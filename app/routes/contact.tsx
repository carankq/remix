import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { INSTRUCTORS } from "../data/mock";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id') || '';
  const instructor = INSTRUCTORS.find(i => i.id === id) || null;
  return json({ instructor });
}

export async function action({ request }: ActionFunctionArgs) {
  // In a real app we'd send an email or store a lead; simulate and redirect
  const form = await request.formData();
  const id = String(form.get('id') || '');
  return redirect(`/results?submitted=${encodeURIComponent(id)}`);
}

export default function ContactRoute() {
  const { instructor } = useLoaderData<typeof loader>();
  return (
    <div>
      <Header />
      <section>
        <div className="container px-4 py-8">
          <h2 className="text-2xl text-gray-900 mb-4">Contact instructor</h2>
          {instructor ? (
            <Form method="post" className="flex flex-col gap-3">
              <input type="hidden" name="id" value={instructor.id} />
              <div>Name: {instructor.name}</div>
              <input name="name" placeholder="Your name" required />
              <input name="email" type="email" placeholder="Your email" required />
              <textarea name="message" placeholder="Your message" rows={4} />
              <button className="btn btn-primary">Send</button>
            </Form>
          ) : (
            <div className="text-gray-600">Unknown instructor.</div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}


