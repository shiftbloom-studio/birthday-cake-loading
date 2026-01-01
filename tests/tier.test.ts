import { resolveCakeTier } from "../src/tier";
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
  expect(resolveCakeTier({ deviceMemoryGB: 2 })).toBe("lite");
});

test("resolveCakeTier returns rich when signals are capable", () => {
  expect(resolveCakeTier({ deviceMemoryGB: 8, hardwareConcurrency: 8 })).toBe("ultra");
});

test("resolveCakeFeatures disables motion on reduced motion", () => {
  const features = resolveCakeFeatures("rich", { prefersReducedMotion: true });
  expect(features.motion).toBe(false);
  expect(features.smoothScroll).toBe(false);
});
