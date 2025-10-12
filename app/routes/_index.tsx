import { useNavigate, useLoaderData, useSearchParams } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SearchSection } from "../components/SearchSection";
import { HeroSection } from "../components/HeroSection";
import { FAQSection } from "../components/FAQSection";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const envBase = process.env.API_HOST ? String(process.env.API_HOST).replace(/\/$/, "") : "";
  const base = envBase || url.origin;
  
  // Extract search params to pass back to client
  const searchParams = {
    postcode: url.searchParams.getAll('postcode'),
    gender: url.searchParams.get('gender') || '',
    vehicleType: url.searchParams.get('vehicleType') || '',
    language: url.searchParams.get('language') || '',
  };
  
  try {
    const res = await fetch(`${base}/blogs?limit=3`, { 
      headers: { 
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, br'
      } 
    });
    const data = await res.json().catch(() => []);
    const blogs = Array.isArray(data) ? data.slice(0, 3) : [];
    
    // Optimize: Only include necessary fields for preview
    const blogsTop3 = blogs.map((blog: any) => ({
      slug: blog.slug || blog.id,
      title: blog.title || blog.name,
      summary: blog.summary?.substring(0, 200) || blog.excerpt?.substring(0, 200), // Limit preview length
    }));
    
    return json({ blogsTop3, searchParams }, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=900',
      }
    });
  } catch {
    return json({ blogsTop3: [], searchParams });
  }
}

export function headers({ loaderHeaders }: { loaderHeaders: Headers }) {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control') || 'public, max-age=300',
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const q = String(formData.get("q") || "").trim();
  const postcode = String(formData.get("postcode") || "").trim();
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (postcode) params.append("postcode", postcode);
  return new Response(null, {
    status: 302,
    headers: { Location: "/results?" + params.toString() }
  });
}

export default function Index() {
  const navigate = useNavigate();
  const { blogsTop3, searchParams } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <Header />
        <SearchSection 
          initialFilters={{
            postcode: searchParams.postcode.join(','),
            gender: searchParams.gender,
            vehicleType: searchParams.vehicleType,
            language: searchParams.language,
          }}
          onSearch={(q, filters) => {
            const params = new URLSearchParams();
            if (filters.postcode) filters.postcode.split(',').map(p => p.trim()).filter(Boolean).forEach(pc => params.append('postcode', pc));
            if (filters.gender) params.set('gender', filters.gender);
            if (filters.vehicleType) params.set('vehicleType', filters.vehicleType);
            if (filters.language) params.set('language', filters.language);
            navigate(`/results?${params.toString()}`);
          }} 
        />
        <HeroSection />
        <FAQSection blogs={blogsTop3} />
      <Footer />
    </div>
  );
}


