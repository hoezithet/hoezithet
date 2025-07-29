/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */
import wrapWithProvider from "./wrap-with-provider"
export const wrapRootElement = wrapWithProvider

import React from "react";

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="cloudflare-analytics"
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon='{"token": "672e2b2e91b34d62bc0b3ceb4d626b8a"}'
    ></script>,
  ]);
};
