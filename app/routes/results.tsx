import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

type Instructor = {
  id: string;
  name: string;
  description?: string;
  pricePerHour?: number;
  vehicleType?: string;
  yearsOfExperience?: number;
  rating?: number;
  totalReviews?: number;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const params = url.searchParams;
  // Build API base: prefer env, otherwise same origin as the current request
  const envBase = process.env.API_HOST ? String(process.env.API_HOST).replace(/\/$/, "") : "";
  const base = envBase || url.origin;
  const apiUrl = `${base}/instructors?${params.toString()}`;
  try {
    const res = await fetch(apiUrl, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const data = await res.json().catch(() => ({}));
    const rawList: any[] = Array.isArray(data) ? data : (Array.isArray((data as any)?.instructors) ? (data as any).instructors : []);
    const list: Instructor[] = rawList.map((r) => ({
      id: String(r.id ?? r._id ?? ""),
      name: String(r.name ?? r.fullName ?? "Unknown"),
      description: typeof r.description === 'string' ? r.description : '',
      pricePerHour: Number(r.pricePerHour ?? r.hourlyRate ?? r.price ?? 0) || undefined,
      vehicleType: r.vehicleType ?? r.transmission,
      yearsOfExperience: Number(r.yearsOfExperience ?? r.experienceYears ?? 0) || undefined,
      rating: Number(r.rating ?? r.averageRating ?? 0) || undefined,
      totalReviews: Number(r.totalReviews ?? r.reviewCount ?? 0) || undefined,
    })).filter(i => i.id);
    return json({ instructors: list });
  } catch (e) {
    return json({ instructors: [] as any[], error: "Unable to load instructors" }, { status: 200 });
  }
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


