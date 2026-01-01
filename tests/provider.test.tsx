import React from "react";
import { render, screen } from "@testing-library/react";
import { CakeProvider, useCakeTier } from "../src/context";

const TierDisplay = () => {
  const tier = useCakeTier();
  return <div data-testid="tier">{tier}</div>;
};

test("CakeProvider exposes tier", async () => {
  render(
    <CakeProvider initialTier="lite">
      <TierDisplay />
    </CakeProvider>
  );

  expect(screen.getByTestId("tier").textContent).toBe("lite");
});
