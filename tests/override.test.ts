import { CAKE_TIER_OVERRIDE_KEY, getTierOverride, setTierOverride } from "../src/override";

afterEach(() => {
  try {
    sessionStorage.removeItem(CAKE_TIER_OVERRIDE_KEY);
  } catch {
    // ignore
  }
  jest.restoreAllMocks();
});

test("getTierOverride returns undefined for invalid stored value", () => {
  sessionStorage.setItem(CAKE_TIER_OVERRIDE_KEY, "nope");
  expect(getTierOverride()).toBeUndefined();
});

test("getTierOverride returns undefined when storage access throws", () => {
  jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  expect(getTierOverride()).toBeUndefined();
});

test("setTierOverride does not throw when storage access throws", () => {
  jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  expect(() => setTierOverride("rich")).not.toThrow();
});

