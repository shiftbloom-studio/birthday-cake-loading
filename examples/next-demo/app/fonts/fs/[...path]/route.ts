const TYPES: Record<string, string> = { woff2: "font/woff2", woff: "font/woff", ttf: "font/ttf" };

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const file = path.join("/");
  const ext = file.split(".").pop() ?? "";
  if (!/^[A-Za-z0-9/_.-]+$/.test(file) || file.includes("..") || !TYPES[ext]) {
    return new Response("not found", { status: 404 });
  }
  const res = await fetch(`https://cdn.fontshare.com/${file}`);
  if (!res.ok) return new Response("not found", { status: 404 });
  return new Response(res.body, {
    headers: { "Content-Type": TYPES[ext], "Cache-Control": "public, max-age=31536000, immutable" }
  });
}
