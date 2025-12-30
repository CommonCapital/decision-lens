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

// Source references for traceability
const SOURCES = {
  bloomberg: { document: "Bloomberg Terminal", last_updated: "2024-12-14T09:00:00Z" },
  tenQ: { document: "10-Q Filing", line: "Consolidated Statements", xbrl_tag: "us-gaap:Revenues", last_updated: "2024-12-14T06:00:00Z" },
  tenQBalanceSheet: { document: "10-Q Filing", line: "Balance Sheet", last_updated: "2024-12-14T06:00:00Z" },
  tenQCashFlow: { document: "10-Q Filing", line: "Cash Flow Statement", xbrl_tag: "us-gaap:NetCashProvidedByUsedInOperatingActivities", last_updated: "2024-12-14T06:00:00Z" },
  calculated: { document: "Calculated", last_updated: new Date().toISOString() },
  managementReconciliation: { document: "Management EBITDA Reconciliation", line: "Non-GAAP Exhibit", last_updated: "2024-12-14T06:00:00Z" },
};

export function FinancialsGrid({ data }: FinancialsGridProps) {
  const m = data.base_metrics;
  
  const ebitdaDisplay = getEBITDADisplay(m);
  const revenueGrowth = calcRevenueGrowth(m);
  const grossMargin = calcGrossMargin(m);
  const operatingMargin = calcOperatingMargin(m);
  const fcfMargin = calcFCFMargin(m);
  const revenuePerEmployee = calcRevenuePerEmployee(m);
  const rdIntensity = calcRDIntensity(m);
  const ev = calcEnterpriseValue(m);

  // Add source references to formula inputs
  const addSources = (inputs: { name: string; value: number | null; formatted: string }[]) => {
    return inputs.map(input => ({
      ...input,
      source: input.name.includes("Revenue") ? SOURCES.tenQ :
              input.name.includes("Debt") || input.name.includes("Cash") || input.name.includes("Market Cap") ? SOURCES.tenQBalanceSheet :
              input.name.includes("Profit") || input.name.includes("Income") ? SOURCES.tenQ :
              SOURCES.calculated
    }));
  };

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-6">
          Financial & Operating Metrics
        </h2>

        {/* Market Metrics */}
        <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4">
          Market Data
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mb-6">
          <FormulaMetricCard
            label="Stock Price"
            value={m?.stock_price ? `$${m.stock_price.toFixed(2)}` : "—"}
            source={SOURCES.bloomberg}
            size="lg"
          />
          <FormulaMetricCard
            label="Market Cap"
            value={formatCurrency(m?.market_cap ?? null)}
            source={{ ...SOURCES.calculated, xbrl_tag: "Stock Price × Shares Outstanding" }}
            size="lg"
          />
          <FormulaMetricCard
            label="Enterprise Value"
            value={ev.formatted}
            formula={ev.formula}
            inputs={addSources(ev.inputs)}
            size="lg"
          />
          <FormulaMetricCard
            label="Shares Outstanding"
            value={m?.shares_outstanding ? `${(m.shares_outstanding / 1e6).toFixed(1)}M` : "—"}
            source={{ ...SOURCES.tenQ, xbrl_tag: "us-gaap:CommonStockSharesOutstanding" }}
          />
        </div>

        {/* Core financials */}
        <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 mt-8">
          Core Financials
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-border mb-6">
          <FormulaMetricCard
            label="Revenue"
            value={formatCurrency(m?.revenue ?? null)}
            source={{ ...SOURCES.tenQ, xbrl_tag: "us-gaap:Revenues" }}
            size="lg"
          />
          <FormulaMetricCard
            label="Revenue Growth"
            value={revenueGrowth.formatted}
            formula={revenueGrowth.formula}
            inputs={addSources(revenueGrowth.inputs)}
          />
          <FormulaMetricCard
            label={ebitdaDisplay.isProxy ? "EBITDA (Proxy)" : "EBITDA"}
            value={formatCurrency(ebitdaDisplay.value)}
            source={ebitdaDisplay.isProxy 
              ? { document: "Calculated", xbrl_tag: "Operating Income + D&A" }
              : SOURCES.managementReconciliation
            }
            size="lg"
          />
          <FormulaMetricCard
            label="Gross Margin"
            value={grossMargin.formatted}
            formula={grossMargin.formula}
            inputs={addSources(grossMargin.inputs)}
          />
          <FormulaMetricCard
            label="Free Cash Flow"
            value={formatCurrency(m?.free_cash_flow ?? null)}
            source={SOURCES.tenQCashFlow}
          />
        </div>

        {/* Operating Efficiency */}
        <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 mt-8">
          Operating Efficiency
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          <FormulaMetricCard
            label="Operating Margin"
            value={operatingMargin.formatted}
            formula={operatingMargin.formula}
            inputs={addSources(operatingMargin.inputs)}
          />
          <FormulaMetricCard
            label="FCF Margin"
            value={fcfMargin.formatted}
            formula={fcfMargin.formula}
            inputs={addSources(fcfMargin.inputs)}
          />
          <FormulaMetricCard
            label="Revenue / Employee"
            value={revenuePerEmployee.formatted}
            formula={revenuePerEmployee.formula}
            inputs={addSources(revenuePerEmployee.inputs)}
          />
          <FormulaMetricCard
            label="R&D Intensity"
            value={rdIntensity.formatted}
            formula={rdIntensity.formula}
            inputs={addSources(rdIntensity.inputs)}
          />
        </div>
      </div>
    </section>
  );
}
