import type { CakeConfig } from "./types";

export const DEFAULT_CONFIG: CakeConfig = {
  tiering: {
    lowMemoryGB: 4,
    veryLowMemoryGB: 2,
    lowCpuCores: 4,
    ultraMemoryGB: 8,
    ultraCpuCores: 8,
    minDownlinkMbps: 1.5,
    maxRttMs: 300
  },
  features: {
    allowMotionOnLite: false,
    allowRichImagesOnBase: false,
    audioRequiresUnmetered: true
  },
  watchtower: {
    enabled: false,
    sensitivity: "medium"
  },
  debug: false,
  watchSignals: true
};
