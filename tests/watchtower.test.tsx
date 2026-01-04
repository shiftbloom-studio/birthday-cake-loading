import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CakeProvider } from "../src/context";
import { CakeWatchtower, useCakeWatchtower } from "../src/watchtower";

// --- Mocks ---

class MockPerformanceObserver {
  callback: PerformanceObserverCallback;
  constructor(callback: PerformanceObserverCallback) {
    this.callback = callback;
  }
  observe() { }
  disconnect() { }
  trigger(entries: Partial<PerformanceEntry>[]) {
    this.callback(
      {
        getEntries: () => entries as PerformanceEntry[],
        getEntriesByName: () => [],
        getEntriesByType: () => [],
      } as PerformanceObserverEntryList,
      this as unknown as PerformanceObserver
    );
  }
}

// Helper to simulate frame drops and time passing
const createFrameSimulator = (
  rafCallbackRef: { current: ((time: number) => void) | null },
  timeRef: { current: number }
) => {
  return {
    advanceTime: async (ms: number) => {
      // Advance time and trigger a frame if a callback is registered
      timeRef.current += ms;

      // We must wrap the callback execution in act() because it might trigger state updates
      await act(async () => {
        if (rafCallbackRef.current) {
          rafCallbackRef.current(timeRef.current);
        }

        // Also advance Jest timers for any setTimeout/setInterval usage
        jest.advanceTimersByTime(ms);
      });
    },

    triggerJank: async () => {
      // Simulate a long freeze
      // Initial frame
      await act(async () => {
        if (rafCallbackRef.current) rafCallbackRef.current(timeRef.current);
      });

      // Advance a lot of time without firing frames in between (simulating a freeze)
      timeRef.current += 2001;

      // Firing the next frame after the long delay
      await act(async () => {
        if (rafCallbackRef.current) rafCallbackRef.current(timeRef.current);
      });
    }
  };
};

describe("CakeWatchtower", () => {
  let rafCallback: ((time: number) => void) | null = null;
  let currentTime = 0;

  // Spies
  let rafSpy: jest.SpyInstance;
  let cancelRafSpy: jest.SpyInstance;
  let performanceNowSpy: jest.SpyInstance;

  // Refs for helper (so it accesses the current variable scope)
  const rafCallbackRef = { get current() { return rafCallback; } };
  const timeRef = {
    get current() { return currentTime; },
    set current(val) { currentTime = val; }
  };

  const simulator = createFrameSimulator(rafCallbackRef, timeRef);

  beforeAll(() => {
    // Safely assign PerformanceObserver if it doesn't exist
    if (!window.PerformanceObserver) {
      window.PerformanceObserver = MockPerformanceObserver as unknown as typeof PerformanceObserver;
    }
  });

  beforeEach(() => {
    jest.useFakeTimers();

    // Reset state
    rafCallback = null;
    currentTime = 0;

    // Mock requestAnimationFrame using spyOn
    rafSpy = jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallback = cb as (time: number) => void;
      return 1; // dummy ID
    });

    cancelRafSpy = jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {
      rafCallback = null;
    });

    // Mock performance.now
    // Check if performance exists, otherwise we might need to mock global.performance (rare in jsdom)
    if (!window.performance) {
      // Fallback for environments without performance
      Object.defineProperty(window, 'performance', {
        writable: true,
        value: { now: () => currentTime }
      });
    }

    performanceNowSpy = jest.spyOn(performance, "now").mockImplementation(() => currentTime);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    rafCallback = null;
  });

  const TestComponent = ({ watchKey }: { watchKey?: string }) => {
    const { janky, downgrade } = useCakeWatchtower(watchKey);
    return (
      <div>
        <div data-testid="status">{janky ? "JANKY" : "SMOOTH"}</div>
        <div data-testid="downgrade">{downgrade ? "DOWNGRADED" : "NORMAL"}</div>
      </div>
    );
  };

  test("should not trigger jank by default", () => {
    render(
      <CakeProvider config={{ watchtower: { enabled: true } }}>
        <CakeWatchtower />
        <TestComponent />
      </CakeProvider>
    );

    expect(screen.getByTestId("status")).toHaveTextContent("SMOOTH");
  });

  test("should trigger jank on low FPS", async () => {
    render(
      <CakeProvider config={{ watchtower: { enabled: true, sensitivity: "high" } }}>
        <CakeWatchtower />
        <TestComponent />
      </CakeProvider>
    );

    await simulator.triggerJank();

    expect(screen.getByTestId("status")).toHaveTextContent("JANKY");
  });

  test("should recover from jank after cooldown", async () => {
    render(
      <CakeProvider config={{ watchtower: { enabled: true, sensitivity: "high" } }}>
        <CakeWatchtower />
        <TestComponent />
      </CakeProvider>
    );

    await simulator.triggerJank();
    expect(screen.getByTestId("status")).toHaveTextContent("JANKY");

    // Recovery MS for high is 3500ms
    await simulator.advanceTime(3600);

    expect(screen.getByTestId("status")).toHaveTextContent("SMOOTH");
  });

  test("should downgrade targeted components when janky", async () => {
    render(
      <CakeProvider config={{ watchtower: { enabled: true, sensitivity: "high", targets: ["hero"] } }}>
        <CakeWatchtower />
        <TestComponent watchKey="hero" />
      </CakeProvider>
    );

    await simulator.triggerJank();

    expect(screen.getByTestId("downgrade")).toHaveTextContent("DOWNGRADED");
  });

  test("should NOT downgrade non-targeted components when janky", async () => {
    render(
      <CakeProvider config={{ watchtower: { enabled: true, sensitivity: "high", targets: ["hero"] } }}>
        <CakeWatchtower />
        <TestComponent watchKey="footer" />
      </CakeProvider>
    );

    await simulator.triggerJank();

    expect(screen.getByTestId("downgrade")).toHaveTextContent("NORMAL");
  });
});
