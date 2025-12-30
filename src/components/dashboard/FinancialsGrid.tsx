import { InvestorDashboard } from "@/lib/investor-schema";
import { 
  calcRevenueGrowth, 
  calcGrossMargin, 
  calcOperatingMargin,
  calcFCFMargin,
  calcRevenuePerEmployee,
  calcRDIntensity,
  getEBITDADisplay,
  formatCurrency,
  formatPercent
} from "@/lib/kpi-calculations";
import { FormulaMetricCard } from "./FormulaMetricCard";

interface FinancialsGridProps {
  data: InvestorDashboard;
}

export function FinancialsGrid({ data }: FinancialsGridProps) {
  const m = data.base_metrics;
  
  // Get EBITDA with proper display
  const ebitdaDisplay = getEBITDADisplay(m);
  
  // Calculate derived KPIs
  const revenueGrowth = calcRevenueGrowth(m);
  const grossMargin = calcGrossMargin(m);
  const operatingMargin = calcOperatingMargin(m);
  const fcfMargin = calcFCFMargin(m);
  const revenuePerEmployee = calcRevenuePerEmployee(m);
  const rdIntensity = calcRDIntensity(m);

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-6">
          Financial & Operating Metrics
        </h2>

        {/* Core financials - Base Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-border mb-6">
          <FormulaMetricCard
            label="Revenue"
            value={formatCurrency(m?.revenue ?? null)}
            source="10-Q Filing"
            size="lg"
          />
          <FormulaMetricCard
            label="Revenue Growth"
            value={revenueGrowth.formatted}
            formula={revenueGrowth.formula}
            inputs={revenueGrowth.inputs}
          />
          <FormulaMetricCard
            label={ebitdaDisplay.isProxy ? "EBITDA (Proxy)" : "EBITDA"}
            value={formatCurrency(ebitdaDisplay.value)}
            source={ebitdaDisplay.label}
            size="lg"
          />
          <FormulaMetricCard
            label="Gross Margin"
            value={grossMargin.formatted}
            formula={grossMargin.formula}
            inputs={grossMargin.inputs}
          />
          <FormulaMetricCard
            label="Free Cash Flow"
            value={formatCurrency(m?.free_cash_flow ?? null)}
            source="Cash Flow Statement"
          />
        </div>

        {/* Derived Metrics - Second Row */}
        <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 mt-8">
          Operating Efficiency
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          <FormulaMetricCard
            label="Operating Margin"
            value={operatingMargin.formatted}
            formula={operatingMargin.formula}
            inputs={operatingMargin.inputs}
          />
          <FormulaMetricCard
            label="FCF Margin"
            value={fcfMargin.formatted}
            formula={fcfMargin.formula}
            inputs={fcfMargin.inputs}
          />
          <FormulaMetricCard
            label="Revenue / Employee"
            value={revenuePerEmployee.formatted}
            formula={revenuePerEmployee.formula}
            inputs={revenuePerEmployee.inputs}
          />
          <FormulaMetricCard
            label="R&D Intensity"
            value={rdIntensity.formatted}
            formula={rdIntensity.formula}
            inputs={rdIntensity.inputs}
          />
        </div>
      </div>
    </section>
  );
}
