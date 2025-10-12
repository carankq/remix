import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { readFile } from "node:fs/promises";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = String(params.slug || "");
  try {
    const md = await readFile(process.cwd() + `/public/blogs/${slug}.md`, "utf8");
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


