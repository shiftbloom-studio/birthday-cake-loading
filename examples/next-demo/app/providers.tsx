"use client";

import type { CakeBootstrap } from "@shiftbloom-studio/birthday-cake-loading";
import { CakeProvider } from "@shiftbloom-studio/birthday-cake-loading";
import { CakeDevTools } from "@shiftbloom-studio/birthday-cake-loading/devtools";

export const Providers = ({
  children,
  bootstrap
}: {
  children: React.ReactNode;
  bootstrap?: CakeBootstrap;
}) => {
  return (
    <CakeProvider bootstrap={bootstrap}>
      {children}
      <CakeDevTools />
    </CakeProvider>
  );
};
