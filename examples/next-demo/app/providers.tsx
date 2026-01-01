"use client";

import { CakeProvider } from "@birthday-cake/loading";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <CakeProvider>{children}</CakeProvider>;
};
