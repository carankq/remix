import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { filterInstructors } from "../data/mock";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const list = filterInstructors(url.searchParams);
  return json({ instructors: list });
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const q = String(form.get("q") || "");
  const postcode = String(form.get("postcode") || "");
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (postcode) postcode.split(',').map(s => s.trim()).filter(Boolean).forEach(pc => params.append('postcode', pc));
  return redirect("/results?" + params.toString());
}

export default function ResultsRoute() {
  const { instructors } = useLoaderData<typeof loader>();
  return (
    <div>
      <Header />
      <section className="bg-deep-navy pt-20 pb-8">
        <div className="container px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl text-white">Results</h1>
            <span className="count-pill">{instructors.length} matches</span>
          </div>
          <Form method="post" className="flex items-center gap-3 mt-6">
            <input name="q" placeholder="Search" className="w-full" />
            <input name="postcode" placeholder="Postcode(s)" className="w-full" />
            <button className="btn btn-primary">Update</button>
          </Form>
        </div>
      </section>

      <section>
        <div className="container px-4 py-8">
          {instructors.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-md px-4 py-4 text-gray-600">No instructors found.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {instructors.map((i) => (
                <article key={i.id} className="bg-white border border-gray-100 rounded-md px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl text-gray-900">{i.name}</h3>
                      <div className="text-gray-600">{i.description}</div>
                      <div className="text-gray-600 mt-6">£{i.pricePerHour}/hr • {i.vehicleType} • {i.yearsOfExperience} yrs • {i.rating}★ ({i.totalReviews})</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/contact?id=${i.id}`} className="btn btn-primary">Contact</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}


