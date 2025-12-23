import { Metric } from "@/lib/investor-schema";
import { cn } from "@/lib/utils";
import { ExternalLink, FileText, Calculator, Link2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TieOutViewProps {
  metric: Metric;
  label: string;
}

export function TieOutView({ metric, label }: TieOutViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const hasDirectSource = metric.source_reference?.xbrl_tag || metric.source_reference?.excerpt;
  const hasCalculationChain = metric.calculation_chain?.components && metric.calculation_chain.components.length > 0;
  
  if (!hasDirectSource && !hasCalculationChain) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors">
          <Link2 className="w-3 h-3" />
          Tie-Out
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {label}: {metric.formatted}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Full audit trail and source verification
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Direct Source (Option A) */}
          {hasDirectSource && !hasCalculationChain && (
            <DirectSourceView metric={metric} />
          )}

          {/* Calculation Chain (Option B) */}
          {hasCalculationChain && (
            <CalculationChainView metric={metric} />
          )}

          {/* Definition Context */}
          {metric.definition && (
            <div className="border border-border p-4 bg-secondary/30">
              <h4 className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-3">
                Metric Definition
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {metric.definition.period && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Period</span>
                    <span>{metric.definition.period}</span>
                  </div>
                )}
                {metric.definition.basis && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Basis</span>
                    <span>{metric.definition.basis}</span>
                  </div>
                )}
                {metric.definition.currency && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Currency</span>
                    <span>{metric.definition.currency}</span>
                  </div>
                )}
                {metric.definition.unit && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Unit</span>
                    <span>{metric.definition.unit}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4">
            <span>Last Refresh: {metric.last_updated ? new Date(metric.last_updated).toLocaleString() : "Unknown"}</span>
            <span className={cn(
              "px-2 py-0.5 text-[10px] uppercase tracking-wide",
              metric.tie_out_status === "final" ? "bg-foreground text-background" :
              metric.tie_out_status === "provisional" ? "bg-muted-foreground/20 text-muted-foreground" :
              "bg-foreground/20 text-foreground border border-foreground"
            )}>
              {metric.tie_out_status}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DirectSourceView({ metric }: { metric: Metric }) {
  const ref = metric.source_reference;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4" />
        <h4 className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
          Direct Source
        </h4>
      </div>

      <div className="border border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium">{metric.source}</span>
          {ref?.url && (
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-3 h-3" />
              View Filing
            </a>
          )}
        </div>

        {ref?.page_reference && (
          <div className="text-sm">
            <span className="text-muted-foreground">Location: </span>
            <span className="font-mono">{ref.page_reference}</span>
          </div>
        )}

        {ref?.xbrl_tag && (
          <div className="text-sm bg-secondary/50 p-2 font-mono text-xs">
            <span className="text-muted-foreground">XBRL: </span>
            <span>{ref.xbrl_tag}</span>
          </div>
        )}

        {ref?.excerpt && (
          <div className="text-sm border-l-2 border-foreground pl-3 italic">
            "{ref.excerpt}"
          </div>
        )}

        {ref?.accessed_at && (
          <div className="text-[10px] text-muted-foreground">
            Accessed: {new Date(ref.accessed_at).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}

function CalculationChainView({ metric }: { metric: Metric }) {
  const chain = metric.calculation_chain;
  if (!chain) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-4 h-4" />
        <h4 className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
          Calculation Chain
        </h4>
      </div>

      {/* Formula */}
      <div className="border border-border p-4 bg-secondary/30">
        <span className="text-micro text-muted-foreground block mb-2">Formula</span>
        <div className="font-mono text-sm">{chain.formula}</div>
        {chain.formula_expanded && (
          <div className="font-mono text-lg mt-2 border-t border-border pt-2">
            {chain.formula_expanded}
          </div>
        )}
      </div>

      {/* Component Sources */}
      <div className="space-y-3">
        <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
          Component Sources
        </span>
        {chain.components.map((component, i) => (
          <ComponentSourceCard key={i} component={component} />
        ))}
      </div>

      {/* Intermediate Calculations (for complex metrics like ROIC) */}
      {chain.intermediate_calculations && chain.intermediate_calculations.length > 0 && (
        <div className="space-y-3 border-t border-border pt-4">
          <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
            Intermediate Calculations
          </span>
          {chain.intermediate_calculations.map((calc, i) => (
            <div key={i} className="border border-border p-3 bg-secondary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{calc.step_name}</span>
                <span className="font-mono bg-secondary px-2 py-0.5 text-sm">{calc.result}</span>
              </div>
              <div className="font-mono text-sm text-muted-foreground">{calc.formula}</div>
              {calc.components && calc.components.length > 0 && (
                <div className="mt-2 pl-3 border-l border-border space-y-1">
                  {calc.components?.map((comp, j) => (
                    <div key={j} className="text-xs flex items-center justify-between">
                      <span>{comp.name || "Component"}</span>
                      <span className="font-mono">{comp.formatted || String(comp.value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ComponentSource {
  name?: string;
  value?: number | string | null;
  formatted?: string | null;
  source?: string | null;
  source_line?: string | null;
  xbrl_tag?: string | null;
  filing_date?: string | null;
}

function ComponentSourceCard({ component }: { component: ComponentSource }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium">{component.name}</span>
          <span className="font-mono bg-secondary px-2 py-0.5 text-sm">
            {component.formatted}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      {expanded && (
        <div className="p-3 border-t border-border bg-secondary/20 space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Source: </span>
            <span>{component.source}</span>
            {component.source_line && (
              <span className="font-mono ml-1">({component.source_line})</span>
            )}
          </div>
          
          {component.xbrl_tag && (
            <div className="font-mono text-xs bg-secondary p-2">
              <span className="text-muted-foreground">XBRL: </span>
              {component.xbrl_tag}
            </div>
          )}
          
          {component.filing_date && (
            <div className="text-[10px] text-muted-foreground">
              Filed: {component.filing_date}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
