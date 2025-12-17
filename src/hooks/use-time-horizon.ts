import { useState, useMemo, useCallback } from "react";
import { 
  TimeHorizon, 
  TimeSeriesDataset, 
  HorizonData, 
  buildTimeSeriesDataset 
} from "@/lib/time-series-data";
import { InvestorDashboard, Metric, MetricWithHistory } from "@/lib/investor-schema";

interface UseTimeHorizonReturn {
  horizon: TimeHorizon;
  setHorizon: (h: TimeHorizon) => void;
  horizonData: HorizonData | null;
  dataset: TimeSeriesDataset | null;
  isTransitioning: boolean;
}

// Helper to extract current metric from MetricWithHistory
function extractMetric(metricWithHistory: MetricWithHistory | undefined): Metric | null {
  if (!metricWithHistory?.current) return null;
  return metricWithHistory.current;
}

// Create a default metric for volume proxy
function createVolumeMetric(marketCap: MetricWithHistory | undefined): Metric {
  const currentMetric = extractMetric(marketCap);
  return {
    value: currentMetric?.value ?? 1000000,
    formatted: currentMetric?.formatted ?? "$1M",
    unit: "shares",
    source: "Derived from Market Cap",
    tie_out_status: "provisional",
    last_updated: currentMetric?.last_updated ?? new Date().toISOString(),
    confidence: 70,
    availability: currentMetric?.availability ?? "available",
  };
}

export function useTimeHorizon(dashboardData: InvestorDashboard): UseTimeHorizonReturn {
  const [horizon, setHorizonState] = useState<TimeHorizon>("1M");
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Build time-series dataset from base metrics
  const dataset = useMemo(() => {
    if (!dashboardData.market_data) return null;
    
    const stockPrice = extractMetric(dashboardData.market_data.stock_price);
    const revenue = extractMetric(dashboardData.financials.revenue);
    const ebitda = extractMetric(dashboardData.financials.ebitda);
    const volume = createVolumeMetric(dashboardData.market_data.market_cap);
    
    if (!stockPrice || !revenue || !ebitda) return null;
    
    return buildTimeSeriesDataset(
      dashboardData.run_metadata.entity,
      {
        stock_price: stockPrice,
        revenue: revenue,
        ebitda: ebitda,
        volume: volume,
      }
    );
  }, [dashboardData]);
  
  // Get current horizon data
  const horizonData = useMemo(() => {
    return dataset?.horizons[horizon] || null;
  }, [dataset, horizon]);
  
  // Handle horizon change with transition
  const setHorizon = useCallback((newHorizon: TimeHorizon) => {
    if (newHorizon === horizon) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setHorizonState(newHorizon);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  }, [horizon]);
  
  return {
    horizon,
    setHorizon,
    horizonData,
    dataset,
    isTransitioning,
  };
}
