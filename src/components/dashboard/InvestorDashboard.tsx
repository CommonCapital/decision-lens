import { useState } from "react";
import { InvestorDashboard as InvestorDashboardType } from "@/lib/investor-schema";
import { useTimeHorizon } from "@/hooks/use-time-horizon";
import { RunHeader } from "./RunHeader";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { TimeSeriesSection } from "./TimeSeriesSection";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { FinancialsGrid } from "./FinancialsGrid";
import { EventsTimeline } from "./EventsTimeline";
import { ScenariosPanel } from "./ScenariosPanel";
import { RisksPanel } from "./RisksPanel";
import { DataLineage } from "./DataLineage";

interface InvestorDashboardProps {
  data: InvestorDashboardType;
}

export function InvestorDashboard({ data }: InvestorDashboardProps) {
  const [mode, setMode] = useState<"public" | "private">(data.run_metadata.mode);
  
  const { 
    horizon, 
    setHorizon, 
    horizonData, 
    isTransitioning 
  } = useTimeHorizon(data);

  return (
    <div className="min-h-screen bg-background">
      <RunHeader
        metadata={data.run_metadata}
        mode={mode}
        onModeChange={setMode}
      />

      <main>
        <ExecutiveSummary summary={data.executive_summary} />
        
        {/* Time-Series Section with functional horizon controls */}
        {mode === "public" && horizonData && (
          <TimeSeriesSection
            horizonData={horizonData}
            horizon={horizon}
            onHorizonChange={setHorizon}
            isTransitioning={isTransitioning}
          />
        )}
        
        {/* AI Insights Panel */}
        {horizonData?.ai_insights && (
          <AIInsightsPanel
            insights={horizonData.ai_insights}
            horizon={horizon}
            isTransitioning={isTransitioning}
          />
        )}
        
        <FinancialsGrid data={data} mode={mode} />
        <EventsTimeline events={data.events} />
        <ScenariosPanel scenarios={data.scenarios} />
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
