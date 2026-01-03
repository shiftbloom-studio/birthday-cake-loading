import type { CakeBootstrap, CakeConfig, CakeState } from "@birthday-cake-loading/core";
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
type $$__sveltets_2_PropsWithChildren<Props, Slots> = Props & (Slots extends {
    default: any;
} ? Props extends Record<string, never> ? any : {
    children?: any;
} : {});
declare const CakeProvider: $$__sveltets_2_IsomorphicComponent<$$__sveltets_2_PropsWithChildren<{
    bootstrap?: CakeBootstrap | undefined;
    config?: Partial<CakeConfig> | undefined;
    autoDetect?: boolean;
    watchSignals?: boolean | undefined;
    applyHtmlDataset?: boolean;
    onChange?: ((state: CakeState) => void) | undefined;
}, {
    default: {};
}>, {
    [evt: string]: CustomEvent<any>;
}, {
    default: {};
}, {}, string>;
type CakeProvider = InstanceType<typeof CakeProvider>;
export default CakeProvider;
