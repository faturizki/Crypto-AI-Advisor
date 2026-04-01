/**
 * @file types.ts
 * @description Type definitions for AI scoring module
 */

/**
 * Input data structure for token scoring
 */
export interface TokenData {
  token: string;
  pair: string;
  chain: string;
  price_usd: number;
  volume_24h: number;
  liquidity: number;
  market_cap?: number;
  holders?: number;
  transactions_24h?: number;
}

/**
 * Token risk indicators
 */
export interface RiskIndicators {
  low_liquidity: boolean;
  new_token: boolean;
  high_volatility: boolean;
  unverified_contract: boolean;
  unusual_trading_pattern: boolean;
}

/**
 * AI Scoring output structure (matches spesifikasi.md exactly)
 */
export interface TokenScore {
  token: string;
  pair: string;
  chain: string;
  price_usd: number;
  volume_24h: number;
  liquidity: number;
  technical_score: number; // 0-100
  fundamental_score: number; // 0-100
  on_chain_score: number; // 0-100
  sentiment_score: number; // 0-100
  overall_potential_score: number; // 0-100
  probability_gain_20_percent: number; // 0-1
  risk_notes: string[];
  recommendation: string;
  summary: string;
  timestamp: string;
}

/**
 * Configuration for AI scoring
 */
export interface ScoringConfig {
  useRealAI?: boolean; // If false, use mock data
  anthropicApiKey?: string;
  mockData?: boolean;
}
