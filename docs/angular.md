# Angular (Universal/SSR) — `@birthday-cake-loading/angular`

This adapter focuses on:

- baseline-first Client Hints bootstrapping helpers
- an Angular provider (`provideBirthdayCakeLoading`) that hydrates from TransferState when available

## Install

```bash
npm i @birthday-cake-loading/angular
```

## Client-side provider

```ts
import { provideBirthdayCakeLoading } from "@birthday-cake-loading/angular";

export const appConfig = {
  providers: [
    provideBirthdayCakeLoading({
      applyHtmlDataset: true
    })
  ]
};
```

## Server helpers (Express)

```ts
import { bclExpressClientHintsMiddleware, getAngularUniversalBootstrapFromHeaders } from "@birthday-cake-loading/angular/server";

app.use(bclExpressClientHintsMiddleware());

app.get("*", (req, res) => {
  const bootstrap = getAngularUniversalBootstrapFromHeaders(req.headers);
  // Write to TransferState during SSR to avoid double-detect on the client.
  res.end("SSR output...");
});
```
