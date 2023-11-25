import type {LinksFunction} from "@remix-run/node";
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration,} from "@remix-run/react";

import tailwindStyles from "./tailwind.css"


export const links: LinksFunction = () => [
    {rel: "stylesheet", href: tailwindStyles},
    {rel: "preconnect", href: "href=https://rsms.me/"},
    {rel: "stylesheet", href: "https://rsms.me/inter/inter.css"},
];

export default function App() {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
        </head>
        <body className={"font-inter"}>
        <Outlet/>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        </body>
        </html>
    );
}
