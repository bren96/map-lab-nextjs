import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

export default function App({
  Component,
  pageProps,
}: AppProps<{ session: Session }>) {
  return (
    <>
      <Head>
        <title>MAP-LAB</title>
        <link href="/favicon.svg" rel="icon" type="image/svg" />
        <link
          href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css"
          rel="stylesheet"
        />
      </Head>
      <TooltipProvider>
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </TooltipProvider>
    </>
  );
}
