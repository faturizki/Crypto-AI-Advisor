/**
 * @file components/Header.tsx
 * @description Dashboard header component
 */

"use client";

import React from "react";

interface HeaderProps {
  tokenCount: number;
  highPotentialCount: number;
  lastUpdated: string | null;
}

/**
 * Dashboard header with title and statistics
 */
export function Header({
  tokenCount,
  highPotentialCount,
  lastUpdated,
}: HeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            🚀 Crypto AI Advisor Dashboard
          </h1>
          <p className="text-gray-400">
            Real-time token analysis powered by AI scoring
          </p>
        </div>
        {lastUpdated && (
          <div className="text-right text-sm text-gray-500">
            <div>Last updated:</div>
            <div className="text-gray-400">{lastUpdated}</div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">Total Tokens</div>
          <div className="text-2xl font-bold text-white">{tokenCount}</div>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">High Potential</div>
          <div className="text-2xl font-bold text-green-400">
            {highPotentialCount}
          </div>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-blue-400">
            {tokenCount > 0
              ? Math.round((highPotentialCount / tokenCount) * 100)
              : 0}
            %
          </div>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">Status</div>
          <div className="text-2xl font-bold text-cyan-400">Active</div>
        </div>
      </div>
    </div>
  );
}
