"use client";

import { useEffect, useState, useCallback } from "react";
import { getStoreProducts } from "@/lib/stores/api";
import { Product } from "@/lib/stores/types";
import ProductCard from "./ProductCard";
import { useStableDebounce } from "@/lib/hooks";

interface ConsumerStoreProductsProps {
  storeSlug: string;
  storeId: string;
}

export default function ConsumerStoreProducts({
  storeSlug,
  storeId,
}: ConsumerStoreProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });
  const [hasMore, setHasMore] = useState(false);

  const debouncedFilters = useStableDebounce(filters, 500);

  const fetchProducts = useCallback(
    async (isLoadMore = false) => {
      try {
        setLoading(true);
        const response = await getStoreProducts(storeSlug, debouncedFilters);

        if (response?.products?.length > 0) {
          setProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p._id));
            const newProducts = response.products.filter(
              (p) => !existingIds.has(p._id)
            );
            return isLoadMore ? [...prev, ...newProducts] : response.products;
          });
          setHasMore(response.pagination?.hasMore || false);
        } else {
          if (!isLoadMore) {
            setProducts([]);
          }
          setHasMore(false);
        }
        setError(null);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [storeSlug, debouncedFilters]
  );

  // Initial load on mount (no debounce)
  useEffect(() => {
    fetchProducts(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load more or refetch on filter change (debounced)
  useEffect(() => {
    if (filters.page !== 1) {
      fetchProducts(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters]);

  const handleLoadMore = () => {
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-black/5 rounded-lg shadow-md h-[250px] sm:h-[300px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm sm:text-base">{error}</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            storeSlug={storeSlug}
            storeId={storeId}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4 sm:pt-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 sm:px-6 py-2 bg-gold-primary text-white rounded-lg hover:bg-gold-secondary 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
