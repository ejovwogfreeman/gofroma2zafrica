"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getOrderById, trackOrder } from "@/lib/orders/api";
import { Order } from "@/lib/orders/types";

export default function OrderDetails({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackingData, setTrackingData] = useState<Order | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
        // Automatically fetch tracking data when order is loaded
        if (data.trackingNumber) {
          await fetchTrackingData(data.trackingNumber);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const fetchTrackingData = async (trackingNumber: string) => {
    setTrackingLoading(true);
    setTrackingError("");
    try {
      const data = await trackOrder(trackingNumber);
      setTrackingData(data);
    } catch (error) {
      setTrackingError(
        error instanceof Error ? error.message : "Failed to track order"
      );
    } finally {
      setTrackingLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading order details...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!order) {
    return <div className="text-white">Order not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-900 p-4 sm:p-6 rounded-lg border-2 border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-0">
          Order #{order.trackingNumber}
        </h1>
        <Link
          href="/account/orders"
          className="text-gold-primary hover:text-gold-secondary transition-colors text-base sm:text-lg font-medium"
        >
          ← Back to Orders
        </Link>
      </div>

      <div className="bg-gray-900 p-4 sm:p-8 rounded-lg border-2 border-gray-700">
        <div className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 border-b-2 border-gray-700 pb-6 sm:pb-8">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Order Status</h2>
              <span
                className={`inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-bold
                  ${
                    order.status === "DELIVERED"
                      ? "bg-green-600 text-white"
                      : order.status === "PENDING"
                      ? "bg-yellow-600 text-white"
                      : "bg-blue-600 text-white"
                  }`}
              >
                {order.status}
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Order Date</h3>
              <p className="text-lg sm:text-xl text-gold-primary font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 border-b-2 border-gray-700 pb-6 sm:pb-8">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Total Amount</h2>
              <p className="text-2xl sm:text-3xl font-bold text-gold-primary">
                ₦{order.price.toLocaleString()}
              </p>
              {order.zonePrice && (
                <p className="text-base sm:text-lg text-white mt-2">
                  Includes delivery fee: ₦{order.zonePrice.toLocaleString()}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Estimated Delivery</h3>
              <p className="text-lg sm:text-xl text-gold-primary font-medium">
                {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border-b-2 border-gray-700 pb-6 sm:pb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Delivery Details</h2>
            <div className="grid gap-4 sm:gap-6 bg-gray-800 p-4 sm:p-6 rounded-lg">
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-white mb-1">Recipient</span>
                <span className="text-lg sm:text-xl text-gold-primary">
                  {order.deliveryAddress.manualAddress?.recipientName || order.deliveryAddress.recipientName}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-white mb-1">Address</span>
                <span className="text-lg sm:text-xl text-gold-primary">
                  {order.deliveryAddress.manualAddress?.street || order.deliveryAddress.street},{" "}
                  {order.deliveryAddress.manualAddress?.city || order.deliveryAddress.city}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-white mb-1">Phone</span>
                <span className="text-lg sm:text-xl text-gold-primary">
                  {order.deliveryAddress.manualAddress?.recipientPhone || order.deliveryAddress.recipientPhone}
                </span>
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-700 pb-6 sm:pb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex flex-col sm:flex-row sm:justify-between sm:items-start bg-gray-800 p-4 sm:p-6 rounded-lg">
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-0">
                    <p className="text-base sm:text-lg text-white">
                      <span className="font-bold">Product ID:</span> {item.productId}
                    </p>
                    <p className="text-base sm:text-lg text-white">
                      <span className="font-bold">Quantity:</span> {item.quantity}
                    </p>
                    {item.variantData && item.variantData.length > 0 && (
                      <div className="text-base sm:text-lg text-white">
                        {item.variantData.map((variant) => (
                          <p key={variant._id}>
                            <span className="font-bold">{variant.name}:</span> {variant.value}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gold-primary">
                    ₦{item.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {order.specialInstructions && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Special Instructions</h2>
              <div className="bg-gray-800 p-4 sm:p-6 rounded-lg">
                <p className="text-base sm:text-lg text-white">
                  {order.specialInstructions}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
