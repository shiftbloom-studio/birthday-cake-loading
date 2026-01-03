import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { CakeProvider, CakeUpgrade } from "../src";

const Enhanced = () => <div data-testid="enhanced">enhanced</div>;

const loader = () => Promise.resolve({ default: Enhanced });

afterEach(() => {
  jest.useRealTimers();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (globalThis as any).IntersectionObserver;
});

test("CakeUpgrade strategy=immediate upgrades when allowed", async () => {
  render(
    <CakeProvider initialTier="rich" autoDetect={false}>
      <CakeUpgrade
        strategy="immediate"
        loader={loader}
        fallback={<div data-testid="fallback">fallback</div>}
      />
    </CakeProvider>
  );

  expect(screen.getByTestId("fallback")).toBeInTheDocument();
  expect(await screen.findByTestId("enhanced")).toBeInTheDocument();
});

test("CakeUpgrade strategy=idle upgrades on the next tick when allowed", async () => {
  jest.useFakeTimers();

  render(
    <CakeProvider initialTier="rich" autoDetect={false}>
      <CakeUpgrade
        strategy="idle"
        loader={loader}
        fallback={<div data-testid="fallback">fallback</div>}
      />
    </CakeProvider>
  );

  expect(screen.getByTestId("fallback")).toBeInTheDocument();

  act(() => {
    jest.runOnlyPendingTimers();
  });

  expect(await screen.findByTestId("enhanced")).toBeInTheDocument();
});

test("CakeUpgrade strategy=timeout upgrades after ms when allowed", async () => {
  jest.useFakeTimers();

  render(
    <CakeProvider initialTier="rich" autoDetect={false}>
      <CakeUpgrade
        strategy={{ type: "timeout", ms: 250 }}
        loader={loader}
        fallback={<div data-testid="fallback">fallback</div>}
      />
    </CakeProvider>
  );

  act(() => {
    jest.advanceTimersByTime(249);
  });
  expect(screen.queryByTestId("enhanced")).toBeNull();

  act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(await screen.findByTestId("enhanced")).toBeInTheDocument();
});

test("CakeUpgrade strategy=visible upgrades when fallback becomes visible", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).IntersectionObserver = class MockIntersectionObserver {
    private cb: (entries: Array<{ isIntersecting: boolean }>) => void;
    constructor(cb: (entries: Array<{ isIntersecting: boolean }>) => void) {
      this.cb = cb;
    }
    observe() {
      this.cb([{ isIntersecting: true }]);
    }
    disconnect() {}
  };

  render(
    <CakeProvider initialTier="rich" autoDetect={false}>
      <CakeUpgrade
        strategy="visible"
        loader={loader}
        fallback={<div data-testid="fallback">fallback</div>}
      />
    </CakeProvider>
  );

  expect(await screen.findByTestId("enhanced")).toBeInTheDocument();
});

test("CakeUpgrade strategy=interaction upgrades on interaction", async () => {
  render(
    <CakeProvider initialTier="rich" autoDetect={false}>
      <CakeUpgrade
        strategy="interaction"
        loader={loader}
        fallback={<button data-testid="fallback">fallback</button>}
      />
    </CakeProvider>
  );

  fireEvent.pointerOver(screen.getByTestId("fallback"));
  expect(await screen.findByTestId("enhanced")).toBeInTheDocument();
});

