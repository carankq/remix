import { createCookieSessionStorage } from "@remix-run/node";

// Create session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "s3cr3t-f4llb4ck-ch4ng3-m3"],
    secure: false, // Set to false for development (localhost)
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserFromSession(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");
  const token = session.get("token");
  const accountType = session.get("accountType");
  const email = session.get("email");
  const fullName = session.get("fullName");
  const phoneNumber = session.get("phoneNumber");
  const ageRange = session.get("ageRange");
  const memberSince = session.get("memberSince");
  
  if (!userId || !token) {
    return null;
  }
  
  return {
    id: userId,
    token,
    accountType,
    email,
    fullName,
    phoneNumber,
    ageRange,
    memberSince,
  };
}

export async function createUserSession({
  request,
  userId,
  token,
  accountType,
  email,
  fullName,
  phoneNumber,
  ageRange,
  memberSince,
  redirectTo,
}: {
  request: Request;
  userId: string;
  token: string;
  accountType: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  ageRange?: string;
  memberSince?: string;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set("userId", userId);
  session.set("token", token);
  session.set("accountType", accountType);
  session.set("email", email);
  session.set("fullName", fullName);
  session.set("phoneNumber", phoneNumber);
  session.set("ageRange", ageRange);
  session.set("memberSince", memberSince);
  
  return sessionStorage.commitSession(session);
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return sessionStorage.destroySession(session);
}

