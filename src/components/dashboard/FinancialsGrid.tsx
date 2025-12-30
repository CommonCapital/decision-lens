import { InvestorDashboard } from "@/lib/investor-schema";
import { 
  calcRevenueGrowth, 
  calcGrossMargin, 
  calcOperatingMargin,
  calcFCFMargin,
  calcRevenuePerEmployee,
  calcRDIntensity,
  calcEnterpriseValue,
  getEBITDADisplay,
  formatCurrency,
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
  const ev = calcEnterpriseValue(m);

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-6">
          Financial & Operating Metrics
        </h2>

        {/* Market Metrics - Stock Price, Market Cap */}
        <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4">
          Market Data
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mb-6">
          <FormulaMetricCard
            label="Stock Price"
            value={m?.stock_price ? `$${m.stock_price.toFixed(2)}` : "—"}
            source="Bloomberg"
            size="lg"
          />
          <FormulaMetricCard
            label="Market Cap"
            value={formatCurrency(m?.market_cap ?? null)}
            source="Calculated"
            size="lg"
          />
          <FormulaMetricCard
            label="Enterprise Value"
            value={ev.formatted}
            formula={ev.formula}
            inputs={ev.inputs}
            size="lg"
          />
          <FormulaMetricCard
            label="Shares Outstanding"
            value={m?.shares_outstanding ? `${(m.shares_outstanding / 1e6).toFixed(1)}M` : "—"}
            source="10-Q Filing"
          />
        </div>

        {/* Core financials - Base Metrics */}
        <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 mt-8">
          Core Financials
        </h3>
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
