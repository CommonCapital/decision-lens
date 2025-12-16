// Uncertainty and Decision Sufficiency Types
// These types overlay the existing schema to add decision-awareness

export type DataAvailability = 
  | "available"      // Data present and validated
  | "pending"        // Expected but not yet received
  | "unavailable"    // Source doesn't provide this
  | "restricted"     // Behind paywall or access limited
  | "stale"          // Data exists but outdated
  | "conflicting";   // Multiple sources disagree

export type SufficiencyLevel = 
  | "sufficient"     // Enough to decide with confidence
  | "partial"        // Can proceed with caveats
  | "insufficient"   // Cannot make informed decision
  | "blocked";       // Critical data missing

export interface UncertaintyReason {
  field: string;
  status: DataAvailability;
  explanation: string;
  impact: "critical" | "material" | "minor";
  workaround?: string;
}

export interface DecisionAssessment {
  sufficiency: SufficiencyLevel;
  confidence: number; // 0-100
  known: string[];
  unknown: string[];
  blockers: string[];
  caveats: string[];
  wouldChangeConclusion: string[];
  recommendation: string;
}

// Helper to compute sufficiency from data completeness
export function computeSufficiency(
  requiredFields: string[],
  availableFields: string[],
  criticalFields: string[]
): DecisionAssessment {
  const missingFields = requiredFields.filter(f => !availableFields.includes(f));
  const missingCritical = criticalFields.filter(f => !availableFields.includes(f));
  
  const completeness = availableFields.length / requiredFields.length;
  
  let sufficiency: SufficiencyLevel;
  let confidence: number;
  let recommendation: string;
  
  if (missingCritical.length > 0) {
    sufficiency = "blocked";
    confidence = Math.min(100, Math.round(completeness * 30));
    recommendation = `Cannot proceed: missing critical data (${missingCritical.join(", ")})`;
  } else if (completeness >= 0.9) {
    sufficiency = "sufficient";
    confidence = Math.min(100, Math.round(75 + (completeness * 25)));
    recommendation = "Sufficient data to make informed decision";
  } else if (completeness >= 0.6) {
    sufficiency = "partial";
    confidence = Math.min(100, Math.round(40 + (completeness * 35)));
    recommendation = "Can proceed with documented caveats";
  } else {
    sufficiency = "insufficient";
    confidence = Math.min(100, Math.round(completeness * 40));
    recommendation = "Recommend sourcing additional data before decision";
  }
  
  return {
    sufficiency,
    confidence,
    known: availableFields,
    unknown: missingFields,
    blockers: missingCritical,
    caveats: missingFields.length > 0 
      ? [`${missingFields.length} data points unavailable`]
      : [],
    wouldChangeConclusion: missingCritical.length > 0
      ? missingCritical.map(f => `Availability of ${f}`)
      : [],
    recommendation,
  };
}

// Assess a dashboard for decision readiness
export function assessDashboardSufficiency(data: any): DecisionAssessment {
  const requiredFields = [
    "revenue", "ebitda", "free_cash_flow", "revenue_growth",
    "stock_price", "market_cap", "events", "risks", "scenarios"
  ];
  
  const criticalFields = [
    "revenue", "ebitda", "thesis_status"
  ];
  
  const availableFields: string[] = [];
  
  // Check financials
  if (data?.financials?.revenue?.value) availableFields.push("revenue");
  if (data?.financials?.ebitda?.value) availableFields.push("ebitda");
  if (data?.financials?.free_cash_flow?.value) availableFields.push("free_cash_flow");
  if (data?.financials?.revenue_growth?.value) availableFields.push("revenue_growth");
  
  // Check market data
  if (data?.market_data?.stock_price?.value) availableFields.push("stock_price");
  if (data?.market_data?.market_cap?.value) availableFields.push("market_cap");
  
  // Check arrays
  if (data?.events?.length > 0) availableFields.push("events");
  if (data?.risks?.length > 0) availableFields.push("risks");
  if (data?.scenarios?.length > 0) availableFields.push("scenarios");
  
  // Check executive summary
  if (data?.executive_summary?.thesis_status) availableFields.push("thesis_status");
  
  return computeSufficiency(requiredFields, availableFields, criticalFields);
}

// Get uncertainty reasons for missing/problematic data
export function getUncertaintyReasons(data: any): UncertaintyReason[] {
  const reasons: UncertaintyReason[] = [];
  
  // Check for provisional data
  const checkMetric = (obj: any, path: string, label: string, impact: "critical" | "material" | "minor") => {
    if (!obj) {
      reasons.push({
        field: label,
        status: "unavailable",
        explanation: `${label} not available from current data sources`,
        impact,
        workaround: "Consider alternative data providers or direct company inquiry"
      });
    } else if (obj.tie_out_status === "provisional") {
      reasons.push({
        field: label,
        status: "pending",
        explanation: `${label} is provisional - awaiting confirmation`,
        impact: impact === "critical" ? "material" : "minor",
        workaround: "Value usable with noted uncertainty"
      });
    } else if (obj.tie_out_status === "flagged") {
      reasons.push({
        field: label,
        status: "conflicting",
        explanation: `${label} has conflicting source data`,
        impact,
        workaround: "Manual reconciliation required"
      });
    }
  };
  
  // Check key metrics
  checkMetric(data?.financials?.revenue, "financials.revenue", "Revenue", "critical");
  checkMetric(data?.financials?.ebitda, "financials.ebitda", "EBITDA", "critical");
  checkMetric(data?.financials?.free_cash_flow, "financials.free_cash_flow", "Free Cash Flow", "material");
  checkMetric(data?.market_data?.stock_price, "market_data.stock_price", "Stock Price", "material");
  checkMetric(data?.market_data?.target_price, "market_data.target_price", "Target Price", "minor");
  checkMetric(data?.market_data?.pe_ratio, "market_data.pe_ratio", "P/E Ratio", "minor");
  checkMetric(data?.market_data?.ev_ebitda, "market_data.ev_ebitda", "EV/EBITDA", "material");
  
  return reasons;
}
