import { z } from "zod";

// === EVIDENCE SCHEMA ===
export const evidenceSchema = z.object({
  url: z.string(),
  quote: z.string().nullable(),
  relevance_score: z.number().min(0).max(1),
}).partial();

// === CORE TYPES ===

// Tie-out status for reconciliation
const tieOutStatusSchema = z.enum(["final", "provisional", "flagged"]);

// Data availability status
const availabilityStatusSchema = z.enum([
  "available",      // Data present and validated
  "pending",        // Expected but not yet received  
  "unavailable",    // Source doesn't provide this
  "restricted",     // Behind paywall or access limited
  "stale",          // Data exists but outdated
  "conflicting",    // Multiple sources disagree
]);

// Decision context per metric
const decisionContextSchema = z.object({
  confidence_level: z.enum(["high", "medium", "low"]),
  sufficiency_status: z.enum(["sufficient", "insufficient"]),
  knowns: z.array(z.string()),
  unknowns: z.array(z.string()),
  what_changes_conclusion: z.array(z.string()),
});

// Metric with uncertainty awareness
const metricSchema = z.object({
  value: z.union([z.number(), z.string()]).nullable(),
  formatted: z.string().nullable(),
  unit: z.string().optional().nullable(),
  source: z.string().nullable(),
  tie_out_status: tieOutStatusSchema,
  last_updated: z.string().nullable(),
  // Uncertainty fields - required for decision-readiness
  confidence: z.number().min(0).max(100),           // 0-100 reliability score
  availability: availabilityStatusSchema,           // Current data status
  unavailable_reason: z.string().optional().nullable(),        // Why missing, if applicable
  decision_context: decisionContextSchema.optional().nullable(),
});

// === TIME-SERIES SCHEMA ===

// Quarterly data slices
const quarterlySeriesSchema = z.object({
  Q1: z.number().nullable(),
  Q2: z.number().nullable(),
  Q3: z.number().nullable(),
  Q4: z.number().nullable(),
});

// Time-series data point
const timeSeriesPointSchema = z.object({
  timestamp: z.string(),
  value: z.number().nullable(),
  formatted: z.string(),
  unit: z.string().optional(),
  confidence: z.number().min(0).max(100),
  availability: availabilityStatusSchema,
  unavailable_reason: z.string().optional().nullable(),
});

// Horizon statistics with quarterly breakdown
const horizonStatsSchema = z.object({
  quarters: quarterlySeriesSchema,
  high: z.number().nullable(),
  low: z.number().nullable(),
  average: z.number().nullable(),
  volatility: z.number().nullable(),
  change_percent: z.number().nullable(),
});

// Time-series metric with full historical data
const timeSeriesMetricSchema = z.object({
  series: z.array(timeSeriesPointSchema),
  horizons: z.record(
    z.enum(["1H", "1D", "1W", "1M", "1Y", "5Y", "10Y"]),
    horizonStatsSchema
  ).optional(),
  availability: availabilityStatusSchema,
  confidence: z.number().min(0).max(100),
  unavailable_reason: z.string().optional().nullable(),
  source: z.string(),
  decision_context: decisionContextSchema.optional().nullable(),
});

// Metric with current value and optional history
const metricWithHistorySchema = z.object({
  current: metricSchema,
  history: timeSeriesMetricSchema.nullable(),
});

// Event in timeline
const eventSchema = z.object({
  id: z.string(),
  date: z.string(),
  type: z.enum(["earnings", "filing", "guidance", "corporate_action", "news", "analyst_update"]),
  title: z.string(),
  description: z.string(),
  impact: z.enum(["positive", "negative", "neutral"]),
  source_url: z.string().optional().nullable(),
});

// Scenario definition
const scenarioSchema = z.object({
  name: z.enum(["base", "downside", "upside"]),
  probability: z.number().min(0).max(1),
  assumptions: z.array(z.object({
    key: z.string().nullable(),
    value: z.string().nullable(),
  })),
  outputs: z.object({
    revenue: metricSchema,
    ebitda: metricSchema,
    valuation: metricSchema,
  }),
});

// Risk definition
const riskSchema = z.object({
  id: z.string(),
  category: z.enum(["market", "operational", "financial", "liquidity", "governance"]),
  title: z.string(),
  description: z.string(),
  severity: z.enum(["critical", "high", "medium", "low"]),
  trigger: z.string().nullable(),
  mitigation: z.string().optional().nullable(),
});

// === MAIN SCHEMA ===

export const investorDashboardSchema = z.object({
  // Run metadata
  run_metadata: z.object({
    run_id: z.string(),
    entity: z.string(),
    ticker: z.string().optional(),
    mode: z.enum(["public", "private"]),
    timestamp: z.string(),
    owner: z.string(),
  }),

  // Executive summary
  executive_summary: z.object({
    headline: z.string(),
    key_facts: z.array(z.string()),
    implications: z.array(z.string()),
    key_risks: z.array(z.string()),
    thesis_status: z.enum(["intact", "challenged", "broken"]),
  }),

  // Core financials with history
  financials: z.object({
    revenue: metricWithHistorySchema,
    revenue_growth: metricWithHistorySchema,
    ebitda: metricWithHistorySchema,
    ebitda_margin: metricWithHistorySchema,
    free_cash_flow: metricWithHistorySchema,
  }),

  // Market data (public mode) with history
  market_data: z.object({
    stock_price: metricWithHistorySchema,
    market_cap: metricWithHistorySchema,
    pe_ratio: metricWithHistorySchema.optional(),
    ev_ebitda: metricWithHistorySchema.optional(),
    target_price: metricWithHistorySchema.optional(),
  }).optional(),

  // Private data (private mode)
  private_data: z.object({
    valuation_mark: metricWithHistorySchema,
    net_leverage: metricWithHistorySchema,
    liquidity_runway: metricWithHistorySchema,
    covenant_headroom: metricWithHistorySchema.optional(),
  }).optional(),

  // Events timeline
  events: z.array(eventSchema),

  // Scenarios
  scenarios: z.array(scenarioSchema),

  // Risks
  risks: z.array(riskSchema),

  // Data sources
  sources: z.array(z.object({
    name: z.string(),
    type: z.enum(["primary", "secondary"]),
    last_refresh: z.string(),
  })),
});

// Type exports
export type InvestorDashboard = z.infer<typeof investorDashboardSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type MetricWithHistory = z.infer<typeof metricWithHistorySchema>;
export type TimeSeriesMetric = z.infer<typeof timeSeriesMetricSchema>;
export type TimeSeriesPoint = z.infer<typeof timeSeriesPointSchema>;
export type HorizonStats = z.infer<typeof horizonStatsSchema>;
export type QuarterlySeries = z.infer<typeof quarterlySeriesSchema>;
export type DecisionContext = z.infer<typeof decisionContextSchema>;
export type TieOutStatus = z.infer<typeof tieOutStatusSchema>;
export type AvailabilityStatus = z.infer<typeof availabilityStatusSchema>;
export type Event = z.infer<typeof eventSchema>;
export type Scenario = z.infer<typeof scenarioSchema>;
export type Risk = z.infer<typeof riskSchema>;
