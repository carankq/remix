import { useNavigate, useLoaderData } from "@remix-run/react";
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
  try {
    const res = await fetch(`${base}/blogs?limit=3`, { headers: { Accept: 'application/json' } });
    const data = await res.json().catch(() => []);
    return json({ blogsTop3: Array.isArray(data) ? data.slice(0, 3) : [] });
  } catch {
    return json({ blogsTop3: [] });
  }
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
  const { blogsTop3 } = useLoaderData<typeof loader>();
  return (
    <div>
      <Header />
        <SearchSection onSearch={(q, filters) => {
          const params = new URLSearchParams();
          if (filters.postcode) filters.postcode.split(',').map(p => p.trim()).filter(Boolean).forEach(pc => params.append('postcode', pc));
          if (filters.gender) params.set('gender', filters.gender);
          if (filters.vehicleType) params.set('vehicleType', filters.vehicleType);
          if (filters.language) params.set('language', filters.language);
          navigate(`/results?${params.toString()}`);
        }} />
        <HeroSection />
        <FAQSection blogs={blogsTop3} />
      <Footer />
    </div>
  );
}


