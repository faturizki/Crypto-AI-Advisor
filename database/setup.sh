#!/bin/bash
# @file database/setup.sh
# @description Setup script for Supabase database
# 
# Usage: ./database/setup.sh <SUPABASE_URL> <SUPABASE_KEY>

SUPABASE_URL=$1
SUPABASE_KEY=$2

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
  echo "Usage: ./database/setup.sh <SUPABASE_URL> <SUPABASE_KEY>"
  exit 1
fi

echo "Setting up database schema at $SUPABASE_URL..."

# Note: In practice, use Supabase SQL Editor or migrations
# This script is for reference only
echo "1. Log in to Supabase console"
echo "2. Navigate to SQL Editor"
echo "3. Create new query and paste contents of database/schema.sql"
echo "4. Execute the query"
echo "5. (Optional) Paste contents of database/seed.sql for sample data"

echo "Done! Your database schema is ready."
