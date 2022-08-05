import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import { RecoilRoot } from "recoil";

import antdCss from "antd/dist/antd.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: antdCss },
    { rel: "stylesheet", href: tailwindStylesheetUrl }
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "iRead",
  viewport: "width=device-width,initial-scale=1"
});

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <RecoilRoot>
          <Outlet />
        </RecoilRoot>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
