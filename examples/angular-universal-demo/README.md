# Birthday-Cake Loading — Angular Universal demo (wiring reference)

This folder contains a minimal **wiring reference** for Angular SSR.\n
Full Angular CLI scaffolding is intentionally omitted.\n

## Server: set Client Hints headers (Express)

```ts
import express from "express";
import { bclExpressClientHintsMiddleware, getAngularUniversalBootstrapFromHeaders } from "@birthday-cake-loading/angular/server";

const app = express();
app.use(bclExpressClientHintsMiddleware());

app.get("*", (req, res) => {
  const bootstrap = getAngularUniversalBootstrapFromHeaders(req.headers);
  // Pass `bootstrap` into Angular's TransferState during SSR (see below).
  res.end("SSR output...");
});
```

## App: provide BCL runtime

```ts
import { provideBirthdayCakeLoading } from "@birthday-cake-loading/angular";

export const appConfig = {
  providers: [
    provideBirthdayCakeLoading({
      // bootstrap: provided via TransferState on the client, or directly if you prefer
      applyHtmlDataset: true
    })
  ]
};
```

