/**
 * @file database/schema.sql
 * @description Supabase database schema for crypto tokens and history
 * 
 * Run this in Supabase SQL Editor to set up tables
 */

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tokens table (current data)
CREATE TABLE IF NOT EXISTS tokens (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  token VARCHAR(50) NOT NULL UNIQUE,
  pair VARCHAR(100) NOT NULL,
  chain VARCHAR(50) NOT NULL,
  price_usd DECIMAL(18, 10) NOT NULL,
  volume_24h DECIMAL(18, 2) NOT NULL,
  liquidity DECIMAL(18, 2) NOT NULL,
  technical_score INT CHECK (technical_score >= 0 AND technical_score <= 100),
  fundamental_score INT CHECK (fundamental_score >= 0 AND fundamental_score <= 100),
  on_chain_score INT CHECK (on_chain_score >= 0 AND on_chain_score <= 100),
  sentiment_score INT CHECK (sentiment_score >= 0 AND sentiment_score <= 100),
  overall_potential_score INT CHECK (overall_potential_score >= 0 AND overall_potential_score <= 100),
  probability_gain_20_percent DECIMAL(3, 2) CHECK (probability_gain_20_percent >= 0 AND probability_gain_20_percent <= 1),
  risk_notes TEXT[] DEFAULT '{}',
  recommendation TEXT,
  summary TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- History table (scoring snapshots)
CREATE TABLE IF NOT EXISTS history (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  token VARCHAR(50) NOT NULL,
  overall_potential_score INT CHECK (overall_potential_score >= 0 AND overall_potential_score <= 100),
  technical_score INT CHECK (technical_score >= 0 AND technical_score <= 100),
  fundamental_score INT CHECK (fundamental_score >= 0 AND fundamental_score <= 100),
  on_chain_score INT CHECK (on_chain_score >= 0 AND on_chain_score <= 100),
  sentiment_score INT CHECK (sentiment_score >= 0 AND sentiment_score <= 100),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (token) REFERENCES tokens(token) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_tokens_chain ON tokens(chain);
CREATE INDEX idx_tokens_overall_score ON tokens(overall_potential_score DESC);
CREATE INDEX idx_tokens_timestamp ON tokens(timestamp DESC);
CREATE INDEX idx_tokens_volume_24h ON tokens(volume_24h DESC);
CREATE INDEX idx_history_token ON history(token);
CREATE INDEX idx_history_timestamp ON history(timestamp DESC);

-- Create composite index for common queries
CREATE INDEX idx_tokens_chain_score ON tokens(chain, overall_potential_score DESC);

-- Set row level security (enable for public read, authenticated write)
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read on tokens" ON tokens
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on history" ON history
  FOR SELECT USING (true);

-- Policy: Allow upsert from authenticated users (backend)
CREATE POLICY "Allow backend upsert on tokens" ON tokens
  FOR INSERT WITH CHECK (true)
  FOR UPDATE USING (true);

CREATE POLICY "Allow backend insert on history" ON history
  FOR INSERT WITH CHECK (true);

-- Create function for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_tokens_updated_at
  BEFORE UPDATE ON tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to tables
COMMENT ON TABLE tokens IS 'Current token data with AI scores and recommendations';
COMMENT ON TABLE history IS 'Historical snapshots of token scores for trend analysis';
COMMENT ON COLUMN tokens.token IS 'Token symbol (e.g., NEWCOIN)';
COMMENT ON COLUMN tokens.technical_score IS 'Technical analysis score (0-100)';
COMMENT ON COLUMN tokens.fundamental_score IS 'Fundamental analysis score (0-100)';
COMMENT ON COLUMN tokens.on_chain_score IS 'On-chain metrics score (0-100)';
COMMENT ON COLUMN tokens.sentiment_score IS 'Market sentiment score (0-100)';
COMMENT ON COLUMN tokens.overall_potential_score IS 'Overall AI-generated score (0-100)';
COMMENT ON COLUMN tokens.probability_gain_20_percent IS 'Estimated probability token will gain 20% (0-1)';
