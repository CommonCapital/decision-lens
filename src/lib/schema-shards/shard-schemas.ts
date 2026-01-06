import { z } from "zod";

// === SHARED PRIMITIVES ===

const sourceReferenceSchema = z.object({
  url: z.string().nullable().optional(),
  document_type: z.string().nullable().optional(),
  excerpt: z.string().nullable().optional(),
  accessed_at: z.string().nullable().optional(),
}).nullable().optional();

const dataQualitySchema = z.object({
  coverage: z.number().nullable().optional(),
  auditability: z.number().nullable().optional(),
  freshness_days: z.number().nullable().optional(),
}).nullable().optional();

const metricDefinitionSchema = z.object({
  metric_name: z.string().nullable().optional(),
  period: z.string().nullable().optional(),
  basis: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
}).nullable().optional();

const decisionContextSchema = z.object({
  confidence_level: z.string().nullable().optional(),
  sufficiency_status: z.string().nullable().optional(),
  knowns: z.array(z.string()).nullable().optional(),
  unknowns: z.array(z.string()).nullable().optional(),
  what_changes_conclusion: z.array(z.string()).nullable().optional(),
}).nullable().optional();

const metricSchema = z.object({
  value: z.union([z.number(), z.string()]).nullable().optional(),
  formatted: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  source_reference: sourceReferenceSchema,
  tie_out_status: z.string().nullable().optional(),
  last_updated: z.string().nullable().optional(),
  availability: z.string().nullable().optional(),
  unavailable_reason: z.string().nullable().optional(),
  confidence: z.number().nullable().optional(),
  data_quality: dataQualitySchema,
  decision_context: decisionContextSchema,
  definition: metricDefinitionSchema,
}).nullable().optional();

const atomicValueSchema = z.object({
  value: z.number().nullable().optional(),
  formatted: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  source_reference: sourceReferenceSchema,
}).nullable().optional();

// ============================================
// SHARD 1: CORE METADATA
// ============================================
export const coreMetadataShardSchema = z.object({
  company_type: z.enum(["public", "private"]),
  run_metadata: z.object({
    run_id: z.string().nullable().optional(),
    entity: z.string().nullable().optional(),
    ticker: z.string().nullable().optional(),
    timestamp: z.string().nullable().optional(),
    owner: z.string().nullable().optional(),
  }).nullable().optional(),
});

export type CoreMetadataShard = z.infer<typeof coreMetadataShardSchema>;

// ============================================
// SHARD 2: BASE METRICS
// ============================================
const ebitdaAvailabilitySchema = z.enum(["reported", "proxy", "not_applicable"]);

export const baseMetricsShardSchema = z.object({
  base_metrics: z.object({
    // Market / Price Base
    market_cap: z.number().nullable().optional(),
    stock_price: z.number().nullable().optional(),
    shares_outstanding: z.number().nullable().optional(),
    
    // Balance Sheet
    total_debt: z.number().nullable().optional(),
    preferred_stock: z.number().nullable().optional(),
    minority_interest: z.number().nullable().optional(),
    cash: z.number().nullable().optional(),
    marketable_securities: z.number().nullable().optional(),
    current_assets: z.number().nullable().optional(),
    current_liabilities: z.number().nullable().optional(),
    accounts_receivable: z.number().nullable().optional(),
    
    // Income Statement (Quarterly)
    revenue: z.number().nullable().optional(),
    revenue_prior: z.number().nullable().optional(),
    gross_profit: z.number().nullable().optional(),
    operating_income: z.number().nullable().optional(),
    depreciation_amortization: z.number().nullable().optional(),
    interest_expense: z.number().nullable().optional(),
    
    // Income Statement (TTM)
    revenue_ttm: z.number().nullable().optional(),
    ebitda_ttm: z.number().nullable().optional(),
    gross_profit_ttm: z.number().nullable().optional(),
    operating_income_ttm: z.number().nullable().optional(),
    
    // EBITDA (dual structure)
    ebitda_reported: z.number().nullable().optional(),
    ebitda_proxy: z.number().nullable().optional(),
    ebitda_availability: ebitdaAvailabilitySchema.nullable().optional(),
    
    // Cash Flow
    free_cash_flow: z.number().nullable().optional(),
    net_burn: z.number().nullable().optional(),
    
    // Operational
    headcount: z.number().nullable().optional(),
    rd_spend: z.number().nullable().optional(),
    sm_spend: z.number().nullable().optional(),
    sm_spend_prior: z.number().nullable().optional(),
    
    // SaaS / Subscription
    arr: z.number().nullable().optional(),
    arr_prior: z.number().nullable().optional(),
    new_arr: z.number().nullable().optional(),
    expansion_arr: z.number().nullable().optional(),
    contraction_arr: z.number().nullable().optional(),
    churned_arr: z.number().nullable().optional(),
    monthly_churn_percent: z.number().nullable().optional(),
    cac: z.number().nullable().optional(),
    ltv: z.number().nullable().optional(),
    arpa: z.number().nullable().optional(),
    gross_margin_percent: z.number().nullable().optional(),
    average_customer_lifespan_months: z.number().nullable().optional(),
    
    // Customer Metrics
    customer_count: z.number().nullable().optional(),
    top_customer_revenue_percent: z.number().nullable().optional(),
    top_3_customer_revenue_percent: z.number().nullable().optional(),
    top_10_customer_revenue_percent: z.number().nullable().optional(),
    
    // Supplier Concentration
    top_supplier_spend_percent: z.number().nullable().optional(),
    top_5_supplier_spend_percent: z.number().nullable().optional(),
  }).nullable().optional(),
});

export type BaseMetricsShard = z.infer<typeof baseMetricsShardSchema>;

// ============================================
// SHARD 3: TIME SERIES
// ============================================
const quarterlySeriesSchema = z.object({
  Q1: z.number().nullable().optional(),
  Q2: z.number().nullable().optional(),
  Q3: z.number().nullable().optional(),
  Q4: z.number().nullable().optional(),
}).nullable().optional();

const horizonStatsSchema = z.object({
  quarters: quarterlySeriesSchema,
  high: z.number().nullable().optional(),
  low: z.number().nullable().optional(),
  average: z.number().nullable().optional(),
  volatility: z.number().nullable().optional(),
  change_percent: z.number().nullable().optional(),
}).nullable().optional();

const timeSeriesMetricSchema = z.object({
  horizons: z.object({
    "1D": horizonStatsSchema,
    "1W": horizonStatsSchema,
    "1M": horizonStatsSchema,
    "1Y": horizonStatsSchema,
    "5Y": horizonStatsSchema,
    "10Y": horizonStatsSchema,
  }).nullable().optional(),
  availability: z.string().nullable().optional(),
  unavailable_reason: z.string().nullable().optional(),
  confidence: z.number().nullable().optional(),
  data_quality: dataQualitySchema,
  source: z.string().nullable().optional(),
  decision_context: decisionContextSchema,
}).nullable().optional();

const changeSchema = z.object({
  id: z.string().nullable().optional(),
  timestamp: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  source_url: z.string().nullable().optional(),
  thesis_pillar: z.string().nullable().optional(),
  so_what: z.string().nullable().optional(),
  action: z.string().nullable().optional(),
}).nullable().optional();

export const timeSeriesShardSchema = z.object({
  time_series: z.object({
    stock_price: timeSeriesMetricSchema,
    revenue: timeSeriesMetricSchema,
    ebitda: timeSeriesMetricSchema,
    volume: timeSeriesMetricSchema,
  }).nullable().optional(),
  changes_since_last_run: z.array(changeSchema).nullable().optional(),
});

export type TimeSeriesShard = z.infer<typeof timeSeriesShardSchema>;

// ============================================
// SHARD 4: EXECUTIVE
// ============================================
const hypothesisSchema = z.object({
  id: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  details: z.string().nullable().optional(),
  assumptions: z.array(z.string()).nullable().optional(),
  falsification_criteria: z.array(z.string()).nullable().optional(),
  confidence_band: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  generated_at: z.string().nullable().optional(),
  horizon_relevance: z.array(z.string()).nullable().optional(),
  impact_score: z.number().nullable().optional(),
  action_required: z.boolean().nullable().optional(),
}).nullable().optional();

export const executiveShardSchema = z.object({
  executive_summary: z.object({
    headline: z.string().nullable().optional(),
    key_facts: z.array(z.string()).nullable().optional(),
    implications: z.array(z.string()).nullable().optional(),
    key_risks: z.array(z.string()).nullable().optional(),
    thesis_status: z.string().nullable().optional(),
  }).nullable().optional(),
  hypotheses: z.array(hypothesisSchema).nullable().optional(),
  ai_insights: z.array(hypothesisSchema).nullable().optional(),
});

export type ExecutiveShard = z.infer<typeof executiveShardSchema>;

// ============================================
// SHARD 5: VALUATION
// ============================================
const formulaInputSchema = z.object({
  name: z.string().nullable().optional(),
  value: z.union([z.number(), z.string()]).nullable().optional(),
  source: z.string().nullable().optional(),
  source_reference: sourceReferenceSchema,
}).nullable().optional();

const scenarioOutputMetricSchema = z.object({
  value: z.union([z.number(), z.string()]).nullable().optional(),
  formatted: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  formula: z.string().nullable().optional(),
  formula_inputs: z.array(formulaInputSchema).nullable().optional(),
  period: z.string().nullable().optional(),
  source_reference: sourceReferenceSchema,
}).nullable().optional();

const scenarioDriverSchema = z.object({
  name: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  value: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  source_reference: sourceReferenceSchema,
}).nullable().optional();

const scenarioAssumptionSchema = z.object({
  key: z.string().nullable().optional(),
  value: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  source_reference: sourceReferenceSchema,
}).nullable().optional();

const singleScenarioSchema = z.object({
  probability: z.number().nullable().optional(),
  assumptions: z.array(scenarioAssumptionSchema).nullable().optional(),
  drivers: z.array(scenarioDriverSchema).nullable().optional(),
  outputs: z.object({
    revenue: scenarioOutputMetricSchema,
    ebitda: scenarioOutputMetricSchema,
    valuation: scenarioOutputMetricSchema,
  }).nullable().optional(),
}).nullable().optional();

export const valuationShardSchema = z.object({
  valuation: z.object({
    valuation_range_low: z.number().nullable().optional(),
    valuation_range_high: z.number().nullable().optional(),
    valuation_range_midpoint: z.number().nullable().optional(),
    why_range_exists: z.string().nullable().optional(),
    
    dcf: z.object({
      terminal_growth_rate: atomicValueSchema,
      wacc: atomicValueSchema,
      implied_value: atomicValueSchema,
      implied_value_per_share: atomicValueSchema,
      source: z.string().nullable().optional(),
      source_reference: sourceReferenceSchema,
      methodology: z.string().nullable().optional(),
    }).nullable().optional(),
    
    trading_comps: z.object({
      implied_value_range_low: atomicValueSchema,
      implied_value_range_high: atomicValueSchema,
      peer_set: z.array(z.string()).nullable().optional(),
      multiple_used: z.string().nullable().optional(),
      source: z.string().nullable().optional(),
      source_reference: sourceReferenceSchema,
      confidence: dataQualitySchema,
    }).nullable().optional(),
    
    precedent_transactions: z.object({
      implied_value_range_low: atomicValueSchema,
      implied_value_range_high: atomicValueSchema,
      transactions: z.array(z.object({
        name: z.string().nullable().optional(),
        date: z.string().nullable().optional(),
        multiple: z.number().nullable().optional(),
      })).nullable().optional(),
      source: z.string().nullable().optional(),
      source_reference: sourceReferenceSchema,
      confidence: dataQualitySchema,
    }).nullable().optional(),
  }).nullable().optional(),
  
  scenarios: z.object({
    base: singleScenarioSchema.optional().nullable(),
    downside: singleScenarioSchema.optional().nullable(),
    upside: singleScenarioSchema.optional().nullable(),
  }).optional().nullable(),
});

export type ValuationShard = z.infer<typeof valuationShardSchema>;

// ============================================
// SHARD 6: RISKS & EVENTS
// ============================================
const eventSchema = z.object({
  id: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  impact: z.string().nullable().optional(),
  source_url: z.string().nullable().optional(),
}).nullable().optional();

const riskItemSchema = z.object({
  id: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  severity: z.string().nullable().optional(),
  probability: z.number().nullable().optional(),
  trigger: z.string().nullable().optional(),
  trigger_metric: z.string().nullable().optional(),
  mitigation: z.string().nullable().optional(),
  mitigation_action: z.string().nullable().optional(),
  status: z.enum(["Active", "Monitoring", "Resolved"]).nullable().optional(),
  source: z.string().nullable().optional(),
  source_reference: sourceReferenceSchema,
}).nullable().optional();

const pathIndicatorSchema = z.object({
  label: z.string().nullable().optional(),
  value: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  next_check: z.string().nullable().optional(),
}).nullable().optional();

export const risksEventsShardSchema = z.object({
  risks: z.object({
    regulatory: z.array(riskItemSchema),
    market: z.array(riskItemSchema),
    operational: z.array(riskItemSchema),
    cybersecurity: z.array(riskItemSchema),
    financial: z.array(riskItemSchema),
    strategic: z.array(riskItemSchema),
  }).nullable().optional(),
  events: z.array(eventSchema).nullable().optional(),
  path_indicators: z.array(pathIndicatorSchema).nullable().optional(),
  kill_switch: z.object({
    conditions: z.array(z.string()).nullable().optional(),
  }).nullable().optional(),
});

export type RisksEventsShard = z.infer<typeof risksEventsShardSchema>;

// ============================================
// SHARD 7: PUBLIC MARKET
// ============================================
export const publicMarketShardSchema = z.object({
  net_cash_or_debt: metricSchema,
  buyback_capacity: metricSchema,
  sbc_percent_revenue: metricSchema,
  share_count_trend: metricSchema,
  
  segments: z.array(z.object({
    name: z.string().nullable().optional(),
    revenue: metricSchema,
    growth: metricSchema,
    margin: metricSchema,
  })).nullable().optional(),
  
  guidance_bridge: z.object({
    low: atomicValueSchema,
    high: atomicValueSchema,
    current_consensus: atomicValueSchema,
    gap_percent: atomicValueSchema,
    source: z.string().nullable().optional(),
    source_reference: sourceReferenceSchema,
    last_updated: z.string().nullable().optional(),
  }).nullable().optional(),
  
  revisions_momentum: z.object({
    direction: z.string().nullable().optional(),
    magnitude: atomicValueSchema,
    trend: z.string().nullable().optional(),
    source: z.string().nullable().optional(),
    source_reference: sourceReferenceSchema,
    last_updated: z.string().nullable().optional(),
  }).nullable().optional(),
  
  position_sizing: z.object({
    current_percent: z.number().nullable().optional(),
    max_percent: z.number().nullable().optional(),
    target_low: z.number().nullable().optional(),
    target_high: z.number().nullable().optional(),
  }).nullable().optional(),
  
  variant_view: z.object({
    summary: z.string().nullable().optional(),
    sensitivity: z.array(z.object({
      label: z.string().nullable().optional(),
      impact: z.string().nullable().optional(),
    })).nullable().optional(),
  }).nullable().optional(),
});

export type PublicMarketShard = z.infer<typeof publicMarketShardSchema>;

// ============================================
// SHARD MAP
// ============================================
export const SHARD_SCHEMAS = {
  core_metadata: coreMetadataShardSchema,
  base_metrics: baseMetricsShardSchema,
  time_series: timeSeriesShardSchema,
  executive: executiveShardSchema,
  valuation: valuationShardSchema,
  risks_events: risksEventsShardSchema,
  public_market: publicMarketShardSchema,
} as const;

export type ShardSchemaMap = typeof SHARD_SCHEMAS;
