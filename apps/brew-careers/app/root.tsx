import { type LinksFunction, type MetaFunction } from "@remix-run/node";
import { LiveReload, Meta, Outlet, ScrollRestoration } from "@remix-run/react";

import { cssBundleHref } from "@remix-run/css-bundle";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const meta: MetaFunction = () => {
  return [
    { title: `Careers - Jobs - ${process.env.COMPANY}` },
    {
      name: "description",
      content: `Careers - Jobs - ${process.env.COMPANY}`,
    },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <meta content="IE=Edge,chrome=1" httpEquiv="X-UA-Compatible" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />

        <meta
          content={`Careers - Jobs - ${process.env.COMPANY}`}
          itemProp="description"
        />
        <meta content="summary_large_image" name="twitter:card" />
        <meta
          content={`Careers - Jobs - ${process.env.COMPANY}`}
          property="og:title"
        />
        <meta
          content={`Careers - Jobs - ${process.env.COMPANY}`}
          property="og:description"
        />
        <meta content="/images/share_image.png" property="og:image" />
        <meta content="1200" property="og:image:width" />
        <meta content="630" property="og:image:height" />
        <meta content={process.env.WEBSITE_URL} property="og:url" />
        <meta content={process.env.COMPANY} property="og:site_name" />
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
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}
