import { z } from "zod";

// === CORE ENUMS ===

const tieOutStatusSchema = z.enum(["final", "provisional", "flagged"]);

const availabilityStatusSchema = z.enum([
  "available",
  "pending",
  "unavailable",
  "restricted",
  "stale",
  "conflicting",
]);

export const timeHorizonSchema = z.enum(["1D", "1W", "1M", "1Y", "5Y", "10Y"]);

// === DATA QUALITY (replaces confidence) ===

const dataQualitySchema = z.object({
  coverage: z.number().min(0).max(100).nullable(),
  auditability: z.number().min(0).max(100).nullable(),
  freshness_days: z.number().nullable(),
});

// === METRIC DEFINITION ===

const metricDefinitionSchema = z.object({
  metric_name: z.string().nullable(),
  period: z.enum(["quarter", "TTM", "FY", "LTM", "NTM"]).nullable(),
  basis: z.enum(["GAAP", "non_GAAP", "adjusted", "reported"]).nullable(),
  currency: z.string().nullable(),
  unit: z.string().nullable(),
});

// === DECISION CONTEXT ===

const decisionContextSchema = z.object({
  confidence_level: z.enum(["high", "medium", "low"]),
  sufficiency_status: z.enum(["sufficient", "insufficient"]),
  knowns: z.array(z.string()),
  unknowns: z.array(z.string()),
  what_changes_conclusion: z.array(z.string()),
});

// === SOURCE REFERENCE ===

const sourceReferenceSchema = z.object({
  url: z.string().nullable(),
  document_type: z.enum(["filing", "transcript", "press_release", "news", "analyst_report", "internal"]).nullable(),
  excerpt: z.string().nullable(),
  accessed_at: z.string().nullable(),
});

// === CORE METRIC ===

const metricSchema = z.object({
  value: z.union([z.number(), z.string()]).nullable(),
  formatted: z.string().nullable(),
  unit: z.string().optional().nullable(),
  source: z.string().nullable(),
  source_reference: sourceReferenceSchema.optional().nullable(),
  tie_out_status: tieOutStatusSchema,
  last_updated: z.string().nullable(),
  availability: availabilityStatusSchema,
  reason: z.string().optional().nullable(),
  confidence: z.number().min(0).max(100),
  data_quality: dataQualitySchema.optional().nullable(),
  decision_context: decisionContextSchema.optional().nullable(),
  definition: metricDefinitionSchema.optional().nullable(),
});

// === TIME-SERIES ===

const quarterlySeriesSchema = z.object({
  Q1: z.number().nullable(),
  Q2: z.number().nullable(),
  Q3: z.number().nullable(),
  Q4: z.number().nullable(),
});

const horizonStatsSchema = z.object({
  quarters: quarterlySeriesSchema,
  high: z.number().nullable(),
  low: z.number().nullable(),
  average: z.number().nullable(),
  volatility: z.number().nullable(),
  change_percent: z.number().nullable(),
});

const timeSeriesMetricSchema = z.object({
  horizons: z.object({
    "1D": horizonStatsSchema.nullable(),
    "1W": horizonStatsSchema.nullable(),
    "1M": horizonStatsSchema.nullable(),
    "1Y": horizonStatsSchema.nullable(),
    "5Y": horizonStatsSchema.nullable(),
    "10Y": horizonStatsSchema.nullable(),
  }),
  availability: availabilityStatusSchema,
  reason: z.string().optional().nullable(),
  confidence: z.number().min(0).max(100),
  data_quality: dataQualitySchema.optional().nullable(),
  source: z.string().nullable(),
});

const metricWithHistorySchema = z.object({
  current: metricSchema,
  history: timeSeriesMetricSchema.nullable(),
});

// === HYPOTHESIS ===

const hypothesisSchema = z.object({
  id: z.string(),
  type: z.enum(["hypothesis", "recommendation", "alert", "analysis"]),
  title: z.string(),
  summary: z.string(),
  details: z.string().optional().nullable(),
  assumptions: z.array(z.string()).optional().nullable(),
  falsification_criteria: z.array(z.string()).optional().nullable(),
  confidence_band: z.enum(["high", "medium", "low"]).nullable(),
  source: z.string(),
  generated_at: z.string(),
  horizon_relevance: z.array(timeHorizonSchema),
  impact_score: z.number().min(-1).max(1).nullable(),
  action_required: z.boolean(),
});

// === EVENT ===

const eventSchema = z.object({
  id: z.string(),
  date: z.string(),
  type: z.enum(["earnings", "filing", "guidance", "corporate_action", "news", "analyst_update"]),
  title: z.string(),
  description: z.string(),
  impact: z.enum(["positive", "negative", "neutral"]),
  source_url: z.string().optional().nullable(),
});

// === SCENARIO ===

const scenarioOutputsSchema = z.object({
  revenue: metricSchema,
  ebitda: metricSchema,
  valuation: metricSchema,
});

const singleScenarioSchema = z.object({
  probability: z.number().min(0).max(1),
  assumptions: z.array(z.object({
    key: z.string().nullable(),
    value: z.string().nullable(),
  })),
  outputs: scenarioOutputsSchema,
});

const scenariosSchema = z.object({
  base: singleScenarioSchema,
  downside: singleScenarioSchema,
  upside: singleScenarioSchema,
});

// === RISK ===

const riskSchema = z.object({
  id: z.string(),
  category: z.enum(["market", "operational", "financial", "liquidity", "governance"]),
  title: z.string(),
  description: z.string(),
  severity: z.enum(["critical", "high", "medium", "low"]),
  trigger: z.string().nullable(),
  mitigation: z.string().optional().nullable(),
});

// === CHANGE ===

const changeSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  category: z.enum(["filing", "transcript", "guidance", "price", "consensus", "regulatory", "news"]),
  title: z.string(),
  description: z.string(),
  source_url: z.string().nullable(),
  thesis_pillar: z.enum(["price", "path", "protection"]).nullable(),
  so_what: z.string().nullable(),
  action: z.string().nullable(),
});

// === VALUATION ===

const valuationSchema = z.object({
  valuation_range_low: z.number().nullable(),
  valuation_range_high: z.number().nullable(),
  valuation_range_midpoint: z.number().nullable(),
  why_range_exists: z.string().nullable(),
  
  dcf: z.object({
    terminal_growth_rate: z.number().nullable(),
    wacc: z.number().nullable(),
    implied_value: z.number().nullable(),
    implied_value_per_share: z.number().nullable(),
  }).optional().nullable(),
  
  trading_comps: z.object({
    implied_value_range_low: z.number().nullable(),
    implied_value_range_high: z.number().nullable(),
    confidence: dataQualitySchema.optional().nullable(),
  }).optional().nullable(),
  
  precedent_transactions: z.object({
    implied_value_range_low: z.number().nullable(),
    implied_value_range_high: z.number().nullable(),
    confidence: dataQualitySchema.optional().nullable(),
  }).optional().nullable(),
});

// === MAIN SCHEMA ===

export const investorDashboardSchema = z.object({
  run_metadata: z.object({
    run_id: z.string(),
    entity: z.string(),
    ticker: z.string().optional(),
    mode: z.enum(["public", "private"]),
    timestamp: z.string(),
    owner: z.string(),
  }),

  changes_since_last_run: z.array(changeSchema).optional().nullable(),

  executive_summary: z.object({
    headline: z.string(),
    key_facts: z.array(z.string()),
    implications: z.array(z.string()),
    key_risks: z.array(z.string()),
    thesis_status: z.enum(["intact", "challenged", "broken"]),
  }),

  financials: z.object({
    revenue: metricWithHistorySchema,
    revenue_growth: z.object({ current: metricSchema }),
    ebitda: metricWithHistorySchema,
    ebitda_margin: z.object({ current: metricSchema }),
    free_cash_flow: z.object({ current: metricSchema }),
  }),

  market_data: z.object({
    stock_price: metricWithHistorySchema,
    volume: metricWithHistorySchema,
    market_cap: z.object({ current: metricSchema }),
    pe_ratio: z.object({ current: metricSchema }).optional(),
    ev_ebitda: z.object({ current: metricSchema }).optional(),
    target_price: z.object({ current: metricSchema }).optional(),
  }).optional(),

  private_data: z.object({
    valuation_mark: z.object({ current: metricSchema }),
    net_leverage: z.object({ current: metricSchema }),
  }).optional(),

  valuation: valuationSchema.optional().nullable(),

  hypotheses: z.array(hypothesisSchema).optional().nullable(),
  ai_insights: z.array(hypothesisSchema).optional().nullable(),

  events: z.array(eventSchema),
  scenarios: scenariosSchema,
  risks: z.array(riskSchema),

  sources: z.array(z.object({
    name: z.string(),
    type: z.enum(["primary", "secondary"]),
    last_refresh: z.string(),
  })),

  run_data_quality: dataQualitySchema.optional().nullable(),
});

// === TYPE EXPORTS ===

export type InvestorDashboard = z.infer<typeof investorDashboardSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type MetricWithHistory = z.infer<typeof metricWithHistorySchema>;
export type TimeSeriesMetric = z.infer<typeof timeSeriesMetricSchema>;
export type HorizonStats = z.infer<typeof horizonStatsSchema>;
export type QuarterlySeries = z.infer<typeof quarterlySeriesSchema>;
export type DecisionContext = z.infer<typeof decisionContextSchema>;
export type TieOutStatus = z.infer<typeof tieOutStatusSchema>;
export type AvailabilityStatus = z.infer<typeof availabilityStatusSchema>;
export type TimeHorizon = z.infer<typeof timeHorizonSchema>;
export type Hypothesis = z.infer<typeof hypothesisSchema>;
export type AIInsight = z.infer<typeof hypothesisSchema>;
export type Event = z.infer<typeof eventSchema>;
export type Scenarios = z.infer<typeof scenariosSchema>;
export type SingleScenario = z.infer<typeof singleScenarioSchema>;
export type Risk = z.infer<typeof riskSchema>;
export type DataQuality = z.infer<typeof dataQualitySchema>;
export type MetricDefinition = z.infer<typeof metricDefinitionSchema>;
export type SourceReference = z.infer<typeof sourceReferenceSchema>;
export type Change = z.infer<typeof changeSchema>;
export type Valuation = z.infer<typeof valuationSchema>;
