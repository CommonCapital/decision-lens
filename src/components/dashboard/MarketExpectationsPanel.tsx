import { InvestorDashboard } from "@/lib/investor-schema";
import { TrendingUp, TrendingDown, Minus, Target, BarChart3, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketExpectationsPanelProps {
  data: InvestorDashboard;
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

function getTraceableSource(val: any): { source?: string; source_reference?: any } | null {
  if (val == null || typeof val !== "object") return null;
  return { source: val.source, source_reference: val.source_reference };
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "—";
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

function SourceLink({ sourceRef }: { sourceRef?: { url?: string; document_type?: string } }) {
  if (!sourceRef?.url) return null;
  return (
    <a
      href={sourceRef.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
    >
      <ExternalLink className="w-3 h-3" />
      {sourceRef.document_type || "Source"}
    </a>
  );
}

function TraceableMetric({ 
  label, 
  val, 
  showSource = true 
}: { 
  label: string; 
  val: any;
  showSource?: boolean;
}) {
  const value = getTraceableValue(val);
  const formatted = getTraceableFormatted(val);
  const sourceInfo = getTraceableSource(val);

  return (
    <div>
      <span className="text-micro text-muted-foreground block mb-1">{label}</span>
      <span className="font-mono text-lg">{formatted || formatCurrency(value)}</span>
      {showSource && sourceInfo?.source_reference && (
        <div className="mt-1">
          <SourceLink sourceRef={sourceInfo.source_reference} />
        </div>
      )}
    </div>
  );
}

function GuidanceBridge({ data }: { data: InvestorDashboard["guidance_bridge"] }) {
  if (!data) return null;

  const { low, high, current_consensus, gap_percent, source, source_reference } = data;
  
  const gapValue = getTraceableValue(gap_percent);
  const gapIsPositive = (gapValue ?? 0) > 0;
  const gapIsNeutral = (gapValue ?? 0) === 0;

  return (
    <div className="border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
          Guidance vs. Consensus
        </h4>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <TraceableMetric label="Guidance Low" val={low} />
        <TraceableMetric label="Guidance High" val={high} />
        <TraceableMetric label="Current Consensus" val={current_consensus} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-micro text-muted-foreground">Gap:</span>
          <span className={cn(
            "font-mono font-medium",
            gapIsPositive ? "text-emerald-600 dark:text-emerald-400" : 
            gapIsNeutral ? "text-muted-foreground" : "text-rose-600 dark:text-rose-400"
          )}>
            {gapIsPositive ? "+" : ""}{gapValue?.toFixed(1) ?? "—"}%
          </span>
          {gapIsPositive ? (
            <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          ) : gapIsNeutral ? (
            <Minus className="w-3 h-3 text-muted-foreground" />
          ) : (
            <TrendingDown className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-micro text-muted-foreground">Source: {source ?? "—"}</span>
          <SourceLink sourceRef={source_reference} />
        </div>
      </div>
    </div>
  );
}

function RevisionsMomentum({ data }: { data: InvestorDashboard["revisions_momentum"] }) {
  if (!data) return null;

  const { direction, magnitude, trend, source, source_reference } = data;
  const isUp = direction === "up";
  const isDown = direction === "down";
  
  const magnitudeFormatted = getTraceableFormatted(magnitude);
  const magnitudeValue = getTraceableValue(magnitude);

  return (
    <div className="border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
          30-Day Estimate Revisions
        </h4>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <span className="text-micro text-muted-foreground block mb-1">Direction</span>
          <div className="flex items-center gap-2">
            {isUp ? (
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : isDown ? (
              <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            ) : (
              <Minus className="w-4 h-4 text-muted-foreground" />
            )}
            <span className={cn(
              "font-medium capitalize",
              isUp ? "text-emerald-600 dark:text-emerald-400" :
              isDown ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"
            )}>
              {direction ?? "—"}
            </span>
          </div>
        </div>
        <div>
          <span className="text-micro text-muted-foreground block mb-1">Magnitude</span>
          <span className={cn(
            "font-mono text-lg",
            isUp ? "text-emerald-600 dark:text-emerald-400" :
            isDown ? "text-rose-600 dark:text-rose-400" : "text-foreground"
          )}>
            {magnitudeFormatted || (magnitudeValue != null ? `${magnitudeValue > 0 ? '+' : ''}${magnitudeValue}%` : "—")}
          </span>
          {getTraceableSource(magnitude)?.source_reference && (
            <div className="mt-1">
              <SourceLink sourceRef={getTraceableSource(magnitude)?.source_reference} />
            </div>
          )}
        </div>
        <div>
          <span className="text-micro text-muted-foreground block mb-1">Trend</span>
          <span className={cn(
            "text-sm capitalize",
            trend === "accelerating" ? "text-emerald-600 dark:text-emerald-400" :
            trend === "decelerating" ? "text-amber-600 dark:text-amber-400" : "text-foreground"
          )}>
            {trend ?? "—"}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="text-micro text-muted-foreground">Source: {source ?? "—"}</span>
        <SourceLink sourceRef={source_reference} />
      </div>
    </div>
  );
}

export function MarketExpectationsPanel({ data }: MarketExpectationsPanelProps) {
  const hasGuidance = data.guidance_bridge != null;
  const hasRevisions = data.revisions_momentum != null;

  if (!hasGuidance && !hasRevisions) return null;

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-4 h-4" />
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
            Market Expectations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hasGuidance && <GuidanceBridge data={data.guidance_bridge} />}
          {hasRevisions && <RevisionsMomentum data={data.revisions_momentum} />}
        </div>
      </div>
    </section>
  );
}
