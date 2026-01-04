import { applySignalMatrix, getSignalMatrixRules } from "../src/signal-matrix";
import { DEFAULT_CONFIG } from "../src/config";
import type { CakeConfig, CakeSignals, CakeSignalMatrixRule } from "../src/types";

describe("signal-matrix", () => {
    describe("getSignalMatrixRules", () => {
        it("returns default rules when no configuration", () => {
            const rules = getSignalMatrixRules();
            expect(rules.length).toBeGreaterThan(0);
            expect(rules.find(r => r.id === "reduced-motion-mobile-low-memory")).toBeDefined();
        });

        it("merges custom rules", () => {
            const customRule: CakeSignalMatrixRule = {
                id: "custom-rule",
                when: { prefersReducedMotion: true },
                adjust: { setTier: "base" }
            };

            const config: CakeConfig = {
                ...DEFAULT_CONFIG,
                advanced: {
                    signalMatrix: true,
                    signalMatrixRules: [customRule]
                }
            };

            const rules = getSignalMatrixRules(config);
            expect(rules).toContainEqual(customRule);
        });

        it("overrides default rules", () => {
            const overrideRule: CakeSignalMatrixRule = {
                id: "reduced-motion-mobile-low-memory",
                when: { prefersReducedMotion: true },
                adjust: { setTier: "ultra" } // Weird override for test
            };

            const config: CakeConfig = {
                ...DEFAULT_CONFIG,
                advanced: {
                    signalMatrix: true,
                    signalMatrixRules: [overrideRule]
                }
            };

            const rules = getSignalMatrixRules(config);
            const rule = rules.find(r => r.id === "reduced-motion-mobile-low-memory");
            expect(rule?.adjust.setTier).toBe("ultra");
        });
    });

    describe("applySignalMatrix", () => {
        const configWithMatrix: CakeConfig = {
            ...DEFAULT_CONFIG,
            advanced: { ...DEFAULT_CONFIG.advanced, signalMatrix: true },
        };

        it("returns original tier if matrix disabled", () => {
            const result = applySignalMatrix("ultra", {}, DEFAULT_CONFIG);
            expect(result).toBe("ultra");
        });

        it("downgrades on reduced motion + mobile + low memory", () => {
            const signals: CakeSignals = {
                prefersReducedMotion: true,
                userAgentMobile: true,
                deviceMemoryGB: 2,
                // Missing maxHardwareConcurrency to hit the first default rule specifically
                effectiveType: "4g"
            };

            // Default rule: reduced-motion-mobile-low-memory (max device memory 4) -> maxTier: lite
            const result = applySignalMatrix("ultra", signals, configWithMatrix);
            expect(result).toBe("lite");
        });

        it("does not downgrade if conditions not met", () => {
            const signals: CakeSignals = {
                prefersReducedMotion: false, // Condition not met
                userAgentMobile: true,
                deviceMemoryGB: 2
            };

            const result = applySignalMatrix("ultra", signals, configWithMatrix);
            expect(result).toBe("ultra");
        });

        it("respects setTier adjustment", () => {
            const signals: CakeSignals = {
                userAgentMobile: true,
                deviceMemoryGB: 1, // < 2
                hardwareConcurrency: 2 // < 4
            };
            // Rule: very-low-memory-mobile -> setTier: base
            const result = applySignalMatrix("ultra", signals, configWithMatrix);
            expect(result).toBe("base");
        });

        it("clamps tier correctly (maxTier)", () => {
            const signals: CakeSignals = {
                prefersReducedData: true,
                userAgentMobile: true,
                effectiveType: "slow-2g"
            };
            // Rule: reduced-data-mobile-constrained-network -> maxTier: lite

            // rich -> lite
            expect(applySignalMatrix("rich", signals, configWithMatrix)).toBe("lite");
            // base -> base (already lower)
            expect(applySignalMatrix("base", signals, configWithMatrix)).toBe("base");
        });

        it("handles multiple rules (sequential application)", () => {
            // This is tricky with default rules as strict order matters, but let's try a custom config
            const customConfig: CakeConfig = {
                ...configWithMatrix,
                advanced: {
                    ...configWithMatrix.advanced,
                    signalMatrixRules: [
                        {
                            id: "rule1",
                            when: { minDeviceMemoryGB: 8 },
                            adjust: { maxTier: "rich" }
                        },
                        {
                            id: "rule2",
                            when: { minHardwareConcurrency: 8 },
                            adjust: { maxTier: "lite" }
                        }
                    ]
                }
            };

            const signals: CakeSignals = {
                deviceMemoryGB: 8, // matches rule 1 (>= 8)
                hardwareConcurrency: 8 // matches rule 2 (>= 8)
            };

            // ultra -> rule1 (rich) -> rule2 (lite) -> lite
            expect(applySignalMatrix("ultra", signals, customConfig)).toBe("lite");
        });
    });
});
