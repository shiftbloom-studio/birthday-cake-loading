# Birthday-Cake Loading — Remix demo (skeleton)

This folder contains a minimal **wiring reference** for Remix.\n
Full Remix scaffolding is intentionally omitted to keep this repo lightweight.\n

## Root route wiring (copy/paste)

```ts
// app/root.tsx
import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunctionArgs, HeadersFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import type { CakeBootstrap } from "birthday-cake-loading";
import { CakeProvider } from "birthday-cake-loading";
import { bclClientHintsHeaders, composeRemixHeaders, getRemixCakeBootstrapFromRequest } from "@birthday-cake-loading/remix";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const bootstrap = getRemixCakeBootstrapFromRequest(request);
  return json({ bootstrap });
};

export const headers: HeadersFunction = composeRemixHeaders([bclClientHintsHeaders()]);

export default function App() {
  const data = useLoaderData<{ bootstrap?: CakeBootstrap }>();
  return (
    <CakeProvider bootstrap={data.bootstrap}>
      <Outlet />
    </CakeProvider>
  );
}
```

