import { resolveCakeTier, tierAtLeast } from "../src/tier";
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
