import { Valuation, DataQuality } from "@/lib/investor-schema";
import { cn } from "@/lib/utils";
import { 
  Calculator, 
  TrendingUp, 
  GitCompare, 
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  FileText,
  Link as LinkIcon
} from "lucide-react";
import { useState } from "react";

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
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className={cn("px-2 py-0.5 text-[10px] uppercase tracking-ultra-wide font-mono flex items-center gap-1", style.bg, style.text)}>
          <Icon className="w-3 h-3" />
          {quality.overall_band || "Unknown"}
        </span>
      </div>
      <div className="flex gap-3 text-[10px] text-muted-foreground font-mono">
        {quality.coverage !== null && (
          <span>Coverage: {quality.coverage}%</span>
        )}
        {quality.auditability !== null && (
          <span>Audit: {quality.auditability}%</span>
        )}
        {quality.freshness_days !== null && (
          <span>{quality.freshness_days}d old</span>
        )}
      </div>
    </div>
  );
}

function formatValue(value: number | null): string {
  if (value === null) return "—";
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toFixed(0)}`;
}

// Source derivation panel for each valuation method
function MethodSourcePanel({ 
  title, 
  sources 
}: { 
  title: string; 
  sources: Array<{ label: string; value: string; source?: string; formula?: string }>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-t border-border pt-3 mt-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-micro uppercase text-muted-foreground hover:text-foreground transition-colors w-full"
      >
        <FileText className="w-3 h-3" />
        <span>{title}</span>
        <ChevronDown className={cn("w-3 h-3 ml-auto transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <div className="mt-3 space-y-2 pl-5">
          {sources.map((item, i) => (
            <div key={i} className="text-sm">
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-mono">{item.value}</span>
              </div>
              {item.formula && (
                <div className="text-[10px] text-muted-foreground/70 mt-0.5 font-mono">
                  Formula: {item.formula}
                </div>
              )}
              {item.source && (
                <div className="text-[10px] text-muted-foreground/70 flex items-center gap-1 mt-0.5">
                  <LinkIcon className="w-2.5 h-2.5" />
                  {item.source}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ValuationSection({ valuation }: ValuationSectionProps) {
  if (!valuation) return null;

  const hasRange = valuation.valuation_range_low !== null && valuation.valuation_range_high !== null;

  // DCF derivation sources
  const dcfSources = valuation.dcf ? [
    { label: "Terminal Growth Rate", value: `${valuation.dcf.terminal_growth_rate}%`, source: "Management Long-Term Plan" },
    { label: "WACC", value: `${valuation.dcf.wacc}%`, formula: "Rf + β(Rm - Rf) + Size Premium", source: "Bloomberg Beta, 10Y Treasury" },
    { label: "Implied Enterprise Value", value: formatValue(valuation.dcf.implied_value), formula: "Σ FCF/(1+WACC)^t + TV/(1+WACC)^n" },
    ...(valuation.dcf.revenue_drivers || []).map(d => ({
      label: d.name,
      value: String(d.value),
      source: d.source === "fact" ? d.source_reference?.document_type || "Filed" : "Judgment",
    })),
  ] : [];

  // Trading comps derivation sources
  const tradingCompsSources = valuation.trading_comps ? [
    { label: "Comp Set Size", value: `${valuation.trading_comps.comps?.length || 0} companies`, source: "FactSet / Capital IQ" },
    { label: "Metric Basis", value: valuation.trading_comps.comps?.[0]?.metric_basis || "NTM", source: "Standard methodology" },
    { label: "Metric Type", value: valuation.trading_comps.comps?.[0]?.metric_type || "Adjusted", source: "Street consensus" },
    { label: "EV/EBITDA Range", value: `${valuation.trading_comps.comps?.map(c => c.ev_ebitda).filter(Boolean).sort((a,b) => (a||0)-(b||0))[0]?.toFixed(1)}x - ${valuation.trading_comps.comps?.map(c => c.ev_ebitda).filter(Boolean).sort((a,b) => (b||0)-(a||0))[0]?.toFixed(1)}x`, formula: "EV / LTM EBITDA" },
    { label: "Implied Value", value: `${formatValue(valuation.trading_comps.implied_value_range_low)} - ${formatValue(valuation.trading_comps.implied_value_range_high)}`, formula: "Target EBITDA × Median Multiple" },
  ] : [];

  // Precedent transactions derivation sources
  const precedentSources = valuation.precedent_transactions ? [
    { label: "Transaction Count", value: `${valuation.precedent_transactions.transactions?.length || 0} deals`, source: "Bloomberg M&A, FactSet" },
    { label: "Date Range", value: valuation.precedent_transactions.transactions?.[0]?.date ? `Since ${valuation.precedent_transactions.transactions[0].date.slice(0, 4)}` : "N/A", source: "Public filings" },
    { label: "EV/EBITDA Paid", value: `${valuation.precedent_transactions.transactions?.map(t => t.ev_ebitda).filter(Boolean).sort((a,b) => (a||0)-(b||0))[0]?.toFixed(1)}x - ${valuation.precedent_transactions.transactions?.map(t => t.ev_ebitda).filter(Boolean).sort((a,b) => (b||0)-(a||0))[0]?.toFixed(1)}x`, source: "Deal announcements, 8-K filings" },
    { label: "Avg Premium Paid", value: `${valuation.precedent_transactions.transactions?.[0]?.premium_paid || 0}%`, source: "Pre-announcement price" },
    { label: "Implied Value", value: `${formatValue(valuation.precedent_transactions.implied_value_range_low)} - ${formatValue(valuation.precedent_transactions.implied_value_range_high)}`, formula: "Target Metrics × Transaction Multiple" },
  ] : [];

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
                
                <MethodSourcePanel title="Derivation Sources" sources={dcfSources} />
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
                
                <MethodSourcePanel title="Derivation Sources" sources={tradingCompsSources} />
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
                
                <MethodSourcePanel title="Derivation Sources" sources={precedentSources} />
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
