import type { ShardId, ShardValidationResult, MergeValidationResult, ShardConflict } from "./types";
import { SHARD_SCHEMAS, type ShardSchemaMap } from "./shard-schemas";
import { SHARD_ROUTING } from "./routing-config";

/**
 * Validate a shard output against its schema
 */
export function validateShard(
  shardId: ShardId,
  data: unknown
): ShardValidationResult {
  const schema = SHARD_SCHEMAS[shardId as keyof ShardSchemaMap];
  if (!schema) {
    return {
      shard_id: shardId,
      is_valid: false,
      errors: [`Unknown shard: ${shardId}`],
      warnings: [],
      coverage: 0,
    };
  }

  const result = schema.safeParse(data);
  
  if (!result.success) {
    return {
      shard_id: shardId,
      is_valid: false,
      errors: result.error.errors.map(
        (e) => `${e.path.join(".")}: ${e.message}`
      ),
      warnings: [],
      coverage: 0,
    };
  }

  // Calculate coverage
  const coverage = calculateCoverage(result.data, shardId);
  const warnings = getPopulationWarnings(result.data, shardId);

  return {
    shard_id: shardId,
    is_valid: true,
    errors: [],
    warnings,
    coverage,
  };
}

/**
 * Calculate what percentage of expected fields are populated
 */
function calculateCoverage(data: unknown, shardId: ShardId): number {
  const routing = SHARD_ROUTING.find((r) => r.shard_id === shardId);
  if (!routing || !data || typeof data !== "object") return 0;

  const expectedKeys = routing.schema_keys;
  let populated = 0;

  for (const key of expectedKeys) {
    const value = (data as Record<string, unknown>)[key];
    if (value !== null && value !== undefined) {
      if (typeof value === "object" && Object.keys(value).length === 0) {
        continue; // Empty object doesn't count
      }
      populated++;
    }
  }

  return expectedKeys.length > 0 ? populated / expectedKeys.length : 0;
}

/**
 * Get warnings for low population areas
 */
function getPopulationWarnings(data: unknown, shardId: ShardId): string[] {
  const warnings: string[] = [];
  if (!data || typeof data !== "object") return warnings;

  const obj = data as Record<string, unknown>;
  
  // Check for null/empty required sections
  const routing = SHARD_ROUTING.find((r) => r.shard_id === shardId);
  if (!routing) return warnings;

  for (const key of routing.schema_keys) {
    const value = obj[key];
    if (value === null || value === undefined) {
      warnings.push(`Missing required section: ${key}`);
    } else if (typeof value === "object" && Object.keys(value).length === 0) {
      warnings.push(`Empty section: ${key}`);
    }
  }

  return warnings;
}

/**
 * Validate all shards and check for conflicts before merge
 */
export function validateMerge(
  shardOutputs: Map<ShardId, unknown>
): MergeValidationResult {
  const shardResults: ShardValidationResult[] = [];
  const conflicts: ShardConflict[] = [];
  
  // Validate each shard
  for (const [shardId, data] of shardOutputs) {
    shardResults.push(validateShard(shardId, data));
  }

  // Check for conflicts (fields appearing in multiple shards)
  const fieldOwnership = buildFieldOwnershipMap(shardOutputs);
  for (const [fieldPath, owners] of fieldOwnership) {
    if (owners.length > 1) {
      const values = owners.map((o) => getNestedValue(shardOutputs.get(o.shardId), fieldPath));
      
      // Check if values actually conflict
      const uniqueValues = new Set(values.map((v) => JSON.stringify(v)));
      if (uniqueValues.size > 1) {
        conflicts.push({
          field_path: fieldPath,
          shard_a: owners[0].shardId,
          shard_b: owners[1].shardId,
          value_a: values[0],
          value_b: values[1],
          resolution: "unresolved",
        });
      }
    }
  }

  const overallCoverage = 
    shardResults.length > 0
      ? shardResults.reduce((sum, r) => sum + r.coverage, 0) / shardResults.length
      : 0;

  return {
    is_valid: shardResults.every((r) => r.is_valid) && conflicts.length === 0,
    shard_results: shardResults,
    conflicts,
    overall_coverage: overallCoverage,
  };
}

/**
 * Build a map of field paths to their owning shards
 */
function buildFieldOwnershipMap(
  shardOutputs: Map<ShardId, unknown>
): Map<string, { shardId: ShardId; value: unknown }[]> {
  const ownership = new Map<string, { shardId: ShardId; value: unknown }[]>();

  for (const [shardId, data] of shardOutputs) {
    const paths = getAllFieldPaths(data, "");
    for (const { path, value } of paths) {
      if (!ownership.has(path)) {
        ownership.set(path, []);
      }
      ownership.get(path)!.push({ shardId, value });
    }
  }

  return ownership;
}

/**
 * Recursively get all field paths from an object
 */
function getAllFieldPaths(
  obj: unknown,
  prefix: string
): { path: string; value: unknown }[] {
  const results: { path: string; value: unknown }[] = [];
  
  if (!obj || typeof obj !== "object") {
    return prefix ? [{ path: prefix, value: obj }] : [];
  }

  if (Array.isArray(obj)) {
    return prefix ? [{ path: prefix, value: obj }] : [];
  }

  for (const [key, value] of Object.entries(obj)) {
    const newPath = prefix ? `${prefix}.${key}` : key;
    
    if (value !== null && value !== undefined) {
      if (typeof value === "object" && !Array.isArray(value)) {
        results.push(...getAllFieldPaths(value, newPath));
      } else {
        results.push({ path: newPath, value });
      }
    }
  }

  return results;
}

/**
 * Get a nested value from an object by dot-notation path
 */
function getNestedValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  
  const parts = path.split(".");
  let current: unknown = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  
  return current;
}

/**
 * Check if a shard output contains any fields outside its allowed schema keys
 */
export function detectCrossShardContamination(
  shardId: ShardId,
  data: unknown
): string[] {
  const routing = SHARD_ROUTING.find((r) => r.shard_id === shardId);
  if (!routing || !data || typeof data !== "object") return [];

  const allowedKeys = new Set(routing.schema_keys);
  const violations: string[] = [];

  for (const key of Object.keys(data as Record<string, unknown>)) {
    if (!allowedKeys.has(key)) {
      violations.push(`Shard "${shardId}" contains unauthorized key: "${key}"`);
    }
  }

  return violations;
}
