import { InvestorDashboard, Metric, MetricWithHistory, TimeSeriesMetric, AIInsight } from "./investor-schema";

function createSimpleMetric(metric: Metric): { current: Metric } {
  return { current: metric };
}

function createMetricWithHistory(current: Metric, history: TimeSeriesMetric | null): MetricWithHistory {
  return { current, history };
}

const stockPriceHistory: TimeSeriesMetric = {
  horizons: {
    "1D": { quarters: { Q1: 126.20, Q2: 126.85, Q3: 127.10, Q4: 127.45 }, high: 127.80, low: 125.90, average: 126.90, volatility: 1.2, change_percent: 0.99 },
    "1W": { quarters: { Q1: 124.50, Q2: 125.30, Q3: 126.40, Q4: 127.45 }, high: 128.20, low: 123.80, average: 125.86, volatility: 2.8, change_percent: 2.37 },
    "1M": { quarters: { Q1: 118.90, Q2: 121.45, Q3: 124.60, Q4: 127.45 }, high: 128.50, low: 117.20, average: 123.10, volatility: 5.4, change_percent: 7.19 },
    "1Y": { quarters: { Q1: 98.20, Q2: 108.45, Q3: 118.90, Q4: 127.45 }, high: 129.80, low: 94.50, average: 113.25, volatility: 18.5, change_percent: 29.79 },
    "5Y": { quarters: { Q1: 52.30, Q2: 72.80, Q3: 98.20, Q4: 127.45 }, high: 129.80, low: 48.20, average: 87.69, volatility: 42.8, change_percent: 143.69 },
    "10Y": { quarters: { Q1: 24.50, Q2: 38.90, Q3: 68.40, Q4: 127.45 }, high: 129.80, low: 22.10, average: 64.81, volatility: 68.5, change_percent: 420.20 },
  },
  availability: "available",
  confidence: 98,
  source: "Bloomberg",
};

const revenueHistory: TimeSeriesMetric = {
  horizons: {
    "1D": null,
    "1W": null,
    "1M": { quarters: { Q1: 285000000, Q2: 289000000, Q3: 294000000, Q4: 297000000 }, high: 297000000, low: 285000000, average: 291250000, volatility: 2.8, change_percent: 4.21 },
    "1Y": { quarters: { Q1: 795000000, Q2: 834000000, Q3: 868000000, Q4: 892000000 }, high: 892000000, low: 795000000, average: 847250000, volatility: 6.2, change_percent: 12.20 },
    "5Y": { quarters: { Q1: 520000000, Q2: 628000000, Q3: 752000000, Q4: 892000000 }, high: 892000000, low: 520000000, average: 698000000, volatility: 24.5, change_percent: 71.54 },
    "10Y": { quarters: { Q1: 245000000, Q2: 385000000, Q3: 580000000, Q4: 892000000 }, high: 892000000, low: 245000000, average: 525500000, volatility: 52.8, change_percent: 264.08 },
  },
  availability: "available",
  confidence: 95,
  source: "SEC Filings",
};

const ebitdaHistory: TimeSeriesMetric = {
  horizons: {
    "1D": null,
    "1W": null,
    "1M": { quarters: { Q1: 70000000, Q2: 72000000, Q3: 74000000, Q4: 74000000 }, high: 74000000, low: 70000000, average: 72500000, volatility: 3.1, change_percent: 5.71 },
    "1Y": { quarters: { Q1: 185000000, Q2: 198000000, Q3: 212000000, Q4: 224000000 }, high: 224000000, low: 185000000, average: 204750000, volatility: 9.8, change_percent: 21.08 },
    "5Y": { quarters: { Q1: 95000000, Q2: 132000000, Q3: 168000000, Q4: 224000000 }, high: 224000000, low: 95000000, average: 154750000, volatility: 35.2, change_percent: 135.79 },
    "10Y": { quarters: { Q1: 42000000, Q2: 78000000, Q3: 138000000, Q4: 224000000 }, high: 224000000, low: 42000000, average: 120500000, volatility: 62.4, change_percent: 433.33 },
  },
  availability: "available",
  confidence: 92,
  source: "Management Reconciliation",
};

const volumeHistory: TimeSeriesMetric = {
  horizons: {
    "1D": { quarters: { Q1: 1200000, Q2: 1450000, Q3: 1380000, Q4: 1520000 }, high: 2100000, low: 980000, average: 1387500, volatility: 28.5, change_percent: 26.67 },
    "1W": { quarters: { Q1: 6800000, Q2: 7200000, Q3: 7800000, Q4: 8100000 }, high: 9500000, low: 5800000, average: 7475000, volatility: 22.4, change_percent: 19.12 },
    "1M": { quarters: { Q1: 28000000, Q2: 31000000, Q3: 34000000, Q4: 36000000 }, high: 42000000, low: 24000000, average: 32250000, volatility: 18.6, change_percent: 28.57 },
    "1Y": { quarters: { Q1: 320000000, Q2: 358000000, Q3: 392000000, Q4: 425000000 }, high: 480000000, low: 280000000, average: 373750000, volatility: 25.2, change_percent: 32.81 },
    "5Y": { quarters: { Q1: 180000000, Q2: 245000000, Q3: 320000000, Q4: 425000000 }, high: 520000000, low: 150000000, average: 292500000, volatility: 45.8, change_percent: 136.11 },
    "10Y": { quarters: { Q1: 85000000, Q2: 142000000, Q3: 248000000, Q4: 425000000 }, high: 520000000, low: 68000000, average: 225000000, volatility: 68.2, change_percent: 400.00 },
  },
  availability: "available",
  confidence: 96,
  source: "Bloomberg",
};

const hypotheses: AIInsight[] = [
  { id: "ai-1", type: "alert", confidence_band: "high", title: "Unusual Volume Detected", summary: "Trading volume 2.3x above 20-day average.", source: "Volume Analysis", generated_at: "2024-12-14T09:00:00Z", horizon_relevance: ["1D", "1W"], impact_score: 0.4, action_required: false },
  { id: "ai-2", type: "hypothesis", confidence_band: "medium", title: "Price Momentum Building", summary: "7-day RSI indicates bullish momentum.", source: "Technical Analysis", generated_at: "2024-12-14T09:00:00Z", horizon_relevance: ["1W", "1M"], impact_score: 0.35, action_required: false },
  { id: "ai-3", type: "analysis", confidence_band: "high", title: "Earnings Catalyst Approaching", summary: "Q4 earnings in 23 days. Consensus revisions trending positive.", source: "Earnings Analysis", generated_at: "2024-12-14T09:00:00Z", horizon_relevance: ["1M"], impact_score: 0.6, action_required: true },
  { id: "ai-4", type: "hypothesis", confidence_band: "medium", title: "Sector Rotation Tailwind", summary: "Macro cycle analysis suggests industrials outperformance.", source: "Macro Analysis", generated_at: "2024-12-14T09:00:00Z", horizon_relevance: ["1Y"], impact_score: 0.45, action_required: false },
  { id: "ai-5", type: "analysis", confidence_band: "medium", title: "Competitive Moat Assessment", summary: "Market share gains sustainable. IP portfolio widening.", source: "Competitive Intelligence", generated_at: "2024-12-14T09:00:00Z", horizon_relevance: ["5Y", "10Y"], impact_score: 0.7, action_required: false },
];

const createBaseMetric = (value: number | string, formatted: string, source: string): Metric => ({
  value, formatted, source, tie_out_status: "final", last_updated: "2024-12-14T08:00:00Z", confidence: 95, availability: "available",
});

export const mockDashboardData: InvestorDashboard = {
  run_metadata: { run_id: "RUN-2024-1214-001", entity: "Meridian Holdings Corp", ticker: "MHC", mode: "public", timestamp: "2024-12-14T09:00:00Z", owner: "Sarah Chen, CFA" },
  
  changes_since_last_run: [
    { id: "CHG-001", timestamp: "2024-12-12T16:00:00Z", category: "filing", title: "Q3 10-Q Filed with Raised Guidance", description: "Company raised FY24 revenue guidance.", source_url: "https://sec.gov/...", thesis_pillar: "path", so_what: "Confirms operational momentum.", action: "Update model assumptions" },
    { id: "CHG-002", timestamp: "2024-12-11T09:30:00Z", category: "price", title: "Stock +7.2% on Guidance Beat", description: "Stock rallied post-earnings.", source_url: null, thesis_pillar: "price", so_what: "Valuation gap narrowing.", action: "Trim position sizing" },
  ],

  executive_summary: {
    headline: "Investment thesis strengthening: operational execution exceeding plan",
    key_facts: ["Q3 revenue of $892M beat consensus by 4.2%", "EBITDA margin expanded 80bps YoY to 25.1%", "FY24 guidance raised"],
    implications: ["Valuation upside of 12-18% in base case", "Market share gains accelerating"],
    key_risks: ["Customer concentration: top 3 = 34% of revenue", "Management succession uncertainty"],
    thesis_status: "intact",
  },

  financials: {
    revenue: createMetricWithHistory(createBaseMetric(892000000, "$892M", "10-Q Filing"), revenueHistory),
    revenue_growth: createSimpleMetric(createBaseMetric(9.2, "9.2%", "Calculated")),
    ebitda: createMetricWithHistory(createBaseMetric(224000000, "$224M", "10-Q Filing"), ebitdaHistory),
    ebitda_margin: createSimpleMetric(createBaseMetric(25.1, "25.1%", "Calculated")),
    free_cash_flow: createSimpleMetric(createBaseMetric(158000000, "$158M", "Calculated")),
  },

  market_data: {
    stock_price: createMetricWithHistory(createBaseMetric(127.45, "$127.45", "Bloomberg"), stockPriceHistory),
    volume: createMetricWithHistory(createBaseMetric(1520000, "1.52M", "Bloomberg"), volumeHistory),
    market_cap: createSimpleMetric(createBaseMetric(12800000000, "$12.8B", "Calculated")),
    pe_ratio: createSimpleMetric(createBaseMetric(28.4, "28.4x", "Calculated")),
    ev_ebitda: createSimpleMetric(createBaseMetric(12.4, "12.4x", "Calculated")),
    target_price: createSimpleMetric({ ...createBaseMetric(0, "Pending", "Analyst Consensus"), availability: "pending", unavailable_reason: "Analyst consensus update expected after Q3 earnings" }),
  },

  private_data: {
    valuation_mark: createSimpleMetric(createBaseMetric(14500000000, "$14.5B", "Internal Model")),
    net_leverage: createSimpleMetric(createBaseMetric(1.8, "1.8x", "Calculated")),
  },

  valuation: {
    valuation_range_low: 13200000000,
    valuation_range_high: 15800000000,
    valuation_range_midpoint: 14500000000,
    why_range_exists: "Multiple scenarios based on margin trajectory and terminal growth assumptions",
    dcf: { terminal_growth_rate: 2.5, wacc: 8.2, implied_value: 14500000000, implied_value_per_share: 145.00 },
    trading_comps: { implied_value_range_low: 13500000000, implied_value_range_high: 15200000000, confidence: { coverage: 85, auditability: 78, freshness_days: 7 } },
    precedent_transactions: { implied_value_range_low: 14000000000, implied_value_range_high: 16500000000, confidence: { coverage: 70, auditability: 65, freshness_days: 30 } },
  },

  hypotheses,
  ai_insights: hypotheses,

  events: [
    { id: "evt-1", date: "2025-01-07", type: "earnings", title: "Q4 2024 Earnings Release", description: "Quarterly earnings announcement", impact: "neutral" },
    { id: "evt-2", date: "2025-03-15", type: "filing", title: "10-K Annual Report", description: "Annual filing due", impact: "neutral" },
  ],

  scenarios: {
    base: { probability: 0.6, assumptions: [{ key: "Revenue Growth", value: "9%" }, { key: "EBITDA Margin", value: "25.5%" }], outputs: { revenue: createBaseMetric(3550000000, "$3.55B", "Model"), ebitda: createBaseMetric(905000000, "$905M", "Model"), valuation: createBaseMetric(14500000000, "$14.5B", "DCF") } },
    downside: { probability: 0.25, assumptions: [{ key: "Revenue Growth", value: "5%" }, { key: "EBITDA Margin", value: "22%" }], outputs: { revenue: createBaseMetric(3280000000, "$3.28B", "Model"), ebitda: createBaseMetric(722000000, "$722M", "Model"), valuation: createBaseMetric(11200000000, "$11.2B", "DCF") } },
    upside: { probability: 0.15, assumptions: [{ key: "Revenue Growth", value: "14%" }, { key: "EBITDA Margin", value: "27%" }], outputs: { revenue: createBaseMetric(3850000000, "$3.85B", "Model"), ebitda: createBaseMetric(1040000000, "$1.04B", "Model"), valuation: createBaseMetric(17800000000, "$17.8B", "DCF") } },
  },

  risks: [
    { id: "risk-1", category: "market", title: "Customer Concentration", description: "Top 3 customers represent 34% of revenue", severity: "high", trigger: "Loss of any top-3 customer", mitigation: "Diversification initiatives underway" },
    { id: "risk-2", category: "operational", title: "Management Succession", description: "CEO is 67 years old with no public succession plan", severity: "medium", trigger: "CEO departure announcement", mitigation: "Board engaged executive search firm" },
    { id: "risk-3", category: "financial", title: "Input Cost Inflation", description: "Raw material costs up 12% YoY", severity: "medium", trigger: "Margin compression >100bps", mitigation: "Price increases implemented Q4" },
  ],

  sources: [
    { name: "SEC EDGAR", type: "primary", last_refresh: "2024-12-14T06:00:00Z" },
    { name: "Bloomberg Terminal", type: "primary", last_refresh: "2024-12-14T09:00:00Z" },
    { name: "FactSet", type: "secondary", last_refresh: "2024-12-14T08:30:00Z" },
  ],

  run_data_quality: { coverage: 88, auditability: 82, freshness_days: 1 },
};