import "./styles.css";
import { Providers } from "./providers";
import { headers } from "next/headers";
import { getServerCakeBootstrapFromHeaders } from "@shiftbloom-studio/birthday-cake-loading/server";

export const metadata = {
  title: "Birthday-Cake Loading Demo",
  description: "Progressive enhancement demo for @shiftbloom-studio/birthday-cake-loading"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const bootstrap = getServerCakeBootstrapFromHeaders(await headers());
  return (
    <html lang="en">
      <body>
        <Providers bootstrap={bootstrap}>{children}</Providers>
      </body>
    </html>
  );
}
