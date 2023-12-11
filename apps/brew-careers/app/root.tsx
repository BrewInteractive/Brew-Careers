import { type LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { cssBundleHref } from "@remix-run/css-bundle";
import { COMPANY } from "./lib/config/companyInfo";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export let loader = async () => {
  return {
    env: process.env,
  };
};

export default function App() {
  const process = useLoaderData<any>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{`Careers - Jobs - ${COMPANY}`}</title>
        <meta charSet="utf-8" />
        <meta content="IE=Edge,chrome=1" httpEquiv="X-UA-Compatible" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />

        <meta content={`Careers - Jobs - ${COMPANY}`} itemProp="description" />
        <meta content="summary_large_image" name="twitter:card" />
        <meta content={`Careers - Jobs - ${COMPANY}`} property="og:title" />
        <meta
          content={`Careers - Jobs - ${COMPANY}`}
          property="og:description"
        />
        <meta content="/images/share_image.png" property="og:image" />
        <meta content="1200" property="og:image:width" />
        <meta content="630" property="og:image:height" />
        <meta content={process.env.WEBSITE_URL} property="og:url" />
        <meta content={COMPANY} property="og:site_name" />
        <meta content="website" property="og:type" />
        <link href={process.env.WEBSITE_URL} rel="canonical" />
        <meta name="csrf-param" content="authenticity_token" />
        <meta
          name="csrf-token"
          content="OC2keB7HgSd3CLO3oh+pE5wPm6KXcOGD6x/R4ey0QRqKXEAjBCSY9lWsKcGzR7Bq15gzmXBK4EgyfEfceDpWag=="
        />

        <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
        <link rel="stylesheet" media="screen" href="/css/careers.css" />
        <link
          rel="stylesheet"
          media="screen"
          href="https://fonts.googleapis.com/css?family=Lato:300,400,700"
          data-company-font="true"
        />
        <link
          rel="stylesheet"
          media="screen"
          href="/css/bootstrap.css"
          data-company-css="true"
        />

        <script src="/js/rt_app.js"></script>
        <script src="/js/careers.js"></script>
        <script src="/js/errors_handler.js"></script>
        <script
          defer
          data-domain={process.env.WEBSITE_DOMAIN}
          src="https://plausible.io/js/script.js"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify({
              WEBSITE_URL: process.env.WEBSITE_URL,
              STORAGE_FILE_URL: process.env.STORAGE_FILE_URL,
            })}`,
          }}
        />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html>
      <head>
        <title>{`Careers - Jobs - ${COMPANY}`}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
            ? error.message
            : "Page not found"}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}
