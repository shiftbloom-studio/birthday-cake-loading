import { Demo, DemoFooter } from "./_components/demo";
import { ServerSnapshot } from "./_components/server-snapshot";

export default function Page() {
  return (
    <main id="content" className="container">
      <Demo />
      <ServerSnapshot />
      <DemoFooter />
    </main>
  );
}
