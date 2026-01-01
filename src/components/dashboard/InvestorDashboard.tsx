import { InvestorDashboard as InvestorDashboardType } from "@/lib/investor-schema";
import { useTimeHorizon } from "@/hooks/use-time-horizon";
import { RunHeader } from "./RunHeader";
import { ChangesSection } from "./ChangesSection";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { TimeSeriesSection } from "./TimeSeriesSection";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { FinancialsGrid } from "./FinancialsGrid";
import { PricePathProtection } from "./PricePathProtection";
import { ValuationSection } from "./ValuationSection";
import { EventsTimeline } from "./EventsTimeline";
import { DriverScenariosPanel } from "./DriverScenariosPanel";
import { RisksPanel } from "./RisksPanel";
import { DataLineage } from "./DataLineage";
import { DecisionSufficiency } from "./DecisionSufficiency";
import { MarketExpectationsPanel } from "./MarketExpectationsPanel";
import { UnitEconomicsPanel } from "./UnitEconomicsPanel";

interface InvestorDashboardProps {
  data: InvestorDashboardType;
}

export function InvestorDashboard({ data }: InvestorDashboardProps) {
  const { 
    horizon, 
    setHorizon, 
    isTransitioning 
  } = useTimeHorizon();

  const isPublic = data.company_type === "public";

  return (
    <div className="min-h-screen bg-background">
      <RunHeader
        metadata={data.run_metadata}
        companyType={data.company_type}
      />

      <main>
        <ChangesSection changes={data.changes_since_last_run} />
        
        <section className="py-6 px-6 border-b border-border">
          <DecisionSufficiency data={data} />
        </section>
        
        <ExecutiveSummary summary={data.executive_summary} />
        
        {isPublic && (
          <PricePathProtection data={data} />
        )}
        
        {isPublic && data.time_series && (
          <TimeSeriesSection
            data={data}
            horizon={horizon}
            onHorizonChange={setHorizon}
            isTransitioning={isTransitioning}
          />
        )}
        
        {((data.ai_insights && data.ai_insights.length > 0) || (data.hypotheses && data.hypotheses.length > 0)) && (
          <AIInsightsPanel
            insights={data.ai_insights || data.hypotheses || []}
            horizon={horizon}
            isTransitioning={isTransitioning}
          />
        )}
        
        <FinancialsGrid data={data} />
        
        {data.unit_economics && (
          <UnitEconomicsPanel data={data} />
        )}
        
        {(data.guidance_bridge || data.revisions_momentum) && (
          <MarketExpectationsPanel data={data} />
        )}
        
        <ValuationSection valuation={data.valuation} />
        
        <EventsTimeline events={data.events} />
        
        <DriverScenariosPanel scenarios={data.scenarios} />
        
        <RisksPanel risks={data.risks} />
        
        <DataLineage sources={data.sources} />
      </main>

      <footer className="border-t border-border py-6 px-6">
        <div className="flex items-center justify-between text-micro text-muted-foreground">
          <span>
            Decision-Grade Dashboard • {data.run_metadata?.entity || "Unknown"} •{" "}
            {data.run_metadata?.run_id || "N/A"}
          </span>
          <span className="font-mono">
            {data.run_metadata?.timestamp ? new Date(data.run_metadata.timestamp).toLocaleString() : "N/A"}
          </span>
        </div>
      </footer>
    </div>
  );
}
