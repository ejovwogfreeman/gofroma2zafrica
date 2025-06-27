"use client";

import { useEffect, useState, useCallback } from "react";
import { useStableDebounce } from "@/lib/hooks";
import { searchProducts } from "@/lib/products/api";
import { Product, ProductFilters } from "@/lib/products/types";
import ProductCard from "@/components/account/stores/products/ProductCard";

export default function ProductSearch() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    category: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(false);

  const debouncedSearch = useStableDebounce(searchQuery, 500);
  const debouncedFilters = useStableDebounce(filters, 500);

  const fetchProducts = useCallback(
    async (isLoadMore = false) => {
      try {
        setLoading(true);
        const response = await searchProducts(debouncedSearch, debouncedFilters);

        if (response?.products?.length > 0) {
          setProducts((prev) => {
            if (isLoadMore) {
              const existingIds = new Set(prev.map((p) => p._id));
              const newProducts = response.products.filter(
                (p) => !existingIds.has(p._id)
              );
              return [...prev, ...newProducts];
            }
            return response.products;
          });
          setHasMore(response.page < response.totalPages);
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
    [debouncedSearch, debouncedFilters]
  );

  // Initial load
  useEffect(() => {
    fetchProducts(false);
  }, [debouncedSearch, debouncedFilters]);

  const handleLoadMore = () => {
    setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }));
  };

  const categories = [
    "All Categories",
    "FASHION",
    "ELECTRONICS",
    "FOOD",
    "GROCERIES",
    "HEALTH",
    "HOME",
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-primary"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-48">
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  category: e.target.value,
                  page: 1,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-primary"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category === "All Categories" ? "" : category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="w-full sm:w-48">
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortOrder: e.target.value as "asc" | "desc",
                  page: 1,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-primary"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && products.length === 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-lg h-[300px] animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            storeId={product.storeId as string}
            storeSlug="default" // This will be updated when clicking to view product
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-gold-primary text-white rounded-lg hover:bg-gold-secondary 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* No Results */}
      {!loading && products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found. Try adjusting your search or filters.
        </div>
      )}
    </div>
  );
} 