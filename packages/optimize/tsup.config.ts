import { defineConfig } from "tsup";

const shared = {
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  minify: false,
  clean: true,
  external: [
    "react",
    "react-dom",
    "vite",
    "framer-motion",
    "gsap",
    "three",
    "@react-three/fiber",
    "swiper",
    "swiper/react",
    "@birthday-cake-loading/react"
  ]
} as const;

export default defineConfig([
  {
    ...shared,
    entry: {
      index: "src/index.ts",
      vite: "src/vite.ts",
      "framer-motion": "src/framer-motion.tsx",
      gsap: "src/gsap.ts",
      three: "src/three.tsx",
      swiper: "src/swiper.tsx"
    }
  }
]);

