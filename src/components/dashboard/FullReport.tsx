import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  Zap,
  FileText,
  Calendar,
  DollarSign,
  Users,
  Building,
  Globe,
  Lock,
  AlertCircle,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Full mock data
const MOCK_DATA = {
  ai_insights: [
    {
      action_required: true,
      assumptions: [
        "Data sovereignty regulations will expand across major markets.",
        "Regulators in EU/Asia do not accept Microsoft's global compliance solutions.",
        "AI workloads require deployment in local sovereign regions.",
      ],
      confidence_band: "Medium",
      details:
        "Governments increasingly require local AI clusters to satisfy privacy and sovereignty, potentially forcing redundant infrastructure and elevating costs relative to global-scale competitors.",
      falsification_criteria: [
        'Microsoft announces a "Universal Data Plane" accepted by regulators, enabling federated compliance without redundant local clusters.',
        "Major regulatory rollbacks enabling more centralized cloud management.",
      ],
      generated_at: "2026-01-07T12:00:00Z",
      horizon_relevance: ["1Y", "5Y"],
      id: "AI-001",
      impact_score: 8,
      source: "AI Insights, Strategic Report (MSFT), January 2026",
      summary:
        'EU and Asia data residency demands could force Microsoft into inefficient regional CapEx, undermining "global fleet" cloud efficiencies.',
      title: "Sovereign Cloud Fragmentation",
      type: "Risk",
    },
    {
      action_required: false,
      assumptions: [
        "Gaming data effectively simulates real-world multi-agent AI environments.",
        "Learnings from gaming efficiently transfer to enterprise applications.",
        "Gaming user base remains large and engaged to support robust data flows.",
      ],
      confidence_band: "Low",
      details:
        "The massive scale and telemetry data from gaming enables accelerated training and safe experimentation for autonomous agents, which can subsequently power productivity solutions like Excel and Teams.",
      falsification_criteria: [
        "Microsoft spins off or divests gaming hardware or key platforms.",
        "Inability to transfer AI advances from gaming to enterprise products.",
        "Gaming user engagement or spend drops significantly.",
      ],
      generated_at: "2026-01-07T12:00:00Z",
      horizon_relevance: ["1Y", "3Y"],
      id: "AI-002",
      impact_score: 6,
      source: "AI Insights, Strategic Report (MSFT), January 2026",
      summary:
        "Microsoft is leveraging its Xbox/Activision gaming business as a training ground for agentic AI before broad enterprise deployment.",
      title: "Gaming as AI Sandbox",
      type: "Strategy",
    },
  ],
  base_metrics: {
    arpa: 320,
    arr: 138000000000,
    arr_prior: 110000000000,
    average_customer_lifespan_months: 120,
    cash: 14350000000,
    churned_arr: 4140000000,
    contraction_arr: 0,
    current_assets: 158700000000,
    current_liabilities: 118400000000,
    customer_count: 430000000,
    ebitda_availability: "reported",
    ebitda_proxy: 0,
    ebitda_reported: 37200000000,
    ebitda_ttm: 128500000000,
    expansion_arr: 12000000000,
    free_cash_flow: 73200000000,
    gross_margin_percent: 69,
    gross_profit: 46150000000,
    gross_profit_ttm: 178500000000,
    headcount: 221000,
    market_cap: 3110000000000,
    marketable_securities: 64100000000,
    monthly_churn_percent: 0.25,
    net_burn: 0,
    new_arr: 28000000000,
    operating_income: 30550000000,
    operating_income_ttm: 114000000000,
    rd_spend: 32488000000,
    revenue: 65585000000,
    revenue_prior: 64727000000,
    revenue_ttm: 254190000000,
    shares_outstanding: 7430000000,
    sm_spend: 24200000000,
    stock_price: 418.9,
    top_10_customer_revenue_percent: 0,
    top_3_customer_revenue_percent: 0,
    top_5_supplier_spend_percent: 0,
    top_customer_revenue_percent: 0,
    top_supplier_spend_percent: 0,
    total_debt: 102140000000,
  },
  buyback_capacity: {
    availability: "Available",
    confidence: 0.9,
    formatted: "$60B authorization",
    source: "Board Authorization",
    value: 60000000000,
  },
  changes_since_last_run: [
    {
      action:
        "Monitor Q2 CapEx guidance (Jan 28) to differentiate between timing shifts and structural efficiency.",
      category: "Capital Allocation",
      description:
        "Q1 CapEx of $19.39B was significantly below the $23.04B consensus, raising discussion about whether demand is slowing or efficiency is improving.",
      id: "CHG-001",
      so_what:
        "If lower spend is due to silicon efficiency (Maia/light-based AOC), margins benefit. If it reflects GPU supply/demand bottlenecks, it's a headwind.",
      source_url:
        "https://www.xtb.com/int/market-analysis/news-and-research/microsoft-q1-2026-earnings",
      thesis_pillar: "AI Infrastructure ROI",
      timestamp: "2025-10-30T14:00:00Z",
      title: "CapEx Undershoot vs. Consensus",
    },
    {
      action:
        "Adjust FY27 revenue models to account for higher base subscription pricing.",
      category: "Monetization Strategy",
      description:
        "Shift from selling Copilot as a $30/user SKU to embedding it in core M365 tiers with an overall price increase.",
      id: "CHG-002",
      so_what:
        "Simplifies sales cycle and forces adoption, potentially accelerating AI revenue more reliably than elective add-ons.",
      source_url:
        "https://www.techrepublic.com/article/news-microsoft-2026-product-plans/",
      thesis_pillar: "Productivity Dominance",
      timestamp: "2025-12-18T09:00:00Z",
      title: "Copilot Transition to Baseline Feature",
    },
  ],
  company_type: "public",
  events: [
    {
      date: "2025-10-29",
      description:
        "Microsoft reported Q1 revenue of $77.7B (+18% YoY) versus $75.6B consensus, with non-GAAP EPS of $4.13 beating $3.65 consensus. Azure and cloud services grew 39% ex-FX, outpacing the 37% target.",
      id: "EVT-001",
      impact:
        "Positive - Demonstrated continued cloud dominance and AI monetization; however, shares dipped 3% post-market due to AI ROI concerns.",
      source_url:
        "https://www.microsoft.com/en-us/investor/earnings/fy-2026-q1/press-release-webcast",
      title: "Q1 FY26 Earnings Outperformance",
      type: "Earnings",
    },
    {
      date: "2025-12-11",
      description:
        "Microsoft unveiled 7 AI trends for 2026 and introduced 'Majorana 1,' the world's first quantum chip with a topological core architecture designed for scalable qubits.",
      id: "EVT-002",
      impact:
        "Positive - Signals long-term technical leadership in next-gen compute (Quantum) and autonomous AI agents.",
      source_url:
        "https://news.microsoft.com/source/asia/2025/12/11/microsoft-unveils-7-ai-trends-for-2026/",
      title: "2026 AI Roadmap & Quantum Milestone",
      type: "Strategic Update",
    },
    {
      date: "2025-12-18",
      description:
        "Microsoft announced that M365 commercial pricing will increase effective July 1, 2026, as AI/Copilot features are moved from optional add-ons to core baseline capabilities.",
      id: "EVT-003",
      impact:
        "Positive - Drives ARPU expansion and reinforces high switching costs.",
      source_url:
        "https://www.techrepublic.com/article/news-microsoft-2026-product-plans/",
      title: "M365 Commercial Pricing Update Announced",
      type: "Pricing Strategy",
    },
    {
      date: "2026-01-08",
      description:
        "Microsoft launched 'Agentic AI' solutions for retail, including Copilot Checkout and Brand Agents, allowing merchants to embed shopping assistants in digital storefronts.",
      id: "EVT-004",
      impact:
        "Positive - Expands AI application layer beyond generic productivity into specialized vertical workflows.",
      source_url:
        "https://news.microsoft.com/source/2026/01/08/microsoft-propels-retail-forward-with-agentic-ai-capabilities/",
      title: "Agentic AI for Retail Solutions",
      type: "Product Launch",
    },
  ],
  executive_summary: {
    headline:
      "Microsoft leads the AI infrastructure era with robust Azure growth, but faces scrutiny over soaring capital expenditures and margin pressures in 2026.",
    implications: [
      "The shift from cloud growth to AI-driven value creation is underway, and future valuation will hinge on the efficiency of capital deployment.",
      "A stable and large backlog offers some floor to valuation, but investors are demanding clear returns on aggressive AI investments.",
      "Enterprise adoption of autonomous AI agents could redefine software monetization, but real-world usage and ROI will be key validation points.",
      "Competition and regulatory demands could challenge Microsoft's ability to maintain its global infrastructure efficiency.",
    ],
    key_facts: [
      "Q1 FY2026 revenue reached $77.7B, up 18% YoY and ahead of Wall Street expectations.",
      "Azure posted 40% growth, outperforming AWS and Google Cloud in the latest quarter.",
      "AI-related capital expenditures surged 74% YoY to $34.9B for the quarter.",
      "Microsoft announced 11,000–22,000 layoffs to manage AI investment costs and reorient toward agentic AI.",
      "Commercial RPO backlog stands at $392B, offering multi-year revenue visibility.",
    ],
    key_risks: [
      "Prolonged high CapEx with slow AI revenue ramp could compress margins and contract valuation multiples.",
      "Physical AI infrastructure constraints create ceilings on Azure revenue growth if capacity fails to scale with demand.",
      "Microsoft's deep dependency on OpenAI exposes it to concentrated partner risk if exclusivity agreements or OpenAI's structure shifts.",
    ],
    thesis_status: "intact",
  },
  guidance_bridge: {
    current_consensus: {
      formatted: "$80.05B",
      source: "FactSet Consensus",
      value: 80050000000,
    },
    gap_percent: {
      formatted: "0.06%",
      value: 0.0006,
    },
    high: {
      formatted: "$80.6B",
      value: 80600000000,
    },
    low: {
      formatted: "$79.5B",
      value: 79500000000,
    },
  },
  hypotheses: [
    {
      action_required: false,
      assumptions: [
        "Enterprises are willing to pay a premium for autonomous software agents.",
        "Agentic AI can outperform Copilots in real business value.",
        "AI agent adoption grows rapidly within Dynamics 365 and Microsoft 365 platforms.",
      ],
      confidence_band: "High",
      details:
        "Agentic AI is estimated to become the primary revenue driver, supplanting the current generation of Copilot products as enterprises value autonomous task solutions over traditional chat interfaces.",
      falsification_criteria: [
        "Copilot churn rates increase significantly.",
        "Revenue from Dynamics 365 Agents remains below 5% of its segment for two or more quarters.",
        "Enterprise customers delay implementing agentic solutions.",
      ],
      generated_at: "2026-01-07T12:00:00Z",
      horizon_relevance: ["1Y", "5Y"],
      id: "HYP-001",
      impact_score: 9,
      source: "Strategic Insight Report: Microsoft (MSFT), January 2026",
      summary:
        "Enterprise demand will shift from Copilot to autonomous AI Agents by late 2026, driving the next wave of Microsoft revenue.",
      title: "The Agentic AI Supercycle",
      type: "Growth",
    },
    {
      action_required: true,
      assumptions: [
        "Maia chip deployment is successful in internal data centers.",
        "Microsoft secures sufficient scale to achieve cost efficiencies.",
        "Transition to custom silicon does not disrupt existing Azure workloads or partner relationships.",
      ],
      confidence_band: "Medium",
      details:
        "Microsoft's investment in custom AI chips aims to serve over 30% of internal AI inference workloads, which should shield margins from volatility in third-party component pricing and improve long-term efficiency.",
      falsification_criteria: [
        "Azure AI service gross margins continue to fall for four or more consecutive quarters.",
        "Custom silicon fails to reach deployment targets or deliver expected efficiency gains.",
        "Microsoft remains overly reliant on NVIDIA for key AI workloads past 2027.",
      ],
      generated_at: "2026-01-07T12:00:00Z",
      horizon_relevance: ["1Y", "5Y"],
      id: "HYP-002",
      impact_score: 8,
      source: "Strategic Insight Report: Microsoft (MSFT), January 2026",
      summary:
        "In-house AI silicon (Maia chips) will stabilize Azure margins by reducing dependency on third-party GPU suppliers by 2027.",
      title: "The Infrastructure Efficiency Pivot",
      type: "Margin",
    },
    {
      action_required: false,
      assumptions: [
        "Contracted revenue continues to convert as scheduled.",
        "Enterprise customer retention remains strong.",
        "Global economic conditions do not trigger mass contract cancellations.",
      ],
      confidence_band: "High",
      details:
        "The sizable revenue backlog, with 80% expected to convert within 24 months, provides protection for Microsoft's earnings base and justifies valuation multiples above sector average.",
      falsification_criteria: [
        "Major cancellations or downgrades in commercial cloud contracts.",
        "Backlog conversion rate drops significantly below 80%.",
        "Prolonged global downturn erodes enterprise spending.",
      ],
      generated_at: "2026-01-07T12:00:00Z",
      horizon_relevance: ["1Y", "3Y"],
      id: "HYP-003",
      impact_score: 7,
      source: "Strategic Insight Report: Microsoft (MSFT), January 2026",
      summary:
        "Microsoft's $392B commercial RPO acts as a synthetic bond, supporting the stock's premium valuation.",
      title: "Backlog as a Valuation Floor",
      type: "Valuation",
    },
  ],
  kill_switch: {
    conditions: [
      "OpenAI partnership termination or loss of exclusive IP rights before 2030",
      "Mandatory divestiture of Azure or Activision Blizzard due to antitrust rulings",
      "Sustained quarterly Cloud Gross Margin drop below 60%",
      "Critical data breach involving >100M users with proven negligence",
      "Significant AI regulatory ban in a tier-1 market (US/EU) affecting primary services",
    ],
  },
  net_cash_or_debt: {
    formatted: "$18.36B net debt",
    source: "Q1 FY26 Balance Sheet",
    value: 18363000000,
  },
  path_indicators: [
    {
      label: "Azure Revenue Growth (ex-FX)",
      next_check: "2026-01-28",
      status: "Ahead - Surpassed 37% guidance",
      value: "39% (Q1 FY26)",
    },
    {
      label: "Commercial RPO",
      next_check: "2026-01-28",
      status: "On Track - +51% YoY growth indicates long-term backlog strength",
      value: "$392B",
    },
    {
      label: "OpenAI Investment Impact (Quarterly)",
      next_check: "2026-01-28",
      status: "Monitor - Increasing impact on GAAP earnings ($0.41/share)",
      value: "$3.1B loss (non-cash)",
    },
  ],
  position_sizing: {
    current_percent: 0,
    max_percent: 10,
    target_high: 8,
    target_low: 4.5,
  },
  revisions_momentum: {
    direction: "up",
    magnitude: {
      formatted: "111% CC",
      value: 1.11,
    },
    trend:
      "Upward revisions driven by Azure outperformance (40% growth vs 37% guidance) and surging commercial RPO (+51% YoY to $392B).",
  },
  risks: {
    cybersecurity: [
      {
        description:
          "Adversaries using Generative AI to scale phishing and bypass biometric/selfie checks via high-fidelity deepfakes.",
        id: "CYB-001",
        mitigation:
          "Secure Future Initiative (SFI) and phishing-resistant MFA deployment.",
        probability: 0.75,
        severity: "High",
        status: "Active",
        title: "AI-Driven Social Engineering",
        trigger: "Significant breach of Microsoft 365 or Azure customer data",
      },
      {
        description:
          "Increasingly sophisticated attacks on field-level devices and cloud service outages.",
        id: "CYB-002",
        mitigation:
          "Zero Trust principles and $4B in annual fraud-blocking investments.",
        probability: 0.45,
        severity: "High",
        status: "Active",
        title: "Supply Chain and Cloud Infrastructure Vulnerability",
        trigger: "Large-scale Azure outage due to cyberattack",
      },
    ],
    financial: [
      {
        description:
          "High Capex and operating costs for AI infrastructure may reduce gross margins (forecasted drop from 68% to 66% in 2026).",
        id: "FIN-001",
        mitigation:
          "Software optimizations for 10x model generation efficiency gains.",
        probability: 0.7,
        severity: "Medium",
        status: "Active",
        title: "AI-Driven Margin Erosion",
        trigger: "Earnings release showing lower-than-guided margins",
      },
      {
        description:
          "A strong US Dollar could negatively impact the translation of international revenues.",
        id: "FIN-002",
        mitigation:
          "Hedging strategies and focus on constant-currency growth metrics.",
        probability: 0.5,
        severity: "Low",
        status: "Monitoring",
        title: "Foreign Currency Volatility",
        trigger: "Significant USD appreciation vs EUR/GBP/JPY",
      },
    ],
    market: [
      {
        description:
          "Intense competition from AWS and Google Cloud could lead to stagnation of Azure's market share (currently ~20% vs AWS ~30%).",
        id: "MKT-001",
        mitigation:
          "Aggressive scaling of AI-specific infrastructure to differentiate Azure.",
        probability: 0.5,
        severity: "High",
        status: "Monitoring",
        title: "Cloud Market Share Stagnation",
        trigger: "Quarterly market share data showing Azure decline",
      },
      {
        description:
          "Potential market correction if AI investments do not yield expected ROI for enterprise customers in 2026.",
        id: "MKT-002",
        mitigation:
          "Diversifying revenue streams across gaming (Activision) and traditional software.",
        probability: 0.4,
        severity: "Medium",
        status: "Monitoring",
        title: "AI 'Bubble' Burst or Over-exuberance",
        trigger: "Decline in enterprise Copilot adoption or ROI metrics",
      },
    ],
    operational: [
      {
        description:
          "Reliance on specific hardware (NVIDIA GPUs) and availability of land/power for datacenters may limit growth.",
        id: "OPS-001",
        mitigation:
          "Investment in first-party silicon (Azure Maia) and custom Cobalt chips.",
        probability: 0.6,
        severity: "High",
        status: "Active",
        title: "AI Infrastructure Scaling Constraints",
        trigger:
          "Supply chain delays for H100/Blackwell chips or power grid failures",
      },
    ],
    regulatory: [
      {
        description:
          "Intense scrutiny from the FTC, EU, and UK regarding market dominance in cloud and AI, specifically the OpenAI partnership and 'acqui-hires' like Inflection AI.",
        id: "REG-001",
        mitigation:
          "Structuring AI partnerships as minority investments and maintaining 'Responsible AI' standards.",
        probability: 0.85,
        severity: "High",
        status: "Active",
        title: "Antitrust and Competition Scrutiny",
        trigger: "Formal antitrust lawsuits or mandated divestitures",
      },
      {
        description:
          "Mandatory compliance with the EU AI Act, which classifies certain AI systems as 'high-risk' and imposes strict transparency and safety obligations.",
        id: "REG-002",
        mitigation:
          "Internal 'Restricted Use Policy' and Azure AI Content Safety guardrails.",
        probability: 0.95,
        severity: "Medium",
        status: "Active",
        title: "EU AI Act Compliance",
        trigger: "Full enforceability of AI Act provisions in 2026/2027",
      },
    ],
    strategic: [
      {
        description:
          "Strategic reliance on OpenAI for core AI IP. Any internal OpenAI turmoil or shift in partnership terms poses a risk.",
        id: "STR-001",
        mitigation:
          "Developing internal models (Phi-3) and multi-model support on Azure.",
        probability: 0.3,
        severity: "High",
        status: "Active",
        title: "OpenAI Dependency and Relationship Risk",
        trigger: "OpenAI leadership change or legal separation",
      },
    ],
  },
  run_metadata: {
    entity: "Microsoft Corporation",
    owner: null,
    run_id: "run_2026-01-08T10:00:00Z",
    ticker: "MSFT",
    timestamp: "2026-01-08T10:00:00Z",
  },
  sbc_percent_revenue: {
    formatted: "4.25%",
    source: "Macrotrends / SEC Filings",
    value: 4.25,
  },
  scenarios: {
    base: {
      assumptions: [
        { key: "Revenue Growth", value: "12%" },
        { key: "EBITDA Margin", value: "50%" },
      ],
      drivers: [
        { category: "Growth", name: "Revenue Growth", value: "12%" },
        { category: "Margin", name: "EBITDA Margin", value: "50%" },
      ],
      outputs: {
        ebitda: { formatted: "$142.35B", value: 142346400000 },
        revenue: { formatted: "$284.69B", value: 284692800000 },
        valuation: { formatted: "$3.55T", value: 3550000000000 },
      },
      probability: 0.6,
    },
    downside: {
      assumptions: [
        { key: "Revenue Growth", value: "8%" },
        { key: "EBITDA Margin", value: "45%" },
      ],
      drivers: [
        { category: "Growth", name: "Revenue Growth", value: "8%" },
        { category: "Margin", name: "EBITDA Margin", value: "45%" },
      ],
      outputs: {
        ebitda: { formatted: "$123.54B", value: 123536340000 },
        revenue: { formatted: "$274.53B", value: 274525200000 },
        valuation: { formatted: "$2.70T", value: 2700000000000 },
      },
      probability: 0.15,
    },
    upside: {
      assumptions: [
        { key: "Revenue Growth", value: "15%" },
        { key: "EBITDA Margin", value: "52%" },
      ],
      drivers: [
        { category: "Growth", name: "Revenue Growth", value: "15%" },
        { category: "Margin", name: "EBITDA Margin", value: "52%" },
      ],
      outputs: {
        ebitda: { formatted: "$152.01B", value: 152005620000 },
        revenue: { formatted: "$292.32B", value: 292318500000 },
        valuation: { formatted: "$4.25T", value: 4250000000000 },
      },
      probability: 0.25,
    },
  },
  segments: [
    {
      growth: { formatted: "34.0%", value: 34 },
      margin: { formatted: "45.0%", value: 45 },
      name: "Intelligent Cloud",
      revenue: { formatted: "$105B", value: 105000000000 },
    },
    {
      growth: { formatted: "15.0%", value: 15 },
      margin: { formatted: "48.0%", value: 48 },
      name: "Productivity and Business Processes",
      revenue: { formatted: "$82B", value: 82000000000 },
    },
  ],
  share_count_trend: {
    formatted: "-0.8% YoY",
    source: "10-K / 10-Q Filings",
    value: -0.8,
  },
};

const formatCurrency = (value: number): string => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
};

const formatNumber = (value: number): string => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toLocaleString();
};

const thesisStatusConfig = {
  intact: { icon: CheckCircle, label: "THESIS INTACT", className: "bg-primary text-primary-foreground" },
  challenged: { icon: AlertTriangle, label: "THESIS CHALLENGED", className: "bg-warning text-warning-foreground" },
  broken: { icon: XCircle, label: "THESIS BROKEN", className: "bg-destructive text-destructive-foreground" },
};

const severityColors = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-muted text-muted-foreground border-border",
};

const confidenceColors = {
  High: "bg-primary/10 text-primary",
  Medium: "bg-warning/10 text-warning",
  Low: "bg-muted text-muted-foreground",
};

export function FullReport() {
  const data = MOCK_DATA;
  const thesisStatus = data.executive_summary.thesis_status as keyof typeof thesisStatusConfig;
  const StatusIcon = thesisStatusConfig[thesisStatus].icon;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-serif font-semibold">{data.run_metadata.entity}</h1>
                  <Badge variant="outline" className="font-mono text-xs">
                    {data.run_metadata.ticker}
                  </Badge>
                </div>
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                  {data.company_type} • Run ID: {data.run_metadata.run_id}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-mono font-medium">${data.base_metrics.stock_price}</div>
                <div className="text-micro text-muted-foreground">
                  Market Cap: {formatCurrency(data.base_metrics.market_cap)}
                </div>
              </div>
              <div className={cn("flex items-center gap-2 px-4 py-2 rounded-sm", thesisStatusConfig[thesisStatus].className)}>
                <StatusIcon className="w-4 h-4" />
                <span className="text-micro uppercase tracking-ultra-wide font-medium">
                  {thesisStatusConfig[thesisStatus].label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Executive Summary */}
        <section className="space-y-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
            Executive Summary
          </h2>
          <p className="text-xl md:text-2xl font-serif font-normal leading-relaxed max-w-4xl">
            {data.executive_summary.headline}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-micro uppercase tracking-ultra-wide text-muted-foreground">Key Facts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.executive_summary.key_facts.map((fact, i) => (
                    <li key={i} className="text-sm font-light leading-relaxed flex gap-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {fact}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-micro uppercase tracking-ultra-wide text-muted-foreground">Implications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.executive_summary.implications.map((impl, i) => (
                    <li key={i} className="text-sm font-light leading-relaxed flex gap-2">
                      <Lightbulb className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      {impl}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-micro uppercase tracking-ultra-wide text-muted-foreground">Key Risks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.executive_summary.key_risks.map((risk, i) => (
                    <li key={i} className="text-sm font-light leading-relaxed flex gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Base Metrics */}
        <section className="space-y-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
            Base Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: "Revenue (Q)", value: formatCurrency(data.base_metrics.revenue) },
              { label: "Revenue TTM", value: formatCurrency(data.base_metrics.revenue_ttm) },
              { label: "ARR", value: formatCurrency(data.base_metrics.arr) },
              { label: "Gross Margin", value: `${data.base_metrics.gross_margin_percent}%` },
              { label: "EBITDA TTM", value: formatCurrency(data.base_metrics.ebitda_ttm) },
              { label: "Operating Income TTM", value: formatCurrency(data.base_metrics.operating_income_ttm) },
              { label: "Free Cash Flow", value: formatCurrency(data.base_metrics.free_cash_flow) },
              { label: "Cash", value: formatCurrency(data.base_metrics.cash) },
              { label: "Total Debt", value: formatCurrency(data.base_metrics.total_debt) },
              { label: "Shares Outstanding", value: formatNumber(data.base_metrics.shares_outstanding) },
              { label: "Customer Count", value: formatNumber(data.base_metrics.customer_count) },
              { label: "Headcount", value: formatNumber(data.base_metrics.headcount) },
              { label: "R&D Spend", value: formatCurrency(data.base_metrics.rd_spend) },
              { label: "S&M Spend", value: formatCurrency(data.base_metrics.sm_spend) },
              { label: "ARPA", value: `$${data.base_metrics.arpa}` },
              { label: "Monthly Churn", value: `${data.base_metrics.monthly_churn_percent}%` },
              { label: "New ARR", value: formatCurrency(data.base_metrics.new_arr) },
              { label: "Expansion ARR", value: formatCurrency(data.base_metrics.expansion_arr) },
            ].map((metric, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-4">
                  <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-1">{metric.label}</div>
                  <div className="text-lg font-mono font-medium">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Guidance Bridge */}
        <section className="space-y-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
            Guidance Bridge
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-1">Guidance Low</div>
                <div className="text-xl font-mono font-medium">{data.guidance_bridge.low.formatted}</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-1">Guidance High</div>
                <div className="text-xl font-mono font-medium">{data.guidance_bridge.high.formatted}</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-1">Consensus</div>
                <div className="text-xl font-mono font-medium">{data.guidance_bridge.current_consensus.formatted}</div>
                <div className="text-xs text-muted-foreground">{data.guidance_bridge.current_consensus.source}</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-1">Gap to Consensus</div>
                <div className="text-xl font-mono font-medium">{data.guidance_bridge.gap_percent.formatted}</div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Segments */}
        <section className="space-y-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
            Business Segments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.segments.map((segment, i) => (
              <Card key={i} className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    {segment.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground">Revenue</div>
                      <div className="text-lg font-mono font-medium">{segment.revenue.formatted}</div>
                    </div>
                    <div>
                      <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground">Growth</div>
                      <div className="text-lg font-mono font-medium text-primary">{segment.growth.formatted}</div>
                    </div>
                    <div>
                      <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground">Margin</div>
                      <div className="text-lg font-mono font-medium">{segment.margin.formatted}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Scenarios */}
        <section className="space-y-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
            Valuation Scenarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["base", "downside", "upside"] as const).map((scenarioKey) => {
              const scenario = data.scenarios[scenarioKey];
              const colors = {
                base: "border-primary/30",
                downside: "border-destructive/30",
                upside: "border-primary/30",
              };
              return (
                <Card key={scenarioKey} className={cn("border-2", colors[scenarioKey])}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">{scenarioKey} Case</span>
                      <Badge variant="outline">{(scenario.probability * 100).toFixed(0)}% Prob</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-2">Assumptions</div>
                      <div className="space-y-1">
                        {scenario.assumptions.map((a, i) => (
                          <div key={i} className="text-sm flex justify-between">
                            <span className="text-muted-foreground">{a.key}</span>
                            <span className="font-mono">{a.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-2">Outputs</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Revenue</span>
                          <span className="font-mono font-medium">{scenario.outputs.revenue.formatted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">EBITDA</span>
                          <span className="font-mono font-medium">{scenario.outputs.ebitda.formatted}</span>
                        </div>
                        <div className="flex justify-between text-lg">
                          <span className="font-medium">Valuation</span>
                          <span className="font-mono font-bold text-primary">{scenario.outputs.valuation.formatted}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <Separator />

        {/* Path Indicators */}
        <section className="space-y-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
            Path Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.path_indicators.map((indicator, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground">{indicator.label}</div>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {indicator.next_check}
                    </Badge>
                  </div>
                  <div className="text-xl font-mono font-medium mb-1">{indicator.value}</div>
                  <div className="text-sm text-muted-foreground">{indicator.status}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Position Sizing */}
        <section className="space-y-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
            Position Sizing & Protection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Position Sizing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground">Current</div>
                    <div className="text-2xl font-mono font-medium">{data.position_sizing.current_percent}%</div>
                  </div>
                  <div>
                    <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground">Max</div>
                    <div className="text-2xl font-mono font-medium">{data.position_sizing.max_percent}%</div>
                  </div>
                  <div>
                    <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground">Target Low</div>
                    <div className="text-xl font-mono">{data.position_sizing.target_low}%</div>
                  </div>
                  <div>
                    <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground">Target High</div>
                    <div className="text-xl font-mono">{data.position_sizing.target_high}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  Kill Switch Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.kill_switch.conditions.map((condition, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      {condition}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Public Market Metrics */}
        <section className="space-y-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
            Public Market Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-1">Buyback Capacity</div>
                <div className="text-lg font-mono font-medium">{data.buyback_capacity.formatted}</div>
                <div className="text-xs text-muted-foreground">{data.buyback_capacity.source}</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-1">SBC % Revenue</div>
                <div className="text-lg font-mono font-medium">{data.sbc_percent_revenue.formatted}</div>
                <div className="text-xs text-muted-foreground">{data.sbc_percent_revenue.source}</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-1">Share Count Trend</div>
                <div className="text-lg font-mono font-medium">{data.share_count_trend.formatted}</div>
                <div className="text-xs text-muted-foreground">{data.share_count_trend.source}</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-1">Net Cash/Debt</div>
                <div className="text-lg font-mono font-medium">{data.net_cash_or_debt.formatted}</div>
                <div className="text-xs text-muted-foreground">{data.net_cash_or_debt.source}</div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Revisions Momentum */}
        <section className="space-y-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
            Revisions Momentum
          </h2>
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={cn("p-3 rounded-full", data.revisions_momentum.direction === "up" ? "bg-primary/10" : "bg-destructive/10")}>
                  {data.revisions_momentum.direction === "up" ? (
                    <TrendingUp className="w-6 h-6 text-primary" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-destructive" />
                  )}
                </div>
                <div>
                  <div className="text-2xl font-mono font-medium">{data.revisions_momentum.magnitude.formatted}</div>
                  <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                    Direction: {data.revisions_momentum.direction}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{data.revisions_momentum.trend}</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Changes Since Last Run */}
        <section className="space-y-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
            Changes Since Last Run
          </h2>
          <div className="space-y-4">
            {data.changes_since_last_run.map((change) => (
              <Card key={change.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{change.title}</h3>
                        <Badge variant="outline">{change.category}</Badge>
                        <Badge variant="secondary">{change.thesis_pillar}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(change.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <a href={change.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-sm mb-4">{change.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-muted/50 p-3 rounded">
                      <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-1">So What</div>
                      <p>{change.so_what}</p>
                    </div>
                    <div className="bg-primary/5 p-3 rounded">
                      <div className="text-micro uppercase tracking-ultra-wide text-primary mb-1">Action</div>
                      <p>{change.action}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Events */}
        <section className="space-y-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
            Events Timeline
          </h2>
          <div className="space-y-4">
            {data.events.map((event) => (
              <Card key={event.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{event.date}</span>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                    <a href={event.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <h3 className="font-medium mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                  <div className="text-sm bg-muted/50 p-2 rounded">
                    <span className="font-medium">Impact:</span> {event.impact}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* AI Insights */}
        <section className="space-y-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
            AI Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.ai_insights.map((insight) => (
              <Card key={insight.id} className={cn("border-2", insight.action_required ? "border-warning/50" : "border-border")}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={insight.type === "Risk" ? "destructive" : "default"}>{insight.type}</Badge>
                        <Badge className={confidenceColors[insight.confidence_band as keyof typeof confidenceColors]}>
                          {insight.confidence_band}
                        </Badge>
                        {insight.action_required && (
                          <Badge variant="outline" className="border-warning text-warning">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <div className="text-2xl font-mono font-bold text-primary">{insight.impact_score}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{insight.summary}</p>
                  <p className="text-sm text-muted-foreground">{insight.details}</p>
                  
                  <div>
                    <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-2">Assumptions</div>
                    <ul className="text-sm space-y-1">
                      {insight.assumptions.map((a, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-muted-foreground">•</span> {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-micro uppercase tracking-ultra-wide text-destructive mb-2">Falsification Criteria</div>
                    <ul className="text-sm space-y-1">
                      {insight.falsification_criteria.map((f, i) => (
                        <li key={i} className="flex gap-2">
                          <XCircle className="w-3 h-3 text-destructive shrink-0 mt-1" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Horizons: {insight.horizon_relevance.join(", ")}</span>
                    <span>•</span>
                    <span>{insight.source}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Hypotheses */}
        <section className="space-y-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
            Hypotheses
          </h2>
          <div className="space-y-6">
            {data.hypotheses.map((hypothesis) => (
              <Card key={hypothesis.id} className={cn("border-2", hypothesis.action_required ? "border-warning/50" : "border-border")}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{hypothesis.type}</Badge>
                        <Badge className={confidenceColors[hypothesis.confidence_band as keyof typeof confidenceColors]}>
                          {hypothesis.confidence_band} Confidence
                        </Badge>
                        {hypothesis.action_required && (
                          <Badge variant="outline" className="border-warning text-warning">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <CardTitle>{hypothesis.title}</CardTitle>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-mono font-bold text-primary">{hypothesis.impact_score}</div>
                      <div className="text-micro text-muted-foreground">Impact Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg font-serif">{hypothesis.summary}</p>
                  <p className="text-sm text-muted-foreground">{hypothesis.details}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded">
                      <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-2">Assumptions</div>
                      <ul className="text-sm space-y-1">
                        {hypothesis.assumptions.map((a, i) => (
                          <li key={i} className="flex gap-2">
                            <CheckCircle className="w-3 h-3 text-primary shrink-0 mt-1" /> {a}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-destructive/5 p-4 rounded">
                      <div className="text-micro uppercase tracking-ultra-wide text-destructive mb-2">Falsification Criteria</div>
                      <ul className="text-sm space-y-1">
                        {hypothesis.falsification_criteria.map((f, i) => (
                          <li key={i} className="flex gap-2">
                            <XCircle className="w-3 h-3 text-destructive shrink-0 mt-1" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                    <span>Horizons: {hypothesis.horizon_relevance.join(", ")}</span>
                    <span>•</span>
                    <span>{hypothesis.source}</span>
                    <span>•</span>
                    <span>Generated: {new Date(hypothesis.generated_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Risks */}
        <section className="space-y-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
            Risk Registry
          </h2>
          
          {Object.entries(data.risks).map(([category, risks]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-sm font-medium capitalize flex items-center gap-2">
                {category === "regulatory" && <Globe className="w-4 h-4" />}
                {category === "financial" && <DollarSign className="w-4 h-4" />}
                {category === "market" && <BarChart3 className="w-4 h-4" />}
                {category === "operational" && <Building className="w-4 h-4" />}
                {category === "cybersecurity" && <Shield className="w-4 h-4" />}
                {category === "strategic" && <Target className="w-4 h-4" />}
                {category} Risks
              </h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Risk</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Severity</TableHead>
                    <TableHead className="w-[80px]">Prob.</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>Mitigation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {risks.map((risk) => (
                    <TableRow key={risk.id}>
                      <TableCell className="font-medium">{risk.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{risk.description}</TableCell>
                      <TableCell>
                        <Badge className={severityColors[risk.severity as keyof typeof severityColors]}>
                          {risk.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{(risk.probability * 100).toFixed(0)}%</TableCell>
                      <TableCell>
                        <Badge variant={risk.status === "Active" ? "default" : "outline"}>
                          {risk.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{risk.mitigation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border mt-12">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              <span>Generated: {new Date(data.run_metadata.timestamp).toLocaleString()}</span>
              <span className="mx-2">•</span>
              <span>Run ID: {data.run_metadata.run_id}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Full Investor Report</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default FullReport;
