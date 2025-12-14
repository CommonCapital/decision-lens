import { useState } from "react";
import { InvestorDashboard as InvestorDashboardType } from "@/lib/investor-schema";
import { RunHeader } from "./RunHeader";
import { DeltaSummary } from "./DeltaSummary";
import { ExecutiveSummary } from "./ExecutiveSummary";
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

  return (
    <div className="min-h-screen bg-background">
      <RunHeader
        metadata={data.run_metadata}
        mode={mode}
        onModeChange={setMode}
      />

      <main>
        <DeltaSummary delta={data.delta_summary} />
        <ExecutiveSummary summary={data.executive_summary} />
        <FinancialsGrid data={data} mode={mode} />
        <EventsTimeline events={data.events} />
        <ScenariosPanel scenarios={data.scenarios} />
        <RisksPanel risks={data.risks} />
        <DataLineage lineage={data.data_lineage} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6">
        <div className="flex items-center justify-between text-micro text-muted-foreground">
          <span>
            Decision-Grade Dashboard • {data.run_metadata.entity} •{" "}
            {data.run_metadata.run_id}
          </span>
          <span className="font-mono">
            Hash: {data.run_metadata.immutable_hash}
          </span>
        </div>
      </footer>
    </div>
  );
}
