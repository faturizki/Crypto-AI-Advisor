/**
 * @file components/FilterBar.tsx
 * @description Filter and search controls for token table
 */

"use client";

import React from "react";
import type { TokenFilters } from "@/types";

interface FilterBarProps {
  filters: TokenFilters;
  onFiltersChange: (filters: TokenFilters) => void;
  availableChains: string[];
}

/**
 * Filter bar component for controlling token display
 *
 * Provides controls for:
 * - Minimum score threshold
 * - Minimum volume threshold
 * - Chain selection
 * - Text search
 */
export function FilterBar({
  filters,
  onFiltersChange,
  availableChains,
}: FilterBarProps) {
  const handleMinScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      minScore: parseInt(e.target.value, 10) || 0,
    });
  };

  const handleMinVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      minVolume: parseInt(e.target.value, 10) || 0,
    });
  };

  const handleChainToggle = (chain: string) => {
    const newChains = filters.chains.includes(chain)
      ? filters.chains.filter((c) => c !== chain)
      : [...filters.chains, chain];
    onFiltersChange({
      ...filters,
      chains: newChains,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchQuery: e.target.value,
    });
  };

  const handleReset = () => {
    onFiltersChange({
      minScore: 0,
      minVolume: 0,
      chains: [],
      searchQuery: "",
    });
  };

  return (
    <div className="space-y-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Search Token
        </label>
        <input
          type="text"
          value={filters.searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by token name, pair, or chain..."
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Min Score Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Minimum Score: {filters.minScore}
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={filters.minScore}
          onChange={handleMinScoreChange}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>

      {/* Min Volume Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Minimum Volume: ${(filters.minVolume / 1000).toFixed(0)}K
        </label>
        <input
          type="range"
          min="0"
          max="1000000"
          step="10000"
          value={filters.minVolume}
          onChange={handleMinVolumeChange}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>

      {/* Chain Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Chains
        </label>
        <div className="flex flex-wrap gap-2">
          {availableChains.map((chain) => (
            <button
              key={chain}
              onClick={() => handleChainToggle(chain)}
              className={`px-3 py-1 rounded text-sm transition ${
                filters.chains.includes(chain)
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {chain}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded transition"
      >
        Reset Filters
      </button>
    </div>
  );
}
