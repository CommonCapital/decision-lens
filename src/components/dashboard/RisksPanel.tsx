import { Risk } from "@/lib/investor-schema";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  Target, 
  Activity, 
  Shield, 
  TrendingDown,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { EmptySection } from "./EmptySection";
import { useState } from "react";

interface RisksPanelProps {
  risks: Risk[];
}

const severityStyles: Record<Risk["severity"], { bg: string; text: string }> = {
  critical: { bg: "bg-foreground", text: "text-background" },
  high: { bg: "bg-foreground/80", text: "text-background" },
  medium: { bg: "bg-foreground/40", text: "text-background" },
  low: { bg: "bg-foreground/20", text: "text-foreground" },
};

const categoryLabels: Record<Risk["category"], string> = {
  market: "Market",
  operational: "Operational",
  financial: "Financial",
  liquidity: "Liquidity",
  governance: "Governance",
};

function RiskCard({ risk, index }: { risk: Risk; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const styles = severityStyles[risk.severity];
  
  const hasEnhancedData = risk.impact_range || 
    (risk.leading_indicators && risk.leading_indicators.length > 0) ||
    (risk.tripwires && risk.tripwires.length > 0) ||
    risk.response;

  return (
    <div
      className="border border-border hover:shadow-subtle transition-all duration-150"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "px-2 py-0.5 text-[10px] uppercase tracking-ultra-wide font-mono",
              styles.bg,
              styles.text
            )}
          >
            {risk.severity}
          </span>
          <span className="text-micro uppercase tracking-wide text-muted-foreground">
            {categoryLabels[risk.category]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-micro font-mono text-muted-foreground">
            {risk.id}
          </span>
          {hasEnhancedData && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-secondary rounded transition-colors"
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-serif text-lg font-medium mb-2">
          {risk.title}
        </h4>
        <p className="text-sm text-muted-foreground font-light mb-4">
          {risk.description}
        </p>

        <div className="text-sm">
          <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
            Trigger
          </span>
          <span className="font-light">{risk.trigger}</span>
        </div>

        {risk.mitigation && (
          <div className="mt-4 p-3 bg-secondary/50 border-l-2 border-foreground">
            <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
              Mitigation
            </span>
            <span className="text-sm font-light">{risk.mitigation}</span>
          </div>
        )}

        {/* Enhanced Risk Data - Expanded View */}
        {expanded && hasEnhancedData && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            {/* Impact Range */}
            {risk.impact_range && (
              <div className="bg-secondary/30 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-4 h-4 text-muted-foreground" />
                  <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                    Impact Range
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {(risk.impact_range.eps_impact_low !== null || risk.impact_range.eps_impact_high !== null) && (
                    <div>
                      <span className="text-micro text-muted-foreground block">EPS Impact</span>
                      <span className="font-mono">
                        {risk.impact_range.eps_impact_low !== null ? `$${risk.impact_range.eps_impact_low.toFixed(2)}` : "—"} to{" "}
                        {risk.impact_range.eps_impact_high !== null ? `$${risk.impact_range.eps_impact_high.toFixed(2)}` : "—"}
                      </span>
                    </div>
                  )}
                  {(risk.impact_range.multiple_impact_low !== null || risk.impact_range.multiple_impact_high !== null) && (
                    <div>
                      <span className="text-micro text-muted-foreground block">Multiple Impact</span>
                      <span className="font-mono">
                        {risk.impact_range.multiple_impact_low !== null ? `${risk.impact_range.multiple_impact_low.toFixed(1)}x` : "—"} to{" "}
                        {risk.impact_range.multiple_impact_high !== null ? `${risk.impact_range.multiple_impact_high.toFixed(1)}x` : "—"}
                      </span>
                    </div>
                  )}
                  {risk.impact_range.revenue_impact_percent !== null && (
                    <div>
                      <span className="text-micro text-muted-foreground block">Revenue Impact</span>
                      <span className="font-mono">{risk.impact_range.revenue_impact_percent.toFixed(1)}%</span>
                    </div>
                  )}
                  {risk.impact_range.probability !== null && (
                    <div>
                      <span className="text-micro text-muted-foreground block">Probability</span>
                      <span className="font-mono">{(risk.impact_range.probability * 100).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
                {risk.impact_range.timing && (
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Timing: </span>
                    <span>{risk.impact_range.timing}</span>
                  </div>
                )}
              </div>
            )}

            {/* Leading Indicators */}
            {risk.leading_indicators && risk.leading_indicators.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                    Leading Indicators (Weekly)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {risk.leading_indicators.map((indicator, i) => (
                    <div key={i} className="flex items-center justify-between bg-secondary/30 p-2 text-sm">
                      <span>{indicator.name}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span>{indicator.current_value}</span>
                        {indicator.threshold && (
                          <span className="text-muted-foreground">
                            ({indicator.direction} {indicator.threshold})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tripwires */}
            {risk.tripwires && risk.tripwires.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                    Tripwires
                  </span>
                </div>
                <div className="space-y-2">
                  {risk.tripwires.map((tripwire, i) => (
                    <div key={i} className="flex items-center justify-between bg-secondary/30 p-2 text-sm">
                      <div>
                        <span>{tripwire.condition}</span>
                        {tripwire.threshold && (
                          <span className="text-muted-foreground ml-2">({tripwire.threshold})</span>
                        )}
                      </div>
                      <span className={cn(
                        "px-2 py-0.5 text-[10px] uppercase tracking-wide font-mono",
                        tripwire.action === "exit" ? "bg-foreground text-background" :
                        tripwire.action === "reduce_position" ? "bg-foreground/60 text-background" :
                        "bg-foreground/30 text-foreground"
                      )}>
                        {tripwire.action.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Response */}
            {risk.response && (
              <div className="bg-secondary/50 p-3 border-l-2 border-foreground/50">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                    Response Protocol
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  {risk.response.sizing_action && (
                    <div>
                      <span className="text-micro text-muted-foreground block">Sizing</span>
                      <span>{risk.response.sizing_action}</span>
                    </div>
                  )}
                  {risk.response.hedge_instrument && (
                    <div>
                      <span className="text-micro text-muted-foreground block">Hedge</span>
                      <span>{risk.response.hedge_instrument}</span>
                    </div>
                  )}
                  {risk.response.exit_condition && (
                    <div>
                      <span className="text-micro text-muted-foreground block">Exit If</span>
                      <span>{risk.response.exit_condition}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function RisksPanel({ risks }: RisksPanelProps) {
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedRisks = [...risks].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-4 h-4" />
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
            Risks & Breakpoints
          </h2>
          <span className="text-micro text-muted-foreground ml-auto">
            Click to expand for impact, indicators, tripwires
          </span>
        </div>

        {risks.length === 0 ? (
          <EmptySection
            title="Risks & Breakpoints"
            type="unavailable"
            reason="No explicit risks have been identified or documented."
            impact="Proceeding without documented risks is itself a risk."
            suggestion="Common risk categories: customer concentration, competitive dynamics, regulatory exposure, balance sheet leverage."
          />
        ) : (
          <div className="space-y-4">
            {sortedRisks.map((risk, index) => (
              <RiskCard key={risk.id} risk={risk} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
