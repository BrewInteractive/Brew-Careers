import { LiveReload, Outlet, ScrollRestoration } from "@remix-run/react";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="IE=Edge,chrome=1" http-equiv="X-UA-Compatible" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Careers - Jobs - Brew Interactive</title>
        <meta content="Careers - Jobs - Brew Interactive" name="description" />
        <meta
          content="Careers - Jobs - Brew Interactive"
          itemProp="description"
        />
        <meta content="summary_large_image" name="twitter:card" />
        <meta content="Careers - Jobs - Brew Interactive" property="og:title" />
        <meta
          content="Careers - Jobs - Brew Interactive"
          property="og:description"
        />
        <meta content="images/share_image.png" property="og:image" />
        <meta content="1200" property="og:image:width" />
        <meta content="630" property="og:image:height" />
        <meta content="https://jobs.brewww.com/" property="og:url" />
        <meta content="Brew Interactive" property="og:site_name" />
        <meta content="website" property="og:type" />
        <link href="https://jobs.brewww.com/" rel="canonical" />
        <meta name="csrf-param" content="authenticity_token" />
        <meta
          name="csrf-token"
          content="OC2keB7HgSd3CLO3oh+pE5wPm6KXcOGD6x/R4ey0QRqKXEAjBCSY9lWsKcGzR7Bq15gzmXBK4EgyfEfceDpWag=="
        />

        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="favicon-4c9bc445d00feebd8833a9dc049e02742732854c8e58a199d3b2c3f9037d42c8.ico"
        />
        <link
          rel="stylesheet"
          media="screen"
          href="css/careers-e3bd8e42fc609055a4f737777f8c5d912a700894765301a04d71fabebf7dd5fa.css"
        />
        <link
          rel="stylesheet"
          media="screen"
          href="https://fonts.googleapis.com/css?family=Lato:300,400,700"
          data-company-font="true"
        />
        <link
          rel="stylesheet"
          media="screen"
          href="css/style_1652974541.css"
          data-company-css="true"
        />
        <script src="js/rt_app-b25d8d9fbffd0631b15547f64ee76931f266926fea014685d7118fe209ad476e.js"></script>
        <script src="js/careers-ccdcff3ffcc048d61156e89009d5b48a8f4fd7b63e71740419c7d07494229d4f.js"></script>

        <script src="js/errors_handler-18c907b27701ecba3737f74ec2d352eff7ccdedb59a3f25752ed3f84d9801c7c.js"></script>
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}
