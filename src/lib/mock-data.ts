import { InvestorDashboard, AIInsight, TimeSeriesMetric } from "./investor-schema";

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

export const mockDashboardData: InvestorDashboard = {
  // Company Classification
  company_type: "public",
  
  run_metadata: { 
    run_id: "RUN-2024-1214-001", 
    entity: "Meridian Holdings Corp", 
    ticker: "MHC", 
    timestamp: "2024-12-14T09:00:00Z", 
    owner: "Sarah Chen, CFA" 
  },
  
  // BASE METRICS (ATOMIC, NON-DERIVABLE)
  base_metrics: {
    // Market / Price Base
    market_cap: 12800000000,
    stock_price: 127.45,
    shares_outstanding: 100400000,
    
    // Balance Sheet
    total_debt: 450000000,
    preferred_stock: 0,
    minority_interest: 25000000,
    cash: 1200000000,
    marketable_securities: 180000000,
    current_assets: 2100000000,
    current_liabilities: 890000000,
    accounts_receivable: 420000000,
    
    // Income Statement (Quarterly - Q4 2024)
    revenue: 892000000,
    revenue_prior: 817000000,
    gross_profit: 446000000,
    operating_income: 198000000,
    depreciation_amortization: 26000000,
    interest_expense: 18000000,
    
    // Income Statement (TTM - Trailing Twelve Months ending Q4 2024)
    // These are the annual base figures that scenario projections build upon
    revenue_ttm: 3260000000, // Sum of Q1-Q4: 795M + 834M + 868M + 892M = 3.26B (from time_series)
    ebitda_ttm: 819000000, // Sum of Q1-Q4: 185M + 198M + 212M + 224M = 819M (from time_series)
    gross_profit_ttm: 1630000000,
    operating_income_ttm: 792000000,
    
    // EBITDA (dual structure) - Reported is available (Quarterly)
    ebitda_reported: 224000000,
    ebitda_proxy: null,
    ebitda_availability: "reported",
    
    // Cash Flow
    free_cash_flow: 158000000,
    net_burn: null,
    
    // Operational
    headcount: 4850,
    rd_spend: 89000000,
    sm_spend: 134000000,
    sm_spend_prior: 128000000,
    
    // SaaS / Subscription - Demo values for unit economics
    arr: 892000000,
    arr_prior: 817000000,
    new_arr: 98000000,
    expansion_arr: 45000000,
    contraction_arr: 28000000,
    churned_arr: 40000000,
    monthly_churn_percent: 1.2,
    cac: 45000,
    ltv: 180000,
    arpa: 4500,
    gross_margin_percent: 50.0,
    average_customer_lifespan_months: 48,
    
    // Customer Metrics
    customer_count: 2400,
    top_customer_revenue_percent: 14,
    top_3_customer_revenue_percent: 34,
    top_10_customer_revenue_percent: 52,
    
    // Supplier Concentration
    top_supplier_spend_percent: 8,
    top_5_supplier_spend_percent: 28,
  },
  
  // Time Series for charting
  time_series: {
    stock_price: stockPriceHistory,
    revenue: revenueHistory,
    ebitda: ebitdaHistory,
    volume: volumeHistory,
  },
  
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

  valuation: {
    valuation_range_low: 13200000000,
    valuation_range_high: 15800000000,
    valuation_range_midpoint: 14500000000,
    why_range_exists: "Multiple scenarios based on margin trajectory and terminal growth assumptions",
    dcf: { 
      terminal_growth_rate: { value: 2.5, formatted: "2.5%", source: "Management guidance", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=10-K", document_type: "10-K MD&A", excerpt: "Long-term growth expectation of 2-3%", accessed_at: "2024-12-14T06:00:00Z" } },
      wacc: { value: 8.2, formatted: "8.2%", source: "Internal Model", formula: "Risk-free rate + Beta × Equity Risk Premium + Size Premium", formula_inputs: [{ name: "Risk-free rate", value: 4.2, source: "10Y Treasury" }, { name: "Beta", value: 1.1, source: "Bloomberg" }, { name: "ERP", value: 5.5, source: "Duff & Phelps" }] },
      implied_value: { value: 14500000000, formatted: "$14.5B", source: "DCF Model", formula: "Sum of discounted FCFs + Terminal Value" },
      implied_value_per_share: { value: 145.00, formatted: "$145.00", source: "DCF Model", formula: "Implied EV / Shares Outstanding" },
      source: "Internal DCF Model",
      source_reference: { url: "https://internal.model/dcf/MHC", document_type: "Valuation Model", excerpt: "5-year DCF with terminal value", accessed_at: "2024-12-14T09:00:00Z" },
      methodology: "5-year explicit forecast with terminal value using Gordon Growth"
    },
    trading_comps: { 
      implied_value_range_low: { value: 13500000000, formatted: "$13.5B", source: "FactSet Comps", source_reference: { url: "https://factset.com/comps/industrials", document_type: "Comparable Analysis", excerpt: "Peer median EV/EBITDA: 12.0x", accessed_at: "2024-12-14T08:30:00Z" } },
      implied_value_range_high: { value: 15200000000, formatted: "$15.2B", source: "FactSet Comps", source_reference: { url: "https://factset.com/comps/industrials", document_type: "Comparable Analysis", excerpt: "Peer 75th percentile EV/EBITDA: 13.5x", accessed_at: "2024-12-14T08:30:00Z" } },
      peer_set: ["Honeywell", "Emerson Electric", "Rockwell Automation", "Parker Hannifin"],
      multiple_used: "EV/EBITDA",
      source: "FactSet Comparable Companies",
      source_reference: { url: "https://factset.com/comps/industrials", document_type: "Comparable Analysis", excerpt: "Industrial sector peer group analysis", accessed_at: "2024-12-14T08:30:00Z" },
      confidence: { coverage: 85, auditability: 78, freshness_days: 7 } 
    },
    precedent_transactions: { 
      implied_value_range_low: { value: 14000000000, formatted: "$14.0B", source: "Bloomberg M&A", source_reference: { url: "https://bloomberg.com/ma/industrials", document_type: "M&A Database", excerpt: "Sector transaction median: 11.5x LTM EBITDA", accessed_at: "2024-12-10T14:00:00Z" } },
      implied_value_range_high: { value: 16500000000, formatted: "$16.5B", source: "Bloomberg M&A", source_reference: { url: "https://bloomberg.com/ma/industrials", document_type: "M&A Database", excerpt: "Premium transactions: 14.0x LTM EBITDA", accessed_at: "2024-12-10T14:00:00Z" } },
      transactions: [
        { name: "Emerson / AspenTech", date: "2022-05", multiple: 13.2 },
        { name: "Rockwell / Plex", date: "2021-06", multiple: 12.8 }
      ],
      source: "Bloomberg M&A Database",
      source_reference: { url: "https://bloomberg.com/ma/industrials", document_type: "M&A Database", excerpt: "Industrial sector precedent transactions 2020-2024", accessed_at: "2024-12-10T14:00:00Z" },
      confidence: { coverage: 70, auditability: 65, freshness_days: 30 } 
    },
  },

  hypotheses,
  ai_insights: hypotheses,

  events: [
    { id: "evt-1", date: "2025-01-07", type: "earnings", title: "Q4 2024 Earnings Release", description: "Quarterly earnings announcement", impact: "neutral" },
    { id: "evt-2", date: "2025-03-15", type: "filing", title: "10-K Annual Report", description: "Annual filing due", impact: "neutral" },
  ],

  scenarios: {
    base: { 
      probability: 0.6, 
      assumptions: [
        { key: "Revenue Growth", value: "9%", source: "Management guidance + historical growth", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=8-K", document_type: "8-K Filing", excerpt: "Management expects 8-10% organic growth in FY25", accessed_at: "2024-12-14T06:00:00Z" } },
        { key: "EBITDA Margin", value: "25.5%", source: "Historical margin + operating leverage", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=10-K", document_type: "10-K MD&A", excerpt: "EBITDA margin of 25.1% in FY24 with continued operating leverage expected", accessed_at: "2024-12-14T06:00:00Z" } }
      ], 
      drivers: [
        { name: "Revenue Growth", category: "growth", value: "9%", unit: "percent", source: "fact", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=8-K", document_type: "8-K Filing", excerpt: "Management expects 8-10% organic growth", accessed_at: "2024-12-14T06:00:00Z" } },
        { name: "EBITDA Margin", category: "margin", value: "25.5%", unit: "percent", source: "fact", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=10-K", document_type: "10-K MD&A", excerpt: "Historical margin trajectory supports 25-26% target", accessed_at: "2024-12-14T06:00:00Z" } },
        { name: "Units Sold", category: "volume", value: "2.8M", unit: "units", source: "fact" },
        { name: "ASP", category: "pricing", value: "$1,165", unit: "usd", source: "judgment" }
      ],
      outputs: { 
        revenue: { 
          value: 3553400000, 
          formatted: "$3.55B (TTM FY25E)", 
          source: "Model Projection",
          period: "FY25E (Annual)",
          formula: "Revenue TTM × (1 + Growth Rate)",
          formula_inputs: [
            { name: "Revenue TTM (Q1-Q4 FY24)", value: 3260000000, source: "SEC Filings - Sum of quarterly", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=10-K", document_type: "10-K Filing", excerpt: "Total Revenue FY24: $3.26B (Q1: $795M + Q2: $834M + Q3: $868M + Q4: $892M)", accessed_at: "2024-12-14T06:00:00Z" } },
            { name: "Growth Rate", value: 0.09, source: "Base Case - 9%", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=8-K", document_type: "8-K Filing", excerpt: "Management expects 8-10% organic growth in FY25", accessed_at: "2024-12-14T06:00:00Z" } }
          ]
        }, 
        ebitda: { 
          value: 906117000, 
          formatted: "$906M (TTM FY25E)", 
          source: "Model Projection",
          period: "FY25E (Annual)",
          formula: "Projected Revenue × EBITDA Margin",
          formula_inputs: [
            { name: "Projected Revenue FY25E", value: 3553400000, source: "Calculated from TTM + Growth" },
            { name: "EBITDA Margin", value: 0.255, source: "Base Case - 25.5%", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=10-K", document_type: "10-K MD&A", excerpt: "EBITDA margin expansion from 25.1% to target 25.5%", accessed_at: "2024-12-14T06:00:00Z" } }
          ]
        }, 
        valuation: { 
          value: 14500000000, 
          formatted: "$14.5B", 
          source: "DCF Model",
          formula: "Discounted Cash Flow with Terminal Value",
          formula_inputs: [
            { name: "FY25E EBITDA", value: 906117000, source: "Calculated" },
            { name: "Exit Multiple", value: 12.0, source: "Trading Comps Median" },
            { name: "WACC", value: 0.082, source: "Internal Model" }
          ]
        } 
      } 
    },
    downside: { 
      probability: 0.25, 
      assumptions: [
        { key: "Revenue Growth", value: "5%", source: "Conservative: macro headwinds", source_reference: { url: "https://bernstein.com/research/industrials", document_type: "Analyst Report", excerpt: "Industrial sector growth may slow to 4-6% in recessionary scenario", accessed_at: "2024-12-10T14:00:00Z" } },
        { key: "EBITDA Margin", value: "22%", source: "Margin compression from input costs", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=10-Q", document_type: "10-Q Filing", excerpt: "Raw material costs increased 12% YoY", accessed_at: "2024-12-14T06:00:00Z" } }
      ],
      drivers: [
        { name: "Revenue Growth", category: "growth", value: "5%", unit: "percent", source: "judgment", source_reference: { url: "https://bernstein.com/research/industrials", document_type: "Analyst Report", excerpt: "Recessionary scenario: 4-6% growth", accessed_at: "2024-12-10T14:00:00Z" } },
        { name: "EBITDA Margin", category: "margin", value: "22%", unit: "percent", source: "judgment", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=10-Q", document_type: "10-Q Filing", excerpt: "Input cost inflation pressure on margins", accessed_at: "2024-12-14T06:00:00Z" } },
        { name: "Units Sold", category: "volume", value: "2.5M", unit: "units", source: "judgment" },
        { name: "ASP", category: "pricing", value: "$1,140", unit: "usd", source: "judgment" }
      ],
      outputs: { 
        revenue: { 
          value: 3423000000, 
          formatted: "$3.42B (TTM FY25E)", 
          source: "Model Projection",
          period: "FY25E (Annual)",
          formula: "Revenue TTM × (1 + Growth Rate)",
          formula_inputs: [
            { name: "Revenue TTM (Q1-Q4 FY24)", value: 3260000000, source: "SEC Filings - Sum of quarterly", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=10-K", document_type: "10-K Filing", excerpt: "Total Revenue FY24: $3.26B", accessed_at: "2024-12-14T06:00:00Z" } },
            { name: "Growth Rate", value: 0.05, source: "Downside - 5%", source_reference: { url: "https://bernstein.com/research/industrials", document_type: "Analyst Report", excerpt: "Recessionary scenario: 4-6% growth", accessed_at: "2024-12-10T14:00:00Z" } }
          ]
        }, 
        ebitda: { 
          value: 753060000, 
          formatted: "$753M (TTM FY25E)", 
          source: "Model Projection",
          period: "FY25E (Annual)",
          formula: "Projected Revenue × EBITDA Margin",
          formula_inputs: [
            { name: "Projected Revenue FY25E", value: 3423000000, source: "Calculated from TTM + Growth" },
            { name: "EBITDA Margin", value: 0.22, source: "Downside - 22%", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=10-Q", document_type: "10-Q Filing", excerpt: "Margin pressure from 12% input cost inflation", accessed_at: "2024-12-14T06:00:00Z" } }
          ]
        }, 
        valuation: { 
          value: 11200000000, 
          formatted: "$11.2B", 
          source: "DCF Model",
          formula: "Discounted Cash Flow with Terminal Value",
          formula_inputs: [
            { name: "FY25E EBITDA", value: 753060000, source: "Calculated" },
            { name: "Exit Multiple", value: 10.5, source: "Trading Comps 25th Percentile" },
            { name: "WACC", value: 0.09, source: "Stressed Discount Rate" }
          ]
        } 
      } 
    },
    upside: { 
      probability: 0.15, 
      assumptions: [
        { key: "Revenue Growth", value: "14%", source: "Market share gains + new products", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=8-K", document_type: "8-K Filing", excerpt: "New product launch expected to add $300M+ revenue in FY25", accessed_at: "2024-12-14T06:00:00Z" } },
        { key: "EBITDA Margin", value: "27%", source: "Operating leverage + competitor exit", source_reference: { url: "https://bernstein.com/research/industrials/MHC-competitive-analysis", document_type: "Analyst Report", excerpt: "Competitor exit creates pricing power; margin upside to 27%+", accessed_at: "2024-12-10T14:00:00Z" } }
      ],
      drivers: [
        { name: "Revenue Growth", category: "growth", value: "14%", unit: "percent", source: "fact", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=8-K", document_type: "8-K Filing", excerpt: "New product launch + market share gains", accessed_at: "2024-12-14T06:00:00Z" } },
        { name: "EBITDA Margin", category: "margin", value: "27%", unit: "percent", source: "judgment", source_reference: { url: "https://bernstein.com/research/industrials/MHC-competitive-analysis", document_type: "Analyst Report", excerpt: "Competitor exit creates margin upside", accessed_at: "2024-12-10T14:00:00Z" } },
        { name: "Units Sold", category: "volume", value: "3.1M", unit: "units", source: "judgment" },
        { name: "ASP", category: "pricing", value: "$1,200", unit: "usd", source: "judgment" }
      ],
      outputs: { 
        revenue: { 
          value: 3716400000, 
          formatted: "$3.72B (TTM FY25E)", 
          source: "Model Projection",
          period: "FY25E (Annual)",
          formula: "Revenue TTM × (1 + Growth Rate)",
          formula_inputs: [
            { name: "Revenue TTM (Q1-Q4 FY24)", value: 3260000000, source: "SEC Filings - Sum of quarterly", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=10-K", document_type: "10-K Filing", excerpt: "Total Revenue FY24: $3.26B", accessed_at: "2024-12-14T06:00:00Z" } },
            { name: "Growth Rate", value: 0.14, source: "Upside - 14%", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=8-K", document_type: "8-K Filing", excerpt: "New product launch + market share gains to drive 14% growth", accessed_at: "2024-12-14T06:00:00Z" } }
          ]
        }, 
        ebitda: { 
          value: 1003428000, 
          formatted: "$1.00B (TTM FY25E)", 
          source: "Model Projection",
          period: "FY25E (Annual)",
          formula: "Projected Revenue × EBITDA Margin",
          formula_inputs: [
            { name: "Projected Revenue FY25E", value: 3716400000, source: "Calculated from TTM + Growth" },
            { name: "EBITDA Margin", value: 0.27, source: "Upside - 27%", source_reference: { url: "https://bernstein.com/research/industrials/MHC-competitive-analysis", document_type: "Analyst Report", excerpt: "Competitor exit + operating leverage supports 27% margin", accessed_at: "2024-12-10T14:00:00Z" } }
          ]
        }, 
        valuation: { 
          value: 17800000000, 
          formatted: "$17.8B", 
          source: "DCF Model",
          formula: "Discounted Cash Flow with Terminal Value",
          formula_inputs: [
            { name: "FY25E EBITDA", value: 1003428000, source: "Calculated" },
            { name: "Exit Multiple", value: 13.5, source: "Trading Comps 75th Percentile" },
            { name: "WACC", value: 0.075, source: "Optimistic Discount Rate" }
          ]
        } 
      } 
    },
  },

  // Guidance vs Consensus - with field-level traceability
  guidance_bridge: {
    low: { value: 3400000000, formatted: "$3.40B", source: "Company Guidance", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=8-K", document_type: "8-K Filing", excerpt: "FY24 Revenue Guidance: $3.40B - $3.60B", accessed_at: "2024-12-12T16:00:00Z" } },
    high: { value: 3600000000, formatted: "$3.60B", source: "Company Guidance", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=8-K", document_type: "8-K Filing", excerpt: "FY24 Revenue Guidance: $3.40B - $3.60B", accessed_at: "2024-12-12T16:00:00Z" } },
    current_consensus: { value: 3520000000, formatted: "$3.52B", source: "FactSet Consensus", source_reference: { url: "https://factset.com/consensus/MHC", document_type: "Consensus Estimates", excerpt: "Street Consensus Revenue: $3.52B (14 analysts)", accessed_at: "2024-12-14T08:30:00Z" } },
    gap_percent: { value: 1.4, formatted: "+1.4%", source: "Calculated", formula: "(Consensus - Guidance Midpoint) / Guidance Midpoint × 100", formula_inputs: [{ name: "Consensus", value: 3520000000, source: "FactSet" }, { name: "Guidance Midpoint", value: 3500000000, source: "Company" }] },
    source: "FactSet Consensus",
    source_reference: { url: "https://factset.com/consensus/MHC", document_type: "Consensus Estimates", excerpt: "FY24 Revenue Guidance: $3.40B - $3.60B; Street Consensus: $3.52B", accessed_at: "2024-12-14T08:30:00Z" },
    last_updated: "2024-12-14T08:30:00Z",
  },

  // 30-Day Estimate Revisions - with field-level traceability
  revisions_momentum: {
    direction: "up",
    magnitude: { value: 2.3, formatted: "+2.3%", source: "Bloomberg", source_reference: { url: "https://bloomberg.com/estimates/MHC", document_type: "Estimate Revisions Report", excerpt: "30-day EPS revision: +2.3%; 12 analysts revised up, 2 revised down", accessed_at: "2024-12-14T09:00:00Z" } },
    trend: "accelerating",
    source: "Bloomberg Estimate Revisions",
    source_reference: { url: "https://bloomberg.com/estimates/MHC", document_type: "Estimate Revisions Report", excerpt: "30-day EPS revision: +2.3%; 12 analysts revised up, 2 revised down", accessed_at: "2024-12-14T09:00:00Z" },
    last_updated: "2024-12-14T09:00:00Z",
  },

  // Risks structured by required category
  risks: {
    regulatory: [
      { id: "RSK-001", title: "Antitrust Scrutiny", description: "DOJ investigation into market dominance in core segments", severity: "high", probability: 0.3, trigger: "Formal complaint or lawsuit filed", trigger_metric: "lawsuit_filed", mitigation: "Legal counsel engaged; proactive divestitures under review", mitigation_action: "diversified_partnerships", status: "Active", source: "SEC 10-K Risk Factors", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=10-K", document_type: "10-K Filing", excerpt: "Risk Factor 1A: Regulatory and Legal Risks", accessed_at: "2024-12-14T06:00:00Z" } },
    ],
    market: [
      { id: "RSK-002", title: "Customer Concentration", description: "Top 3 customers represent 34% of revenue, creating significant dependency", severity: "high", probability: 0.25, trigger: "Loss of any top-3 customer or >10% revenue at risk", trigger_metric: "customer_churn_rate", mitigation: "Diversification initiatives targeting 15 new enterprise accounts", mitigation_action: "customer_diversification", status: "Active", source: "SEC 10-K Customer Disclosure", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=10-K", document_type: "10-K Filing", excerpt: "Note 14: Major Customers - Top 3 customers represent 34% of consolidated revenue", accessed_at: "2024-12-14T06:00:00Z" } },
    ],
    operational: [
      { id: "RSK-003", title: "Management Succession", description: "CEO is 67 years old with no public succession plan disclosed", severity: "medium", probability: 0.35, trigger: "CEO departure announcement or health issue", trigger_metric: "executive_departure", mitigation: "Board engaged Spencer Stuart for succession planning", mitigation_action: "succession_planning", status: "Monitoring", source: "Proxy Statement DEF 14A", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=DEF%2014A", document_type: "Proxy Statement", excerpt: "CEO Biography: John Smith, age 67, has served as CEO since 2015", accessed_at: "2024-12-14T06:00:00Z" } },
      { id: "RSK-008", title: "Supply Chain Concentration", description: "Single-source supplier for critical component (18% of COGS)", severity: "medium", probability: 0.25, trigger: "Supplier disruption or lead time >60 days", trigger_metric: "supplier_lead_time", mitigation: "Qualification of secondary supplier in progress; 90-day safety stock maintained", mitigation_action: "secondary_supplier", status: "Monitoring", source: "Management Discussion & Analysis", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=10-K", document_type: "10-K MD&A", excerpt: "Supply Chain: Single-source supplier for precision components representing 18% of COGS", accessed_at: "2024-12-14T06:00:00Z" } },
    ],
    cybersecurity: [
      { id: "RSK-005", title: "Cybersecurity Vulnerability", description: "Critical manufacturing systems increasingly connected; 2 incidents in past 18 months", severity: "high", probability: 0.2, trigger: "Data breach or ransomware attack affecting operations", trigger_metric: "breach_alert", mitigation: "Enhanced security protocols; $12M investment in cyber infrastructure", mitigation_action: "enhance_security_protocols", status: "Monitoring", source: "SEC 10-K Risk Factors", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=10-K", document_type: "10-K Filing", excerpt: "Risk Factor 1C: Cybersecurity Risks - We have experienced cybersecurity incidents", accessed_at: "2024-12-14T06:00:00Z" } },
    ],
    financial: [
      { id: "RSK-004", title: "Input Cost Inflation", description: "Raw material costs up 12% YoY, pressuring gross margins", severity: "medium", probability: 0.45, trigger: "Margin compression >100bps vs guidance", trigger_metric: "gross_margin_delta", mitigation: "Q4 price increases of 4-6% implemented; hedging contracts in place", mitigation_action: "price_hedging", status: "Active", source: "Q3 Earnings Call Transcript", source_reference: { url: "https://factset.com/transcripts/MHC/Q3-2024", document_type: "Earnings Transcript", excerpt: "CFO: Raw material costs increased 12% year-over-year, partially offset by pricing actions", accessed_at: "2024-12-12T16:00:00Z" } },
      { id: "RSK-007", title: "Refinancing Risk", description: "$200M term loan maturing Q2 2025 in rising rate environment", severity: "low", probability: 0.15, trigger: "Refinancing spread >150bps above current facility", trigger_metric: "interest_spread", mitigation: "Proactive discussions with lenders; strong credit metrics support favorable terms", mitigation_action: "proactive_refinancing", status: "Monitoring", source: "SEC 10-Q Debt Schedule", source_reference: { url: "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC&type=10-Q", document_type: "10-Q Filing", excerpt: "Note 8: Long-term Debt - $200M term loan facility matures April 2025", accessed_at: "2024-12-14T06:00:00Z" } },
    ],
    strategic: [
      { id: "RSK-006", title: "Competitive Disruption", description: "New entrant with 40% lower cost structure gaining share in Asia-Pacific", severity: "medium", probability: 0.3, trigger: "Loss of >2 major APAC contracts or pricing pressure >15%", trigger_metric: "market_share_loss", mitigation: "Accelerated automation roadmap; exploring strategic partnership", mitigation_action: "strategic_partnership", status: "Active", source: "Industry Research Report", source_reference: { url: "https://bernstein.com/research/industrials/MHC-competitive-analysis", document_type: "Analyst Report", excerpt: "New APAC competitor operating at 40% lower cost basis; taking share in mid-tier segment", accessed_at: "2024-12-10T14:00:00Z" } },
    ],
  },

  path_indicators: [
    { label: "Revenue vs Plan", value: "+2.0% ahead", status: "on_track", next_check: "Q4 Earnings" },
    { label: "Margin Trajectory", value: "25.1% (target: 26%)", status: "on_track", next_check: "Monthly" },
    { label: "Market Share", value: "Gaining (+$200M TAM)", status: "on_track", next_check: "Quarterly" },
    { label: "Order Book", value: "Pending Q4 disclosure", status: "at_risk", next_check: "Jan 15" },
  ],

  position_sizing: {
    current_percent: 6,
    max_percent: 10,
    target_low: 5,
    target_high: 8,
  },

  variant_view: {
    summary: "Market underestimates margin expansion from competitor exit and operating leverage. Consensus EPS catching up but still 3-5% below our model.",
    sensitivity: [
      { label: "EBITDA ±1pp", impact: "±$0.8B EV" },
      { label: "Multiple ±1x", impact: "±$0.9B EV" },
    ],
  },

  kill_switch: {
    conditions: ["Thesis pillar broken", "Customer loss confirmed", "Margin <20%"],
  },

  sources: [
    { name: "SEC EDGAR", type: "primary", last_refresh: "2024-12-14T06:00:00Z", refresh_frequency: "quarterly", status: "connected", priority: 1, url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MHC", metrics_covered: ["Revenue", "EBITDA", "Debt", "Cash", "Shares Outstanding"], next_refresh: "2025-02-15T06:00:00Z" },
    { name: "Bloomberg Terminal", type: "primary", last_refresh: "2024-12-14T09:00:00Z", refresh_frequency: "realtime", status: "connected", priority: 2, url: "https://bloomberg.com/quote/MHC:US", metrics_covered: ["Stock Price", "Market Cap", "Volume", "P/E Ratio"], next_refresh: null },
    { name: "FactSet", type: "secondary", last_refresh: "2024-12-14T08:30:00Z", refresh_frequency: "hourly", status: "connected", priority: 3, url: "https://factset.com", metrics_covered: ["Analyst Estimates", "Consensus Revisions", "Price Targets"] },
    { name: "Internal CRM", type: "secondary", last_refresh: "2024-12-13T18:00:00Z", refresh_frequency: "daily", status: "connected", priority: 4, url: null, metrics_covered: ["Customer Count", "CAC", "LTV", "Churn Rate"], next_refresh: "2024-12-14T18:00:00Z" },
    { name: "Bernstein Research", type: "secondary", last_refresh: "2024-12-10T14:00:00Z", refresh_frequency: "weekly", status: "connected", priority: 5, url: "https://bernstein.com/research/industrials", metrics_covered: ["Industry Analysis", "Growth Forecasts", "Competitive Intel"] },
    { name: "S&P Capital IQ", type: "secondary", last_refresh: "2024-12-12T10:00:00Z", refresh_frequency: "daily", status: "stale", priority: 6, url: "https://capitaliq.spglobal.com", metrics_covered: ["Comps Analysis", "Transaction Multiples", "Credit Metrics"], next_refresh: "2024-12-14T10:00:00Z" },
    { name: "Management Presentations", type: "primary", last_refresh: "2024-11-15T09:00:00Z", refresh_frequency: "quarterly", status: "connected", priority: 7, url: "https://ir.meridianholdings.com/events", metrics_covered: ["Guidance", "Strategic Initiatives", "Capital Allocation"] },
  ],

  // Unit Economics with Investor Context
  unit_economics: {
    cac: { 
      value: 45000, 
      formatted: "$45,000", 
      source: "Internal S&M Analysis",
      source_reference: { 
        url: "https://internal.model/unit-economics", 
        document_type: "Unit Economics Model", 
        excerpt: "CAC = Total S&M Spend / New Customers Acquired = $134M / 2,978 = $45K",
        accessed_at: "2024-12-14T09:00:00Z"
      },
      formula: "Total S&M Spend / New Customers Acquired",
      formula_inputs: [
        { name: "S&M Spend", value: 134000000, source: "10-Q" },
        { name: "New Customers", value: 2978, source: "CRM Data" }
      ]
    },
    ltv: { 
      value: 180000, 
      formatted: "$180,000", 
      source: "Internal Model",
      source_reference: { 
        url: "https://internal.model/unit-economics", 
        document_type: "Unit Economics Model", 
        excerpt: "LTV = ARPA × Gross Margin % × Avg Customer Lifespan = $4,500 × 12 × 50% × 4 years = $180K",
        accessed_at: "2024-12-14T09:00:00Z"
      },
      formula: "ARPA × 12 × Gross Margin % × Avg Customer Lifespan (years)",
      formula_inputs: [
        { name: "ARPA (monthly)", value: 4500, source: "Billing Data" },
        { name: "Gross Margin", value: 50, source: "10-Q" },
        { name: "Avg Lifespan (years)", value: 4, source: "Cohort Analysis" }
      ]
    },
    ltv_cac_ratio: { 
      value: 4.0, 
      formatted: "4.0x", 
      source: "Calculated",
      formula: "LTV / CAC",
      formula_inputs: [
        { name: "LTV", value: 180000, source: "Model" },
        { name: "CAC", value: 45000, source: "Model" }
      ]
    },
    payback_period_months: { 
      value: 20, 
      formatted: "20 months", 
      source: "Calculated",
      formula: "CAC / (ARPA × Gross Margin %)",
      formula_inputs: [
        { name: "CAC", value: 45000, source: "Model" },
        { name: "Monthly Contribution", value: 2250, source: "ARPA × GM%" }
      ]
    },
    investor_context: {
      ltv_cac_interpretation: "LTV/CAC of 4.0x indicates strong unit economics. Industry benchmark is 3.0x minimum for sustainable growth. Company earns $4 for every $1 spent acquiring customers, providing significant margin of safety for continued S&M investment.",
      benchmark_comparison: "Above median for industrial SaaS (3.2x) and software peers (3.5x). Top quartile performers achieve 5.0x+. Current ratio supports aggressive growth investment.",
      trend_analysis: "LTV/CAC improved from 3.6x to 4.0x YoY driven by: (1) 12% ARPA expansion, (2) reduced churn from 1.5% to 1.2% monthly, (3) stable CAC despite increased S&M spend.",
      risk_factors: [
        "CAC may increase as company exhausts early-adopter market",
        "Churn could spike if economic conditions deteriorate", 
        "LTV assumes stable gross margins; input cost inflation is a risk"
      ],
      action_implications: "Strong unit economics support thesis of continued market share gains. Monitor: (1) CAC trajectory as new market segments targeted, (2) cohort retention curves, (3) expansion revenue as % of new ARR."
    },
    source: "Internal Unit Economics Model",
    source_reference: { 
      url: "https://internal.model/unit-economics", 
      document_type: "Unit Economics Analysis", 
      excerpt: "Quarterly unit economics review - Q3 2024",
      accessed_at: "2024-12-14T09:00:00Z"
    }
  },

  run_data_quality: { coverage: 88, auditability: 82, freshness_days: 1 },
};
