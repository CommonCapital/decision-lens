import { useState, useMemo, useCallback } from "react";
import { 
  TimeHorizon, 
  TimeSeriesDataset, 
  HorizonData, 
  buildTimeSeriesDataset 
} from "@/lib/time-series-data";
import { InvestorDashboard } from "@/lib/investor-schema";

interface UseTimeHorizonReturn {
  horizon: TimeHorizon;
  setHorizon: (h: TimeHorizon) => void;
  horizonData: HorizonData | null;
  dataset: TimeSeriesDataset | null;
  isTransitioning: boolean;
}

export function useTimeHorizon(dashboardData: InvestorDashboard): UseTimeHorizonReturn {
  const [horizon, setHorizonState] = useState<TimeHorizon>("1M");
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Build time-series dataset from base metrics
  const dataset = useMemo(() => {
    if (!dashboardData.market_data) return null;
    
    return buildTimeSeriesDataset(
      dashboardData.run_metadata.entity,
      {
        stock_price: dashboardData.market_data.stock_price,
        revenue: dashboardData.financials.revenue,
        ebitda: dashboardData.financials.ebitda,
        volume: dashboardData.market_data.market_cap, // Using market_cap as proxy
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
