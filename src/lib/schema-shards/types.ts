import { z } from "zod";

// === SHARD IDENTIFIERS ===
export const SHARD_IDS = [
  "core_metadata",      // run_metadata, company_type
  "base_metrics",       // base_metrics (atomic financial data)
  "time_series",        // time_series, changes_since_last_run
  "executive",          // executive_summary, ai_insights, hypotheses
  "valuation",          // valuation, scenarios
  "risks_events",       // risks, events, path_indicators, kill_switch
  "public_market",      // segments, guidance_bridge, revisions_momentum, etc.
] as const;

export type ShardId = typeof SHARD_IDS[number];

// === JOB STATUS ===
export type JobStatus = "pending" | "in_progress" | "completed" | "failed" | "stale";

// === SCRAPER TYPES ===
export const SCRAPER_IDS = [
  "sec_filings",        // 10-K, 10-Q, 8-K
  "market_data",        // Price, volume, market cap
  "news_sentiment",     // News articles, sentiment
  "analyst_reports",    // Analyst ratings, estimates
  "company_website",    // IR pages, press releases
  "social_sentiment",   // Social media, reddit, twitter
] as const;

export type ScraperId = typeof SCRAPER_IDS[number];

// === SCRAPER JOB ===
export interface ScraperJob {
  id: string;
  scraper_id: ScraperId;
  dashboard_id: string;
  status: JobStatus;
  raw_data: unknown | null;
  error?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

// === SHARD JOB ===
export interface ShardJob {
  id: string;
  shard_id: ShardId;
  dashboard_id: string;
  llm_model: string;
  status: JobStatus;
  input_scraper_ids: ScraperId[];
  output_data: unknown | null;
  validation_errors?: string[];
  error?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

// === MERGE JOB ===
export interface MergeJob {
  id: string;
  dashboard_id: string;
  status: JobStatus;
  shard_job_ids: string[];
  merged_data: unknown | null;
  validation_errors?: string[];
  error?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

// === PIPELINE RUN ===
export interface PipelineRun {
  id: string;
  dashboard_id: string;
  status: JobStatus;
  scraper_jobs: ScraperJob[];
  shard_jobs: ShardJob[];
  merge_job: MergeJob | null;
  created_at: string;
  completed_at?: string;
}

// === SHARD ROUTING CONFIG ===
export interface ShardRoutingConfig {
  shard_id: ShardId;
  llm_model: string;
  required_scrapers: ScraperId[];
  schema_keys: string[];
  priority: number; // Lower = higher priority
}

// === VALIDATION RESULT ===
export interface ShardValidationResult {
  shard_id: ShardId;
  is_valid: boolean;
  errors: string[];
  warnings: string[];
  coverage: number; // 0-1, how many fields populated
}

// === MERGE VALIDATION RESULT ===
export interface MergeValidationResult {
  is_valid: boolean;
  shard_results: ShardValidationResult[];
  conflicts: ShardConflict[];
  overall_coverage: number;
}

export interface ShardConflict {
  field_path: string;
  shard_a: ShardId;
  shard_b: ShardId;
  value_a: unknown;
  value_b: unknown;
  resolution: "shard_a" | "shard_b" | "merge" | "unresolved";
}
