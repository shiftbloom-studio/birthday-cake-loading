// Clash Display and General Sans come from Fontshare, but visitors' browsers never
// contact Fontshare: this route fetches the stylesheet server-side and rewrites the
// font URLs to /fonts/fs/*, which are proxied too. The font files are not in the
// repository because their license doesn't allow redistribution.
const FONT_CSS =
  "https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600&f[]=general-sans@400,500,600&display=swap";

export async function GET() {
  const res = await fetch(FONT_CSS);
  if (!res.ok) {
    return new Response("/* fonts unavailable */", { headers: { "Content-Type": "text/css" } });
  }
  const css = (await res.text()).replace(/(?:https?:)?\/\/cdn\.fontshare\.com\//g, "/fonts/fs/");
  return new Response(css, {
    headers: { "Content-Type": "text/css; charset=utf-8", "Cache-Control": "public, max-age=86400" }
  });
}
