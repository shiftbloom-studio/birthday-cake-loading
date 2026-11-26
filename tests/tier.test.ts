import { resolveCakeTier, tierAtLeast } from "../src/tier";
import { DEFAULT_CONFIG } from "../src/config";
import { resolveCakeFeatures } from "../src/features";
import type { CakeSignals } from "../src/types";

const baseSignals: CakeSignals = {
  saveData: true,
  effectiveType: "2g"
};

test("resolveCakeTier returns base for saveData", () => {
  expect(resolveCakeTier(baseSignals)).toBe("base");
});

test("resolveCakeTier returns lite for low memory", () => {
  expect(resolveCakeTier({ deviceMemoryGB: 4 })).toBe("lite");
});

test("resolveCakeTier returns ultra when signals are very capable", () => {
  expect(resolveCakeTier({ deviceMemoryGB: 8, hardwareConcurrency: 8 })).toBe("ultra");
});

test("resolveCakeTier prefers base for saveData even on fast hardware", () => {
  expect(
    resolveCakeTier({
      saveData: true,
      deviceMemoryGB: 16,
      hardwareConcurrency: 16,
      effectiveType: "4g"
    })
  ).toBe("base");
});

test("resolveCakeTier returns lite for constrained network rtt", () => {
  expect(resolveCakeTier({ rttMs: 800, effectiveType: "4g" })).toBe("lite");
});

test("tierAtLeast respects tier ordering", () => {
  expect(tierAtLeast("rich", "lite")).toBe(true);
  expect(tierAtLeast("lite", "ultra")).toBe(false);
});

test("resolveCakeFeatures disables motion on reduced motion", () => {
  const features = resolveCakeFeatures("rich", { prefersReducedMotion: true });
  expect(features.motion).toBe(false);
  expect(features.smoothScroll).toBe(false);
});

test("resolveCakeTier steps an ultra tier down to rich on a low battery while not charging", () => {
  expect(
    resolveCakeTier({
      deviceMemoryGB: 8,
      hardwareConcurrency: 8,
      batteryLevel: 0.1,
      charging: false,
    }),
  ).toBe("rich");
});

test("resolveCakeTier steps a rich tier down to lite on a low battery while not charging", () => {
  expect(resolveCakeTier({ batteryLevel: 0.2, charging: false })).toBe("lite");
});

test("resolveCakeTier steps a lite tier down to base on a low battery while not charging", () => {
  expect(
    resolveCakeTier({
      deviceMemoryGB: 4,
      batteryLevel: 0.15,
      charging: false,
    }),
  ).toBe("base");
});

test("resolveCakeTier never steps below base on a low battery", () => {
  expect(
    resolveCakeTier({ saveData: true, batteryLevel: 0.05, charging: false }),
  ).toBe("base");
});

test("resolveCakeTier does not step the tier down on a low battery while charging", () => {
  expect(
    resolveCakeTier({
      deviceMemoryGB: 8,
      hardwareConcurrency: 8,
      batteryLevel: 0.1,
      charging: true,
    }),
  ).toBe("ultra");
});

test("resolveCakeTier does not step the tier down when the battery is above the threshold", () => {
  expect(
    resolveCakeTier({
      deviceMemoryGB: 8,
      hardwareConcurrency: 8,
      batteryLevel: 0.5,
      charging: false,
    }),
  ).toBe("ultra");
});

test("resolveCakeTier does not step the tier down when the battery is unknown", () => {
  expect(
    resolveCakeTier({ deviceMemoryGB: 8, hardwareConcurrency: 8 }),
  ).toBe("ultra");
});

test("resolveCakeTier keeps the tier when lowBatteryLevel is false", () => {
  const signals: CakeSignals = {
    deviceMemoryGB: 8,
    hardwareConcurrency: 8,
    batteryLevel: 0.1,
    charging: false,
  };
  expect(
    resolveCakeTier(signals, {
      ...DEFAULT_CONFIG,
      tiering: { ...DEFAULT_CONFIG.tiering, lowBatteryLevel: false },
    }),
  ).toBe("ultra");
});

test("resolveCakeTier respects a custom lowBatteryLevel threshold", () => {
  const signals: CakeSignals = {
    deviceMemoryGB: 8,
    hardwareConcurrency: 8,
    batteryLevel: 0.3,
    charging: false,
  };
  expect(
    resolveCakeTier(signals, {
      ...DEFAULT_CONFIG,
      tiering: { ...DEFAULT_CONFIG.tiering, lowBatteryLevel: 0.4 },
    }),
  ).toBe("rich");
});
