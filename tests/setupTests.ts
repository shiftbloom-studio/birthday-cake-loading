import "@testing-library/jest-dom";

// --- Global Mocks for Browser APIs ---
// These need to be set up globally to avoid "Cannot redefine property" errors
// in strict jsdom environments (like GitHub Actions).

class MockPerformanceObserver implements PerformanceObserver {
  private callback: PerformanceObserverCallback;

  constructor(callback: PerformanceObserverCallback) {
    this.callback = callback;
  }

  observe(): void {}
  disconnect(): void {}
  takeRecords(): PerformanceEntryList {
    return [];
  }
}

// Only define if not already present, using Object.defineProperty for safety
if (typeof window !== "undefined") {
  // PerformanceObserver mock
  if (!window.PerformanceObserver) {
    Object.defineProperty(window, "PerformanceObserver", {
      writable: true,
      configurable: true,
      value: MockPerformanceObserver,
    });
  }

  // Ensure requestAnimationFrame exists (jsdom should have it, but be safe)
  if (!window.requestAnimationFrame) {
    Object.defineProperty(window, "requestAnimationFrame", {
      writable: true,
      configurable: true,
      value: (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 16),
    });
  }

  // Ensure cancelAnimationFrame exists
  if (!window.cancelAnimationFrame) {
    Object.defineProperty(window, "cancelAnimationFrame", {
      writable: true,
      configurable: true,
      value: (id: number) => clearTimeout(id),
    });
  }
}
