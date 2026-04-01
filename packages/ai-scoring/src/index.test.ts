import { AIScorer, mockTokenScore } from "../src/index";

describe("AIScorer Mock Mode", () => {
  it("should generate consistent mock scores", async () => {
    const scorer = new AIScorer("test-key", true);

    const tokenData = {
      token: "TESTCOIN",
      pair: "TESTCOIN/USDT",
      chain: "BSC",
      price_usd: 0.0123,
      volume_24h: 52000,
      liquidity: 105000,
    };

    const score = await scorer.scoreToken(tokenData);

    expect(score.token).toBe("TESTCOIN");
    expect(score.technical_score).toBeGreaterThanOrEqual(0);
    expect(score.technical_score).toBeLessThanOrEqual(100);
    expect(score.overall_potential_score).toBeGreaterThanOrEqual(0);
    expect(score.overall_potential_score).toBeLessThanOrEqual(100);
    expect(score.probability_gain_20_percent).toBeGreaterThanOrEqual(0);
    expect(score.probability_gain_20_percent).toBeLessThanOrEqual(1);
  });

  it("should identify risk factors", async () => {
    const tokenData = {
      token: "RISKYCOIN",
      pair: "RISKYCOIN/USDT",
      chain: "ETH",
      price_usd: 0.00001,
      volume_24h: 1000,
      liquidity: 30000,
    };

    const score = mockTokenScore(tokenData);

    expect(score.risk_notes.length).toBeGreaterThan(0);
  });

  it("should handle multiple tokens", async () => {
    const scorer = new AIScorer("test-key", true);

    const tokens = [
      {
        token: "TOKEN1",
        pair: "TOKEN1/USDT",
        chain: "BSC",
        price_usd: 0.01,
        volume_24h: 50000,
        liquidity: 100000,
      },
      {
        token: "TOKEN2",
        pair: "TOKEN2/USDT",
        chain: "ETH",
        price_usd: 0.05,
        volume_24h: 30000,
        liquidity: 80000,
      },
    ];

    const scores = await scorer.scoreTokens(tokens);

    expect(scores).toHaveLength(2);
    expect(scores[0].token).toBe("TOKEN1");
    expect(scores[1].token).toBe("TOKEN2");
  });
});
