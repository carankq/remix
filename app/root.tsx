import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import stylesHref from "./styles/global.css?url";
import { AuthProvider } from "./context/AuthContext";
import { getUserFromSession } from "./session.server";
import { json } from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesHref },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const userSession = await getUserFromSession(request);
  
  return json({ 
    ENV: { 
      API_HOST: process.env.API_HOST || "",
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || ""
    },
    user: userSession ? {
      id: userSession.id as string,
      email: userSession.email as string,
      accountType: (userSession.accountType || 'student') as 'student' | 'instructor',
      fullName: userSession.fullName,
      phoneNumber: userSession.phoneNumber,
      ageRange: userSession.ageRange,
      memberSince: userSession.memberSince
    } : null,
    token: userSession?.token || null
  });
}

// Optimize headers for caching
export function headers() {
  return {
    "Cache-Control": "public, max-age=3600",
  };
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e293b" />
        <Meta />
        <Links />
        <script src="https://js.stripe.com/v3/" async></script>
      </head>
      <body>
        <AuthProvider initialUser={data.user} initialToken={data.token}>
          <Outlet />
        </AuthProvider>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ENV__ = ${JSON.stringify(data.ENV)};`
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}


