import { Scenarios, SingleScenario, ScenarioDriver } from "@/lib/investor-schema";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EmptySection } from "./EmptySection";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DriverScenariosPanelProps {
  scenarios?: Scenarios | null;
}

type ScenarioName = "base" | "downside" | "upside";

const scenarioLabels: Record<ScenarioName, string> = {
  base: "Base Case",
  downside: "Downside",
  upside: "Upside",
};

export function DriverScenariosPanel({ scenarios }: DriverScenariosPanelProps) {
  const [activeScenario, setActiveScenario] = useState<ScenarioName>("base");
  const [showDrivers, setShowDrivers] = useState(true);

  if (!scenarios) {
    return (
      <section className="py-8 border-b border-border animate-fade-in">
        <div className="px-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-6">
            Driver-Based Scenarios
          </h2>
          <EmptySection
            title="Driver-Based Scenarios"
            type="unavailable"
            reason="No driver-based scenario models have been constructed."
            impact="Cannot stress-test thesis against different assumptions."
            suggestion="Build scenarios with explicit driver deltas for revenue, margin, and capital."
          />
        </div>
      </section>
    );
  }

  const availableScenarios: Array<{ name: ScenarioName; scenario: SingleScenario }> = [];
  if (scenarios.base) availableScenarios.push({ name: "base", scenario: scenarios.base });
  if (scenarios.downside) availableScenarios.push({ name: "downside", scenario: scenarios.downside });
  if (scenarios.upside) availableScenarios.push({ name: "upside", scenario: scenarios.upside });

  if (availableScenarios.length === 0) {
    return (
      <section className="py-8 border-b border-border animate-fade-in">
        <div className="px-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-6">
            Driver-Based Scenarios
          </h2>
          <EmptySection
            title="Driver-Based Scenarios"
            type="unavailable"
            reason="No scenario data available."
            impact="Cannot stress-test thesis against different assumptions."
            suggestion="Build scenarios with explicit driver deltas for revenue, margin, and capital."
          />
        </div>
      </section>
    );
  }

  const current = scenarios[activeScenario] || availableScenarios[0]?.scenario;
  
  if (!current) {
    return null;
  }

  // Extract valuation values from each scenario
  const getValuation = (scenario: SingleScenario | null | undefined): number => {
    return (scenario?.outputs?.valuation?.value as number) || 0;
  };
  
  const baseVal = getValuation(scenarios.base);
  const downsideVal = getValuation(scenarios.downside);
  const upsideVal = getValuation(scenarios.upside);
  
  // Calculate min/max range across all scenarios with valid valuations
  const validValuations = [baseVal, downsideVal, upsideVal].filter(v => v > 0);
  const minVal = validValuations.length > 0 ? Math.min(...validValuations) : 0;
  const maxVal = validValuations.length > 0 ? Math.max(...validValuations) : 0;
  const range = maxVal - minVal;

  // Calculate probability-weighted expected value
  // EV = (Base × w_base) + (Downside × w_downside) + (Upside × w_upside)
  const baseProb = scenarios.base?.probability || 0;
  const downsideProb = scenarios.downside?.probability || 0;
  const upsideProb = scenarios.upside?.probability || 0;
  
  const expectedValue = (baseVal * baseProb) + (downsideVal * downsideProb) + (upsideVal * upsideProb);

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
              Driver-Based Scenarios
            </h2>
            <button
              onClick={() => setShowDrivers(!showDrivers)}
              className="text-micro text-muted-foreground hover:text-foreground transition-colors"
            >
              {showDrivers ? "Hide Drivers" : "Show Drivers"}
            </button>
          </div>

          <div className="flex items-center border border-foreground">
            {availableScenarios.map(({ name, scenario }) => (
              <button
                key={name}
                onClick={() => setActiveScenario(name)}
                className={cn(
                  "px-4 py-2 text-micro uppercase tracking-ultra-wide font-sans transition-all duration-150",
                  activeScenario === name
                    ? "bg-foreground text-background"
                    : "bg-transparent text-foreground hover:bg-foreground/5"
                )}
              >
                {scenarioLabels[name]}
                <span className="ml-2 text-[10px] opacity-60">
                  {Math.round((scenario?.probability || 0) * 100)}%
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Valuation Range with Expected Value */}
        <div className="mb-8 p-4 bg-secondary/30 border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
              Probability-Weighted Valuation
            </span>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-micro text-muted-foreground block">Range</span>
                <span className="font-mono">
                  {minVal > 0 ? `$${(minVal / 1e9).toFixed(1)}B` : "N/A"} — {maxVal > 0 ? `$${(maxVal / 1e9).toFixed(1)}B` : "N/A"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-micro text-muted-foreground block">Expected Value</span>
                <span className="font-mono text-xl">
                  {expectedValue > 0 ? `$${(expectedValue / 1e9).toFixed(1)}B` : "N/A"}
                </span>
              </div>
            </div>
          </div>
          
          {/* Formula tooltip */}
          <div className="text-[10px] text-muted-foreground mb-3">
            EV = (Base × {(baseProb * 100).toFixed(0)}%) + (Downside × {(downsideProb * 100).toFixed(0)}%) + (Upside × {(upsideProb * 100).toFixed(0)}%)
          </div>
          
          {/* Visual range */}
          <div className="relative h-10 bg-secondary border border-border">
            {availableScenarios.map(({ name, scenario }) => {
              const val = (scenario?.outputs?.valuation?.value as number) || 0;
              const position = range > 0 ? ((val - minVal) / range) * 100 : 50;

              return (
                <div
                  key={name}
                  className={cn(
                    "absolute top-0 bottom-0 flex items-center justify-center transition-all duration-300",
                    name === activeScenario
                      ? "bg-foreground text-background z-10"
                      : "bg-foreground/10"
                  )}
                  style={{
                    left: `${Math.max(0, position - 10)}%`,
                    width: "20%",
                  }}
                >
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-wide block opacity-70">
                      {scenarioLabels[name]}
                    </span>
                    <span className="text-micro font-mono">
                      {scenario?.outputs?.valuation?.formatted || "N/A"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver Breakdown Table */}
        {showDrivers && (() => {
          // Build merged drivers from all scenarios
          const baseDrivers = scenarios.base?.drivers || [];
          const downsideDrivers = scenarios.downside?.drivers || [];
          const upsideDrivers = scenarios.upside?.drivers || [];
          
          // Create a map of driver names across all scenarios
          const driverNames = new Set<string>();
          baseDrivers.forEach(d => d?.name && driverNames.add(d.name));
          downsideDrivers.forEach(d => d?.name && driverNames.add(d.name));
          upsideDrivers.forEach(d => d?.name && driverNames.add(d.name));
          
          const getDriverValue = (drivers: typeof baseDrivers, name: string) => {
            const driver = drivers.find(d => d?.name === name);
            return driver?.value || "N/A";
          };
          
          const getDriverMeta = (drivers: typeof baseDrivers, name: string) => {
            const driver = drivers.find(d => d?.name === name);
            return {
              category: driver?.category || "",
              source: driver?.source || "",
            };
          };
          
          const driverNameList = Array.from(driverNames);
          
          if (driverNameList.length === 0) {
            return (
              <div className="mb-8 p-4 border border-border bg-secondary/20">
                <p className="text-sm text-muted-foreground">No driver data available in scenarios.</p>
              </div>
            );
          }
          
          return (
            <div className="mb-8 border border-border">
              <div className="grid grid-cols-5 gap-px bg-border">
                <div className="bg-secondary p-3 text-micro uppercase tracking-ultra-wide text-muted-foreground">
                  Driver
                </div>
                <div className="bg-secondary p-3 text-micro uppercase tracking-ultra-wide text-muted-foreground text-center">
                  Downside
                </div>
                <div className="bg-secondary p-3 text-micro uppercase tracking-ultra-wide text-muted-foreground text-center font-medium">
                  Base
                </div>
                <div className="bg-secondary p-3 text-micro uppercase tracking-ultra-wide text-muted-foreground text-center">
                  Upside
                </div>
                <div className="bg-secondary p-3 text-micro uppercase tracking-ultra-wide text-muted-foreground text-center">
                  Source
                </div>
              </div>
              
              {driverNameList.map((driverName, i) => {
                const getDriverFull = (drivers: typeof baseDrivers, name: string) => {
                  return drivers.find(d => d?.name === name);
                };
                
                const baseFull = getDriverFull(baseDrivers, driverName);
                const downsideFull = getDriverFull(downsideDrivers, driverName);
                const upsideFull = getDriverFull(upsideDrivers, driverName);
                const meta = baseFull || downsideFull || upsideFull;
                
                const downsideValue = downsideFull?.value || "N/A";
                const baseValue = baseFull?.value || "N/A";
                const upsideValue = upsideFull?.value || "N/A";
                const source = meta?.source || "";
                const category = meta?.category || "";
                
                // Get source reference for tooltip
                const sourceRef = baseFull?.source_reference || downsideFull?.source_reference || upsideFull?.source_reference;
                
                return (
                  <div key={i} className="grid grid-cols-5 gap-px bg-border">
                    <div className="bg-card p-3 flex items-center gap-2">
                      <span className="text-sm">{driverName}</span>
                      {category && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-secondary text-muted-foreground uppercase">
                          {category}
                        </span>
                      )}
                    </div>
                    <div className={cn(
                      "bg-card p-3 text-center font-mono text-sm",
                      activeScenario === "downside" ? "bg-foreground/5" : ""
                    )}>
                      <span className="text-muted-foreground">{downsideValue}</span>
                    </div>
                    <div className={cn(
                      "bg-card p-3 text-center font-mono text-sm font-medium",
                      activeScenario === "base" ? "bg-foreground/5" : ""
                    )}>
                      {baseValue}
                    </div>
                    <div className={cn(
                      "bg-card p-3 text-center font-mono text-sm",
                      activeScenario === "upside" ? "bg-foreground/5" : ""
                    )}>
                      <span className="text-muted-foreground">{upsideValue}</span>
                    </div>
                    <div className="bg-card p-3 text-center">
                      {source && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.5 uppercase tracking-wide cursor-help",
                              source === "fact" 
                                ? "bg-foreground text-background" 
                                : "bg-foreground/20 text-foreground border border-dashed border-foreground/30"
                            )}>
                              {source}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <div className="text-xs space-y-1">
                              <p className="font-medium">
                                {source === "fact" 
                                  ? "Source-linked assumption" 
                                  : "Judgment call - analyst estimate"}
                              </p>
                              {sourceRef?.excerpt && (
                                <p className="text-muted-foreground italic">"{sourceRef.excerpt}"</p>
                              )}
                              {sourceRef?.document_type && (
                                <p className="text-muted-foreground">Source: {sourceRef.document_type}</p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Scenario Outputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Scenario Assumptions */}
          <div>
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 border-b border-border pb-2">
              {scenarioLabels[activeScenario]} Assumptions
            </h3>
            <div className="space-y-3">
              {(current?.assumptions || []).map((assumption, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-border/50"
                >
                  <span className="text-sm">{assumption?.key || ""}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-secondary px-2 py-1">
                      {assumption?.value || ""}
                    </span>
                    {activeScenario !== "base" && (
                      <span className="text-[10px] text-muted-foreground">
                        {activeScenario === "downside" ? (
                          <ArrowDown className="w-3 h-3 inline" />
                        ) : (
                          <ArrowUp className="w-3 h-3 inline" />
                        )}
                        vs base
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outputs with Traceability */}
          <div>
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 border-b border-border pb-2">
              {scenarioLabels[activeScenario]} Outputs
              {current?.outputs?.revenue?.period && (
                <span className="ml-2 text-[10px] bg-secondary px-2 py-0.5">{current.outputs.revenue.period}</span>
              )}
            </h3>
            <div className="bg-secondary/30 border border-border p-3 mb-4">
              <p className="text-[10px] text-muted-foreground">
                <strong>Note:</strong> Scenario outputs are <strong>annual projections (FY25E)</strong> based on TTM FY24 Revenue of $3.26B 
                (sum of Q1: $795M + Q2: $834M + Q3: $868M + Q4: $892M). 
                Quarterly Analysis shows individual quarter values (e.g., Q4: $892M Revenue, $224M EBITDA).
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border">
              {/* Revenue */}
              <div className="bg-card p-4">
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
                  Revenue
                </span>
                <span className="font-mono text-xl">{current?.outputs?.revenue?.formatted || "N/A"}</span>
                {current?.outputs?.revenue?.formula && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-[10px] text-muted-foreground mt-1 cursor-help underline decoration-dashed">
                        {current.outputs.revenue.formula}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="text-xs space-y-1">
                        {current.outputs.revenue.formula_inputs?.map((input, i) => (
                          <div key={i} className="flex justify-between gap-4">
                            <span>{input?.name}:</span>
                            <span className="font-mono">
                              {typeof input?.value === 'number' 
                                ? (input.value >= 1e9 ? `$${(input.value / 1e9).toFixed(2)}B` : input.value >= 1e6 ? `$${(input.value / 1e6).toFixed(0)}M` : `${(input.value * 100).toFixed(0)}%`)
                                : input?.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              
              {/* EBITDA */}
              <div className="bg-card p-4">
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
                  EBITDA
                </span>
                <span className="font-mono text-xl">{current?.outputs?.ebitda?.formatted || "N/A"}</span>
                {current?.outputs?.ebitda?.formula && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-[10px] text-muted-foreground mt-1 cursor-help underline decoration-dashed">
                        {current.outputs.ebitda.formula}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="text-xs space-y-1">
                        {current.outputs.ebitda.formula_inputs?.map((input, i) => (
                          <div key={i} className="flex justify-between gap-4">
                            <span>{input?.name}:</span>
                            <span className="font-mono">
                              {typeof input?.value === 'number' 
                                ? (input.value >= 1e9 ? `$${(input.value / 1e9).toFixed(2)}B` : input.value >= 1e6 ? `$${(input.value / 1e6).toFixed(0)}M` : `${(input.value * 100).toFixed(0)}%`)
                                : input?.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              
              {/* Implied Valuation */}
              <div className="bg-card p-4 col-span-2">
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
                  Implied Valuation
                </span>
                <span className="font-mono text-2xl">{current?.outputs?.valuation?.formatted || "N/A"}</span>
                {current?.outputs?.valuation?.formula && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-[10px] text-muted-foreground mt-1 cursor-help underline decoration-dashed">
                        {current.outputs.valuation.formula}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="text-xs space-y-1">
                        {current.outputs.valuation.formula_inputs?.map((input, i) => (
                          <div key={i} className="flex justify-between gap-4">
                            <span>{input?.name}:</span>
                            <span className="font-mono">
                              {typeof input?.value === 'number' 
                                ? (input.value >= 1e9 ? `$${(input.value / 1e9).toFixed(2)}B` : input.value >= 1e6 ? `$${(input.value / 1e6).toFixed(0)}M` : `${input.value}`)
                                : input?.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}