/**
 * @file database/seed.sql
 * @description Sample data for testing
 * 
 * Optional: Run this to populate sample data for testing
 */

-- Insert sample tokens for testing
INSERT INTO tokens (
  token, pair, chain, price_usd, volume_24h, liquidity,
  technical_score, fundamental_score, on_chain_score, sentiment_score,
  overall_potential_score, probability_gain_20_percent,
  risk_notes, recommendation, summary, timestamp
) VALUES
(
  'SAMPLE1', 'SAMPLE1/USDT', 'BSC', 0.0123, 105000, 250000,
  82, 78, 85, 75, 81, 0.68,
  ARRAY['Low liquidity']::TEXT[],
  'Monitor closely. Potential high upside, consider small allocation if trend continues.',
  'SAMPLE1 shows strong technical indicators with moderate fundamental support. Volume increased 120% in 24h, suggesting growing interest.',
  CURRENT_TIMESTAMP
),
(
  'SAMPLE2', 'SAMPLE2/USDT', 'ETH', 0.456, 52000, 150000,
  65, 72, 68, 70, 69, 0.45,
  ARRAY['New token', 'Unverified audit']::TEXT[],
  'Hold for now. Neutral with some promise. Review when more data becomes available.',
  'SAMPLE2 shows balanced metrics across all scoring categories. Market activity is moderate with steady trading.',
  CURRENT_TIMESTAMP
),
(
  'SAMPLE3', 'SAMPLE3/USDT', 'SOLANA', 1.234, 320000, 500000,
  88, 85, 82, 80, 84, 0.72,
  ARRAY[]::TEXT[],
  'Strong buy. Token shows excellent technical and fundamental metrics. Consider significant allocation if risk tolerance allows.',
  'SAMPLE3 demonstrates exceptional strength across all metrics. High platform volume and strong holder distribution suggest confidence.',
  CURRENT_TIMESTAMP
);

-- Insert sample history data
INSERT INTO history (token, overall_potential_score, technical_score, fundamental_score, on_chain_score, sentiment_score, timestamp)
VALUES
('SAMPLE1', 81, 82, 78, 85, 75, CURRENT_TIMESTAMP - INTERVAL '5 days'),
('SAMPLE1', 79, 80, 76, 83, 73, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('SAMPLE1', 81, 82, 78, 85, 75, CURRENT_TIMESTAMP),
('SAMPLE2', 67, 63, 70, 66, 68, CURRENT_TIMESTAMP - INTERVAL '5 days'),
('SAMPLE2', 68, 64, 71, 67, 69, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('SAMPLE2', 69, 65, 72, 68, 70, CURRENT_TIMESTAMP),
('SAMPLE3', 80, 85, 82, 79, 78, CURRENT_TIMESTAMP - INTERVAL '5 days'),
('SAMPLE3', 82, 86, 84, 81, 79, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('SAMPLE3', 84, 88, 85, 82, 80, CURRENT_TIMESTAMP);
