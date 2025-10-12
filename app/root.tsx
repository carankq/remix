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
import tailwindHref from "./styles/tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindHref },
  { rel: "stylesheet", href: stylesHref }
];

export async function loader({ request }: LoaderFunctionArgs) {
  return { ENV: { API_HOST: process.env.API_HOST || "" } };
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
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


