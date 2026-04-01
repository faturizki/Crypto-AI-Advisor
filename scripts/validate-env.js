#!/usr/bin/env node

/**
 * @file scripts/validate-env.js
 * @description Validate required environment variables
 * 
 * Run: node scripts/validate-env.js
 */

const requiredVars = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_KEY",
];

const missingVars = requiredVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingVars.forEach((v) => console.error(`   - ${v}`));
  console.error(
    "\nCreate .env.local with these variables. See .env.example for template."
  );
  process.exit(1);
}

console.log("✅ All required environment variables are set");
process.exit(0);
