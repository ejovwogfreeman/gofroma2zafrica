"use client";

import { useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Store, StoreFilters as StoreFiltersType } from "@/lib/stores/types";
import { getStores } from "@/lib/stores/api";
import StoreCard from "@/components/stores/listing/StoreCard";
import StoreFilters from "@/components/stores/listing/StoreFilters";

export default function AccountStoreList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState<StoreFiltersType>({
    page: 1,
    limit: 12,
    search: "",
    category: "",
    city: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchStores = useCallback(
    async (isLoadMore = false) => {
      try {
        setLoading(true);
        const data = await getStores(filters);

        setStores((prev) =>
          isLoadMore ? [...prev, ...data.stores] : data.stores
        );
        setHasMore(data.pagination.hasMore);
        setError(null);
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError("Failed to load stores. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleFilterChange = useCallback(
    (newFilters: Partial<StoreFiltersType>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        page: 1, // Reset page when filters change
      }));
    },
    []
  );

  const handleLoadMore = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      page: (prev.page || 1) + 1,
    }));
  }, []);

  if (loading && stores.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark">Browse Stores</h1>
      </div>

      {/* Filters */}
      <StoreFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stores Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {stores.map((store) => (
          <StoreCard key={store._id} store={store} />
        ))}
      </motion.div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-gold-primary text-white rounded-lg hover:bg-gold-secondary 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
