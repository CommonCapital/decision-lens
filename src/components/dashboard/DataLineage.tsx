import { InvestorDashboard } from "@/lib/investor-schema";
import { Database, RefreshCw, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataLineageProps {
  lineage: InvestorDashboard["data_lineage"];
}

export function DataLineage({ lineage }: DataLineageProps) {
  return (
    <section className="py-8 animate-fade-in">
      <div className="px-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-4 h-4" />
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
            Data Lineage & Audit Trail
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Data Sources */}
          <div>
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 border-b border-border pb-2">
              Data Sources
            </h3>
            <div className="space-y-2">
              {lineage.sources.map((source, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        source.type === "primary"
                          ? "bg-foreground"
                          : source.type === "secondary"
                          ? "bg-foreground/50"
                          : "bg-foreground/20"
                      )}
                    />
                    <div>
                      <span className="text-sm font-medium">{source.name}</span>
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {source.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <RefreshCw className="w-3 h-3" />
                      <span className="font-mono">
                        {new Date(source.last_refresh).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Owner: {source.owner}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reconciliation Log */}
          <div>
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 border-b border-border pb-2">
              Reconciliation Log
            </h3>
            <div className="space-y-3">
              {lineage.reconciliation_log.map((entry, i) => (
                <div
                  key={i}
                  className="p-3 bg-secondary/30 border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{entry.metric}</span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                      <CheckCircle className="w-3 h-3" />
                      {entry.variance}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Sources: {entry.sources_compared.join(" • ")}
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">
                      {entry.resolution}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
