import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React, { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import moralis from 'moralis'
import { StoreProvider } from 'easy-peasy';
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core";
import { ToastContainer } from 'react-toastify';
import "@fortawesome/fontawesome-svg-core/styles.css";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';

import store, { useAppActions } from "../store";

const serverUrl = "https://bzs8fv2acgni.usemoralis.com:2053/server";
const appId = "sYQ6jITIh6hmFtPCQm2cRO5LeiSylpiudK37U1Yn";
moralis.start({ serverUrl, appId });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider store={store}>
      <div style={{ background: "#1F1D2C" }} className="flex flex-row w-full h-full min-h-screen">
        <Component {...pageProps} />
        <ToastContainer toastClassName="rounded-full" bodyClassName="rounded-full" />
      </div>
    </StoreProvider>
  )
}

export default MyApp
