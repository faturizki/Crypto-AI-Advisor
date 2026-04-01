/**
 * @file components/TokenTable.tsx
 * @description Main token display table component
 */

"use client";

import React, { useMemo } from "react";
import type { TokenScore } from "@/types";

interface TokenTableProps {
  tokens: TokenScore[];
  filters: {
    minScore: number;
    minVolume: number;
    chains: string[];
    searchQuery: string;
  };
}

/**
 * Token table component with filtering and sorting
 *
 * Displays tokens in a sortable, filterable table with:
 * - Token name and pair
 * - Chain identifier
 * - Price and volume
 * - AI scores
 * - Risk notes
 * - Recommendation
 */
export function TokenTable({ tokens, filters }: TokenTableProps) {
  // Filter tokens based on active filters
  const filteredTokens = useMemo(() => {
    return tokens.filter((token) => {
      // Score filter
      if (token.overall_potential_score < filters.minScore) return false;

      // Volume filter
      if (token.volume_24h < filters.minVolume) return false;

      // Chain filter
      if (filters.chains.length > 0 && !filters.chains.includes(token.chain)) {
        return false;
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          token.token.toLowerCase().includes(query) ||
          token.pair.toLowerCase().includes(query) ||
          token.chain.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [tokens, filters]);

  if (filteredTokens.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400">
        <p>No tokens match the current filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-700 bg-gray-900">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">
              Token
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">
              Pair
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">
              Chain
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-200">
              Price
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-200">
              Volume 24h
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-200">
              Liquidity
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-200">
              Overall Score
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-200">
              Recommendation
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredTokens.map((token) => (
            <tr
              key={token.token + token.timestamp}
              className={`border-b border-gray-800 hover:bg-gray-900 transition ${
                token.overall_potential_score >= 80
                  ? "bg-gradient-to-r from-green-950 to-transparent"
                  : token.overall_potential_score >= 70
                    ? "bg-gradient-to-r from-blue-950 to-transparent"
                    : ""
              }`}
            >
              <td className="px-4 py-3 text-sm font-medium text-white">
                {token.token}
              </td>
              <td className="px-4 py-3 text-sm text-gray-300">{token.pair}</td>
              <td className="px-4 py-3 text-sm">
                <span className="px-2 py-1 rounded bg-gray-800 text-gray-200 text-xs">
                  {token.chain}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-300">
                ${token.price_usd.toFixed(6)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-300">
                ${(token.volume_24h / 1000).toFixed(1)}K
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-300">
                ${(token.liquidity / 1000).toFixed(1)}K
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center">
                  <div
                    className={`px-3 py-1 rounded font-semibold text-sm ${
                      token.overall_potential_score >= 80
                        ? "bg-green-900 text-green-200"
                        : token.overall_potential_score >= 70
                          ? "bg-blue-900 text-blue-200"
                          : token.overall_potential_score >= 50
                            ? "bg-yellow-900 text-yellow-200"
                            : "bg-red-900 text-red-200"
                    }`}
                  >
                    {token.overall_potential_score}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-300">
                <div className="text-xs max-w-xs truncate">
                  {token.recommendation.split(".")[0]}...
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
