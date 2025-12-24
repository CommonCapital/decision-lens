import { z } from "zod";

// === EVIDENCE & AUDIT TRAIL ===

export const evidenceSchema = z.object({
  url: z.string(),
  quote: z.string().nullable(),
  relevance_score: z.number().min(0).max(1),
  accessed_at: z.string().nullable(),
}).partial();

// Source link for audit trail - every claim must link to source
const sourceReferenceSchema = z.object({
  url: z.string().nullable(),
  document_type: z.enum(["filing", "transcript", "press_release", "news", "analyst_report", "internal"]).nullable(),
  excerpt: z.string().nullable(),
  xbrl_tag: z.string().optional().nullable(),  // For financial data tie-out
  page_reference: z.string().optional().nullable(),
  accessed_at: z.string().nullable(),
});

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

// Time horizons (removed 1H as it's not illustrated)
export const timeHorizonSchema = z.enum(["1D", "1W", "1M", "1Y", "5Y", "10Y"]);

// === REPLACE CONFIDENCE WITH COVERAGE + AUDITABILITY + FRESHNESS ===

const dataQualitySchema = z.object({
  coverage: z.number().min(0).max(100).nullable(),        // % of required exhibits populated
  auditability: z.number().min(0).max(100).nullable(),    // % of numbers source-linked, reproducible, definition-locked
  freshness_days: z.number().nullable(),                   // Max age of datapoint in days
  overall_band: z.enum(["high", "medium", "low"]).nullable(),  // Qualitative band based on above
});

// Definition pill - every metric needs context
const metricDefinitionSchema = z.object({
  metric_name: z.string().nullable(),
  period: z.enum(["quarter", "TTM", "FY", "LTM", "NTM"]).nullable(),
  basis: z.enum(["GAAP", "non_GAAP", "adjusted", "reported"]).nullable(),
  currency: z.string().nullable(),
  unit: z.string().nullable(),
  calculation_method: z.string().optional().nullable(),
});

// Decision context per metric
const decisionContextSchema = z.object({
  confidence_level: z.enum(["high", "medium", "low"]),
  sufficiency_status: z.enum(["sufficient", "insufficient"]),
  knowns: z.array(z.string()),
  unknowns: z.array(z.string()),
  what_changes_conclusion: z.array(z.string()),
});

// === CALCULATION CHAIN (AUDIT TRAIL) ===

// Component source for calculation chains
const componentSourceSchema = z.object({
  name: z.string(),
  value: z.union([z.number(), z.string()]).nullable(),
  formatted: z.string().nullable(),
  source: z.string().nullable(),
  source_line: z.string().optional().nullable(),  // e.g., "Line 12"
  xbrl_tag: z.string().optional().nullable(),
  filing_date: z.string().optional().nullable(),
});

// Full calculation chain for derived metrics
const calculationChainSchema = z.object({
  formula: z.string(),  // e.g., "Cash Flow from Operations - Capital Expenditures"
  formula_expanded: z.string().optional().nullable(),  // e.g., "$215M - $57M = $158M"
  components: z.array(componentSourceSchema),
  // For complex multi-step calculations
  intermediate_calculations: z.array(z.object({
    step_name: z.string(),
    formula: z.string(),
    result: z.string(),
    components: z.array(componentSourceSchema).optional().nullable(),
  })).optional().nullable(),
});

// Metric with uncertainty awareness
const metricSchema = z.object({
  value: z.union([z.number(), z.string()]).nullable(),
  formatted: z.string().nullable(),
  unit: z.string().optional().nullable(),
  source: z.string().nullable(),
  source_reference: sourceReferenceSchema.optional().nullable(),  // Full audit trail
  tie_out_status: tieOutStatusSchema,
  last_updated: z.string().nullable(),
  // Replace confidence with data quality
  data_quality: dataQualitySchema.optional().nullable(),
  // Legacy confidence for backward compatibility
  confidence: z.number().min(0).max(100),
  availability: availabilityStatusSchema,
  // Reason for availability status (applies to all statuses, not just unavailable)
  reason: z.string().optional().nullable(),
  decision_context: decisionContextSchema.optional().nullable(),
  // Definition pill
  definition: metricDefinitionSchema.optional().nullable(),
  // NEW: Calculation chain for derived metrics
  calculation_chain: calculationChainSchema.optional().nullable(),
});

// === TIME-SERIES SCHEMA ===

// Quarterly data slices - Q1-Q4 values for graph visualization
const quarterlySeriesSchema = z.object({
  Q1: z.number().nullable(),
  Q2: z.number().nullable(),
  Q3: z.number().nullable(),
  Q4: z.number().nullable(),
});

// Horizon statistics with quarterly breakdown
const horizonStatsSchema = z.object({
  quarters: quarterlySeriesSchema,
  high: z.number().nullable(),
  low: z.number().nullable(),
  average: z.number().nullable(),
  volatility: z.number().nullable(),        // Percentage volatility
  change_percent: z.number().nullable(),    // Period change percentage
});

// Time-series metric with horizon data (for Stock Price, EBITDA, Revenue, Volume only)
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
  confidence: z.number().min(0).max(100),
  data_quality: dataQualitySchema.optional().nullable(),
  // Reason for availability status (applies to all statuses)
  reason: z.string().optional().nullable(),
  source: z.string().nullable(),
  decision_context: decisionContextSchema.optional().nullable(),
});

// Metric with current value and optional history (only for key metrics)
const metricWithHistorySchema = z.object({
  current: metricSchema,
  history: timeSeriesMetricSchema.nullable(),
});

// === HYPOTHESIS SCHEMA (REPLACES PREDICTIONS) ===

const hypothesisSchema = z.object({
  id: z.string(),
  type: z.enum(["hypothesis", "recommendation", "alert", "analysis"]),  // Changed from prediction
  title: z.string(),
  summary: z.string(),
  details: z.string().optional().nullable(),
  
  // Evidence-based structure
  evidence: z.array(z.object({
    claim: z.string(),
    source_url: z.string().nullable(),
    source_type: z.string().nullable(),
    accessed_at: z.string().nullable(),
  })).optional().nullable(),
  
  // Explicit assumptions
  assumptions: z.array(z.string()).optional().nullable(),
  
  // What would falsify this
  falsification_criteria: z.array(z.string()).optional().nullable(),
  
  // Required next check
  next_check: z.object({
    date: z.string().nullable(),
    trigger: z.string().nullable(),
    indicator: z.string().nullable(),
  }).optional().nullable(),
  
  // Qualitative confidence band (not fake percentages)
  confidence_band: z.enum(["high", "medium", "low"]).nullable(),
  evidence_count: z.number().nullable(),
  evidence_recency_days: z.number().nullable(),
  
  source: z.string(),
  generated_at: z.string(),
  horizon_relevance: z.array(timeHorizonSchema),
  impact_score: z.number().min(-1).max(1).nullable(),
  action_required: z.boolean(),
  supporting_metrics: z.array(z.string()).optional().nullable(),
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

// === DRIVER-BASED SCENARIO SCHEMA ===

// Driver input for DCF and scenarios
const driverSchema = z.object({
  name: z.string(),
  category: z.enum(["revenue", "margin", "working_capital", "capex", "other"]),
  value: z.union([z.number(), z.string()]).nullable(),
  unit: z.string().nullable(),
  source: z.enum(["fact", "judgment"]),  // Tagged as fact (sourced) or judgment
  source_reference: sourceReferenceSchema.optional().nullable(),
  rationale: z.string().optional().nullable(),
});

// Scenario definition - driver-based
const scenarioSchema = z.object({
  name: z.enum(["base", "downside", "upside"]),
  probability: z.number().min(0).max(1),
  
  // Driver-based assumptions (not line items)
  drivers: z.array(driverSchema).optional().nullable(),
  
  // Legacy assumptions for backward compatibility
  assumptions: z.array(z.object({
    key: z.string().nullable(),
    value: z.string().nullable(),
  })),
  
  // Driver deltas from base case
  driver_deltas: z.array(z.object({
    driver_name: z.string(),
    base_value: z.union([z.number(), z.string()]).nullable(),
    scenario_value: z.union([z.number(), z.string()]).nullable(),
    delta_percent: z.number().nullable(),
  })).optional().nullable(),
  
  outputs: z.object({
    revenue: metricSchema,
    ebitda: metricSchema,
    valuation: metricSchema,
    fcf: metricSchema.optional().nullable(),  // Free cash flow
  }),
  
  // Sensitivity table
  sensitivity: z.object({
    key_driver: z.string().nullable(),
    range_low: z.number().nullable(),
    range_high: z.number().nullable(),
    valuation_at_low: z.number().nullable(),
    valuation_at_high: z.number().nullable(),
  }).optional().nullable(),
});

// === ENHANCED RISK SCHEMA - TRADABLE OBJECTS ===

const riskSchema = z.object({
  id: z.string(),
  category: z.enum(["market", "operational", "financial", "liquidity", "governance"]),
  title: z.string(),
  description: z.string(),
  severity: z.enum(["critical", "high", "medium", "low"]),
  trigger: z.string().nullable(),
  mitigation: z.string().optional().nullable(),
  
  // NEW: Impact range in financial terms
  impact_range: z.object({
    eps_impact_low: z.number().nullable(),
    eps_impact_high: z.number().nullable(),
    multiple_impact_low: z.number().nullable(),
    multiple_impact_high: z.number().nullable(),
    revenue_impact_percent: z.number().nullable(),
    probability: z.number().min(0).max(1).nullable(),
    timing: z.string().nullable(),
  }).optional().nullable(),
  
  // NEW: Leading indicators tracked weekly
  leading_indicators: z.array(z.object({
    name: z.string(),
    current_value: z.union([z.number(), z.string()]).nullable(),
    threshold: z.union([z.number(), z.string()]).nullable(),
    direction: z.enum(["above", "below", "at"]).nullable(),
    source_url: z.string().nullable(),
  })).optional().nullable(),
  
  // NEW: Tripwires that force thesis review
  tripwires: z.array(z.object({
    condition: z.string(),
    threshold: z.string().nullable(),
    action: z.enum(["review_thesis", "reduce_position", "exit", "hedge"]),
  })).optional().nullable(),
  
  // NEW: Hedge/response logic
  response: z.object({
    sizing_action: z.string().nullable(),
    hedge_instrument: z.string().nullable(),
    exit_condition: z.string().nullable(),
  }).optional().nullable(),
});

// === VALUATION MODALITIES ===

// Comp for trading comparables
const tradingCompSchema = z.object({
  company: z.string(),
  ticker: z.string().nullable(),
  business_model_match: z.number().min(0).max(100).nullable(),  // % match to target
  
  // Metric alignment
  metric_basis: z.enum(["LTM", "NTM"]).nullable(),
  metric_type: z.enum(["adjusted", "reported"]).nullable(),
  
  // Multiples
  ev_revenue: z.number().nullable(),
  ev_ebitda: z.number().nullable(),
  pe_ratio: z.number().nullable(),
  
  // Context
  revenue_growth: z.number().nullable(),
  ebitda_margin: z.number().nullable(),
  
  // Regime context
  multiple_date: z.string().nullable(),
  market_regime: z.string().nullable(),
});

const compDistributionSchema = z.object({
  metric: z.string(),
  percentile_25: z.number().nullable(),
  percentile_50: z.number().nullable(),
  percentile_75: z.number().nullable(),
  mean: z.number().nullable(),
  implied_value_at_25: z.number().nullable(),
  implied_value_at_50: z.number().nullable(),
  implied_value_at_75: z.number().nullable(),
});

// Precedent transaction
const precedentTransactionSchema = z.object({
  id: z.string(),
  target: z.string(),
  acquirer: z.string(),
  date: z.string(),
  
  // Required context
  rationale: z.string().nullable(),
  asset_quality: z.enum(["premium", "average", "distressed"]).nullable(),
  growth_profile: z.string().nullable(),
  margin_profile: z.string().nullable(),
  buyer_type: z.enum(["strategic", "financial", "consortium"]).nullable(),
  outcome_over_time: z.string().optional().nullable(),
  
  // Multiples paid
  ev_revenue: z.number().nullable(),
  ev_ebitda: z.number().nullable(),
  premium_paid: z.number().nullable(),
  
  // Applicability scoring
  applicability_score: z.number().min(0).max(100).nullable(),
  applicability_rationale: z.string().nullable(),
});

// DCF valuation
const dcfValuationSchema = z.object({
  // Revenue drivers
  revenue_drivers: z.array(driverSchema).optional().nullable(),
  
  // Margin drivers
  margin_drivers: z.array(driverSchema).optional().nullable(),
  
  // Working capital and capex
  working_capital_drivers: z.array(driverSchema).optional().nullable(),
  capex_assumptions: z.array(driverSchema).optional().nullable(),
  
  // Terminal assumptions
  terminal_growth_rate: z.number().nullable(),
  wacc: z.number().nullable(),
  
  // Outputs
  implied_value: z.number().nullable(),
  implied_value_per_share: z.number().nullable(),
  
  // Confidence
  assumptions_sourced_percent: z.number().nullable(),
  blockers: z.array(z.string()).optional().nullable(),
});

// Full valuation section
const valuationSchema = z.object({
  // Summary
  valuation_range_low: z.number().nullable(),
  valuation_range_high: z.number().nullable(),
  valuation_range_midpoint: z.number().nullable(),
  why_range_exists: z.string().nullable(),
  what_breaks_it: z.array(z.string()).optional().nullable(),
  what_moves_it_next: z.array(z.string()).optional().nullable(),
  
  // Three modalities
  dcf: dcfValuationSchema.optional().nullable(),
  
  trading_comps: z.object({
    comps: z.array(tradingCompSchema).optional().nullable(),
    distributions: z.array(compDistributionSchema).optional().nullable(),
    implied_value_range_low: z.number().nullable(),
    implied_value_range_high: z.number().nullable(),
    confidence: dataQualitySchema.optional().nullable(),
    blockers: z.array(z.string()).optional().nullable(),
  }).optional().nullable(),
  
  precedent_transactions: z.object({
    transactions: z.array(precedentTransactionSchema).optional().nullable(),
    implied_value_range_low: z.number().nullable(),
    implied_value_range_high: z.number().nullable(),
    confidence: dataQualitySchema.optional().nullable(),
    blockers: z.array(z.string()).optional().nullable(),
  }).optional().nullable(),
  
  // Method weighting
  method_weights: z.object({
    dcf: z.number().nullable(),
    trading_comps: z.number().nullable(),
    precedent_transactions: z.number().nullable(),
  }).optional().nullable(),
});

// === CHANGE TRACKING - WHAT CHANGED SINCE LAST RUN ===

const changeSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  category: z.enum(["filing", "transcript", "guidance", "price", "consensus", "regulatory", "news"]),
  
  // The change
  title: z.string(),
  description: z.string(),
  source_url: z.string().nullable(),
  
  // Thesis pillar mapping
  thesis_pillar: z.enum(["price", "path", "protection"]).nullable(),
  
  // So what and action
  so_what: z.string().nullable(),
  action: z.string().nullable(),
  
  // Impact on model
  model_impact: z.object({
    metric_affected: z.string().nullable(),
    previous_value: z.union([z.number(), z.string()]).nullable(),
    new_value: z.union([z.number(), z.string()]).nullable(),
    percent_change: z.number().nullable(),
  }).optional().nullable(),
});

// === PUBLIC MARKET METRICS (FOR PUBLIC MODE) ===

const publicMarketMetricsSchema = z.object({
  // Cash and capital
  net_cash_or_debt: metricSchema.optional().nullable(),
  buyback_capacity: metricSchema.optional().nullable(),
  sbc_percent_revenue: metricSchema.optional().nullable(),
  share_count_trend: metricSchema.optional().nullable(),
  
  // Segment data
  segment_growth: z.array(z.object({
    segment_name: z.string(),
    revenue: metricSchema.optional().nullable(),
    growth_percent: z.number().nullable(),
    margin_percent: z.number().nullable(),
  })).optional().nullable(),
  
  // Guidance and consensus
  guidance_bridge: z.object({
    metric: z.string().nullable(),
    company_guidance_low: z.number().nullable(),
    company_guidance_high: z.number().nullable(),
    consensus: z.number().nullable(),
    delta_to_consensus: z.number().nullable(),
  }).optional().nullable(),
  
  revisions_momentum: z.object({
    eps_revisions_30d: z.number().nullable(),
    revenue_revisions_30d: z.number().nullable(),
    direction: z.enum(["up", "down", "flat"]).nullable(),
  }).optional().nullable(),
  
  // Factor exposure
  factor_exposure: z.array(z.object({
    factor: z.string(),
    exposure: z.number().nullable(),
  })).optional().nullable(),
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
    version: z.string().optional().nullable(),  // For versioning
    previous_run_id: z.string().optional().nullable(),  // Link to previous run
  }),
  
  // NEW: What changed since last run (top of dashboard)
  changes_since_last_run: z.array(changeSchema).optional().nullable(),

  // Executive summary
  executive_summary: z.object({
    headline: z.string(),
    key_facts: z.array(z.string()),
    implications: z.array(z.string()),
    key_risks: z.array(z.string()),
    thesis_status: z.enum(["intact", "challenged", "broken"]),
  }),

  // Core financials - only revenue and ebitda have history
  financials: z.object({
    revenue: metricWithHistorySchema,
    revenue_growth: z.object({ current: metricSchema }),
    ebitda: metricWithHistorySchema,
    ebitda_margin: z.object({ current: metricSchema }),
    free_cash_flow: z.object({ current: metricSchema }),
  }),

  // Market data (public mode) - stock_price and volume have history
  market_data: z.object({
    stock_price: metricWithHistorySchema,
    volume: metricWithHistorySchema,
    market_cap: z.object({ current: metricSchema }),
    pe_ratio: z.object({ current: metricSchema }).optional(),
    ev_ebitda: z.object({ current: metricSchema }).optional(),
    target_price: z.object({ current: metricSchema }).optional(),
  }).optional(),
  
  // NEW: Public market metrics (replaces private_data for public mode)
  public_market_metrics: publicMarketMetricsSchema.optional().nullable(),

  // Private data (private mode only) - hidden in public mode
  private_data: z.object({
    valuation_mark: z.object({ current: metricSchema }),
    net_leverage: z.object({ current: metricSchema }),
    liquidity_runway: z.object({ current: metricSchema }),
    covenant_headroom: z.object({ current: metricSchema }).optional(),
  }).optional(),

  // NEW: Valuation as an engine
  valuation: valuationSchema.optional().nullable(),

  // Hypotheses (replaces ai_insights with predictions)
  hypotheses: z.array(hypothesisSchema).optional().nullable(),
  
  // Legacy AI insights for backward compatibility
  ai_insights: z.array(hypothesisSchema).optional().nullable(),

  // Events timeline
  events: z.array(eventSchema),

  // Scenarios (now driver-based)
  scenarios: z.array(scenarioSchema),

  // Risks (now tradable objects)
  risks: z.array(riskSchema),

  // Data sources
  sources: z.array(z.object({
    name: z.string(),
    type: z.enum(["primary", "secondary"]),
    last_refresh: z.string(),
  })),
  
  // Overall data quality for the run
  run_data_quality: dataQualitySchema.optional().nullable(),
});

// Type exports
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
export type AIInsight = z.infer<typeof hypothesisSchema>;  // Alias for backward compatibility
export type Event = z.infer<typeof eventSchema>;
export type Scenario = z.infer<typeof scenarioSchema>;
export type Risk = z.infer<typeof riskSchema>;
export type Driver = z.infer<typeof driverSchema>;
export type DataQuality = z.infer<typeof dataQualitySchema>;
export type MetricDefinition = z.infer<typeof metricDefinitionSchema>;
export type SourceReference = z.infer<typeof sourceReferenceSchema>;
export type Change = z.infer<typeof changeSchema>;
export type Valuation = z.infer<typeof valuationSchema>;
export type DCFValuation = z.infer<typeof dcfValuationSchema>;
export type TradingComp = z.infer<typeof tradingCompSchema>;
export type PrecedentTransaction = z.infer<typeof precedentTransactionSchema>;
export type PublicMarketMetrics = z.infer<typeof publicMarketMetricsSchema>;
