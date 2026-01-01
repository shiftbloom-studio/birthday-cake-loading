import "./styles.css";
import { Providers } from "./providers";
import { headers } from "next/headers";
import { getServerCakeBootstrapFromHeaders } from "@birthday-cake/loading/server";

export const metadata = {
  title: "Birthday-Cake Loading Demo",
  description: "Progressive enhancement demo for @birthday-cake/loading"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const bootstrap = getServerCakeBootstrapFromHeaders(headers());
  return (
    <html lang="en">
      <body>
        <Providers bootstrap={bootstrap}>{children}</Providers>
      </body>
    </html>
  );
}
