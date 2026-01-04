import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CakeProvider } from "../src/context";
import { CakeWatchtower, useCakeWatchtower } from "../src/watchtower";

// --- Mocks ---

// Mock PerformanceObserver
class MockPerformanceObserver {
  callback: PerformanceObserverCallback;
  constructor(callback: PerformanceObserverCallback) {
    this.callback = callback;
  }
  observe() {}
  disconnect() {}
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
global.PerformanceObserver = MockPerformanceObserver as unknown as typeof PerformanceObserver;

// Mock requestAnimationFrame
const originalRaf = global.requestAnimationFrame;
const originalCancelRaf = global.cancelAnimationFrame;
let rafCallback: ((time: number) => void) | null = null;
let lastRafId = 0;

// Mock performance.now
const originalPerformanceNow = global.performance?.now;
let currentTime = 0;

beforeEach(() => {
  jest.useFakeTimers();
  
  // RAF mock that stores the callback
  global.requestAnimationFrame = (cb) => {
    rafCallback = cb;
    return ++lastRafId;
  };
  global.cancelAnimationFrame = () => {
    rafCallback = null;
  };

  // Time mock
  currentTime = 0;
  if (global.performance) {
    global.performance.now = () => currentTime;
  } else {
    // @ts-expect-error invalid operation
    global.performance = { now: () => currentTime };
  }
});

afterEach(() => {
  jest.useRealTimers();
  global.requestAnimationFrame = originalRaf;
  global.cancelAnimationFrame = originalCancelRaf;
  if (global.performance && originalPerformanceNow) {
    global.performance.now = originalPerformanceNow;
  }
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

describe("CakeWatchtower", () => {
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

    // High sensitivity: FPS threshold 55. Window 2000ms.
    // Loop logic:
    // Frame 1: start
    // Frame 2: elapsed = now - windowStart. if elapsed >= window, calc FPS.
    
    // Simulate initial frame
    act(() => {
        if (rafCallback) rafCallback(currentTime);
    });

    // Advance time by 2001ms
    currentTime += 2001; 
    
    // Simulate next frame callback. 
    // Frame count will be 1 (only this frame since start). 
    // Elapsed = 2001ms.
    // FPS = (1 * 1000) / 2001 = ~0.5 FPS.
    // This is < 55, so it should trigger jank.
    
    await act(async () => {
        if (rafCallback) rafCallback(currentTime);
    });

    expect(screen.getByTestId("status")).toHaveTextContent("JANKY");
  });
  
  test("should recover from jank after cooldown", async () => {
    render(
        <CakeProvider config={{ watchtower: { enabled: true, sensitivity: "high" } }}>
          <CakeWatchtower />
          <TestComponent />
        </CakeProvider>
      );
  
      // Trigger Jank
      act(() => {
          if (rafCallback) rafCallback(currentTime);
      });
      currentTime += 2001;
      await act(async () => {
          if (rafCallback) rafCallback(currentTime);
      });
      
      expect(screen.getByTestId("status")).toHaveTextContent("JANKY");

      // Recovery MS for high is 3500ms
      // Advance time past recovery
      act(() => {
          jest.advanceTimersByTime(3600);
      });

      expect(screen.getByTestId("status")).toHaveTextContent("SMOOTH");
  });

  test("should downgrade targeted components when janky", async () => {
    render(
        <CakeProvider config={{ watchtower: { enabled: true, sensitivity: "high", targets: ["hero"] } }}>
          <CakeWatchtower />
          <TestComponent watchKey="hero" />
        </CakeProvider>
    );

    // Trigger Jank
    act(() => {
        if (rafCallback) rafCallback(currentTime);
    });
    currentTime += 2001;
    await act(async () => {
        if (rafCallback) rafCallback(currentTime);
    });

    expect(screen.getByTestId("downgrade")).toHaveTextContent("DOWNGRADED");
  });

  test("should NOT downgrade non-targeted components when janky", async () => {
    render(
        <CakeProvider config={{ watchtower: { enabled: true, sensitivity: "high", targets: ["hero"] } }}>
          <CakeWatchtower />
          <TestComponent watchKey="footer" />
        </CakeProvider>
    );

    // Trigger Jank
    act(() => {
        if (rafCallback) rafCallback(currentTime);
    });
    currentTime += 2001;
    await act(async () => {
        if (rafCallback) rafCallback(currentTime);
    });

    expect(screen.getByTestId("downgrade")).toHaveTextContent("NORMAL");
  });
});
