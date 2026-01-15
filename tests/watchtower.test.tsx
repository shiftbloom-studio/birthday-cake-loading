import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CakeProvider } from "../src/context";
import { CakeWatchtower, useCakeWatchtower } from "../src/watchtower";

const HIGH_SENSITIVITY_RECOVERY_MS = 3600; // Recovery threshold is 3500ms; use 3600ms to ensure we've passed it

// --- Mocks ---

// PerformanceObserver is mocked globally in setupTests.ts.

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
  // Refs for helper following the conventional React ref shape
  const rafCallbackRef: { current: ((time: number) => void) | null } = { current: null };
  const timeRef: { current: number } = { current: 0 };

  const simulator = createFrameSimulator(rafCallbackRef, timeRef);

  beforeEach(() => {
    jest.useFakeTimers();

    // Reset state
    rafCallbackRef.current = null;
    timeRef.current = 0;

    // Mock requestAnimationFrame using spyOn
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallbackRef.current = cb as (time: number) => void;
      return 1; // dummy ID
    });

    jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {
      rafCallbackRef.current = null;
    });

    // Mock performance.now
    // Check if performance exists, otherwise we might need to mock global.performance (rare in jsdom)
    if (!window.performance) {
      // Fallback for environments without performance
      Object.defineProperty(window, 'performance', {
        writable: true,
        value: { now: () => timeRef.current }
      });
    }

    jest.spyOn(performance, "now").mockImplementation(() => timeRef.current);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
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

    // Advance past the high-sensitivity recovery threshold
    await simulator.advanceTime(HIGH_SENSITIVITY_RECOVERY_MS);

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
