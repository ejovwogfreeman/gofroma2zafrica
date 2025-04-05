"use client";

import { Store } from "@/lib/stores/types";
import Link from "next/link";
import { memo } from "react";

interface StoreCardProps {
  store: Store;
}

const StoreCard = memo(function StoreCard({ store }: StoreCardProps) {
  return (
    <Link
      href={`/account/stores/${store.slug}`}
      className="block bg-black/5 rounded-lg shadow-md border border-gold-primary/20 hover:border-gold-primary transition-all hover:shadow-lg overflow-hidden"
    >
      <div className="p-4 space-y-4">
        {/* Store Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-light-900 truncate">
              {store.storeName}
            </h3>
            {store.settings.isVerified && (
              <span className="bg-gold-primary/10 text-gold-primary text-xs px-2 py-1 rounded-full">
                Verified
              </span>
            )}
          </div>
          <p className="text-sm text-light-600 line-clamp-2">
            {store.description}
          </p>
        </div>

        {/* Store Info */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-light-600">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {store.address.city}, {store.address.state}
          </div>
          <div className="flex items-center text-sm text-light-600">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            {store.category}
          </div>
        </div>

        {/* Store Metrics */}
        <div className="flex justify-between pt-4 border-t border-gold-primary/10 text-sm">
          <span className="text-light-600">
            Products: {store.metrics.totalProducts}
          </span>
          {store.settings.allowRatings && (
            <span className="flex items-center text-gold-primary">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              4.5
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});

export default StoreCard;
