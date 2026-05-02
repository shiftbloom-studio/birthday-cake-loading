import { initCakeRuntime } from "../src/runtime";

describe("initCakeRuntime", () => {
  it("writes tier state to html dataset", () => {
    const stop = initCakeRuntime({ watchSignals: false });
    expect(document.documentElement.dataset.bclReady).toBe("true");
    expect(document.documentElement.dataset.bclTier).toBeDefined();
    stop();
  });

  it("injects default visibility css for [data-cake-tier]", () => {
    initCakeRuntime({ watchSignals: false });
    const style = document.getElementById("bcl-default-tier-visibility");
    expect(style?.textContent).toContain('[data-cake-tier="rich"]');
    expect(style?.textContent).toContain('[caketier="rich"]');
  });
});
