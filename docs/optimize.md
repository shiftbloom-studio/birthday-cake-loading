# Library optimizations — `@birthday-cake-loading/optimize`

This package provides **tier-aware wrappers** that avoid pulling heavy libraries into base/lite experiences.

## Install

```bash
npm i @birthday-cake-loading/optimize
```

## Framer Motion (React)

```tsx
import { BclMotionDiv } from "@birthday-cake-loading/optimize/framer-motion";

<BclMotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  Hero
</BclMotionDiv>
```

## GSAP (React)

```tsx
import { useGsap } from "@birthday-cake-loading/optimize/gsap";

const gsap = useGsap("rich");
```

## React Three Fiber (React)

```tsx
import { BclR3FCanvas } from "@birthday-cake-loading/optimize/three";

<BclR3FCanvas minTier="ultra" fallback={<img src="/poster.jpg" alt="" />}>
  {/* R3F scene */}
</BclR3FCanvas>
```

## Swiper (React)

```tsx
import { BclSwiper } from "@birthday-cake-loading/optimize/swiper";

<BclSwiper>
  <div>Slide A</div>
  <div>Slide B</div>
</BclSwiper>
```
