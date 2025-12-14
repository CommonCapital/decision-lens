import { DeltaSummary as DeltaSummaryType } from "@/lib/investor-schema";
import { TieOutBadge } from "./TieOutBadge";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DeltaSummaryProps {
  delta: DeltaSummaryType;
}

export function DeltaSummary({ delta }: DeltaSummaryProps) {
  const hasChanges =
    delta.new_events.length > 0 ||
    delta.assumption_deltas.length > 0 ||
    delta.metric_revisions.length > 0 ||
    delta.status_changes.length > 0;

  if (!hasChanges) {
    return (
      <section className="py-6 px-6 bg-secondary/30 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
            What Changed
          </span>
          <span className="text-sm text-muted-foreground">
            No changes since last run
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 px-6 bg-secondary/50 border-b border-border animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-micro uppercase tracking-ultra-wide font-sans px-2 py-1 bg-foreground text-background">
          What Changed Since Last Run
        </span>
        {delta.prior_run_id && (
          <span className="text-micro text-muted-foreground font-mono">
            vs. {delta.prior_run_id}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* New Events */}
        {delta.new_events.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
              New Events ({delta.new_events.length})
            </h4>
            <ul className="space-y-1">
              {delta.new_events.map((event, i) => (
                <li
                  key={i}
                  className="text-xs font-light pl-3 border-l border-border"
                >
                  {event}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Assumption Deltas */}
        {delta.assumption_deltas.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
              Assumption Changes ({delta.assumption_deltas.length})
            </h4>
            <ul className="space-y-2">
              {delta.assumption_deltas.map((change, i) => (
                <li key={i} className="text-xs pl-3 border-l border-border">
                  <span className="font-medium">{change.field}</span>
                  <div className="flex items-center gap-1 mt-0.5 font-mono text-[10px]">
                    <span className="text-muted-foreground">
                      {change.prior_value}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                    <span>{change.new_value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Metric Revisions */}
        {delta.metric_revisions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
              Metric Revisions ({delta.metric_revisions.length})
            </h4>
            <ul className="space-y-2">
              {delta.metric_revisions.map((rev, i) => (
                <li key={i} className="text-xs pl-3 border-l border-border">
                  <span className="font-medium">{rev.metric}</span>
                  <div className="flex items-center gap-2 mt-0.5 font-mono text-[10px]">
                    <span className="text-muted-foreground">{rev.prior}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>{rev.current}</span>
                    {rev.change_pct !== undefined && (
                      <span className="flex items-center gap-0.5">
                        {rev.change_pct > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : rev.change_pct < 0 ? (
                          <TrendingDown className="w-3 h-3" />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                        {Math.abs(rev.change_pct).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Status Changes */}
        {delta.status_changes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
              Status Changes ({delta.status_changes.length})
            </h4>
            <ul className="space-y-2">
              {delta.status_changes.map((change, i) => (
                <li key={i} className="text-xs pl-3 border-l border-border">
                  <span className="font-medium">{change.metric}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <TieOutBadge status={change.from} />
                    <ArrowRight className="w-3 h-3" />
                    <TieOutBadge status={change.to} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
