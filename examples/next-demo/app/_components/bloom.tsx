// The shiftbloom bloom, exactly as shiftbloom.studio draws it (brand book v2, "The Mark"):
// four interleaved petal rings (10 · 10 · 8 · 6) plus the seed. Gradient only inside the mark.
const RINGS = [
  { r: 100, n: 10, w: 32, l: 90, a: "#D8163F", b: "#FF2E52", rot: 0 },
  { r: 74, n: 10, w: 25.16, l: 66.6, a: "#FF2E52", b: "#FF7E9E", rot: 18 },
  { r: 50, n: 8, w: 19, l: 45, a: "#FF7E9E", b: "#FFC2D3", rot: 40.5 },
  { r: 27, n: 6, w: 12.96, l: 24.3, a: "#FFB4CA", b: "#FFDCE7", rot: 70.5 }
];

const f = (v: number) => Number(v.toFixed(2));
const petal = (w: number, l: number) => `M 0,0 C ${w},0 ${w},${-f(0.55 * l)} 0,${-l} C ${-w},${-f(0.55 * l)} ${-w},0 0,0 Z`;

export const Bloom = ({ size = 30, id = "sb-bloom-ring" }: { size?: number; id?: string }) => (
  <svg className="bloom" width={size} height={size} viewBox="0 0 200 200" aria-hidden="true">
    <defs>
      {RINGS.map((g) => (
        <linearGradient key={g.r} id={`${id}-${g.r}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={-g.l}>
          <stop offset="0%" stopColor={g.a} />
          <stop offset="100%" stopColor={g.b} />
        </linearGradient>
      ))}
    </defs>
    {RINGS.map((g) =>
      Array.from({ length: g.n }).map((_, i) => (
        <path
          key={`${g.r}-${i}`}
          d={petal(g.w, g.l)}
          fill={`url(#${id}-${g.r})`}
          transform={`translate(100 100) rotate(${f(g.rot + (360 / g.n) * i)}) translate(0 ${-f(g.r - g.l)})`}
        />
      ))
    )}
    <circle cx="100" cy="100" r="7" fill="#FF2E52" />
  </svg>
);
