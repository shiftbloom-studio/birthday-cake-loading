"use client";

import type { CakeBootstrap } from "@shiftbloom-studio/birthday-cake-loading";
import { CakeProvider, CakeWatch } from "@shiftbloom-studio/birthday-cake-loading";
import { CakeDevTools } from "@shiftbloom-studio/birthday-cake-loading/devtools";

export const Providers = ({
  children,
  bootstrap
}: {
  children: React.ReactNode;
  bootstrap?: CakeBootstrap;
}) => {
  return (
    <CakeProvider
      bootstrap={bootstrap}
      config={{
        watchtower: {
          enabled: true,
          sensitivity: "medium",
          targets: ["hero", "metrics", "gallery", "ultra"]
        }
      }}
    >
      <CakeWatch />
      {children}
      <CakeDevTools position="top-right" />
    </CakeProvider>
  );
};
