import { getClientHintsHeaders, getServerCakeBootstrapFromHeadersIfPresent } from "../packages/core/src/server";
import { createCakeRuntime } from "../packages/core/src/runtime";

test("getClientHintsHeaders returns Accept-CH + Permissions-Policy + Vary", () => {
  const headers = getClientHintsHeaders();
  expect(headers["Accept-CH"]).toContain("Device-Memory");
  expect(headers["Permissions-Policy"]).toContain("ch-device-memory");
  expect(headers.Vary).toContain("Viewport-Width");
});

test("getServerCakeBootstrapFromHeadersIfPresent returns undefined when no hints exist", () => {
  const bootstrap = getServerCakeBootstrapFromHeadersIfPresent({});
  expect(bootstrap).toBeUndefined();
});

test("createCakeRuntime uses bootstrap tier immediately (SSR-safe)", () => {
  const rt = createCakeRuntime({
    bootstrap: { tier: "lite", signals: { saveData: true } },
    autoDetect: false
  });
  expect(rt.getState().ready).toBe(true);
  expect(rt.getState().tier).toBe("lite");
  rt.destroy();
});

