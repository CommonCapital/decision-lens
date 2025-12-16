import { cn } from "@/lib/utils";
import { Metric } from "@/lib/investor-schema";
import { TieOutBadge } from "./TieOutBadge";
import { DataAvailability } from "@/lib/uncertainty-types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  HelpCircle, 
  Clock, 
  Lock, 
  AlertTriangle,
  Ban
} from "lucide-react";

interface UncertainMetricProps {
  label: string;
  metric?: Metric | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  unavailableReason?: string;
  availability?: DataAvailability;
}

const AVAILABILITY_CONFIG: Record<DataAvailability, {
  icon: typeof HelpCircle;
  label: string;
  color: string;
  bgColor: string;
}> = {
  available: {
    icon: HelpCircle,
    label: "Available",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
  unavailable: {
    icon: Ban,
    label: "Not Available",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
  },
  restricted: {
    icon: Lock,
    label: "Restricted",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  stale: {
    icon: Clock,
    label: "Stale",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  conflicting: {
    icon: AlertTriangle,
    label: "Conflicting",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
};

export function UncertainMetric({
  label,
  metric,
  size = "md",
  className,
  unavailableReason,
  availability = metric ? "available" : "unavailable",
}: UncertainMetricProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  // If we have a metric with a value, render normally
  if (metric?.value !== undefined && metric?.value !== null) {
    return (
      <div
        className={cn(
          "group relative p-4 border border-border bg-card transition-all duration-150 hover:shadow-subtle",
          className
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
            {label}
          </span>
          <TieOutBadge status={metric.tie_out_status} />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "font-mono font-medium tracking-tight cursor-help",
                sizeClasses[size]
              )}
              data-metric
            >
              {metric.formatted}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            align="start"
            className="max-w-xs p-4 bg-foreground text-background border-0"
          >
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-background/60 uppercase tracking-wide text-[10px]">
                  Source
                </span>
                <p className="font-medium">{metric.source}</p>
              </div>
              {metric.last_updated && (
                <div>
                  <span className="text-background/60 uppercase tracking-wide text-[10px]">
                    Updated
                  </span>
                  <p className="font-mono text-[10px]">
                    {new Date(metric.last_updated).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground/10 group-hover:bg-foreground/20 transition-colors" />
      </div>
    );
  }

  // Render uncertainty state
  const config = AVAILABILITY_CONFIG[availability];
  const Icon = config.icon;
  const reason = unavailableReason || getDefaultReason(availability, label);

  return (
    <div
      className={cn(
        "group relative p-4 border border-border transition-all duration-150",
        config.bgColor,
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
          {label}
        </span>
        <div className={cn(
          "flex items-center gap-1 text-micro uppercase tracking-wide",
          config.color
        )}>
          <Icon className="w-3 h-3" />
          <span>{config.label}</span>
        </div>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "font-mono tracking-tight cursor-help flex items-center gap-2",
              sizeClasses[size],
              "text-muted-foreground/50"
            )}
          >
            <span>—</span>
            <Icon className={cn("w-5 h-5", config.color)} />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="start"
          className="max-w-xs p-4 bg-foreground text-background border-0"
        >
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-background/60 uppercase tracking-wide text-[10px]">
                Status
              </span>
              <p className="font-medium">{config.label}</p>
            </div>
            <div>
              <span className="text-background/60 uppercase tracking-wide text-[10px]">
                Why
              </span>
              <p>{reason}</p>
            </div>
            <div>
              <span className="text-background/60 uppercase tracking-wide text-[10px]">
                Decision Impact
              </span>
              <p className="italic">
                {getDecisionImpact(availability, label)}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>

      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-[2px]",
        availability === "unavailable" ? "bg-muted-foreground/20" :
        availability === "pending" ? "bg-amber-500/30" :
        availability === "restricted" ? "bg-orange-500/30" :
        "bg-red-500/30"
      )} />
    </div>
  );
}

function getDefaultReason(availability: DataAvailability, label: string): string {
  switch (availability) {
    case "pending":
      return `${label} data is being processed or awaiting source confirmation`;
    case "unavailable":
      return `${label} is not available from current data sources`;
    case "restricted":
      return `${label} requires premium data access or authentication`;
    case "stale":
      return `${label} data is outdated and may not reflect current state`;
    case "conflicting":
      return `Multiple sources report different values for ${label}`;
    default:
      return `${label} data status unknown`;
  }
}

function getDecisionImpact(availability: DataAvailability, label: string): string {
  switch (availability) {
    case "pending":
      return "May proceed with caution; verify when available";
    case "unavailable":
      return "Consider if this metric is critical for your decision";
    case "restricted":
      return "Evaluate if premium access is worth the decision value";
    case "stale":
      return "Factor potential changes since last update";
    case "conflicting":
      return "Manual reconciliation recommended before decision";
    default:
      return "Assess importance to your investment thesis";
  }
}
