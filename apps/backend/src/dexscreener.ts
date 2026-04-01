/**
 * @file dexscreener.ts
 * @description DexScreener API client for fetching token data
 */

import axios, { AxiosInstance } from "axios";
import { logger } from "./logger";

/**
 * DexScreener API response for tokens
 */
export interface DexscreenerToken {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    m5: number;
    h1: number;
    h24: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h24: number;
  };
  liquidity?: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
}

/**
 * DexScreener API client
 */
export class DexscreenerClient {
  private client: AxiosInstance;
  private baseUrl: string;
  private retryAttempts: number;
  private retryDelay: number;

  /**
   * Initialize DexScreener client
   * @param baseUrl - Base URL for DexScreener API (default: official)
   * @param retryAttempts - Number of retry attempts on failure (default: 3)
   * @param retryDelay - Delay between retries in ms (default: 1000)
   *
   * @example
   * ```typescript
   * const client = new DexscreenerClient();
   * ```
   */
  constructor(
    baseUrl: string = "https://api.dexscreener.com/latest/dex",
    retryAttempts: number = 3,
    retryDelay: number = 1000
  ) {
    this.baseUrl = baseUrl;
    this.retryAttempts = retryAttempts;
    this.retryDelay = retryDelay;
    this.client = axios.create({
      timeout: 10000,
      headers: {
        "User-Agent": "Crypto-AI-Advisor/1.0",
      },
    });
  }

  /**
   * Search for tokens by chain and query
   * @param query - Search query (chain name or token symbol)
   * @returns Array of token data
   *
   * @example
   * ```typescript
   * const tokens = await client.searchTokens('BSC');
   * ```
   */
  async searchTokens(query: string): Promise<DexscreenerToken[]> {
    return this.retryWithBackoff(async () => {
      try {
        logger.debug(`Fetching tokens for query: ${query}`);

        const response = await this.client.get(`/search?q=${encodeURIComponent(query)}`);

        if (!response.data.pairs) {
          logger.warn(`No pairs found for query: ${query}`);
          return [];
        }

        logger.debug(`Found ${response.data.pairs.length} tokens for query: ${query}`);
        return response.data.pairs as DexscreenerToken[];
      } catch (error) {
        logger.error(`Error searching tokens: ${error}`);
        throw error;
      }
    });
  }

  /**
   * Get tokens by chain
   * @param chainId - Chain ID (e.g., 'bsc', 'ethereum', 'solana')
   * @param orderBy - Sort field (default: 'volume')
   * @param limit - Max results (default: 100)
   * @returns Array of token data
   *
   * @example
   * ```typescript
   * const bscTokens = await client.getTokensByChain('bsc', 'volume', 50);
   * ```
   */
  async getTokensByChain(
    chainId: string,
    orderBy: string = "volume",
    limit: number = 100
  ): Promise<DexscreenerToken[]> {
    return this.retryWithBackoff(async () => {
      try {
        logger.debug(`Fetching top ${limit} tokens from ${chainId} ordered by ${orderBy}`);

        const response = await this.client.get(
          `/tokens?chain=${chainId}&orderBy=${orderBy}&limit=${limit}`
        );

        if (!response.data.tokens) {
          logger.warn(`No tokens found for chain: ${chainId}`);
          return [];
        }

        logger.info(`Fetched ${response.data.tokens.length} tokens from ${chainId}`);
        return response.data.tokens as DexscreenerToken[];
      } catch (error) {
        logger.error(`Error fetching tokens from ${chainId}:`, error);
        throw error;
      }
    });
  }

  /**
   * Get latest tokens (highest volume)
   * @param limit - Number of top tokens to fetch
   * @returns Array of token data
   *
   * @example
   * ```typescript
   * const topTokens = await client.getLatestTokens(50);
   * ```
   */
  async getLatestTokens(limit: number = 50): Promise<DexscreenerToken[]> {
    const chains = ["bsc", "ethereum", "solana", "polygon"];
    const allTokens: DexscreenerToken[] = [];

    for (const chain of chains) {
      try {
        const tokens = await this.getTokensByChain(chain, "volume", Math.ceil(limit / chains.length));
        allTokens.push(...tokens);
      } catch (error) {
        logger.warn(`Failed to fetch tokens from ${chain}:`, error);
      }
    }

    // Sort by volume and return top N
    return allTokens
      .sort(
        (a, b) =>
          (b.volume?.h24 || 0) - (a.volume?.h24 || 0)
      )
      .slice(0, limit);
  }

  /**
   * Retry API call with exponential backoff
   * @param operation - Async operation to retry
   * @returns Result of operation
   *
   * @internal
   */
  private async retryWithBackoff<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === this.retryAttempts) {
          throw error;
        }

        const delayMs = this.retryDelay * Math.pow(2, attempt - 1);
        logger.warn(
          `Retry attempt ${attempt}/${this.retryAttempts} - waiting ${delayMs}ms`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw new Error("Retry loop completed without result");
  }
}
