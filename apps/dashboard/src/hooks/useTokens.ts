/**
 * @file hooks/useTokens.ts
 * @description Hook for fetching tokens from Supabase
 */

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { TokenScore } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

/**
 * Hook to fetch and manage token data
 *
 * @returns Tokens, loading state, and refresh function
 *
 * @example
 * ```typescript
 * const { tokens, loading, error, refresh } = useTokens();
 * ```
 */
export function useTokens() {
  const [tokens, setTokens] = useState<TokenScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch tokens from database
   */
  const fetchTokens = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("tokens")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(100);

      if (supabaseError) {
        setError(supabaseError.message);
        return;
      }

      setTokens((data || []) as TokenScore[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchTokens();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel("tokens")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tokens",
        },
        () => {
          // Refetch when changes occur
          fetchTokens();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Refresh interval (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTokens();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    tokens,
    loading,
    error,
    refresh: fetchTokens,
  };
}
