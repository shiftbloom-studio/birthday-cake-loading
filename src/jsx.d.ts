import type { CakeTierSelector } from "./cake-tier-visibility";

declare module "react" {
  interface Attributes {
    cakeTier?: CakeTierSelector;
  }
}
