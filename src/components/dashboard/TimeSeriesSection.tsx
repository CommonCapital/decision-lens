import { HorizonData, TimeHorizon, HORIZON_LABELS, LegacyTimeSeriesMetric } from "@/lib/time-series-data";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { TimeHorizonTabs } from "./TimeHorizonSelector";
import { cn } from "@/lib/utils";
import { Calendar, TrendingUp, Activity, AlertCircle } from "lucide-react";

interface TimeSeriesSectionProps {
  horizonData: HorizonData;
  horizon: TimeHorizon;
  onHorizonChange: (h: TimeHorizon) => void;
  isTransitioning?: boolean;
}

// Helper to check if a metric is available for charting
function isMetricAvailable(metric?: LegacyTimeSeriesMetric): metric is LegacyTimeSeriesMetric {
  return !!(
    metric &&
    metric.current.availability === "available" &&
    metric.series &&
    metric.series.length > 0
  );
}

export function TimeSeriesSection({
  horizonData,
  horizon,
  onHorizonChange,
  isTransitioning,
}: TimeSeriesSectionProps) {
  const { metrics, start_date, end_date, events_count, key_events } = horizonData;

  // Check which metrics are available
  const availableMetrics = {
    stock_price: isMetricAvailable(metrics.stock_price),
    revenue: isMetricAvailable(metrics.revenue),
    ebitda: isMetricAvailable(metrics.ebitda),
    volume: isMetricAvailable(metrics.volume),
  };

  const hasAnyCharts = Object.values(availableMetrics).some(Boolean);

  return (
    <section
      className={cn(
        "py-8 border-b border-border transition-opacity duration-150",
        isTransitioning ? "opacity-50" : "opacity-100"
      )}
    >
      <div className="px-6">
        {/* Section Header with Horizon Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
              Time-Series Analysis
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Date Range Display */}
            <div className="flex items-center gap-2 text-micro text-muted-foreground font-mono">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(start_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: horizon === "5Y" || horizon === "10Y" ? "numeric" : undefined,
                })}
              </span>
              <span>→</span>
              <span>
                {new Date(end_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Horizon Tabs */}
            <TimeHorizonTabs
              current={horizon}
              onChange={onHorizonChange}
            />
          </div>
        </div>

        {/* Horizon Summary Bar */}
        <div className="flex items-center justify-between bg-secondary/50 px-4 py-3 mb-6">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-micro text-muted-foreground block">Horizon</span>
              <span className="font-medium">{HORIZON_LABELS[horizon]}</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <span className="text-micro text-muted-foreground block">Events</span>
              <span className="font-mono">{events_count}</span>
            </div>
            {key_events.length > 0 && (
              <>
                <div className="w-px h-8 bg-border" />
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {key_events.slice(0, 2).join(" • ")}
                    {key_events.length > 2 && ` +${key_events.length - 2}`}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Quick Stats - only show if available */}
          {availableMetrics.stock_price && metrics.stock_price && (
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "text-lg font-mono",
                  metrics.stock_price.change.percent >= 0
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {metrics.stock_price.change.formatted}
              </span>
              <span className="text-micro text-muted-foreground">
                Price {HORIZON_LABELS[horizon]}
              </span>
            </div>
          )}
        </div>

        {/* Charts Grid - only render available metrics */}
        {hasAnyCharts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {availableMetrics.stock_price && metrics.stock_price && (
              <TimeSeriesChart
                metric={metrics.stock_price}
                horizon={horizon}
                label="Stock Price"
                isTransitioning={isTransitioning}
              />
            )}
            {availableMetrics.revenue && metrics.revenue && (
              <TimeSeriesChart
                metric={metrics.revenue}
                horizon={horizon}
                label="Revenue"
                isTransitioning={isTransitioning}
              />
            )}
            {availableMetrics.ebitda && metrics.ebitda && (
              <TimeSeriesChart
                metric={metrics.ebitda}
                horizon={horizon}
                label="EBITDA"
                isTransitioning={isTransitioning}
              />
            )}
            {availableMetrics.volume && metrics.volume && (
              <TimeSeriesChart
                metric={metrics.volume}
                horizon={horizon}
                label="Volume"
                isTransitioning={isTransitioning}
              />
            )}
          </div>
        ) : (
          <div className="bg-muted/30 border border-border p-8 text-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No time-series data available for the selected horizon.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Historical data may be pending, restricted, or unavailable from sources.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
