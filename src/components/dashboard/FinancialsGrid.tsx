import { InvestorDashboard } from "@/lib/investor-schema";
import { MetricCard } from "./MetricCard";

interface FinancialsGridProps {
  data: InvestorDashboard;
  mode: "public" | "private";
}

export function FinancialsGrid({ data, mode }: FinancialsGridProps) {
  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-6">
          Financial & Operating Metrics
        </h2>

        {/* Core financials */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border mb-6">
          <MetricCard
            label="Revenue"
            metric={data.financials.revenue}
            size="lg"
            className="bg-card"
          />
          <MetricCard
            label="Revenue Growth"
            metric={data.financials.revenue_growth}
            className="bg-card"
          />
          <MetricCard
            label="Gross Margin"
            metric={data.financials.gross_margin}
            className="bg-card"
          />
          <MetricCard
            label="EBITDA"
            metric={data.financials.ebitda}
            size="lg"
            className="bg-card"
          />
          <MetricCard
            label="EBITDA Margin"
            metric={data.financials.ebitda_margin}
            className="bg-card"
          />
          <MetricCard
            label="Free Cash Flow"
            metric={data.financials.free_cash_flow}
            className="bg-card"
          />
        </div>

        {/* Mode-specific metrics */}
        {mode === "public" && data.public_data && (
          <>
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 mt-8">
              Market Data
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-border">
              <MetricCard
                label="Stock Price"
                metric={data.public_data.stock_price}
                size="lg"
                className="bg-card"
              />
              <MetricCard
                label="Market Cap"
                metric={data.public_data.market_cap}
                className="bg-card"
              />
              <MetricCard
                label="Volume"
                metric={data.public_data.volume}
                className="bg-card"
              />
              <MetricCard
                label="Volatility"
                metric={data.public_data.volatility}
                className="bg-card"
              />
              {data.public_data.pe_ratio && (
                <MetricCard
                  label="P/E Ratio"
                  metric={data.public_data.pe_ratio}
                  className="bg-card"
                />
              )}
              {data.public_data.ev_ebitda && (
                <MetricCard
                  label="EV/EBITDA"
                  metric={data.public_data.ev_ebitda}
                  className="bg-card"
                />
              )}
              <MetricCard
                label="vs. Index"
                metric={data.public_data.benchmark_performance.vs_index}
                className="bg-card"
              />
            </div>

            {/* Consensus */}
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 mt-8">
              Consensus Estimates
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
              <MetricCard
                label="Consensus Revenue"
                metric={data.public_data.consensus_estimates.revenue}
                className="bg-card"
              />
              <MetricCard
                label="Consensus EPS"
                metric={data.public_data.consensus_estimates.eps}
                className="bg-card"
              />
              <MetricCard
                label="Target Price"
                metric={data.public_data.analyst_ratings.target_price}
                className="bg-card"
              />
              <div className="bg-card p-4">
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans block mb-2">
                  Analyst Ratings
                </span>
                <div className="flex items-center gap-3 font-mono text-sm">
                  <span className="text-foreground">
                    {data.public_data.analyst_ratings.buy} Buy
                  </span>
                  <span className="text-muted-foreground">
                    {data.public_data.analyst_ratings.hold} Hold
                  </span>
                  <span className="text-muted-foreground">
                    {data.public_data.analyst_ratings.sell} Sell
                  </span>
                </div>
                <div className="mt-2 text-micro text-muted-foreground">
                  30d Revisions: ↑{data.public_data.consensus_estimates.revisions_30d.up} ↓
                  {data.public_data.consensus_estimates.revisions_30d.down}
                </div>
              </div>
            </div>
          </>
        )}

        {mode === "private" && data.private_data && (
          <>
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 mt-8">
              Valuation & Performance
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
              <MetricCard
                label="Valuation Mark"
                metric={data.private_data.valuation_mark}
                size="lg"
                className="bg-card"
              />
              <MetricCard
                label="Revenue Variance"
                metric={data.private_data.budget_vs_actual.revenue_variance}
                className="bg-card"
              />
              <MetricCard
                label="EBITDA Variance"
                metric={data.private_data.budget_vs_actual.ebitda_variance}
                className="bg-card"
              />
              <div className="bg-card p-4">
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans block mb-2">
                  Valuation Methodology
                </span>
                <span className="text-sm">
                  {data.private_data.valuation_methodology}
                </span>
              </div>
            </div>

            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 mt-8">
              Liquidity Position
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
              <MetricCard
                label="Cash"
                metric={data.private_data.liquidity.cash}
                size="lg"
                className="bg-card"
              />
              <MetricCard
                label="Revolver Available"
                metric={data.private_data.liquidity.revolver_availability}
                className="bg-card"
              />
              <MetricCard
                label="Runway (Months)"
                metric={data.private_data.liquidity.runway_months}
                className="bg-card"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
