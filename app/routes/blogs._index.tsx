import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { readFile } from "node:fs/promises";
import { Link, useLoaderData } from "@remix-run/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

type BlogListItem = { slug: string; title: string; summary?: string; date?: string };

export async function loader({}: LoaderFunctionArgs) {
  try {
    const raw = await readFile(process.cwd() + "/public/blogs/index.json", "utf8");
    const items = JSON.parse(raw);
    return json({ items: Array.isArray(items) ? (items as BlogListItem[]) : [] });
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
                {items.map((b) => (
                  <div key={b.slug} className="px-4 py-3 border border-gray-100">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-gray-900">{b.title}</div>
                        {b.summary && <div className="text-gray-600">{b.summary}</div>}
                      </div>
                      <Link to={`/blogs/${b.slug}`} className="no-underline text-gray-900">Read →</Link>
                    </div>
                  </div>
                ))}
              </nav>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}


