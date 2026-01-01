import { getServerCakeBootstrapFromHeaders, getServerSignalsFromHeaders } from "../src/server";

test("getServerSignalsFromHeaders parses save-data and client hints", () => {
  const signals = getServerSignalsFromHeaders({
    "save-data": "on",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-prefers-reduced-motion": "reduce",
    ect: "3g",
    downlink: "0.8",
    rtt: "900",
    "device-memory": "2",
    dpr: "2",
    "viewport-width": "390"
  });

  expect(signals.saveData).toBe(true);
  expect(signals.userAgentMobile).toBe(true);
  expect(signals.prefersReducedMotion).toBe(true);
  expect(signals.effectiveType).toBe("3g");
  expect(signals.downlinkMbps).toBe(0.8);
  expect(signals.rttMs).toBe(900);
  expect(signals.deviceMemoryGB).toBe(2);
  expect(signals.devicePixelRatio).toBe(2);
  expect(signals.screenWidth).toBe(390);
});

test("getServerCakeBootstrapFromHeaders computes tier", () => {
  const bootstrap = getServerCakeBootstrapFromHeaders({ "save-data": "on" });
  expect(bootstrap.signals.saveData).toBe(true);
  expect(bootstrap.tier).toBe("base");
});

