import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

type BlogListItem = { slug?: string; title?: string; summary?: string; date?: string };

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const envBase = process.env.API_HOST ? String(process.env.API_HOST).replace(/\/$/, "") : "";
  const base = envBase || url.origin;
  const api = `${base}/blogs?limit=*`;
  try {
    const res = await fetch(api, { headers: { Accept: 'application/json' } });
    const data = await res.json().catch(() => []);
    const items: BlogListItem[] = Array.isArray(data) ? data : [];
    return json({ items });
  } catch {
    return json({ items: [] as BlogListItem[] });
  }
}

export default function BlogsIndexRoute() {
  const { items } = useLoaderData<typeof loader>();
  return (
    <div>
      <Header />
      <section>
        <div className="container px-4 py-8">
          <h2 className="text-2xl text-gray-900 mb-4">Blogs</h2>
          <div className="bg-white border border-gray-100 rounded-md">
            {items.length === 0 ? (
              <div className="px-4 py-4 text-gray-600">No blogs.</div>
            ) : (
              <nav>
                {items.map((b, i) => {
                  const title = String(b.title || '').trim() || 'Untitled';
                  const slug = (b.slug && String(b.slug)) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  return (
                  <div key={slug + '-' + i} className="px-4 py-3 border border-gray-100">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-gray-900 capitalize">{title}</div>
                        {b.summary && <div className="text-gray-600">{b.summary}</div>}
                      </div>
                      <Link to={`/blogs/${slug}`} className="no-underline text-gray-900">Read →</Link>
                    </div>
                  </div>
                );})}
              </nav>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}


