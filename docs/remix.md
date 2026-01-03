# Remix — `@birthday-cake-loading/remix`

## Install

```bash
npm i @birthday-cake-loading/remix
```

## Setup (root route)

```ts
import { json } from "@remix-run/node";
import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
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
