import { defineEventHandler, setResponseHeader } from "h3";
import { getClientHintsHeaders, getServerCakeBootstrapFromHeadersIfPresent } from "@birthday-cake-loading/core/server";

export default defineEventHandler((event) => {
  const ch = getClientHintsHeaders();

  // Request Client Hints for future navigations / requests.
  for (const [k, v] of Object.entries(ch)) {
    setResponseHeader(event, k, v);
  }

  // Baseline-first SSR: only compute bootstrap if hints are present.
  // Attach to request context so the runtime plugin can read it.
  const bootstrap = getServerCakeBootstrapFromHeadersIfPresent(event.node.req.headers as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (event.context as any).bclBootstrap = bootstrap;
});

