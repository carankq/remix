import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import locations from "../data/locationPostcodes.json";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const location = String(params.location || '').toLowerCase();
  const pcs = (locations as Record<string, string[]>)[location] || [];
  const url = new URL(request.url);
  const sp = new URLSearchParams(url.search);
  sp.delete('postcode');
  for (const pc of pcs) sp.append('postcode', pc.toUpperCase());
  return redirect(`/results?${sp.toString()}`);
}

export default function ResultsByLocationRoute() { return null; }


