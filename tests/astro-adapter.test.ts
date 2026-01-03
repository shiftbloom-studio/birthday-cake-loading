import { onRequest } from "../packages/astro/src/middleware";

test("Astro middleware sets locals bootstrap and Client Hints headers", async () => {
  const headerStore = new Map<string, string>();
  const context: any = {
    request: {
      headers: {
        get: (k: string) => (k.toLowerCase() === "save-data" ? "on" : null)
      }
    },
    locals: {}
  };
  const next = async () => ({
    headers: {
      set: (k: string, v: string) => headerStore.set(k.toLowerCase(), v),
      get: (k: string) => headerStore.get(k.toLowerCase()) ?? null
    }
  });

  const response = await onRequest(context, next);

  expect(context.locals.bcl).toBeDefined();
  expect(context.locals.bcl.bootstrap).toBeDefined();
  expect(response.headers.get("accept-ch")).toContain("Device-Memory");
});

