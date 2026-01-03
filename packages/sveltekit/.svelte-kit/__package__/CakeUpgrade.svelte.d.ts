export type CakeUpgradeStrategy = "immediate" | "idle" | "visible" | "interaction" | {
    type: "timeout";
    ms: number;
} | {
    type: "idle";
    timeoutMs?: number;
} | {
    type: "visible";
    rootMargin?: string;
    threshold?: number | number[];
};
import type { CakeFeatureKey, CakeTier } from "@birthday-cake-loading/core";
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
declare const CakeUpgrade: $$__sveltets_2_IsomorphicComponent<{
    minTier?: CakeTier;
    feature?: CakeFeatureKey | undefined;
    loader: () => Promise<{
        default: any;
    }>;
    strategy?: CakeUpgradeStrategy;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    fallback: {};
}, {}, string>;
type CakeUpgrade = InstanceType<typeof CakeUpgrade>;
export default CakeUpgrade;
