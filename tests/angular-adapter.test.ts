import { getAngularUniversalBootstrapFromHeaders, getAngularUniversalClientHintsHeaders } from "../packages/angular/src/server";

test("Angular server helpers expose client hints headers", () => {
  const headers = getAngularUniversalClientHintsHeaders();
  expect(headers["Accept-CH"]).toContain("Device-Memory");
});

test("Angular bootstrap helper is baseline-first", () => {
  expect(getAngularUniversalBootstrapFromHeaders({} as any)).toBeUndefined();
  const b = getAngularUniversalBootstrapFromHeaders({ "save-data": "on" } as any);
  expect(b?.tier).toBe("base");
});

