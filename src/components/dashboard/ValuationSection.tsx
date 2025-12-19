import { Valuation, DataQuality } from "@/lib/investor-schema";
import { cn } from "@/lib/utils";
import { 
  Calculator, 
  TrendingUp, 
  GitCompare, 
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface ValuationSectionProps {
  valuation: Valuation | null | undefined;
}

function DataQualityBadge({ quality }: { quality: DataQuality | null | undefined }) {
  if (!quality) return null;
  
  const bandStyles = {
    high: { icon: CheckCircle, bg: "bg-foreground", text: "text-background" },
    medium: { icon: AlertCircle, bg: "bg-foreground/60", text: "text-background" },
    low: { icon: XCircle, bg: "bg-foreground/30", text: "text-foreground" },
  };
  
  const style = quality.overall_band ? bandStyles[quality.overall_band] : bandStyles.low;
  const Icon = style.icon;

  return (
    <div className="flex items-center gap-2">
      <span className={cn("px-2 py-0.5 text-[10px] uppercase tracking-ultra-wide font-mono flex items-center gap-1", style.bg, style.text)}>
        <Icon className="w-3 h-3" />
        {quality.overall_band || "Unknown"}
      </span>
      {quality.coverage !== null && (
        <span className="text-micro text-muted-foreground">
          {quality.coverage}% coverage
        </span>
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
              {valuation.method_weights && (
                <div className="text-right">
                  <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-2">
                    Method Weights
                  </span>
                  <div className="flex gap-4 text-sm font-mono">
                    {valuation.method_weights.dcf !== null && (
                      <span>DCF: {(valuation.method_weights.dcf * 100).toFixed(0)}%</span>
                    )}
                    {valuation.method_weights.trading_comps !== null && (
                      <span>Comps: {(valuation.method_weights.trading_comps * 100).toFixed(0)}%</span>
                    )}
                    {valuation.method_weights.precedent_transactions !== null && (
                      <span>Precedents: {(valuation.method_weights.precedent_transactions * 100).toFixed(0)}%</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Why the range exists */}
            {valuation.why_range_exists && (
              <div className="border-t border-border pt-4 mt-4">
                <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-1">
                  Why This Range
                </span>
                <p className="text-sm">{valuation.why_range_exists}</p>
              </div>
            )}

            {/* What breaks it / What moves it */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
              {valuation.what_breaks_it && valuation.what_breaks_it.length > 0 && (
                <div>
                  <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-2">
                    What Breaks It
                  </span>
                  <ul className="space-y-1">
                    {valuation.what_breaks_it.map((item, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <XCircle className="w-3 h-3 mt-1 text-muted-foreground flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {valuation.what_moves_it_next && valuation.what_moves_it_next.length > 0 && (
                <div>
                  <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-2">
                    What Moves It Next
                  </span>
                  <ul className="space-y-1">
                    {valuation.what_moves_it_next.map((item, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <TrendingUp className="w-3 h-3 mt-1 text-muted-foreground flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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
              <>
                <div className="mb-4">
                  <span className="text-2xl font-mono font-medium">
                    {formatValue(valuation.dcf.implied_value)}
                  </span>
                  {valuation.dcf.implied_value_per_share !== null && (
                    <span className="text-sm text-muted-foreground ml-2">
                      ({formatValue(valuation.dcf.implied_value_per_share)}/share)
                    </span>
                  )}
                </div>

                {valuation.dcf.assumptions_sourced_percent !== null && (
                  <div className="text-sm mb-3">
                    <span className="text-muted-foreground">Assumptions sourced: </span>
                    <span className="font-mono">{valuation.dcf.assumptions_sourced_percent}%</span>
                  </div>
                )}

                {valuation.dcf.blockers && valuation.dcf.blockers.length > 0 && (
                  <div className="border-t border-border pt-3 mt-3">
                    <span className="text-micro uppercase text-muted-foreground block mb-2">Blockers</span>
                    <ul className="space-y-1">
                      {valuation.dcf.blockers.map((b, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-1">
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
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
                    {formatValue(valuation.trading_comps.implied_value_range_low)} - {formatValue(valuation.trading_comps.implied_value_range_high)}
                  </span>
                </div>

                <DataQualityBadge quality={valuation.trading_comps.confidence} />

                {valuation.trading_comps.comps && valuation.trading_comps.comps.length > 0 && (
                  <div className="border-t border-border pt-3 mt-3">
                    <span className="text-micro uppercase text-muted-foreground block mb-2">
                      {valuation.trading_comps.comps.length} Comparables
                    </span>
                    <ul className="space-y-1">
                      {valuation.trading_comps.comps.slice(0, 3).map((comp, i) => (
                        <li key={i} className="text-sm flex justify-between">
                          <span>{comp.company}</span>
                          <span className="font-mono text-muted-foreground">
                            {comp.business_model_match}% match
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {valuation.trading_comps.blockers && valuation.trading_comps.blockers.length > 0 && (
                  <div className="border-t border-border pt-3 mt-3">
                    <span className="text-micro uppercase text-muted-foreground block mb-2">Blockers</span>
                    <ul className="space-y-1">
                      {valuation.trading_comps.blockers.map((b, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-1">
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
                    {formatValue(valuation.precedent_transactions.implied_value_range_low)} - {formatValue(valuation.precedent_transactions.implied_value_range_high)}
                  </span>
                </div>

                <DataQualityBadge quality={valuation.precedent_transactions.confidence} />

                {valuation.precedent_transactions.transactions && valuation.precedent_transactions.transactions.length > 0 && (
                  <div className="border-t border-border pt-3 mt-3">
                    <span className="text-micro uppercase text-muted-foreground block mb-2">
                      {valuation.precedent_transactions.transactions.length} Precedents
                    </span>
                    <ul className="space-y-1">
                      {valuation.precedent_transactions.transactions.slice(0, 3).map((tx, i) => (
                        <li key={i} className="text-sm flex justify-between">
                          <span>{tx.target}</span>
                          <span className="font-mono text-muted-foreground">
                            {tx.applicability_score}% applicable
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {valuation.precedent_transactions.blockers && valuation.precedent_transactions.blockers.length > 0 && (
                  <div className="border-t border-border pt-3 mt-3">
                    <span className="text-micro uppercase text-muted-foreground block mb-2">Blockers</span>
                    <ul className="space-y-1">
                      {valuation.precedent_transactions.blockers.map((b, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-1">
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
