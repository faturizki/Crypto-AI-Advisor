/**
 * @file index.ts
 * @description Main backend entry point and polling orchestrator
 */

import "dotenv/config";
import { AIScorer } from "@crypto-ai/ai-scoring";
import { DexscreenerClient } from "./dexscreener";
import { Database } from "./database";
import { logger, LogLevel } from "./logger";

/**
 * Main poller class that orchestrates all operations
 */
class TokenPoller {
  private dexscreenerClient: DexscreenerClient;
  private aiScorer: AIScorer;
  private database: Database;
  private pollIntervalMinutes: number;
  private isRunning: boolean;

  /**
   * Initialize the token poller with all required services
   *
   * @example
   * ```typescript
   * const poller = new TokenPoller();
   * await poller.start();
   * ```
   */
  constructor() {
    this.validateEnvironment();

    this.dexscreenerClient = new DexscreenerClient();
    this.aiScorer = new AIScorer(
      process.env.ANTHROPIC_API_KEY || "",
      process.env.USE_MOCK_AI === "true"
    );
    this.database = new Database(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    this.pollIntervalMinutes =
      parseInt(process.env.POLL_INTERVAL_MINUTES || "15", 10) || 15;
    this.isRunning = false;

    logger.info(`Token Poller initialized with ${this.pollIntervalMinutes}min interval`);
  }

  /**
   * Start the polling loop
   * Runs continuously at specified intervals
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn("Poller is already running");
      return;
    }

    this.isRunning = true;
    logger.info("Starting Token Poller");

    try {
      // Run once immediately
      await this.poll();

      // Then run on interval
      setInterval(() => {
        this.poll().catch((error) => {
          logger.error("Error in polling cycle:", error);
        });
      }, this.pollIntervalMinutes * 60 * 1000);
    } catch (error) {
      logger.error("Fatal error in poller:", error);
      this.isRunning = false;
      process.exit(1);
    }
  }

  /**
   * Execute a single polling cycle
   *
   * Steps:
   * 1. Fetch latest tokens from DexScreener
   * 2. Normalize the data
   * 3. Score using AI module
   * 4. Save to Supabase
   * 5. Record history
   *
   * @internal
   */
  private async poll(): Promise<void> {
    logger.info("Starting poll cycle");
    const startTime = Date.now();

    try {
      // Fetch tokens from DexScreener
      logger.info("Fetching tokens from DexScreener");
      const dexTokens = await this.dexscreenerClient.getLatestTokens(50);

      if (dexTokens.length === 0) {
        logger.warn("No tokens fetched from DexScreener");
        return;
      }

      logger.info(`Fetched ${dexTokens.length} tokens from DexScreener`);

      // Normalize and score
      logger.info("Normalizing and scoring tokens");
      const normalizedTokens = dexTokens.map((token) => ({
        token: token.baseToken.symbol,
        pair: `${token.baseToken.symbol}/${token.quoteToken.symbol}`,
        chain: token.chainId.toUpperCase(),
        price_usd: parseFloat(token.priceUsd),
        volume_24h: token.volume?.h24 || 0,
        liquidity: token.liquidity?.usd || 0,
        market_cap: token.marketCap,
        transactions_24h: token.txns?.h24.buys + token.txns?.h24.sells || 0,
      }));

      // Score with AI
      const scoredTokens = await this.aiScorer.scoreTokens(normalizedTokens);
      logger.info(`Scored ${scoredTokens.length} tokens`);

      // Save to database
      const upsertResult = await this.database.upsertTokens(scoredTokens);
      logger.info(
        `Upsert result: ${upsertResult.success} success, ${upsertResult.failed} failed`
      );

      if (upsertResult.errors.length > 0) {
        logger.error(
          "Upsert errors:",
          upsertResult.errors.join("; ")
        );
      }

      // Record history for high-potential tokens
      for (const token of scoredTokens) {
        if (token.overall_potential_score >= 70) {
          await this.database.recordHistory(token.token, token);
        }
      }

      const duration = Date.now() - startTime;
      logger.info(`Poll cycle completed in ${duration}ms`);
    } catch (error) {
      logger.error("Error during poll cycle:", error);
    }
  }

  /**
   * Validate required environment variables
   *
   * @throws Error if required env vars are missing
   *
   * @internal
   */
  private validateEnvironment(): void {
    const required = ["SUPABASE_URL", "SUPABASE_ANON_KEY"];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }

    logger.debug("Environment validation passed");
  }

  /**
   * Gracefully stop the poller
   */
  stop(): void {
    this.isRunning = false;
    logger.info("Token Poller stopped");
  }
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  logger.info("Starting Crypto AI Advisor Backend");
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);

  const poller = new TokenPoller();

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    logger.info("Received SIGINT, shutting down gracefully...");
    poller.stop();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    logger.info("Received SIGTERM, shutting down gracefully...");
    poller.stop();
    process.exit(0);
  });

  // Start polling
  await poller.start();
}

// Run main
main().catch((error) => {
  logger.error("Fatal error in main:", error);
  process.exit(1);
});
