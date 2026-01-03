import type { CakeState } from "./types";

/**
 * Writes debugging / gating-friendly attributes to `<html>`:
 * - data-bcl-tier, data-bcl-ready, data-bcl-motion, ...
 *
 * Safe to call in any framework; it no-ops on the server.
 */
export const applyCakeDatasetAttributes = (state: CakeState) => {
  if (typeof document === "undefined") {
    return;
  }

  const html = document.documentElement;
  html.dataset.bclTier = state.tier;
  html.dataset.bclReady = String(state.ready);
  html.dataset.bclMotion = String(state.features.motion);
  html.dataset.bclSmoothScroll = String(state.features.smoothScroll);
  html.dataset.bclAudio = String(state.features.audio);
  html.dataset.bclPrivacy = String(state.features.privacyBanner);
  html.dataset.bclRichImages = String(state.features.richImages);
  html.dataset.bclSaveData = String(Boolean(state.signals.saveData));

  if (state.override) {
    html.dataset.bclOverride = state.override;
  } else {
    delete html.dataset.bclOverride;
  }

  if (state.signals.effectiveType) {
    html.dataset.bclEct = state.signals.effectiveType;
  } else {
    delete html.dataset.bclEct;
  }
};

