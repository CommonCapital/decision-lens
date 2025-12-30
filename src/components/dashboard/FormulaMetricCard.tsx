import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormulaMetricCardProps {
  label: string;
  value: string;
  formula?: string;
  inputs?: { name: string; value: number | null; formatted: string }[];
  source?: string;
  size?: "sm" | "lg";
  className?: string;
}

export function FormulaMetricCard({
  label,
  value,
  formula,
  inputs,
  source,
  size = "sm",
  className
}: FormulaMetricCardProps) {
  // Don't render if value is null/empty
  if (value === "—" || value === "" || value === null) {
    return null;
  }

  const hasFormula = formula && inputs && inputs.length > 0;

  return (
    <div className={cn(
      "p-4 bg-card",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
          {label}
        </span>
        {hasFormula && (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Info className="w-3 h-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className="max-w-xs bg-card border border-border p-3"
              >
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                    Formula
                  </div>
                  <code className="text-xs font-mono bg-secondary px-2 py-1 block">
                    {formula}
                  </code>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-3 mb-1">
                    Inputs
                  </div>
                  <div className="space-y-1">
                    {inputs.map((input, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{input.name}</span>
                        <span className="font-mono">{input.formatted}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className={cn(
        "font-mono font-medium",
        size === "lg" ? "text-2xl" : "text-lg"
      )}>
        {value}
      </div>
      
      {source && !hasFormula && (
        <span className="text-[10px] text-muted-foreground mt-1 block">
          {source}
        </span>
      )}
    </div>
  );
}
