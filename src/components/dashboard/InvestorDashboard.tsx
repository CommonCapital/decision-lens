import { useState } from "react";
import { InvestorDashboard as InvestorDashboardType } from "@/lib/investor-schema";
import { useTimeHorizon } from "@/hooks/use-time-horizon";
import { RunHeader } from "./RunHeader";
import { ChangesSection } from "./ChangesSection";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { TimeSeriesSection } from "./TimeSeriesSection";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { FinancialsGrid } from "./FinancialsGrid";
import { PricePathProtection } from "./PricePathProtection";
import { PublicMarketMetrics } from "./PublicMarketMetrics";
import { ValuationSection } from "./ValuationSection";
import { EventsTimeline } from "./EventsTimeline";
import { DriverScenariosPanel } from "./DriverScenariosPanel";
import { RisksPanel } from "./RisksPanel";
import { DataLineage } from "./DataLineage";
import { DecisionSufficiency } from "./DecisionSufficiency";

interface InvestorDashboardProps {
  data: InvestorDashboardType;
}

export function InvestorDashboard({ data }: InvestorDashboardProps) {
  const [mode, setMode] = useState<"public" | "private">(data.run_metadata.mode);
  
  const { 
    horizon, 
    setHorizon, 
    isTransitioning 
  } = useTimeHorizon();

  return (
    <div className="min-h-screen bg-background">
      <RunHeader
        metadata={data.run_metadata}
        mode={mode}
        onModeChange={setMode}
      />

      <main>
        {/* What Changed Since Last Run - TOP OF DASHBOARD */}
        <ChangesSection changes={data.changes_since_last_run} />
        
        {/* Decision Sufficiency Assessment */}
        <section className="py-6 px-6 border-b border-border">
          <DecisionSufficiency data={data} />
        </section>
        
        <ExecutiveSummary summary={data.executive_summary} />
        
        {/* Price → Path → Protection Framework */}
        {mode === "public" && (
          <PricePathProtection data={data} />
        )}
        
        {/* Time-Series Section with functional horizon controls */}
        {mode === "public" && data.market_data && (
          <TimeSeriesSection
            data={data}
            horizon={horizon}
            onHorizonChange={setHorizon}
            isTransitioning={isTransitioning}
          />
        )}
        
        {/* AI Insights / Hypotheses Panel */}
        {((data.ai_insights && data.ai_insights.length > 0) || (data.hypotheses && data.hypotheses.length > 0)) && (
          <AIInsightsPanel
            insights={data.ai_insights || data.hypotheses || []}
            horizon={horizon}
            isTransitioning={isTransitioning}
          />
        )}
        
        <FinancialsGrid data={data} mode={mode} />
        
        {/* Public Market Metrics - replaces private noise */}
        {mode === "public" && (
          <PublicMarketMetrics 
            data={null} 
            segments={null}
            guidance_bridge={null}
            revisions_momentum={null}
          />
        )}
        
        {/* Valuation Engine */}
        <ValuationSection valuation={data.valuation} />
        
        <EventsTimeline events={data.events} />
        
        {/* Driver-Based Scenarios - replaces thin scenario panel */}
        <DriverScenariosPanel scenarios={data.scenarios} />
        
        {/* Enhanced Risks as Tradable Objects */}
        <RisksPanel risks={data.risks} />
        
        <DataLineage sources={data.sources} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6">
        <div className="flex items-center justify-between text-micro text-muted-foreground">
          <span>
            Decision-Grade Dashboard • {data.run_metadata.entity} •{" "}
            {data.run_metadata.run_id}
          </span>
          <span className="font-mono">
            {new Date(data.run_metadata.timestamp).toLocaleString()}
          </span>
        </div>
      </footer>
    </div>
  );
}
