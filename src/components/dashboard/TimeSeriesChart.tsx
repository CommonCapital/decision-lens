import { useMemo } from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  ReferenceLine,
} from "recharts";
import { TimeSeriesMetric, TimeHorizon, HORIZON_LABELS } from "@/lib/time-series-data";
import { cn } from "@/lib/utils";

interface TimeSeriesChartProps {
  metric: TimeSeriesMetric;
  horizon: TimeHorizon;
  label: string;
  isTransitioning?: boolean;
  className?: string;
}

export function TimeSeriesChart({
  metric,
  horizon,
  label,
  isTransitioning,
  className,
}: TimeSeriesChartProps) {
  const chartData = useMemo(() => {
    return metric.series.map((point) => ({
      timestamp: point.timestamp,
      value: point.value,
      formatted: point.formatted,
      date: new Date(point.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: horizon === "1D" ? undefined : "numeric",
        hour: horizon === "1D" ? "numeric" : undefined,
        year: horizon === "5Y" || horizon === "10Y" ? "numeric" : undefined,
      }),
    }));
  }, [metric.series, horizon]);

  const isPositive = metric.change.percent >= 0;
  const average = metric.horizon_stats.average;

  return (
    <div
      className={cn(
        "bg-card p-4 transition-all duration-300",
        isTransitioning ? "opacity-50 scale-[0.99]" : "opacity-100 scale-100",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans block mb-1">
            {label} • {HORIZON_LABELS[horizon]}
          </span>
          <span className="text-2xl font-mono font-medium">
            {metric.current.formatted}
          </span>
        </div>
        <div className="text-right">
          <span
            className={cn(
              "text-lg font-mono",
              isPositive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {metric.change.formatted}
          </span>
          <span className="block text-micro text-muted-foreground">
            {HORIZON_LABELS[horizon]} change
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 0%, 0%)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(0, 0%, 0%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(0, 0%, 40%)" }}
              tickMargin={8}
              interval="preserveStartEnd"
            />
            <YAxis hide domain={["dataMin - 5%", "dataMax + 5%"]} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-foreground text-background px-3 py-2 text-micro font-mono">
                    <div>{data.formatted}</div>
                    <div className="text-background/70">{data.date}</div>
                  </div>
                );
              }}
            />
            <ReferenceLine
              y={average}
              stroke="hsl(0, 0%, 70%)"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(0, 0%, 0%)"
              strokeWidth={1.5}
              fill={`url(#gradient-${label})`}
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border">
        <div>
          <span className="text-micro text-muted-foreground block">High</span>
          <span className="text-sm font-mono">
            ${(metric.horizon_stats.high / 1000000).toFixed(1)}M
          </span>
        </div>
        <div>
          <span className="text-micro text-muted-foreground block">Low</span>
          <span className="text-sm font-mono">
            ${(metric.horizon_stats.low / 1000000).toFixed(1)}M
          </span>
        </div>
        <div>
          <span className="text-micro text-muted-foreground block">Avg</span>
          <span className="text-sm font-mono">
            ${(metric.horizon_stats.average / 1000000).toFixed(1)}M
          </span>
        </div>
        <div>
          <span className="text-micro text-muted-foreground block">Vol</span>
          <span className="text-sm font-mono">
            {(metric.horizon_stats.volatility * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
