import type { ShardRoutingConfig, ScraperId, ShardId } from "./types";

/**
 * Routing configuration for each shard.
 * Defines which scrapers feed into each shard and which LLM model processes it.
 */
export const SHARD_ROUTING: ShardRoutingConfig[] = [
  {
    shard_id: "core_metadata",
    llm_model: "gemini-2.5-flash", // Fast, simple extraction
    required_scrapers: ["sec_filings", "company_website"],
    schema_keys: ["company_type", "run_metadata"],
    priority: 1,
  },
  {
    shard_id: "base_metrics",
    llm_model: "gemini-2.5-pro", // Complex financial parsing
    required_scrapers: ["sec_filings", "market_data"],
    schema_keys: ["base_metrics"],
    priority: 2,
  },
  {
    shard_id: "time_series",
    llm_model: "gemini-2.5-flash",
    required_scrapers: ["market_data", "sec_filings"],
    schema_keys: ["time_series", "changes_since_last_run"],
    priority: 3,
  },
  {
    shard_id: "executive",
    llm_model: "gemini-2.5-pro", // Needs reasoning for synthesis
    required_scrapers: ["sec_filings", "news_sentiment", "analyst_reports"],
    schema_keys: ["executive_summary", "hypotheses", "ai_insights"],
    priority: 4,
  },
  {
    shard_id: "valuation",
    llm_model: "gemini-2.5-pro", // Complex financial modeling
    required_scrapers: ["sec_filings", "market_data", "analyst_reports"],
    schema_keys: ["valuation", "scenarios"],
    priority: 5,
  },
  {
    shard_id: "risks_events",
    llm_model: "gemini-2.5-flash",
    required_scrapers: ["sec_filings", "news_sentiment", "social_sentiment"],
    schema_keys: ["risks", "events", "path_indicators", "kill_switch"],
    priority: 6,
  },
  {
    shard_id: "public_market",
    llm_model: "gemini-2.5-flash",
    required_scrapers: ["market_data", "analyst_reports", "sec_filings"],
    schema_keys: [
      "net_cash_or_debt",
      "buyback_capacity",
      "sbc_percent_revenue",
      "share_count_trend",
      "segments",
      "guidance_bridge",
      "revisions_momentum",
      "position_sizing",
      "variant_view",
    ],
    priority: 7,
  },
];

/**
 * Get routing config for a specific shard
 */
export function getShardRouting(shardId: ShardId): ShardRoutingConfig | undefined {
  return SHARD_ROUTING.find((r) => r.shard_id === shardId);
}

/**
 * Get all shards that depend on a specific scraper
 */
export function getShardsForScraper(scraperId: ScraperId): ShardId[] {
  return SHARD_ROUTING
    .filter((r) => r.required_scrapers.includes(scraperId))
    .map((r) => r.shard_id);
}

/**
 * Check if all required scrapers for a shard have completed
 */
export function canProcessShard(
  shardId: ShardId,
  completedScrapers: Set<ScraperId>
): boolean {
  const routing = getShardRouting(shardId);
  if (!routing) return false;
  return routing.required_scrapers.every((s) => completedScrapers.has(s));
}

/**
 * Get shards ordered by priority
 */
export function getShardsByPriority(): ShardId[] {
  return [...SHARD_ROUTING]
    .sort((a, b) => a.priority - b.priority)
    .map((r) => r.shard_id);
}

/**
 * Scraper to data type mapping for routing raw data
 */
export const SCRAPER_DATA_TYPES: Record<ScraperId, string[]> = {
  sec_filings: ["10-K", "10-Q", "8-K", "DEF14A", "S-1"],
  market_data: ["price", "volume", "market_cap", "shares_outstanding"],
  news_sentiment: ["news_articles", "sentiment_scores"],
  analyst_reports: ["ratings", "price_targets", "estimates"],
  company_website: ["press_releases", "ir_pages", "company_info"],
  social_sentiment: ["reddit", "twitter", "stocktwits"],
};
