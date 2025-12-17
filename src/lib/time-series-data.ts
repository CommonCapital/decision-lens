import { Metric, TimeSeriesMetric } from "@/lib/investor-schema";

// Time horizons
export type TimeHorizon = "1D" | "1W" | "1M" | "1Y" | "5Y" | "10Y";

export const TIME_HORIZONS: TimeHorizon[] = ["1D", "1W", "1M", "1Y", "5Y", "10Y"];

export const HORIZON_LABELS: Record<TimeHorizon, string> = {
  "1D": "Day",
  "1W": "Week",
  "1M": "Month",
  "1Y": "Year",
  "5Y": "5 Year",
  "10Y": "10 Year",
};

// Time-series data point (for compatibility with existing components)
export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  formatted: string;
}

// Time-series metric with full historical data (legacy format for existing charts)
export interface LegacyTimeSeriesMetric {
  current: Metric;
  series: TimeSeriesDataPoint[];
  change: {
    absolute: number;
    percent: number;
    formatted: string;
  };
  horizon_stats: {
    high: number;
    low: number;
    average: number;
    volatility: number;
  };
}

// AI Insight structure (stubbed for future AI integration)
export interface AIInsight {
  id: string;
  type: "prediction" | "recommendation" | "alert" | "analysis";
  confidence: number;
  title: string;
  summary: string;
  details?: string;
  source: "model_v1" | "pending_ai_integration";
  generated_at: string;
  horizon_relevance: TimeHorizon[];
  impact_score: number; // -1 to 1
  action_required: boolean;
  supporting_metrics?: string[];
}

// Aggregated metrics per horizon
export interface HorizonData {
  horizon: TimeHorizon;
  start_date: string;
  end_date: string;
  metrics: {
    stock_price?: LegacyTimeSeriesMetric;
    revenue?: LegacyTimeSeriesMetric;
    ebitda?: LegacyTimeSeriesMetric;
    volume?: LegacyTimeSeriesMetric;
    margin?: LegacyTimeSeriesMetric;
    fcf?: LegacyTimeSeriesMetric;
  };
  events_count: number;
  key_events: string[];
  ai_insights?: AIInsight[];
}

// Full time-series dataset
export interface TimeSeriesDataset {
  entity: string;
  last_updated: string;
  horizons: Record<TimeHorizon, HorizonData>;
}

// Convert schema TimeSeriesMetric to legacy format for chart compatibility
export function convertToLegacyMetric(
  current: Metric,
  history: TimeSeriesMetric | null
): LegacyTimeSeriesMetric | null {
  if (!history || history.availability !== "available" || history.series.length === 0) {
    return null;
  }

  const series: TimeSeriesDataPoint[] = history.series
    .filter(p => p.value !== null)
    .map(p => ({
      timestamp: p.timestamp,
      value: p.value as number,
      formatted: p.formatted,
    }));

  if (series.length === 0) return null;

  const values = series.map(s => s.value);
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const change = lastValue - firstValue;
  const changePercent = (change / firstValue) * 100;

  const high = Math.max(...values);
  const low = Math.min(...values);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - average, 2), 0) / values.length;

  return {
    current,
    series,
    change: {
      absolute: change,
      percent: changePercent,
      formatted: `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(1)}%`,
    },
    horizon_stats: {
      high,
      low,
      average,
      volatility: Math.sqrt(variance) / average,
    },
  };
}

// Generate mock time series for a horizon
function generateMockSeries(
  horizon: TimeHorizon,
  baseValue: number,
  volatility: number
): TimeSeriesDataPoint[] {
  const points: TimeSeriesDataPoint[] = [];
  const now = new Date();
  
  const config: Record<TimeHorizon, { count: number; interval: number }> = {
    "1D": { count: 24, interval: 60 * 60 * 1000 }, // hourly
    "1W": { count: 7, interval: 24 * 60 * 60 * 1000 }, // daily
    "1M": { count: 30, interval: 24 * 60 * 60 * 1000 }, // daily
    "1Y": { count: 12, interval: 30 * 24 * 60 * 60 * 1000 }, // monthly
    "5Y": { count: 20, interval: 90 * 24 * 60 * 60 * 1000 }, // quarterly
    "10Y": { count: 10, interval: 365 * 24 * 60 * 60 * 1000 }, // yearly
  };
  
  const { count, interval } = config[horizon];
  let currentValue = baseValue * (1 - volatility * 0.5);
  
  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * interval);
    const change = (Math.random() - 0.4) * volatility * baseValue * 0.1;
    currentValue = Math.max(currentValue + change, baseValue * 0.5);
    
    points.push({
      timestamp: timestamp.toISOString(),
      value: currentValue,
      formatted: currentValue >= 1000000 
        ? `$${(currentValue / 1000000).toFixed(1)}M`
        : `$${currentValue.toFixed(2)}`,
    });
  }
  
  return points;
}

function calculateTimeSeriesMetric(
  baseMetric: Metric,
  horizon: TimeHorizon,
  volatility: number = 0.15
): LegacyTimeSeriesMetric {
  const baseValue = typeof baseMetric.value === "number" ? baseMetric.value : 100;
  const series = generateMockSeries(horizon, baseValue, volatility);
  
  const firstValue = series[0]?.value || baseValue;
  const lastValue = series[series.length - 1]?.value || baseValue;
  const change = lastValue - firstValue;
  const changePercent = (change / firstValue) * 100;
  
  const values = series.map(s => s.value);
  const high = Math.max(...values);
  const low = Math.min(...values);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - average, 2), 0) / values.length;
  
  return {
    current: baseMetric,
    series,
    change: {
      absolute: change,
      percent: changePercent,
      formatted: `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(1)}%`,
    },
    horizon_stats: {
      high,
      low,
      average,
      volatility: Math.sqrt(variance) / average,
    },
  };
}

// Mock AI insights per horizon
const MOCK_AI_INSIGHTS: Record<TimeHorizon, AIInsight[]> = {
  "1D": [
    {
      id: "ai-1d-001",
      type: "alert",
      confidence: 0.87,
      title: "Unusual Volume Detected",
      summary: "Trading volume 2.3x above 20-day average. Institutional activity likely.",
      source: "pending_ai_integration",
      generated_at: new Date().toISOString(),
      horizon_relevance: ["1D", "1W"],
      impact_score: 0.4,
      action_required: false,
      supporting_metrics: ["Volume", "Price Action"],
    },
  ],
  "1W": [
    {
      id: "ai-1w-001",
      type: "prediction",
      confidence: 0.72,
      title: "Price Momentum Building",
      summary: "7-day RSI indicates bullish momentum. Historical pattern suggests 3-5% upside probability.",
      details: "Based on similar setups in last 3 years, 68% resulted in positive returns over following 2 weeks.",
      source: "pending_ai_integration",
      generated_at: new Date().toISOString(),
      horizon_relevance: ["1W", "1M"],
      impact_score: 0.35,
      action_required: false,
      supporting_metrics: ["RSI", "MACD", "Volume"],
    },
  ],
  "1M": [
    {
      id: "ai-1m-001",
      type: "analysis",
      confidence: 0.89,
      title: "Earnings Catalyst Approaching",
      summary: "Q4 earnings in 23 days. Consensus revisions trending positive (4 up, 1 down in 30d).",
      details: "Company has beaten estimates 8 of last 12 quarters. Average beat: 4.2%.",
      source: "pending_ai_integration",
      generated_at: new Date().toISOString(),
      horizon_relevance: ["1M"],
      impact_score: 0.6,
      action_required: true,
      supporting_metrics: ["EPS Estimates", "Revenue Estimates"],
    },
  ],
  "1Y": [
    {
      id: "ai-1y-001",
      type: "prediction",
      confidence: 0.65,
      title: "Sector Rotation Tailwind",
      summary: "Macro cycle analysis suggests industrials outperformance through H2 2025.",
      details: "Fed rate trajectory and capex cycle favor sector. Position for 12-18 month hold.",
      source: "pending_ai_integration",
      generated_at: new Date().toISOString(),
      horizon_relevance: ["1Y"],
      impact_score: 0.45,
      action_required: false,
      supporting_metrics: ["Sector ETF flows", "PMI data"],
    },
  ],
  "5Y": [
    {
      id: "ai-5y-001",
      type: "analysis",
      confidence: 0.58,
      title: "Competitive Moat Assessment",
      summary: "Market share gains sustainable. IP portfolio and scale advantages widening.",
      details: "5-year revenue CAGR of 11.2% vs industry 6.8%. Margin differential expanding.",
      source: "pending_ai_integration",
      generated_at: new Date().toISOString(),
      horizon_relevance: ["5Y", "10Y"],
      impact_score: 0.7,
      action_required: false,
      supporting_metrics: ["Market Share", "R&D Investment", "Patent Count"],
    },
  ],
  "10Y": [
    {
      id: "ai-10y-001",
      type: "analysis",
      confidence: 0.45,
      title: "Secular Growth Runway",
      summary: "TAM expansion driven by adjacent market entry and geographic expansion.",
      details: "Long-term compounder characteristics: high ROIC, reinvestment runway, management quality.",
      source: "pending_ai_integration",
      generated_at: new Date().toISOString(),
      horizon_relevance: ["10Y"],
      impact_score: 0.8,
      action_required: false,
      supporting_metrics: ["ROIC", "TAM", "Geographic Mix"],
    },
  ],
};

// Build mock dataset from base metrics
export function buildTimeSeriesDataset(
  entity: string,
  baseMetrics: {
    stock_price: Metric;
    revenue: Metric;
    ebitda: Metric;
    volume: Metric;
  }
): TimeSeriesDataset {
  const horizons: Partial<Record<TimeHorizon, HorizonData>> = {};
  
  for (const horizon of TIME_HORIZONS) {
    const now = new Date();
    const offsets: Record<TimeHorizon, number> = {
      "1D": 1,
      "1W": 7,
      "1M": 30,
      "1Y": 365,
      "5Y": 365 * 5,
      "10Y": 365 * 10,
    };
    
    const startDate = new Date(now.getTime() - offsets[horizon] * 24 * 60 * 60 * 1000);
    
    horizons[horizon] = {
      horizon,
      start_date: startDate.toISOString(),
      end_date: now.toISOString(),
      metrics: {
        stock_price: calculateTimeSeriesMetric(baseMetrics.stock_price, horizon, 0.2),
        revenue: calculateTimeSeriesMetric(baseMetrics.revenue, horizon, 0.08),
        ebitda: calculateTimeSeriesMetric(baseMetrics.ebitda, horizon, 0.12),
        volume: calculateTimeSeriesMetric(baseMetrics.volume, horizon, 0.4),
      },
      events_count: Math.floor(Math.random() * 5) + (horizon === "1D" ? 0 : 1),
      key_events: horizon === "1M" 
        ? ["Q3 Earnings Beat", "Competitor Exit Announced"]
        : horizon === "1Y"
        ? ["Guidance Raised x2", "Major Contract Win", "CFO Transition"]
        : [],
      ai_insights: MOCK_AI_INSIGHTS[horizon],
    };
  }
  
  return {
    entity,
    last_updated: new Date().toISOString(),
    horizons: horizons as Record<TimeHorizon, HorizonData>,
  };
}
