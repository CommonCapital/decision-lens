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
    if (!dashboardData.public_data) return null;
    
    return buildTimeSeriesDataset(
      dashboardData.run_metadata.entity,
      {
        stock_price: dashboardData.public_data.stock_price,
        revenue: dashboardData.financials.revenue,
        ebitda: dashboardData.financials.ebitda,
        volume: dashboardData.public_data.volume,
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
    
    // Brief delay to allow exit animation
    setTimeout(() => {
      setHorizonState(newHorizon);
      
      // Allow enter animation
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
