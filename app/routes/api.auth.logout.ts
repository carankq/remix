import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "../session.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Destroy session and return Set-Cookie header to clear it
  const cookie = await logout(request);
  
  return new Response(null, {
    status: 200,
    headers: {
      "Set-Cookie": cookie,
    },
  });
}

