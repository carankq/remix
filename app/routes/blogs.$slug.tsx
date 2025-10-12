import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const slug = String(params.slug || "");
  const url = new URL(request.url);
  const envBase = process.env.API_HOST ? String(process.env.API_HOST).replace(/\/$/, "") : "";
  const base = envBase || url.origin;
  try {
    const res = await fetch(`${base}/blogs/${encodeURIComponent(slug)}`, { headers: { Accept: 'application/json' } });
    const data = await res.json().catch(() => ({}));
    // If API returns markdown `content` or `md`, prefer that; otherwise, build placeholder
    const md: string = data?.content || data?.md || `# ${slug.replace(/-/g, ' ')}\n\nContent coming soon.`;
    return json({ slug, md });
  } catch {
    return json({ slug, md: `# ${slug.replace(/-/g, ' ')}\n\nContent coming soon.` });
  }
}

export default function BlogSlugRoute() {
  const { md, slug } = useLoaderData<typeof loader>();
  return (
    <div>
      <Header />
      <section>
        <div className="container px-4 py-8">
          <div className="bg-white border border-gray-100 rounded-md px-4 py-4">
            <pre style={{ whiteSpace: 'pre-wrap' }}>{md}</pre>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}


