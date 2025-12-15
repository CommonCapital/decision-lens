import { z } from "zod";

// === SIMPLIFIED CORE TYPES ===

// Tie-out status for reconciliation
const tieOutStatusSchema = z.enum(["final", "provisional", "flagged"]);

// Simplified metric with essential provenance
const metricSchema = z.object({
  value: z.union([z.number(), z.string()]),
  formatted: z.string(),
  unit: z.string().optional(),
  source: z.string(),
  tie_out_status: tieOutStatusSchema,
  last_updated: z.string(),
});

// Event in timeline
const eventSchema = z.object({
  id: z.string(),
  date: z.string(),
  type: z.enum(["earnings", "filing", "guidance", "corporate_action", "news", "analyst_update"]),
  title: z.string(),
  description: z.string(),
  impact: z.enum(["positive", "negative", "neutral"]),
  source_url: z.string().optional(),
});

// Scenario definition
const scenarioSchema = z.object({
  name: z.enum(["base", "downside", "upside"]),
  probability: z.number().min(0).max(1),
  assumptions: z.array(z.object({
    key: z.string(),
    value: z.string(),
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
  trigger: z.string(),
  mitigation: z.string().optional(),
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

  // Core financials
  financials: z.object({
    revenue: metricSchema,
    revenue_growth: metricSchema,
    ebitda: metricSchema,
    ebitda_margin: metricSchema,
    free_cash_flow: metricSchema,
  }),

  // Market data (public mode)
  market_data: z.object({
    stock_price: metricSchema,
    market_cap: metricSchema,
    pe_ratio: metricSchema.optional(),
    ev_ebitda: metricSchema.optional(),
    target_price: metricSchema.optional(),
  }).optional(),

  // Private data (private mode)
  private_data: z.object({
    valuation_mark: metricSchema,
    net_leverage: metricSchema,
    liquidity_runway: metricSchema,
    covenant_headroom: metricSchema.optional(),
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
export type TieOutStatus = z.infer<typeof tieOutStatusSchema>;
export type Event = z.infer<typeof eventSchema>;
export type Scenario = z.infer<typeof scenarioSchema>;
export type Risk = z.infer<typeof riskSchema>;
