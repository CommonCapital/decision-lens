import { InvestorDashboard, Metric, MetricWithHistory, TimeSeriesMetric, HorizonStats, AvailabilityStatus } from "./investor-schema";

// Helper to create a metric with history
function createMetricWithHistory(
  current: Metric,
  hasHistory: boolean = true,
  baseValue?: number
): MetricWithHistory {
  if (!hasHistory || current.availability !== "available") {
    return {
      current,
      history: null,
    };
  }

  const value = baseValue ?? (typeof current.value === "number" ? current.value : 100);
  const history = generateTimeSeriesMetric(value, current.source || "Unknown");
  
  return {
    current,
    history,
  };
}

// Generate time series with quarterly data for all horizons
function generateTimeSeriesMetric(baseValue: number, source: string): TimeSeriesMetric {
  const now = new Date();
  const series: TimeSeriesMetric["series"] = [];
  
  // Generate 30 data points for current period
  for (let i = 29; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const variance = (Math.random() - 0.5) * 0.1 * baseValue;
    const value = baseValue + variance;
    
    series.push({
      timestamp: timestamp.toISOString(),
      value,
      formatted: formatValue(value),
      confidence: 85 + Math.random() * 15,
      availability: "available" as AvailabilityStatus,
    });
  }

  // Generate horizon stats with quarterly breakdown
  const horizons: TimeSeriesMetric["horizons"] = {
    "1H": generateHorizonStats(baseValue, 0.02),
    "1D": generateHorizonStats(baseValue, 0.05),
    "1W": generateHorizonStats(baseValue, 0.08),
    "1M": generateHorizonStats(baseValue, 0.12),
    "1Y": generateHorizonStats(baseValue, 0.25),
    "5Y": generateHorizonStats(baseValue, 0.45),
    "10Y": generateHorizonStats(baseValue, 0.65),
  };

  return {
    series,
    horizons,
    availability: "available",
    confidence: 90,
    source,
    decision_context: {
      confidence_level: "high",
      sufficiency_status: "sufficient",
      knowns: ["Historical data validated", "Source verified"],
      unknowns: ["Future projections uncertain"],
      what_changes_conclusion: ["Material restatement", "Source data correction"],
    },
  };
}

function generateHorizonStats(baseValue: number, volatilityFactor: number): HorizonStats {
  const variance = baseValue * volatilityFactor;
  return {
    quarters: {
      Q1: baseValue * (0.9 + Math.random() * 0.2),
      Q2: baseValue * (0.92 + Math.random() * 0.2),
      Q3: baseValue * (0.95 + Math.random() * 0.2),
      Q4: baseValue * (0.98 + Math.random() * 0.2),
    },
    high: baseValue + variance,
    low: baseValue - variance * 0.8,
    average: baseValue,
    volatility: volatilityFactor,
    change_percent: (Math.random() - 0.3) * 20,
  };
}

function formatValue(value: number): string {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

export const mockDashboardData: InvestorDashboard = {
  run_metadata: {
    run_id: "RUN-2024-1214-001",
    entity: "Meridian Holdings Corp",
    ticker: "MHC",
    mode: "public",
    timestamp: "2024-12-14T09:00:00Z",
    owner: "Sarah Chen, CFA",
  },

  executive_summary: {
    headline: "Investment thesis strengthening: operational execution exceeding plan with expanding margins and raised guidance",
    key_facts: [
      "Q3 revenue of $892M beat consensus by $36M (4.2%)",
      "EBITDA margin expanded 80bps YoY to 25.1%",
      "FY24 guidance raised: revenue $3.52-3.58B (was $3.45-3.52B)",
      "Competitor exit creates $200M addressable market opportunity",
    ],
    implications: [
      "Valuation upside of 12-18% in base case",
      "Market share gains accelerating vs. plan",
      "Operating leverage thesis proving out",
    ],
    key_risks: [
      "Customer concentration: top 3 = 34% of revenue",
      "Input cost inflation not fully passed through",
      "Management succession uncertainty (CEO age 67)",
    ],
    thesis_status: "intact",
  },

  financials: {
    revenue: createMetricWithHistory({
      value: 892000000,
      formatted: "$892M",
      unit: "USD",
      source: "10-Q Filing",
      tie_out_status: "final",
      last_updated: "2024-12-14T08:00:00Z",
      confidence: 98,
      availability: "available",
      decision_context: {
        confidence_level: "high",
        sufficiency_status: "sufficient",
        knowns: ["Filed with SEC", "Auditor reviewed"],
        unknowns: [],
        what_changes_conclusion: ["Material restatement"],
      },
    }, true, 892000000),
    revenue_growth: createMetricWithHistory({
      value: 12.4,
      formatted: "+12.4%",
      unit: "%",
      source: "Calculated from 10-Q",
      tie_out_status: "final",
      last_updated: "2024-12-14T08:00:00Z",
      confidence: 95,
      availability: "available",
    }, false),
    ebitda: createMetricWithHistory({
      value: 224000000,
      formatted: "$224M",
      unit: "USD",
      source: "Management Reconciliation",
      tie_out_status: "final",
      last_updated: "2024-12-14T08:00:00Z",
      confidence: 92,
      availability: "available",
    }, true, 224000000),
    ebitda_margin: createMetricWithHistory({
      value: 25.1,
      formatted: "25.1%",
      unit: "%",
      source: "Calculated",
      tie_out_status: "final",
      last_updated: "2024-12-14T08:00:00Z",
      confidence: 95,
      availability: "available",
    }, false),
    free_cash_flow: createMetricWithHistory({
      value: 158000000,
      formatted: "$158M",
      unit: "USD",
      source: "Cash Flow Statement",
      tie_out_status: "final",
      last_updated: "2024-12-14T08:00:00Z",
      confidence: 90,
      availability: "available",
    }, true, 158000000),
  },

  market_data: {
    stock_price: createMetricWithHistory({
      value: 127.45,
      formatted: "$127.45",
      unit: "USD",
      source: "Bloomberg",
      tie_out_status: "final",
      last_updated: "2024-12-14T09:00:00Z",
      confidence: 100,
      availability: "available",
    }, true, 127.45),
    market_cap: createMetricWithHistory({
      value: 8200000000,
      formatted: "$8.2B",
      unit: "USD",
      source: "Bloomberg",
      tie_out_status: "final",
      last_updated: "2024-12-14T09:00:00Z",
      confidence: 100,
      availability: "available",
    }, true, 8200000000),
    pe_ratio: createMetricWithHistory({
      value: 18.2,
      formatted: "18.2x",
      source: "Bloomberg",
      tie_out_status: "final",
      last_updated: "2024-12-14T09:00:00Z",
      confidence: 95,
      availability: "available",
    }, false),
    ev_ebitda: createMetricWithHistory({
      value: 11.4,
      formatted: "11.4x",
      source: "Calculated",
      tie_out_status: "final",
      last_updated: "2024-12-14T09:00:00Z",
      confidence: 88,
      availability: "available",
    }, false),
    target_price: createMetricWithHistory({
      value: null,
      formatted: null,
      unit: "USD",
      source: "Bloomberg Consensus",
      tie_out_status: "provisional",
      last_updated: "2024-12-14T09:00:00Z",
      confidence: 0,
      availability: "pending",
      unavailable_reason: "Analyst consensus update expected after Q3 earnings cycle completes",
      decision_context: {
        confidence_level: "low",
        sufficiency_status: "insufficient",
        knowns: ["Previous target was $142"],
        unknowns: ["New analyst ratings pending"],
        what_changes_conclusion: ["Consensus publication"],
      },
    }, false),
  },

  private_data: {
    valuation_mark: createMetricWithHistory({
      value: 850000000,
      formatted: "$850M",
      unit: "USD",
      source: "Internal Model",
      tie_out_status: "provisional",
      last_updated: "2024-12-14T08:00:00Z",
      confidence: 75,
      availability: "available",
    }, true, 850000000),
    net_leverage: createMetricWithHistory({
      value: 3.2,
      formatted: "3.2x",
      source: "Debt Schedule",
      tie_out_status: "final",
      last_updated: "2024-12-14T08:00:00Z",
      confidence: 95,
      availability: "available",
    }, false),
    liquidity_runway: createMetricWithHistory({
      value: 18,
      formatted: "18 months",
      unit: "months",
      source: "Cash Flow Model",
      tie_out_status: "provisional",
      last_updated: "2024-12-14T08:00:00Z",
      confidence: 70,
      availability: "available",
    }, false),
    covenant_headroom: createMetricWithHistory({
      value: null,
      formatted: null,
      source: "Credit Agreement",
      tie_out_status: "flagged",
      last_updated: "2024-12-14T08:00:00Z",
      confidence: 0,
      availability: "restricted",
      unavailable_reason: "Credit agreement amendment in progress; terms under renegotiation",
      decision_context: {
        confidence_level: "low",
        sufficiency_status: "insufficient",
        knowns: ["Renegotiation in progress"],
        unknowns: ["New covenant terms", "Timeline for closure"],
        what_changes_conclusion: ["Amendment finalization", "Lender approval"],
      },
    }, false),
  },

  events: [
    {
      id: "EVT-001",
      date: "2024-12-12",
      type: "earnings",
      title: "Q3 2024 Earnings Release",
      description: "Beat consensus on revenue and EPS. Management raised full-year guidance.",
      impact: "positive",
      source_url: "https://sec.gov/...",
    },
    {
      id: "EVT-002",
      date: "2024-12-10",
      type: "news",
      title: "Competitor Market Exit Announced",
      description: "Major competitor Acme Corp announces exit from North American market, creating ~$200M addressable opportunity.",
      impact: "positive",
    },
    {
      id: "EVT-003",
      date: "2024-12-05",
      type: "analyst_update",
      title: "Morgan Stanley Upgrade",
      description: "Upgraded to Overweight from Equal-weight. PT raised to $152 from $128.",
      impact: "positive",
    },
    {
      id: "EVT-004",
      date: "2024-11-28",
      type: "filing",
      title: "Form 4 - CEO Stock Sale",
      description: "CEO sold 50,000 shares at $124.50 per pre-arranged 10b5-1 plan.",
      impact: "neutral",
      source_url: "https://sec.gov/...",
    },
  ],

  scenarios: [
    {
      name: "base",
      probability: 0.6,
      assumptions: [
        { key: "Revenue Growth", value: "9.2%" },
        { key: "EBITDA Margin", value: "25.5%" },
        { key: "Multiple", value: "12.0x EV/EBITDA" },
      ],
      outputs: {
        revenue: {
          value: 3550000000,
          formatted: "$3.55B",
          source: "Model",
          tie_out_status: "final",
          last_updated: "2024-12-14T08:00:00Z",
          confidence: 85,
          availability: "available",
        },
        ebitda: {
          value: 905000000,
          formatted: "$905M",
          source: "Model",
          tie_out_status: "final",
          last_updated: "2024-12-14T08:00:00Z",
          confidence: 82,
          availability: "available",
        },
        valuation: {
          value: 10860000000,
          formatted: "$10.9B",
          source: "Model",
          tie_out_status: "final",
          last_updated: "2024-12-14T08:00:00Z",
          confidence: 78,
          availability: "available",
        },
      },
    },
    {
      name: "downside",
      probability: 0.25,
      assumptions: [
        { key: "Revenue Growth", value: "5.0%" },
        { key: "EBITDA Margin", value: "22.0%" },
        { key: "Multiple", value: "9.0x EV/EBITDA" },
      ],
      outputs: {
        revenue: {
          value: 3400000000,
          formatted: "$3.40B",
          source: "Model",
          tie_out_status: "final",
          last_updated: "2024-12-14T08:00:00Z",
          confidence: 80,
          availability: "available",
        },
        ebitda: {
          value: 748000000,
          formatted: "$748M",
          source: "Model",
          tie_out_status: "final",
          last_updated: "2024-12-14T08:00:00Z",
          confidence: 75,
          availability: "available",
        },
        valuation: {
          value: 6732000000,
          formatted: "$6.7B",
          source: "Model",
          tie_out_status: "final",
          last_updated: "2024-12-14T08:00:00Z",
          confidence: 70,
          availability: "available",
        },
      },
    },
    {
      name: "upside",
      probability: 0.15,
      assumptions: [
        { key: "Revenue Growth", value: "14.0%" },
        { key: "EBITDA Margin", value: "27.0%" },
        { key: "Multiple", value: "14.0x EV/EBITDA" },
      ],
      outputs: {
        revenue: {
          value: 3700000000,
          formatted: "$3.70B",
          source: "Model",
          tie_out_status: "final",
          last_updated: "2024-12-14T08:00:00Z",
          confidence: 75,
          availability: "available",
        },
        ebitda: {
          value: 999000000,
          formatted: "$999M",
          source: "Model",
          tie_out_status: "final",
          last_updated: "2024-12-14T08:00:00Z",
          confidence: 72,
          availability: "available",
        },
        valuation: {
          value: 13986000000,
          formatted: "$14.0B",
          source: "Model",
          tie_out_status: "final",
          last_updated: "2024-12-14T08:00:00Z",
          confidence: 65,
          availability: "available",
        },
      },
    },
  ],

  risks: [
    {
      id: "RISK-001",
      category: "financial",
      title: "Customer Concentration Risk",
      description: "Top 3 customers represent 34% of revenue. Loss of any major customer would materially impact financials.",
      severity: "high",
      trigger: "Loss of top-5 customer or >20% volume decline from any",
      mitigation: "Accelerating customer diversification; targeting 5+ new enterprise accounts in FY25",
    },
    {
      id: "RISK-002",
      category: "operational",
      title: "Input Cost Inflation",
      description: "Raw material costs up 12% YTD. Pricing actions lag 2-3 quarters.",
      severity: "medium",
      trigger: "Gross margin compression >200bps from current levels",
      mitigation: "Long-term supply agreements under negotiation",
    },
    {
      id: "RISK-003",
      category: "governance",
      title: "CEO Succession",
      description: "CEO age 67, no announced succession plan. Key-man risk for strategic relationships.",
      severity: "medium",
      trigger: "CEO departure announcement without successor",
      mitigation: null,
    },
  ],

  sources: [
    { name: "SEC EDGAR", type: "primary", last_refresh: "2024-12-14T08:00:00Z" },
    { name: "Bloomberg Terminal", type: "primary", last_refresh: "2024-12-14T09:00:00Z" },
    { name: "Company IR", type: "secondary", last_refresh: "2024-12-13T16:00:00Z" },
    { name: "Internal Model", type: "secondary", last_refresh: "2024-12-14T07:00:00Z" },
  ],
};
