"use client";

import { Suspense } from "react";
import ProductSearch from "@/components/account/products/ProductSearch";

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Search Products</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductSearch />
      </Suspense>
    </div>
  );
} 