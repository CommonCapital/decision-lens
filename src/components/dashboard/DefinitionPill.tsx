import { MetricDefinition } from "@/lib/investor-schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface DefinitionPillProps {
  definition: MetricDefinition | null | undefined;
}

const PERIOD_LABELS = {
  quarter: "Quarterly",
  TTM: "Trailing 12 Months",
  FY: "Fiscal Year",
  LTM: "Last Twelve Months",
  NTM: "Next Twelve Months",
};

const BASIS_LABELS = {
  GAAP: "GAAP",
  non_GAAP: "Non-GAAP",
  adjusted: "Adjusted",
  reported: "As Reported",
};

export function DefinitionPill({ definition }: DefinitionPillProps) {
  if (!definition) return null;

  const hasContent = definition.period || definition.basis || definition.currency;
  if (!hasContent) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-secondary text-micro font-mono text-muted-foreground hover:bg-secondary/80 transition-colors">
          <Info className="w-3 h-3" />
          {definition.period && (
            <span>{definition.period}</span>
          )}
          {definition.basis && (
            <span className="border-l border-border pl-1 ml-1">{definition.basis}</span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="space-y-2 text-sm">
          {definition.metric_name && (
            <div>
              <span className="text-muted-foreground">Metric: </span>
              <span className="font-medium">{definition.metric_name}</span>
            </div>
          )}
          {definition.period && (
            <div>
              <span className="text-muted-foreground">Period: </span>
              <span>{PERIOD_LABELS[definition.period] || definition.period}</span>
            </div>
          )}
          {definition.basis && (
            <div>
              <span className="text-muted-foreground">Basis: </span>
              <span>{BASIS_LABELS[definition.basis] || definition.basis}</span>
            </div>
          )}
          {definition.currency && (
            <div>
              <span className="text-muted-foreground">Currency: </span>
              <span>{definition.currency}</span>
            </div>
          )}
          {definition.unit && (
            <div>
              <span className="text-muted-foreground">Unit: </span>
              <span>{definition.unit}</span>
            </div>
          )}
          {definition.calculation_method && (
            <div className="border-t border-border pt-2 mt-2">
              <span className="text-muted-foreground block mb-1">Calculation:</span>
              <span className="text-xs">{definition.calculation_method}</span>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
