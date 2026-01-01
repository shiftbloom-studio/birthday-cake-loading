import React from "react";
import { render, screen } from "@testing-library/react";
import { CakeProvider, useCake, useCakeTier } from "../src/context";

const TierDisplay = () => {
  const tier = useCakeTier();
  return <div data-testid="tier">{tier}</div>;
};

test("CakeProvider exposes tier", async () => {
  render(
    <CakeProvider initialTier="lite" autoDetect={false}>
      <TierDisplay />
    </CakeProvider>
  );

  expect(screen.getByTestId("tier").textContent).toBe("lite");
});

test("CakeProvider does not treat initialTier as an override", async () => {
  const OverrideDisplay = () => {
    const { override } = useCake();
    return <div data-testid="override">{override ?? ""}</div>;
  };

  render(
    <CakeProvider initialTier="lite" autoDetect={false}>
      <OverrideDisplay />
    </CakeProvider>
  );

  expect(screen.getByTestId("override").textContent).toBe("");
});
