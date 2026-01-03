import { getServerCakeBootstrapFromHeaders, getServerSignalsFromHeaders } from "../src/server";

class FakeHeaders {
  private readonly map: Record<string, string>;
  constructor(map: Record<string, string>) {
    this.map = Object.fromEntries(Object.entries(map).map(([k, v]) => [k.toLowerCase(), v]));
  }
  get(key: string) {
    return this.map[key.toLowerCase()] ?? null;
  }
}

test("getServerSignalsFromHeaders parses save-data and client hints", () => {
  const signals = getServerSignalsFromHeaders({
    "save-data": "on",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-prefers-reduced-motion": "reduce",
    "sec-ch-prefers-reduced-data": "reduce",
    ect: "3g",
    downlink: "0.8",
    rtt: "900",
    "device-memory": "2",
    dpr: "2",
    "viewport-width": "390",
    "viewport-height": "844"
  });

  expect(signals.saveData).toBe(true);
  expect(signals.userAgentMobile).toBe(true);
  expect(signals.prefersReducedMotion).toBe(true);
  expect(signals.prefersReducedData).toBe(true);
  expect(signals.effectiveType).toBe("3g");
  expect(signals.downlinkMbps).toBe(0.8);
  expect(signals.rttMs).toBe(900);
  expect(signals.deviceMemoryGB).toBe(2);
  expect(signals.devicePixelRatio).toBe(2);
  expect(signals.screenWidth).toBe(390);
  expect(signals.screenHeight).toBe(844);
});

test("getServerCakeBootstrapFromHeaders computes tier", () => {
  const bootstrap = getServerCakeBootstrapFromHeaders({ "save-data": "on" });
  expect(bootstrap.signals.saveData).toBe(true);
  expect(bootstrap.tier).toBe("base");
});

test("getServerSignalsFromHeaders supports headers-like objects (e.g. Next.js ReadonlyHeaders)", () => {
  const signals = getServerSignalsFromHeaders(
    new FakeHeaders({
      "save-data": "on",
      "sec-ch-ua-mobile": "?0",
      ect: "4g",
      downlink: "20",
      rtt: "50",
      "device-memory": "8",
      dpr: "2"
    })
  );

  expect(signals.saveData).toBe(true);
  expect(signals.userAgentMobile).toBe(false);
  expect(signals.effectiveType).toBe("4g");
  expect(signals.downlinkMbps).toBe(20);
  expect(signals.rttMs).toBe(50);
  expect(signals.deviceMemoryGB).toBe(8);
  expect(signals.devicePixelRatio).toBe(2);
});

