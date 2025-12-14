import { z } from "zod";

// Evidence schema for audit trail
const evidenceSchema = z.object({
  source: z.string(),
  url: z.string().optional(),
  timestamp: z.string(),
  confidence: z.number().min(0).max(1),
});

// Tie-out status for reconciliation
const tieOutStatusSchema = z.enum(["final", "provisional", "flagged", "overridden"]);

// Metric with full provenance
const metricSchema = z.object({
  value: z.union([z.number(), z.string()]),
  formatted: z.string(),
  unit: z.string().optional(),
  primary_source: z.string(),
  secondary_sources: z.array(z.string()).optional(),
  tie_out_method: z.string(),
  tolerance_threshold: z.string().optional(),
  tie_out_status: tieOutStatusSchema,
  owner: z.string(),
  reviewer: z.string().optional(),
  last_updated: z.string(),
  override_justification: z.string().optional(),
  evidence: z.array(evidenceSchema).optional(),
});

// Change log entry
const changeLogSchema = z.object({
  field: z.string(),
  prior_value: z.string(),
  new_value: z.string(),
  rationale: z.string(),
  editor: z.string(),
  timestamp: z.string(),
});

// Event in timeline
const eventSchema = z.object({
  id: z.string(),
  date: z.string(),
  type: z.enum([
    "earnings",
    "filing",
    "guidance",
    "corporate_action",
    "news",
    "analyst_update",
    "covenant_test",
    "valuation_mark",
    "refinancing",
    "board_meeting",
  ]),
  title: z.string(),
  description: z.string(),
  impact: z.enum(["positive", "negative", "neutral", "mixed"]),
  source_url: z.string().optional(),
  evidence: z.array(evidenceSchema),
});

// Scenario definition
const scenarioSchema = z.object({
  name: z.enum(["base", "downside", "upside"]),
  probability: z.number().min(0).max(1),
  assumptions: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
      rationale: z.string(),
    })
  ),
  outputs: z.object({
    revenue: metricSchema,
    ebitda: metricSchema,
    valuation: metricSchema,
    covenant_headroom: metricSchema.optional(),
    liquidity_runway: metricSchema.optional(),
  }),
});

// Risk/breakpoint definition
const riskSchema = z.object({
  id: z.string(),
  category: z.enum([
    "market",
    "operational",
    "financial",
    "covenant",
    "liquidity",
    "refinancing",
    "governance",
  ]),
  title: z.string(),
  description: z.string(),
  trigger_condition: z.string(),
  current_distance: z.string(),
  severity: z.enum(["critical", "high", "medium", "low"]),
  watch_metrics: z.array(z.string()),
  mitigation: z.string().optional(),
});

// Public mode specific data
const publicModeDataSchema = z.object({
  stock_price: metricSchema,
  volume: metricSchema,
  volatility: metricSchema,
  market_cap: metricSchema,
  pe_ratio: metricSchema.optional(),
  ev_ebitda: metricSchema.optional(),
  benchmark_performance: z.object({
    vs_index: metricSchema,
    vs_peers: metricSchema,
  }),
  consensus_estimates: z.object({
    revenue: metricSchema,
    eps: metricSchema,
    revisions_30d: z.object({
      up: z.number(),
      down: z.number(),
      unchanged: z.number(),
    }),
  }),
  analyst_ratings: z.object({
    buy: z.number(),
    hold: z.number(),
    sell: z.number(),
    target_price: metricSchema,
  }),
});

// Private mode specific data
const privateModeDataSchema = z.object({
  valuation_mark: metricSchema,
  valuation_methodology: z.string(),
  budget_vs_actual: z.object({
    revenue_variance: metricSchema,
    ebitda_variance: metricSchema,
  }),
  lender_model_variance: metricSchema.optional(),
  covenant_metrics: z.array(
    z.object({
      name: z.string(),
      current_value: metricSchema,
      threshold: z.string(),
      headroom: metricSchema,
      next_test_date: z.string(),
      breach_risk: z.enum(["none", "low", "medium", "high", "imminent"]),
    })
  ),
  liquidity: z.object({
    cash: metricSchema,
    revolver_availability: metricSchema,
    runway_months: metricSchema,
  }),
  capital_structure: z.object({
    total_debt: metricSchema,
    net_leverage: metricSchema,
    interest_coverage: metricSchema,
    maturity_profile: z.array(
      z.object({
        year: z.number(),
        amount: z.number(),
        instrument: z.string(),
      })
    ),
  }),
  refinancing_risk: z.enum(["none", "low", "medium", "high", "critical"]),
});

// Main investor dashboard schema
export const investorDashboardSchema = z.object({
  // Run metadata (immutable)
  run_metadata: z.object({
    run_id: z.string(),
    entity: z.string(),
    entity_ticker: z.string().optional(),
    mode: z.enum(["public", "private"]),
    scenario: z.enum(["base", "downside", "upside"]),
    data_cut_timestamp: z.string(),
    owner: z.string(),
    reviewer: z.string(),
    publisher: z.string().optional(),
    status: z.enum(["draft", "reviewed", "published"]),
    immutable_hash: z.string(),
  }),

  // What changed since last run
  delta_summary: z.object({
    prior_run_id: z.string().optional(),
    new_events: z.array(z.string()),
    assumption_deltas: z.array(changeLogSchema),
    metric_revisions: z.array(
      z.object({
        metric: z.string(),
        prior: z.string(),
        current: z.string(),
        change_pct: z.number().optional(),
      })
    ),
    status_changes: z.array(
      z.object({
        metric: z.string(),
        from: tieOutStatusSchema,
        to: tieOutStatusSchema,
      })
    ),
  }),

  // Executive summary
  executive_summary: z.object({
    headline: z.string(),
    key_facts: z.array(z.string()),
    implications: z.array(z.string()),
    key_risks: z.array(z.string()),
    decisions_required: z.array(z.string()),
    investment_thesis_status: z.enum(["intact", "challenged", "broken"]),
  }),

  // Core financials (mode-agnostic)
  financials: z.object({
    revenue: metricSchema,
    revenue_growth: metricSchema,
    gross_margin: metricSchema,
    ebitda: metricSchema,
    ebitda_margin: metricSchema,
    free_cash_flow: metricSchema,
    capex: metricSchema.optional(),
  }),

  // Mode-specific data
  public_data: publicModeDataSchema.optional(),
  private_data: privateModeDataSchema.optional(),

  // Events timeline
  events: z.array(eventSchema),

  // Scenarios
  scenarios: z.array(scenarioSchema),

  // Risks and breakpoints
  risks: z.array(riskSchema),

  // Data lineage
  data_lineage: z.object({
    sources: z.array(
      z.object({
        name: z.string(),
        type: z.enum(["primary", "secondary", "derived"]),
        last_refresh: z.string(),
        next_refresh: z.string().optional(),
        owner: z.string(),
      })
    ),
    reconciliation_log: z.array(
      z.object({
        metric: z.string(),
        sources_compared: z.array(z.string()),
        variance: z.string(),
        resolution: z.string(),
        timestamp: z.string(),
      })
    ),
  }),
});

// Type exports
export type InvestorDashboard = z.infer<typeof investorDashboardSchema>;
export type RunMetadata = InvestorDashboard["run_metadata"];
export type DeltaSummary = InvestorDashboard["delta_summary"];
export type ExecutiveSummary = InvestorDashboard["executive_summary"];
export type Metric = z.infer<typeof metricSchema>;
export type TieOutStatus = z.infer<typeof tieOutStatusSchema>;
export type Event = z.infer<typeof eventSchema>;
export type Scenario = z.infer<typeof scenarioSchema>;
export type Risk = z.infer<typeof riskSchema>;
export type PublicModeData = z.infer<typeof publicModeDataSchema>;
export type PrivateModeData = z.infer<typeof privateModeDataSchema>;
export type ChangeLog = z.infer<typeof changeLogSchema>;
