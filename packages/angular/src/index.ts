import {
  EnvironmentProviders,
  InjectionToken,
  computed,
  inject,
  makeEnvironmentProviders,
  makeStateKey,
  signal
} from "@angular/core";
import { TransferState } from "@angular/core";
import type { CakeBootstrap, CakeConfig, CakeState, CakeTier } from "@birthday-cake-loading/core";
import { createCakeRuntime } from "@birthday-cake-loading/core/runtime";
import { applyCakeDatasetAttributes } from "@birthday-cake-loading/core/dom";

export interface AngularCakeApi {
  state: () => CakeState;
  tier: () => CakeTier;
  ready: () => boolean;
  refresh: () => void;
  setTierOverride: (tier?: CakeTier) => void;
}

export const BCL_BOOTSTRAP_STATE_KEY = makeStateKey<CakeBootstrap | undefined>("bcl:bootstrap");

export const BCL_ANGULAR_TOKEN = new InjectionToken<AngularCakeApi>(
  "BCL_ANGULAR_TOKEN"
);

export interface ProvideBirthdayCakeLoadingOptions {
  bootstrap?: CakeBootstrap;
  config?: Partial<CakeConfig>;
  autoDetect?: boolean;
  watchSignals?: boolean;
  /**
   * If true, writes `data-bcl-*` attributes on `<html>` in the browser.
   *
   * Default: true
   */
  applyHtmlDataset?: boolean;
}

const DEFAULT_STATE: CakeState = {
  signals: {},
  tier: "base",
  features: {
    motion: false,
    smoothScroll: false,
    audio: false,
    privacyBanner: false,
    richImages: false
  },
  ready: false
};

const readBootstrapFromTransferState = (
  transferState: TransferState
): CakeBootstrap | undefined => {
  if (transferState.hasKey(BCL_BOOTSTRAP_STATE_KEY)) {
    const v = transferState.get(BCL_BOOTSTRAP_STATE_KEY, undefined);
    transferState.remove(BCL_BOOTSTRAP_STATE_KEY);
    return v;
  }
  return undefined;
};

export const provideBirthdayCakeLoading = (
  options: ProvideBirthdayCakeLoadingOptions = {}
): EnvironmentProviders =>
  makeEnvironmentProviders([
    {
      provide: BCL_ANGULAR_TOKEN,
      useFactory: (): AngularCakeApi => {
        const transferState = inject(TransferState, { optional: true });
        const bootstrap =
          options.bootstrap ??
          (transferState ? readBootstrapFromTransferState(transferState) : undefined);

        const stateSig = signal<CakeState>(DEFAULT_STATE);

        const runtime = createCakeRuntime({
          config: options.config,
          bootstrap,
          autoDetect: options.autoDetect ?? true,
          watchSignals: options.watchSignals,
          onChange: (s) => {
            stateSig.set(s);
          }
        });

        stateSig.set(runtime.getState());

        const applyHtmlDataset = options.applyHtmlDataset !== false;
        if (typeof document !== "undefined" && applyHtmlDataset) {
          applyCakeDatasetAttributes(runtime.getState());
          runtime.subscribe((s) => applyCakeDatasetAttributes(s));
        }

        const tier = computed(() => stateSig().tier);
        const ready = computed(() => stateSig().ready);

        return {
          state: () => stateSig(),
          tier: () => tier(),
          ready: () => ready(),
          refresh: () => runtime.refresh(),
          setTierOverride: (t?: CakeTier) => runtime.setTierOverride(t)
        };
      }
    }
  ]);

export const injectCake = (): AngularCakeApi => inject(BCL_ANGULAR_TOKEN);

