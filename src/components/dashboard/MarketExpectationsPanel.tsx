import { InvestorDashboard } from "@/lib/investor-schema";
import { TrendingUp, TrendingDown, Minus, Target, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketExpectationsPanelProps {
  data: InvestorDashboard;
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "—";
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

function GuidanceBridge({ data }: { data: InvestorDashboard["guidance_bridge"] }) {
  if (!data) return null;

  const { low, high, current_consensus, gap_percent, source } = data;
  const gapIsPositive = (gap_percent ?? 0) > 0;
  const gapIsNeutral = (gap_percent ?? 0) === 0;

  return (
    <div className="border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
          Guidance vs. Consensus
        </h4>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <span className="text-micro text-muted-foreground block mb-1">Guidance Low</span>
          <span className="font-mono text-lg">{formatCurrency(low)}</span>
        </div>
        <div>
          <span className="text-micro text-muted-foreground block mb-1">Guidance High</span>
          <span className="font-mono text-lg">{formatCurrency(high)}</span>
        </div>
        <div>
          <span className="text-micro text-muted-foreground block mb-1">Current Consensus</span>
          <span className="font-mono text-lg">{formatCurrency(current_consensus)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-micro text-muted-foreground">Gap:</span>
          <span className={cn(
            "font-mono font-medium",
            gapIsPositive ? "text-emerald-600 dark:text-emerald-400" : 
            gapIsNeutral ? "text-muted-foreground" : "text-rose-600 dark:text-rose-400"
          )}>
            {gapIsPositive ? "+" : ""}{gap_percent?.toFixed(1) ?? "—"}%
          </span>
          {gapIsPositive ? (
            <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          ) : gapIsNeutral ? (
            <Minus className="w-3 h-3 text-muted-foreground" />
          ) : (
            <TrendingDown className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          )}
        </div>
        <span className="text-micro text-muted-foreground">Source: {source ?? "—"}</span>
      </div>
    </div>
  );
}

function RevisionsMomentum({ data }: { data: InvestorDashboard["revisions_momentum"] }) {
  if (!data) return null;

  const { direction, magnitude, trend, source } = data;
  const isUp = direction === "up";
  const isDown = direction === "down";

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
            {magnitude ?? "—"}
          </span>
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

      <div className="pt-3 border-t border-border">
        <span className="text-micro text-muted-foreground">Source: {source ?? "—"}</span>
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
