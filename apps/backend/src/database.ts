/**
 * @file database.ts
 * @description Supabase database operations for storing token data
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { TokenScore } from "@crypto-ai/ai-scoring";
import { logger } from "./logger";

/**
 * Database operations for tokens and history
 */
export class Database {
  private supabase: SupabaseClient;

  /**
   * Initialize Supabase connection
   * @param supabaseUrl - Supabase project URL
   * @param supabaseKey - Supabase anonymous key or service key
   *
   * @example
   * ```typescript
   * const db = new Database(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
   * ```
   */
  constructor(supabaseUrl: string, supabaseKey: string) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Upsert token data (insert or update)
   * @param token - Token score data to save
   * @returns Saved token data or error
   *
   * @example
   * ```typescript
   * const result = await db.upsertToken(tokenScore);
   * ```
   */
  async upsertToken(token: TokenScore): Promise<{ success: boolean; error?: string }> {
    try {
      logger.debug(`Upserting token: ${token.token}`);

      const { error } = await this.supabase.from("tokens").upsert([
        {
          token: token.token,
          pair: token.pair,
          chain: token.chain,
          price_usd: token.price_usd,
          volume_24h: token.volume_24h,
          liquidity: token.liquidity,
          technical_score: token.technical_score,
          fundamental_score: token.fundamental_score,
          on_chain_score: token.on_chain_score,
          sentiment_score: token.sentiment_score,
          overall_potential_score: token.overall_potential_score,
          probability_gain_20_percent: token.probability_gain_20_percent,
          risk_notes: token.risk_notes,
          recommendation: token.recommendation,
          summary: token.summary,
          timestamp: new Date().toISOString(),
        },
      ]);

      if (error) {
        logger.error(`Error upserting token ${token.token}:`, error);
        return { success: false, error: error.message };
      }

      logger.info(`Successfully upserted token: ${token.token}`);
      return { success: true };
    } catch (error) {
      logger.error(`Unexpected error upserting token:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Batch upsert multiple tokens
   * @param tokens - Array of token scores
   * @returns Result with count of succeeded and failed
   *
   * @example
   * ```typescript
   * const result = await db.upsertTokens(tokenScores);
   * ```
   */
  async upsertTokens(
    tokens: TokenScore[]
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = { success: 0, failed: 0, errors: [] as string[] };

    logger.info(`Upserting ${tokens.length} tokens`);

    try {
      const tokenData = tokens.map((token) => ({
        token: token.token,
        pair: token.pair,
        chain: token.chain,
        price_usd: token.price_usd,
        volume_24h: token.volume_24h,
        liquidity: token.liquidity,
        technical_score: token.technical_score,
        fundamental_score: token.fundamental_score,
        on_chain_score: token.on_chain_score,
        sentiment_score: token.sentiment_score,
        overall_potential_score: token.overall_potential_score,
        probability_gain_20_percent: token.probability_gain_20_percent,
        risk_notes: token.risk_notes,
        recommendation: token.recommendation,
        summary: token.summary,
        timestamp: new Date().toISOString(),
      }));

      const { error, data } = await this.supabase
        .from("tokens")
        .upsert(tokenData)
        .select();

      if (error) {
        logger.error("Error batch upserting tokens:", error);
        results.failed = tokens.length;
        results.errors.push(error.message);
        return results;
      }

      results.success = data?.length || tokens.length;
      logger.info(`Successfully upserted ${results.success} tokens`);
      return results;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error("Unexpected error in batch upsert:", error);
      results.failed = tokens.length;
      results.errors.push(errorMsg);
      return results;
    }
  }

  /**
   * Get all tokens from database
   * @param limit - Maximum number of tokens to retrieve
   * @returns Array of tokens
   *
   * @example
   * ```typescript
   * const tokens = await db.getAllTokens(100);
   * ```
   */
  async getAllTokens(limit: number = 100): Promise<TokenScore[]> {
    try {
      logger.debug(`Fetching all tokens (limit: ${limit})`);

      const { data, error } = await this.supabase
        .from("tokens")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(limit);

      if (error) {
        logger.error("Error fetching tokens:", error);
        return [];
      }

      logger.debug(`Fetched ${data?.length || 0} tokens`);
      return (data || []) as TokenScore[];
    } catch (error) {
      logger.error("Unexpected error fetching tokens:", error);
      return [];
    }
  }

  /**
   * Get tokens by chain
   * @param chain - Chain name (e.g., 'BSC', 'ETH')
   * @param limit - Maximum number of tokens
   * @returns Array of tokens from specified chain
   *
   * @example
   * ```typescript
   * const bscTokens = await db.getTokensByChain('BSC', 50);
   * ```
   */
  async getTokensByChain(chain: string, limit: number = 100): Promise<TokenScore[]> {
    try {
      logger.debug(`Fetching tokens from chain: ${chain}`);

      const { data, error } = await this.supabase
        .from("tokens")
        .select("*")
        .eq("chain", chain)
        .order("timestamp", { ascending: false })
        .limit(limit);

      if (error) {
        logger.error(`Error fetching tokens from ${chain}:`, error);
        return [];
      }

      return (data || []) as TokenScore[];
    } catch (error) {
      logger.error(`Unexpected error fetching tokens from ${chain}:`, error);
      return [];
    }
  }

  /**
   * Get high-potential tokens
   * @param minScore - Minimum overall potential score (default: 70)
   * @param limit - Maximum number of tokens
   * @returns Array of high-potential tokens
   *
   * @example
   * ```typescript
   * const highPotential = await db.getHighPotentialTokens(75);
   * ```
   */
  async getHighPotentialTokens(
    minScore: number = 70,
    limit: number = 50
  ): Promise<TokenScore[]> {
    try {
      logger.debug(`Fetching tokens with score >= ${minScore}`);

      const { data, error } = await this.supabase
        .from("tokens")
        .select("*")
        .gte("overall_potential_score", minScore)
        .order("overall_potential_score", { ascending: false })
        .limit(limit);

      if (error) {
        logger.error("Error fetching high-potential tokens:", error);
        return [];
      }

      return (data || []) as TokenScore[];
    } catch (error) {
      logger.error("Unexpected error fetching high-potential tokens:", error);
      return [];
    }
  }

  /**
   * Record token scoring history
   * @param tokenSymbol - Token symbol
   * @param scores - Score snapshot
   * @returns Success indicator
   *
   * @example
   * ```typescript
   * await db.recordHistory('NEWCOIN', tokenScore);
   * ```
   */
  async recordHistory(
    tokenSymbol: string,
    scores: Partial<TokenScore>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      logger.debug(`Recording history for token: ${tokenSymbol}`);

      const { error } = await this.supabase.from("history").insert([
        {
          token: tokenSymbol,
          overall_potential_score: scores.overall_potential_score,
          technical_score: scores.technical_score,
          fundamental_score: scores.fundamental_score,
          on_chain_score: scores.on_chain_score,
          sentiment_score: scores.sentiment_score,
          timestamp: new Date().toISOString(),
        },
      ]);

      if (error) {
        logger.error(`Error recording history for ${tokenSymbol}:`, error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      logger.error("Unexpected error recording history:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Clean up old data (older than N days)
   * @param daysOld - Delete records older than this many days
   * @returns Result of cleanup
   *
   * @example
   * ```typescript
   * await db.cleanupOldData(30); // Delete records older than 30 days
   * ```
   */
  async cleanupOldData(daysOld: number = 30): Promise<{
    success: boolean;
    deletedCount?: number;
    error?: string;
  }> {
    try {
      logger.info(`Cleaning up data older than ${daysOld} days`);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { error, data } = await this.supabase
        .from("history")
        .delete()
        .lt("timestamp", cutoffDate.toISOString());

      if (error) {
        logger.error("Error cleaning up old data:", error);
        return { success: false, error: error.message };
      }

      return { success: true, deletedCount: data?.length };
    } catch (error) {
      logger.error("Unexpected error during cleanup:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
