import type { InvestorDashboard } from "../investor-schema";
import type { ShardId, MergeValidationResult, ShardConflict } from "./types";
import { SHARD_ROUTING } from "./routing-config";
import { validateMerge, detectCrossShardContamination } from "./validation";

/**
 * Priority-based conflict resolution strategy
 */
type ConflictResolution = "priority" | "latest" | "merge" | "error";

export interface MergeOptions {
  conflictResolution: ConflictResolution;
  validateBeforeMerge: boolean;
  stripUnauthorizedKeys: boolean;
}

const DEFAULT_MERGE_OPTIONS: MergeOptions = {
  conflictResolution: "priority",
  validateBeforeMerge: true,
  stripUnauthorizedKeys: true,
};

/**
 * Deterministically merge all shard outputs into the final InvestorDashboard schema.
 * Enforces schema position alignment and prevents cross-shard contamination.
 */
export function mergeShards(
  shardOutputs: Map<ShardId, unknown>,
  options: Partial<MergeOptions> = {}
): { data: Partial<InvestorDashboard>; validation: MergeValidationResult } {
  const opts = { ...DEFAULT_MERGE_OPTIONS, ...options };

  // Step 1: Pre-merge validation
  if (opts.validateBeforeMerge) {
    const preValidation = validateMerge(shardOutputs);
    if (!preValidation.is_valid && opts.conflictResolution === "error") {
      return { data: {}, validation: preValidation };
    }
  }

  // Step 2: Strip unauthorized keys if enabled
  if (opts.stripUnauthorizedKeys) {
    for (const [shardId, data] of shardOutputs) {
      const contamination = detectCrossShardContamination(shardId, data);
      if (contamination.length > 0) {
        const sanitized = sanitizeShardOutput(shardId, data);
        shardOutputs.set(shardId, sanitized);
      }
    }
  }

  // Step 3: Merge by priority (lower priority number = higher precedence)
  const sortedShards = [...shardOutputs.entries()]
    .sort((a, b) => {
      const priorityA = SHARD_ROUTING.find((r) => r.shard_id === a[0])?.priority ?? 999;
      const priorityB = SHARD_ROUTING.find((r) => r.shard_id === b[0])?.priority ?? 999;
      return priorityA - priorityB;
    });

  let merged: Partial<InvestorDashboard> = {};

  for (const [shardId, data] of sortedShards) {
    if (!data || typeof data !== "object") continue;
    
    const routing = SHARD_ROUTING.find((r) => r.shard_id === shardId);
    if (!routing) continue;

    // Only merge allowed schema keys for this shard
    for (const key of routing.schema_keys) {
      const value = (data as Record<string, unknown>)[key];
      
      if (value !== null && value !== undefined) {
        const existingValue = (merged as Record<string, unknown>)[key];
        
        if (existingValue !== undefined) {
          // Handle conflict based on strategy
          const resolvedValue = resolveConflict(
            key,
            existingValue,
            value,
            opts.conflictResolution
          );
          (merged as Record<string, unknown>)[key] = resolvedValue;
        } else {
          (merged as Record<string, unknown>)[key] = value;
        }
      }
    }
  }

  // Step 4: Post-merge validation
  const finalValidation = validateMerge(shardOutputs);

  return { data: merged, validation: finalValidation };
}

/**
 * Remove keys from shard output that don't belong to its schema
 */
function sanitizeShardOutput(shardId: ShardId, data: unknown): unknown {
  if (!data || typeof data !== "object") return data;
  
  const routing = SHARD_ROUTING.find((r) => r.shard_id === shardId);
  if (!routing) return data;

  const allowedKeys = new Set(routing.schema_keys);
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (allowedKeys.has(key)) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Resolve conflicts between shard values
 */
function resolveConflict(
  key: string,
  existingValue: unknown,
  newValue: unknown,
  strategy: ConflictResolution
): unknown {
  switch (strategy) {
    case "priority":
      // Keep existing (higher priority shard was processed first)
      return existingValue;
    
    case "latest":
      // Use new value
      return newValue;
    
    case "merge":
      // Deep merge objects, arrays concatenate
      return deepMerge(existingValue, newValue);
    
    case "error":
      throw new Error(`Conflict detected for key "${key}"`);
    
    default:
      return existingValue;
  }
}

/**
 * Deep merge two values
 */
function deepMerge(target: unknown, source: unknown): unknown {
  if (source === null || source === undefined) return target;
  if (target === null || target === undefined) return source;
  
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source];
  }
  
  if (typeof target === "object" && typeof source === "object") {
    const result: Record<string, unknown> = { ...(target as Record<string, unknown>) };
    
    for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
      result[key] = deepMerge(result[key], value);
    }
    
    return result;
  }
  
  // For primitives, source wins
  return source;
}

/**
 * Create an empty shard output template
 */
export function createEmptyShardTemplate(shardId: ShardId): Record<string, null> {
  const routing = SHARD_ROUTING.find((r) => r.shard_id === shardId);
  if (!routing) return {};

  const template: Record<string, null> = {};
  for (const key of routing.schema_keys) {
    template[key] = null;
  }
  return template;
}

/**
 * Get a summary of the merge result
 */
export function getMergeSummary(validation: MergeValidationResult): string {
  const lines: string[] = [];
  
  lines.push(`Overall Coverage: ${(validation.overall_coverage * 100).toFixed(1)}%`);
  lines.push(`Valid: ${validation.is_valid ? "Yes" : "No"}`);
  lines.push(`Conflicts: ${validation.conflicts.length}`);
  lines.push("\n");
  lines.push("Shard Results:");
  
  for (const result of validation.shard_results) {
    const status = result.is_valid ? "✓" : "✗";
    lines.push(`  ${status} ${result.shard_id}: ${(result.coverage * 100).toFixed(0)}% coverage`);
    for (const error of result.errors) {
      lines.push(`      Error: ${error}`);
    }
    for (const warning of result.warnings) {
      lines.push(`      Warn: ${warning}`);
    }
  }
  
  if (validation.conflicts.length > 0) {
    lines.push("\n");
    lines.push("Conflicts:");
    for (const conflict of validation.conflicts) {
      lines.push(`  ${conflict.field_path}: ${conflict.shard_a} vs ${conflict.shard_b}`);
    }
  }
  
  return lines.join("\n");
}
