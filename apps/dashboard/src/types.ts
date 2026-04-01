/**
 * @file types.ts
 * @description Type definitions for dashboard
 */

import { TokenScore } from "@crypto-ai/ai-scoring";

export type { TokenScore };

/**
 * Filter options for token display
 */
export interface TokenFilters {
  minScore: number;
  minVolume: number;
  chains: string[];
  searchQuery: string;
}
