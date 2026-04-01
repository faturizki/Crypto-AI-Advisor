/**
 * @file mock.ts
 * @description Mock implementations for testing without AI API calls
 */

import { TokenData, TokenScore, RiskIndicators } from "./types";

/**
 * Mock AI scoring implementation for testing
 * Provides realistic but deterministic scores based on token data
 *
 * @param tokenData - Token data to score
 * @returns Mock token score
 *
 * @example
 * ```typescript
 * const mockScore = mockTokenScore({
 *   token: "NEWCOIN",
 *   pair: "NEWCOIN/USDT",
 *   chain: "BSC",
 *   price_usd: 0.0123,
 *   volume_24h: 52000,
 *   liquidity: 105000
 * });
 * ```
 */
export function mockTokenScore(tokenData: TokenData): TokenScore {
  const riskNotes = analyzeRisks(tokenData);

  // Generate deterministic scores based on token characteristics
  const technicalScore = calculateTechnicalScore(tokenData);
  const fundamentalScore = calculateFundamentalScore(tokenData);
  const onChainScore = calculateOnChainScore(tokenData);
  const sentimentScore = calculateSentimentScore(tokenData);

  const overallPotentialScore = Math.round(
    (technicalScore + fundamentalScore + onChainScore + sentimentScore) / 4
  );

  const probabilityGain20Percent =
    overallPotentialScore > 70
      ? 0.65 + Math.random() * 0.25
      : overallPotentialScore > 50
        ? 0.35 + Math.random() * 0.25
        : 0.1 + Math.random() * 0.2;

  const recommendation = generateRecommendation(
    overallPotentialScore,
    riskNotes.length
  );
  const summary = generateSummary(tokenData, overallPotentialScore);

  return {
    token: tokenData.token,
    pair: tokenData.pair,
    chain: tokenData.chain,
    price_usd: tokenData.price_usd,
    volume_24h: tokenData.volume_24h,
    liquidity: tokenData.liquidity,
    technical_score: technicalScore,
    fundamental_score: fundamentalScore,
    on_chain_score: onChainScore,
    sentiment_score: sentimentScore,
    overall_potential_score: overallPotentialScore,
    probability_gain_20_percent: parseFloat(probabilityGain20Percent.toFixed(2)),
    risk_notes: riskNotes,
    recommendation,
    summary,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Analyze token data for risk indicators
 *
 * @param tokenData - Token data to analyze
 * @returns Array of risk notes
 *
 * @internal
 */
function analyzeRisks(tokenData: TokenData): string[] {
  const risks: string[] = [];

  // Low liquidity check
  if (tokenData.liquidity < 50000) {
    risks.push("Low liquidity - high price volatility risk");
  }

  // Low volume compared to liquidity
  if (tokenData.volume_24h < tokenData.liquidity * 0.2) {
    risks.push("Low trading volume relative to liquidity");
  }

  // Very small market cap (proxy: low price * low volume)
  if (tokenData.price_usd < 0.001) {
    risks.push("Micro-cap token - extreme volatility expected");
  }

  // High liquidity lock suggests early stage
  if (tokenData.liquidity > tokenData.volume_24h * 5) {
    risks.push("New token, unverified audit");
  }

  return risks;
}

/**
 * Calculate technical score based on price action and volume
 *
 * @param tokenData - Token data
 * @returns Score 0-100
 *
 * @internal
 */
function calculateTechnicalScore(tokenData: TokenData): number {
  let score = 50; // Base score

  // Volume/Liquidity ratio indicates trading strength
  const volumeRatio = tokenData.volume_24h / tokenData.liquidity;
  if (volumeRatio > 1) score += 20;
  else if (volumeRatio > 0.5) score += 10;

  // Price trends (simulated from data patterns)
  if (tokenData.price_usd > 0.01 && tokenData.price_usd < 1) score += 15;

  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate fundamental score based on token metrics
 *
 * @param tokenData - Token data
 * @returns Score 0-100
 *
 * @internal
 */
function calculateFundamentalScore(tokenData: TokenData): number {
  let score = 50; // Base score

  // Market cap health (inferred from liquidity and volume)
  const estimatedMarketCap = tokenData.liquidity * 3;
  if (estimatedMarketCap > 500000) score += 15;
  else if (estimatedMarketCap > 100000) score += 10;

  // Liquidity strength
  if (tokenData.liquidity > 200000) score += 20;
  else if (tokenData.liquidity > 100000) score += 10;

  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate on-chain score based on network metrics
 *
 * @param tokenData - Token data
 * @returns Score 0-100
 *
 * @internal
 */
function calculateOnChainScore(tokenData: TokenData): number {
  let score = 55; // Base score (conservative)

  // On-chain data hints from transactions
  if (tokenData.transactions_24h && tokenData.transactions_24h > 5000) {
    score += 20;
  } else if (tokenData.transactions_24h && tokenData.transactions_24h > 1000) {
    score += 10;
  }

  // Holder distribution hints
  if (tokenData.holders && tokenData.holders > 10000) {
    score += 15;
  } else if (tokenData.holders && tokenData.holders > 1000) {
    score += 8;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate sentiment score based on data patterns
 *
 * @param tokenData - Token data
 * @returns Score 0-100
 *
 * @internal
 */
function calculateSentimentScore(tokenData: TokenData): number {
  let score = 50; // Base score

  // Volume growth indicator
  if (tokenData.volume_24h > 100000) score += 15;
  else if (tokenData.volume_24h > 50000) score += 10;

  // Price position
  if (tokenData.price_usd > 0.001 && tokenData.price_usd < 0.1) score += 10;

  return Math.min(100, Math.max(0, score));
}

/**
 * Generate recommendation based on overall score
 *
 * @param overallScore - Overall potential score
 * @param riskCount - Number of risk factors
 * @returns Recommendation string
 *
 * @internal
 */
function generateRecommendation(
  overallScore: number,
  riskCount: number
): string {
  if (overallScore >= 80 && riskCount <= 1) {
    return "Strong buy. Token shows excellent technical and fundamental metrics. Consider significant allocation if risk tolerance allows.";
  }
  if (overallScore >= 70 && riskCount <= 2) {
    return "Buy. Positive indicators across most metrics. Potential high upside, consider allocation with proper risk management.";
  }
  if (overallScore >= 60 && riskCount <= 3) {
    return "Monitor closely. Potential high upside but requires continuous monitoring. Consider small allocation if trend continues.";
  }
  if (overallScore >= 50) {
    return "Hold for now. Neutral with some promise. Review when more data becomes available.";
  }
  return `Use caution. Limited positive signals detected (score: ${overallScore}). Allocate minimal capital only.`;
}

/**
 * Generate summary text for token
 *
 * @param tokenData - Token data
 * @param overallScore - Overall potential score
 * @returns Summary string
 *
 * @internal
 */
function generateSummary(tokenData: TokenData, overallScore: number): string {
  const volumeStr =
    tokenData.volume_24h > 100000
      ? "high"
      : tokenData.volume_24h > 50000
        ? "moderate"
        : "low";
  const liquidityStr =
    tokenData.liquidity > 200000
      ? "strong"
      : tokenData.liquidity > 100000
        ? "adequate"
        : "limited";

  const chain = tokenData.chain;
  return (
    `${tokenData.token} on ${chain} shows ${volumeStr} trading volume with ${liquidityStr} liquidity. ` +
    `Price at ${tokenData.price_usd.toFixed(6)} USD. Overall potential score: ${overallScore}/100. ` +
    `Token demonstrates moderate market activity with room for growth. Monitor price action and volume trends closely.`
  );
}
