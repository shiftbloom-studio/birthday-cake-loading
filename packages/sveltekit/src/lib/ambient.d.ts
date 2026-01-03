import type { CakeBootstrap } from "@birthday-cake-loading/core";

declare global {
  namespace App {
    interface Locals {
      /**
       * Populated by `handleBirthdayCakeLoading` in `hooks.server`.
       */
      bcl?: {
        bootstrap?: CakeBootstrap;
      };
    }
  }
}

export {};

