import "./styles.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Birthday-Cake Loading Demo",
  description: "Progressive enhancement demo for @birthday-cake/loading"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
