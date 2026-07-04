import type { CakeTier } from "./types";

export type CakeTierSelector = CakeTier | `${CakeTier}+` | `${CakeTier}-`;

const STYLE_ID = "bcl-default-tier-visibility";

const selectorFor = (selector: CakeTierSelector, hiddenTier: CakeTier) => {
  if (selector.endsWith("+")) {
    const base = selector.slice(0, -1) as CakeTier;
    const order: CakeTier[] = ["base", "lite", "rich", "ultra"];
    return order.indexOf(hiddenTier) < order.indexOf(base);
  }
  if (selector.endsWith("-")) {
    const base = selector.slice(0, -1) as CakeTier;
    const order: CakeTier[] = ["base", "lite", "rich", "ultra"];
    return order.indexOf(hiddenTier) > order.indexOf(base);
  }
  return selector !== hiddenTier;
};

const supportedSelectors: CakeTierSelector[] = [
  "base", "lite", "rich", "ultra",
  "base+", "lite+", "rich+", "ultra+",
  "base-", "lite-", "rich-", "ultra-"
];

export const ensureCakeTierVisibilityStyles = () => {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) {
    return;
  }

  const tiers: CakeTier[] = ["base", "lite", "rich", "ultra"];
  const rules: string[] = [];

  for (const activeTier of tiers) {
    for (const selector of supportedSelectors) {
      if (!selectorFor(selector, activeTier)) {
        continue;
      }
      rules.push(`html[data-bcl-tier="${activeTier}"] [data-cake-tier="${selector}"], html[data-bcl-tier="${activeTier}"] [caketier="${selector}"] { display: none !important; }`);
    }
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.dataset.bcl = "tier-visibility";
  style.textContent = rules.join("\n");
  const head = document.head ?? document.getElementsByTagName("head")[0] ?? document.documentElement;
  head.appendChild(style);
};
