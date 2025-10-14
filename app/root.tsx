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

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesHref },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return { 
    ENV: { 
      API_HOST: process.env.API_HOST || "" 
    } 
  };
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
      </head>
      <body>
        <AuthProvider>
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


