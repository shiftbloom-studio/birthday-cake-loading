# Recipe: CakeWatch Quickstart

A minimal guide to getting started with `CakeWatch` in under 10 minutes.

## Minimal Setup

Wrap your application components with `CakeProvider`, mount `CakeWatch`, and use `CakeLayer` with a fallback UI:

```tsx
import React from 'react';
import { CakeProvider, CakeWatch, CakeLayer } from 'birthday-cake-loading';

export function App() {
  return (
    <CakeProvider>
      {/* CakeWatch monitors runtime render cycles and tracks active loaders */}
      <CakeWatch />
      
      <CakeLayer fallback={<div>Loading tier...</div>}>
        <DashboardContent />
      </CakeLayer>
    </CakeProvider>
  );
}

function DashboardContent() {
  return <div>Application loaded!</div>;
}
```

## What is "Jank"?

In `CakeWatch`, **jank** refers to visible frame drops or render stutter caused by unbatched state updates during tier transitions.

## How to Turn Jank Off

You can disable jank warnings and strict jitter throttling by passing `jank={false}` or setting the mode to passive on `CakeWatch`:

```tsx
<CakeWatch jank={false} />
```
