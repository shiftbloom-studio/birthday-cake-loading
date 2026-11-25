// The shiftbloom Bloom, drawn from the brand book v2 spec: four petal rings and a seed.
const RINGS = [
  { r: 100, w: 30, n: 10, rot: 0, a: "#D8163F", b: "#FF2E52" },
  { r: 74, w: 25, n: 10, rot: 18, a: "#FF2E52", b: "#FF7E9E" },
  { r: 50, w: 19, n: 8, rot: 22.5, a: "#FF7E9E", b: "#FFC2D3" },
  { r: 27, w: 11, n: 6, rot: 30, a: "#FFB4CA", b: "#FFDCE7" }
];

const petal = (r: number, w: number) =>
  `M0 0C${w} ${-r * 0.32} ${w * 0.55} ${-r * 0.78} 0 ${-r}C${-w * 0.55} ${-r * 0.78} ${-w} ${-r * 0.32} 0 0Z`;

export const Bloom = ({ size = 36, id = "bloom" }: { size?: number; id?: string }) => (
  <svg className="bloom" width={size} height={size} viewBox="-104 -104 208 208" aria-hidden="true">
    <defs>
      {RINGS.map((g, k) => (
        <linearGradient key={k} id={`${id}${k}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={g.a} />
          <stop offset="1" stopColor={g.b} />
        </linearGradient>
      ))}
    </defs>
    {RINGS.map((g, k) =>
      Array.from({ length: g.n }).map((_, i) => (
        <path
          key={`${k}-${i}`}
          d={petal(g.r, g.w)}
          fill={`url(#${id}${k})`}
          transform={`rotate(${g.rot + (360 / g.n) * i})`}
        />
      ))
    )}
    <circle r="7" fill="#FF2E52" />
  </svg>
);
