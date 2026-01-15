import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCEPT_CH =
  "Sec-CH-UA-Mobile, Sec-CH-Prefers-Reduced-Motion, Sec-CH-Prefers-Reduced-Data, ECT, Downlink, RTT, Device-Memory, DPR, Viewport-Width, Viewport-Height";

// These are optional but help ensure CH headers are delivered consistently.
// Some hints require an explicit Permissions-Policy to be sent by the origin.
const PERMISSIONS_POLICY =
  "ch-ua-mobile=(self), ch-prefers-reduced-motion=(self), ch-prefers-reduced-data=(self), ch-ect=(self), ch-downlink=(self), ch-rtt=(self), ch-device-memory=(self), ch-dpr=(self), ch-viewport-width=(self), ch-viewport-height=(self)";

const VARY =
  "Sec-CH-UA-Mobile, Sec-CH-Prefers-Reduced-Motion, Sec-CH-Prefers-Reduced-Data, ECT, Downlink, RTT, Device-Memory, DPR, Viewport-Width, Viewport-Height";

export function proxy(_request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Accept-CH", ACCEPT_CH);
  response.headers.set("Permissions-Policy", PERMISSIONS_POLICY);
  response.headers.set("Vary", VARY);
  return response;
}

export const config = {
  matcher: "/:path*"
};

