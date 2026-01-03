import { bclClientHintsHeaders, getRemixCakeBootstrapFromRequest } from "../packages/remix/src";

test("Remix adapter returns bootstrap when hints exist", () => {
  const req: any = { headers: { get: (k: string) => (k.toLowerCase() === "save-data" ? "on" : null) } };
  const bootstrap = getRemixCakeBootstrapFromRequest(req);
  expect(bootstrap).toBeDefined();
  expect(bootstrap?.tier).toBe("base");
});

test("Remix adapter provides Client Hints header function", () => {
  const fn = bclClientHintsHeaders();
  const headers = fn({} as any) as Headers;
  expect(headers.get("Accept-CH")).toContain("Device-Memory");
});

