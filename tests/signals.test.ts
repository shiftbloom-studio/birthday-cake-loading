import { detectSignals, subscribeToSignalChanges } from "../src/signals";

const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

const mockBattery = (level: number, charging: boolean) => {
  const listeners: Record<string, Array<() => void>> = {};
  const addEventListener = jest.fn((event: string, handler: () => void) => {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(handler);
  });
  const removeEventListener = jest.fn((event: string, handler: () => void) => {
    listeners[event] = (listeners[event] ?? []).filter(
      (listener) => listener !== handler,
    );
  });
  const manager = {
    level,
    charging,
    addEventListener,
    removeEventListener,
  };
  return { manager, listeners, addEventListener, removeEventListener };
};

const setGetBattery = (value: unknown) => {
  Object.defineProperty(navigator, "getBattery", {
    value,
    writable: true,
    configurable: true,
  });
};

const originalGetBattery = (
  navigator as Navigator & { getBattery?: unknown }
).getBattery;

afterEach(() => {
  if (originalGetBattery === undefined) {
    delete (navigator as Navigator & { getBattery?: unknown }).getBattery;
  } else {
    setGetBattery(originalGetBattery);
  }
});

test("subscribing without the Battery Status API does nothing", async () => {
  // jsdom has no getBattery: the subscription must not throw, and no
  // battery fields appear.
  delete (navigator as Navigator & { getBattery?: unknown }).getBattery;
  const callback = jest.fn();
  const stop = subscribeToSignalChanges(callback);
  await flush();
  expect(callback).not.toHaveBeenCalled();
  expect(detectSignals().batteryLevel).toBeUndefined();
  expect(detectSignals().charging).toBeUndefined();
  stop();
});

test("detectSignals has no battery fields before subscribing", () => {
  const { manager } = mockBattery(0.42, false);
  setGetBattery(jest.fn(() => Promise.resolve(manager)));
  expect(detectSignals().batteryLevel).toBeUndefined();
  expect(detectSignals().charging).toBeUndefined();
});

test("subscribing fills in the battery level and charging state", async () => {
  const { manager } = mockBattery(0.42, false);
  setGetBattery(jest.fn(() => Promise.resolve(manager)));
  const callback = jest.fn();
  const stop = subscribeToSignalChanges(callback);
  await flush();
  expect(callback).toHaveBeenCalled();
  expect(detectSignals().batteryLevel).toBe(0.42);
  expect(detectSignals().charging).toBe(false);
  stop();
});

test("a levelchange updates the reading and re-runs the callback", async () => {
  const { manager, listeners } = mockBattery(0.42, false);
  setGetBattery(jest.fn(() => Promise.resolve(manager)));
  const callback = jest.fn();
  const stop = subscribeToSignalChanges(callback);
  await flush();
  callback.mockClear();
  manager.level = 0.15;
  listeners["levelchange"].forEach((listener) => listener());
  expect(callback).toHaveBeenCalledTimes(1);
  expect(detectSignals().batteryLevel).toBe(0.15);
  stop();
});

test("a chargingchange updates the reading and re-runs the callback", async () => {
  const { manager, listeners } = mockBattery(0.15, false);
  setGetBattery(jest.fn(() => Promise.resolve(manager)));
  const callback = jest.fn();
  const stop = subscribeToSignalChanges(callback);
  await flush();
  callback.mockClear();
  manager.charging = true;
  listeners["chargingchange"].forEach((listener) => listener());
  expect(callback).toHaveBeenCalledTimes(1);
  expect(detectSignals().charging).toBe(true);
  stop();
});

test("cleanup removes the battery listeners", async () => {
  const { manager, addEventListener, removeEventListener } =
    mockBattery(0.42, false);
  setGetBattery(jest.fn(() => Promise.resolve(manager)));
  const stop = subscribeToSignalChanges(jest.fn());
  await flush();
  expect(addEventListener).toHaveBeenCalledWith(
    "levelchange",
    expect.any(Function),
  );
  expect(addEventListener).toHaveBeenCalledWith(
    "chargingchange",
    expect.any(Function),
  );
  stop();
  expect(removeEventListener).toHaveBeenCalledWith(
    "levelchange",
    expect.any(Function),
  );
  expect(removeEventListener).toHaveBeenCalledWith(
    "chargingchange",
    expect.any(Function),
  );
});

test("a late battery promise does not attach listeners after cleanup", async () => {
  const { manager, addEventListener } = mockBattery(0.42, false);
  let resolveBattery: (manager: BatteryManager) => void = () => undefined;
  setGetBattery(
    jest.fn(
      () =>
        new Promise<BatteryManager>((resolve) => {
          resolveBattery = resolve;
        }),
    ),
  );
  const callback = jest.fn();
  const stop = subscribeToSignalChanges(callback);
  stop();
  resolveBattery(manager as unknown as BatteryManager);
  await flush();
  expect(callback).not.toHaveBeenCalled();
  expect(addEventListener).not.toHaveBeenCalled();
});

test("a rejected battery promise does not throw", async () => {
  setGetBattery(jest.fn(() => Promise.reject(new Error("no battery"))));
  const callback = jest.fn();
  const stop = subscribeToSignalChanges(callback);
  await flush();
  expect(callback).not.toHaveBeenCalled();
  stop();
});
