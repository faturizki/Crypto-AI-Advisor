/**
 * @file app/page.tsx
 * @description Main dashboard page
 */

"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { TokenTable } from "@/components/TokenTable";
import { useTokens } from "@/hooks/useTokens";
import type { TokenFilters } from "@/types";

/**
 * Main dashboard page
 *
 * Displays:
 * - Header with statistics
 * - Filter controls
 * - Token table with real-time data
 * - Loading and error states
 */
export default function Dashboard() {
  const { tokens, loading, error, refresh } = useTokens();
  const [filters, setFilters] = useState<TokenFilters>({
    minScore: 0,
    minVolume: 0,
    chains: [],
    searchQuery: "",
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const highPotential = tokens.filter(
      (t) => t.overall_potential_score >= 70
    ).length;
    const lastUpdate =
      tokens.length > 0
        ? new Date(tokens[0].timestamp).toLocaleString()
        : null;

    return {
      total: tokens.length,
      highPotential,
      lastUpdate,
    };
  }, [tokens]);

  // Get unique chains for filter
  const availableChains = useMemo(() => {
    const chains = new Set(tokens.map((t) => t.chain));
    return Array.from(chains).sort();
  }, [tokens]);

  return (
    <div className="space-y-6">
      {/* Header with statistics */}
      <Header
        tokenCount={stats.total}
        highPotentialCount={stats.highPotential}
        lastUpdated={stats.lastUpdate}
      />

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded text-red-300">
          <div className="font-semibold mb-1">Error loading tokens</div>
          <div className="text-sm">{error}</div>
          <button
            onClick={refresh}
            className="mt-2 px-3 py-1 bg-red-800 hover:bg-red-700 rounded text-sm transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && tokens.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mb-4" />
          <p className="text-gray-400">Loading tokens...</p>
        </div>
      ) : (
        <>
          {/* Filter Bar */}
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            availableChains={availableChains}
          />

          {/* Token Table */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Tokens</h2>
              <button
                onClick={refresh}
                disabled={loading}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded text-sm transition"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            <TokenTable tokens={tokens} filters={filters} />
          </div>
        </>
      )}
    </div>
  );
}
