"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ConsumerProfile,
  AnalyticsOverview,
  OrderAnalytics,
  SpendingAnalytics,
  PreferencesAnalytics,
} from "@/lib/consumers/types";
import {
  getProfile,
  getAnalyticsOverview,
  getOrderAnalytics,
  getSpendingAnalytics,
  getPreferencesAnalytics,
} from "@/lib/consumers/api";

export default function AccountOverview() {
  const [profile, setProfile] = useState<ConsumerProfile | null>(null);
  const [analytics, setAnalytics] = useState<{
    overview: AnalyticsOverview | null;
    orders: OrderAnalytics | null;
    spending: SpendingAnalytics | null;
    preferences: PreferencesAnalytics | null;
  }>({
    overview: null,
    orders: null,
    spending: null,
    preferences: null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          profileData,
          overviewData,
          orderData,
          spendingData,
          preferencesData,
        ] = await Promise.all([
          getProfile(),
          getAnalyticsOverview(),
          getOrderAnalytics(),
          getSpendingAnalytics(),
          getPreferencesAnalytics(),
        ]);

        setProfile(profileData);
        setAnalytics({
          overview: overviewData,
          orders: orderData,
          spending: spendingData,
          preferences: preferencesData,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  console.log(analytics);

  return (
    <div className="space-y-8">
      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Profile Information
          </h2>
          <Link
            href="/account/profile"
            className="text-gold-primary hover:text-gold-secondary transition-colors"
          >
            Edit Profile →
          </Link>
        </div>

        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p className="text-sm">Name</p>
              <p className="text-gray-900">
                {profile.firstName} {profile.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm">Email</p>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm">Phone</p>
              <p className="text-gray-900">{profile.phone || "Not set"}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Analytics Overview */}

      {analytics.overview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders</h3>
            <p className="text-3xl font-bold text-gold-primary">
              {analytics.overview.totalOrders}
            </p>
            <p className="text-sm text-gray-600 mt-2">Total Orders</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Total Spent
            </h3>
            <p className="text-3xl font-bold text-gold-primary">
              ₦{analytics.overview.totalSpent.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-2">Lifetime Spending</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Favorite Store
            </h3>
            <p className="text-xl font-semibold text-gray-900">
              {analytics.overview.favoriteStore.storeName}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {analytics.overview.favoriteStore.orderCount} orders
            </p>
          </div>
        </motion.div>
      )}

      {/* Order Status */}
      {analytics.orders && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order Status
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analytics.orders.ordersByStatus).map(
              ([status, count]) => (
                <div key={status} className="text-center">
                  <p className="text-2xl font-bold text-gold-primary">
                    {count}
                  </p>
                  <p className="text-sm text-gray-600">{status}</p>
                </div>
              )
            )}
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Delivery Preferences */}
        {analytics.preferences && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delivery Preferences
            </h3>
            <div className="space-y-4">
              {analytics.preferences.deliveryPreferences.commonAddresses
                .slice(0, 3)
                .map((address, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <p className="text-gray-600">{address.address}</p>
                    <span className="text-sm text-gray-500">
                      {address.useCount} times
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Popular Products */}
        {analytics.preferences && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Most Ordered Products
            </h3>
            <div className="space-y-4">
              {analytics.preferences.productPreferences
                .slice(0, 3)
                .map((product) => (
                  <div
                    key={product.productId}
                    className="flex justify-between items-center"
                  >
                    <p className="text-gray-600">{product.productName}</p>
                    <span className="text-sm text-gray-500">
                      {product.orderCount} orders
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </motion.div>

      <a
        href="https://wa.me/+2347066096155"
        style={{
          position: "fixed",
          zIndex: "100000000000",
          bottom: "10px",
          right: "3%",
          backgroundColor: "#25D366",
          borderRadius: "50%",
          padding: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"
          />
        </svg>
      </a>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/iconify/3.1.1/iconify.min.js"></script>
    </div>
  );
}
