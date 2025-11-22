import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { createUserSession } from "../session.server";

export async function action({ request }: ActionFunctionArgs) {
  console.log('[set-session] Route called');
  
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const token = formData.get("token") as string;
  const accountType = formData.get("accountType") as string;
  const email = formData.get("email") as string;
  const fullName = formData.get("fullName") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const ageRange = formData.get("ageRange") as string;
  const memberSince = formData.get("memberSince") as string;

  console.log('[set-session] userId:', userId, 'email:', email, 'accountType:', accountType);

  if (!userId || !token) {
    console.log('[set-session] Missing required fields');
    return new Response("Missing required fields", { status: 400 });
  }

  // Create session cookie
  const cookie = await createUserSession({
    request,
    userId,
    token,
    accountType,
    email,
    fullName,
    phoneNumber,
    ageRange,
    memberSince,
    redirectTo: '/', // Not used since we're not redirecting
  });

  console.log('[set-session] Session cookie created successfully');

  // Return success with Set-Cookie header
  return json({ success: true }, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
}

