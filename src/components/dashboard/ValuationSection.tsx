import { Valuation, DataQuality } from "@/lib/investor-schema";
import { cn } from "@/lib/utils";
import { 
  Calculator, 
  TrendingUp, 
  GitCompare, 
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink
} from "lucide-react";

interface ValuationSectionProps {
  valuation: Valuation | null | undefined;
}

// Helper to extract value from traceable value or number
function getTraceableValue(val: any): number | null {
  if (val == null) return null;
  if (typeof val === "number") return val;
  if (typeof val === "object" && val.value != null) return val.value;
  return null;
}

function getTraceableFormatted(val: any): string | null {
  if (val == null) return null;
  if (typeof val === "object" && val.formatted) return val.formatted;
  return null;
}

function getQualityBand(quality: DataQuality): "high" | "medium" | "low" {
  const avgScore = [quality?.coverage, quality?.auditability].filter(Boolean).reduce((a, b) => a + (b || 0), 0) / 2;
  if (avgScore >= 85) return "high";
  if (avgScore >= 60) return "medium";
  return "low";
}

function DataQualityBadge({ quality }: { quality: DataQuality | null | undefined }) {
  if (!quality) return null;
  
  const band = getQualityBand(quality);
  
  const bandStyles = {
    high: { icon: CheckCircle, bg: "bg-foreground", text: "text-background" },
    medium: { icon: AlertCircle, bg: "bg-foreground/60", text: "text-background" },
    low: { icon: XCircle, bg: "bg-foreground/30", text: "text-foreground" },
  };
  
  const style = bandStyles[band];
  const Icon = style.icon;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className={cn("px-2 py-0.5 text-[10px] uppercase tracking-ultra-wide font-mono flex items-center gap-1", style.bg, style.text)}>
          <Icon className="w-3 h-3" />
          {band}
        </span>
      </div>
      <div className="flex gap-3 text-[10px] text-muted-foreground font-mono">
        {quality.coverage !== null && quality.coverage !== undefined && (
          <span>Coverage: {quality.coverage}%</span>
        )}
        {quality.auditability !== null && quality.auditability !== undefined && (
          <span>Audit: {quality.auditability}%</span>
        )}
        {quality.freshness_days !== null && quality.freshness_days !== undefined && (
          <span>{quality.freshness_days}d old</span>
        )}
      </div>
    </div>
  );
}

function SourceLink({ sourceRef, source }: { sourceRef?: { url?: string; document_type?: string }; source?: string }) {
  if (!sourceRef?.url && !source) return null;
  
  return (
    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
      <span className="text-[10px] text-muted-foreground">Source:</span>
      {sourceRef?.url ? (
        <a
          href={sourceRef.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          {sourceRef.document_type || source || "View Source"}
        </a>
      ) : (
        <span className="text-[10px] text-muted-foreground">{source}</span>
      )}
    </div>
  );
}

function formatValue(value: number | null): string {
  if (value === null) return "—";
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toFixed(0)}`;
}

export function ValuationSection({ valuation }: ValuationSectionProps) {
  if (!valuation) return null;

  const hasRange = valuation.valuation_range_low !== null && valuation.valuation_range_high !== null;

  return (
    <section className="py-8 border-b border-border">
      <div className="px-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
            Valuation Engine
          </h2>
        </div>

        {/* Summary Range */}
        {hasRange && (
          <div className="bg-card border border-border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-2">
                  Valuation Range
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-mono font-medium">
                    {formatValue(valuation.valuation_range_low)}
                  </span>
                  <span className="text-muted-foreground">to</span>
                  <span className="text-3xl font-mono font-medium">
                    {formatValue(valuation.valuation_range_high)}
                  </span>
                </div>
                {valuation.valuation_range_midpoint !== null && (
                  <span className="text-sm text-muted-foreground mt-1 block">
                    Midpoint: {formatValue(valuation.valuation_range_midpoint)}
                  </span>
                )}
              </div>
            </div>

            {valuation.why_range_exists && (
              <div className="border-t border-border pt-4 mt-4">
                <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-1">
                  Why This Range
                </span>
                <p className="text-sm">{valuation.why_range_exists}</p>
              </div>
            )}
          </div>
        )}

        {/* Three Modalities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* DCF */}
          <div className="bg-card border border-border p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-4 h-4 text-muted-foreground" />
              <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                DCF Valuation
              </span>
            </div>

            {valuation.dcf ? (
              <div className="mb-4">
                <span className="text-2xl font-mono font-medium">
                  {getTraceableFormatted(valuation.dcf.implied_value) || formatValue(getTraceableValue(valuation.dcf.implied_value))}
                </span>
                {getTraceableValue(valuation.dcf.implied_value_per_share) !== null && (
                  <span className="text-sm text-muted-foreground ml-2">
                    ({getTraceableFormatted(valuation.dcf.implied_value_per_share) || formatValue(getTraceableValue(valuation.dcf.implied_value_per_share))}/share)
                  </span>
                )}
                <div className="mt-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Terminal Growth</span>
                    <span className="font-mono">{getTraceableFormatted(valuation.dcf.terminal_growth_rate) || `${getTraceableValue(valuation.dcf.terminal_growth_rate) ?? "—"}%`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WACC</span>
                    <span className="font-mono">{getTraceableFormatted(valuation.dcf.wacc) || `${getTraceableValue(valuation.dcf.wacc) ?? "—"}%`}</span>
                  </div>
                  {valuation.dcf.methodology && (
                    <div className="pt-2 mt-2 border-t border-border/50">
                      <span className="text-[10px] text-muted-foreground">{valuation.dcf.methodology}</span>
                    </div>
                  )}
                </div>
                <SourceLink sourceRef={valuation.dcf.source_reference} source={valuation.dcf.source} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not available</p>
            )}
          </div>

          {/* Trading Comps */}
          <div className="bg-card border border-border p-4">
            <div className="flex items-center gap-2 mb-4">
              <GitCompare className="w-4 h-4 text-muted-foreground" />
              <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                Trading Comps
              </span>
            </div>

            {valuation.trading_comps ? (
              <>
                <div className="mb-4">
                  <span className="text-2xl font-mono font-medium">
                    {getTraceableFormatted(valuation.trading_comps.implied_value_range_low) || formatValue(getTraceableValue(valuation.trading_comps.implied_value_range_low))} - {getTraceableFormatted(valuation.trading_comps.implied_value_range_high) || formatValue(getTraceableValue(valuation.trading_comps.implied_value_range_high))}
                  </span>
                  {valuation.trading_comps.multiple_used && (
                    <span className="text-sm text-muted-foreground block mt-1">
                      Multiple: {valuation.trading_comps.multiple_used}
                    </span>
                  )}
                  {valuation.trading_comps.peer_set && valuation.trading_comps.peer_set.length > 0 && (
                    <div className="mt-2">
                      <span className="text-[10px] text-muted-foreground block mb-1">Peer Set:</span>
                      <span className="text-[10px] text-muted-foreground">{valuation.trading_comps.peer_set.join(", ")}</span>
                    </div>
                  )}
                </div>
                <DataQualityBadge quality={valuation.trading_comps.confidence} />
                <SourceLink sourceRef={valuation.trading_comps.source_reference} source={valuation.trading_comps.source} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Not available</p>
            )}
          </div>

          {/* Precedent Transactions */}
          <div className="bg-card border border-border p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                Precedent Transactions
              </span>
            </div>

            {valuation.precedent_transactions ? (
              <>
                <div className="mb-4">
                  <span className="text-2xl font-mono font-medium">
                    {getTraceableFormatted(valuation.precedent_transactions.implied_value_range_low) || formatValue(getTraceableValue(valuation.precedent_transactions.implied_value_range_low))} - {getTraceableFormatted(valuation.precedent_transactions.implied_value_range_high) || formatValue(getTraceableValue(valuation.precedent_transactions.implied_value_range_high))}
                  </span>
                  {valuation.precedent_transactions.transactions && valuation.precedent_transactions.transactions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <span className="text-[10px] text-muted-foreground block">Reference Transactions:</span>
                      {valuation.precedent_transactions.transactions.map((tx, idx) => (
                        <div key={idx} className="text-[10px] text-muted-foreground flex justify-between">
                          <span>{tx.name}</span>
                          <span className="font-mono">{tx.multiple}x</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <DataQualityBadge quality={valuation.precedent_transactions.confidence} />
                <SourceLink sourceRef={valuation.precedent_transactions.source_reference} source={valuation.precedent_transactions.source} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Not available</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
