/**
 * @file ai-scorer.ts
 * @description Main AI scoring implementation using Claude API
 */

import Anthropic from "@anthropic-ai/sdk";
import { TokenData, TokenScore } from "./types";
import { mockTokenScore } from "./mock";

/**
 * AI Scorer class using Claude for real scoring
 */
export class AIScorer {
  private client: Anthropic;
  private useMock: boolean;

  /**
   * Initialize AI Scorer with Anthropic client
   *
   * @param apiKey - Anthropic API key
   * @param useMock - If true, use mock data instead of real AI
   *
   * @example
   * ```typescript
   * const scorer = new AIScorer(process.env.ANTHROPIC_API_KEY, false);
   * ```
   */
  constructor(apiKey: string, useMock: boolean = true) {
    this.useMock = useMock;
    if (!useMock && !apiKey) {
      throw new Error("Anthropic API key required when not using mock data");
    }
    this.client = new Anthropic({
      apiKey: apiKey || "mock-key",
    });
  }

  /**
   * Score a single token
   *
   * @param tokenData - Token data to score
   * @returns Scored token with all metrics
   *
   * @example
   * ```typescript
   * const score = await scorer.scoreToken({
   *   token: "NEWCOIN",
   *   pair: "NEWCOIN/USDT",
   *   chain: "BSC",
   *   price_usd: 0.0123,
   *   volume_24h: 52000,
   *   liquidity: 105000
   * });
   * ```
   */
  async scoreToken(tokenData: TokenData): Promise<TokenScore> {
    if (this.useMock) {
      return mockTokenScore(tokenData);
    }

    return this.scoreTokenWithAI(tokenData);
  }

  /**
   * Score multiple tokens
   *
   * @param tokens - Array of token data to score
   * @returns Array of scored tokens
   *
   * @example
   * ```typescript
   * const scores = await scorer.scoreTokens(tokenDataArray);
   * ```
   */
  async scoreTokens(tokens: TokenData[]): Promise<TokenScore[]> {
    return Promise.all(tokens.map((token) => this.scoreToken(token)));
  }

  /**
   * Score token using Claude API
   *
   * @param tokenData - Token data
   * @returns Scored token
   *
   * @internal
   */
  private async scoreTokenWithAI(tokenData: TokenData): Promise<TokenScore> {
    const prompt = this.buildScoringPrompt(tokenData);

    try {
      const response = await this.client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type from Claude API");
      }

      return this.parseAIResponse(content.text, tokenData);
    } catch (error) {
      console.error("Error calling Claude API:", error);
      throw new Error(
        `Failed to score token ${tokenData.token}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Build prompt for Claude AI
   *
   * @param tokenData - Token data
   * @returns Formatted prompt
   *
   * @internal
   */
  private buildScoringPrompt(tokenData: TokenData): string {
    return `You are an expert crypto analyst. Analyze this token and provide structured scoring.

Token Data:
- Token: ${tokenData.token}
- Pair: ${tokenData.pair}
- Chain: ${tokenData.chain}
- Price (USD): ${tokenData.price_usd}
- Volume 24h: ${tokenData.volume_24h}
- Liquidity: ${tokenData.liquidity}
${tokenData.market_cap ? `- Market Cap: ${tokenData.market_cap}` : ""}
${tokenData.holders ? `- Holders: ${tokenData.holders}` : ""}
${tokenData.transactions_24h ? `- Transactions 24h: ${tokenData.transactions_24h}` : ""}

Provide JSON response with exactly this structure:
{
  "technical_score": <0-100 int>,
  "fundamental_score": <0-100 int>,
  "on_chain_score": <0-100 int>,
  "sentiment_score": <0-100 int>,
  "overall_potential_score": <0-100 int>,
  "probability_gain_20_percent": <0-1 float>,
  "risk_notes": [<list of risk strings>],
  "recommendation": "<string>",
  "summary": "<2-3 sentence analysis>"
}

Focus on:
- Technical: price action, volume, volatility patterns
- Fundamental: liquidity, market cap, holder distribution
- On-chain: transaction velocity, holder concentration, whale activity
- Sentiment: volume trends, price momentum

Be conservative. Output ONLY valid JSON.`;
  }

  /**
   * Parse Claude's JSON response
   *
   * @param response - Claude's text response
   * @param tokenData - Original token data
   * @returns Scored token
   *
   * @internal
   */
  private parseAIResponse(response: string, tokenData: TokenData): TokenScore {
    try {
      // Extract JSON from response (Claude might add extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        token: tokenData.token,
        pair: tokenData.pair,
        chain: tokenData.chain,
        price_usd: tokenData.price_usd,
        volume_24h: tokenData.volume_24h,
        liquidity: tokenData.liquidity,
        technical_score: Math.max(0, Math.min(100, parsed.technical_score)),
        fundamental_score: Math.max(
          0,
          Math.min(100, parsed.fundamental_score)
        ),
        on_chain_score: Math.max(0, Math.min(100, parsed.on_chain_score)),
        sentiment_score: Math.max(0, Math.min(100, parsed.sentiment_score)),
        overall_potential_score: Math.max(
          0,
          Math.min(100, parsed.overall_potential_score)
        ),
        probability_gain_20_percent: Math.max(
          0,
          Math.min(1, parsed.probability_gain_20_percent)
        ),
        risk_notes: Array.isArray(parsed.risk_notes)
          ? parsed.risk_notes
          : ["Unable to assess risks"],
        recommendation: parsed.recommendation || "Unable to provide recommendation",
        summary: parsed.summary || "Unable to provide summary",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error parsing AI response:", error);
      throw new Error(
        `Failed to parse AI response for ${tokenData.token}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
