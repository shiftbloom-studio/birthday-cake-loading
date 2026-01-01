"use client";

import type { CakeBootstrap } from "@birthday-cake/loading";
import { CakeProvider } from "@birthday-cake/loading";
import { CakeDevTools } from "@birthday-cake/loading/devtools";

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
