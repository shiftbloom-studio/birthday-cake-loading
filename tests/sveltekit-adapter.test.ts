import { handleBirthdayCakeLoading } from "../packages/sveltekit/src/lib/server";

test("SvelteKit handleBirthdayCakeLoading sets locals and response headers", async () => {
  const handle = handleBirthdayCakeLoading();

  const headerStore = new Map<string, string>();
  const event: any = {
    request: {
      headers: {
        get: (k: string) => (k.toLowerCase() === "save-data" ? "on" : null)
      }
    },
    locals: {}
  };

  const response = await handle({
    event,
    resolve: async () => ({
      headers: {
        set: (k: string, v: string) => headerStore.set(k.toLowerCase(), v),
        get: (k: string) => headerStore.get(k.toLowerCase()) ?? null
      }
    })
  } as any);

  expect(event.locals.bcl).toBeDefined();
  // First request may or may not have CH; save-data counts.
  expect(event.locals.bcl.bootstrap).toBeDefined();
  expect(response.headers.get("accept-ch")).toContain("Device-Memory");
  expect(response.headers.get("permissions-policy")).toContain("ch-device-memory");
  expect(response.headers.get("vary")).toContain("Viewport-Width");
});

