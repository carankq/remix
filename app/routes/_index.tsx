import { Form, Link, useNavigation } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

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
  const nav = useNavigation();
  const submitting = nav.state === "submitting";
  return (
    <div>
      <Header />
      <section className="bg-white">
        <div className="container px-4 py-8">
          <h2 className="text-2xl text-gray-900 mb-4">Find a driving instructor</h2>
          <Form method="post" className="flex items-center gap-3">
            <input name="q" placeholder="Name or keyword" className="w-full" />
            <input name="postcode" placeholder="Postcode(s) e.g. E1, E2" className="w-full" />
            <button className="btn btn-primary" disabled={submitting}>{submitting ? "Searching…" : "Search"}</button>
          </Form>
          <p className="text-gray-600 mt-6">Or browse by <Link to="/results">all instructors</Link>.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}


