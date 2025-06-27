"use client";

import { useState, useEffect } from 'react';
import { getOrderById } from '@/lib/orders/api';
import { Order } from '@/lib/orders/types';

interface OrderDetailsClientProps {
  orderId: string;
}

export default function OrderDetailsClient({ orderId }: OrderDetailsClientProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setError("Order ID is missing");
        setLoading(false);
        return;
      }
      
      try {
        console.log("Fetching order with ID:", orderId);
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="text-gold-primary text-base sm:text-xl font-bold">Loading order details...</div>;
  if (error) return <div className="text-red-500 text-base sm:text-xl font-bold">Error: {error}</div>;
  if (!order) return <div className="text-gold-primary text-base sm:text-xl font-bold">Order not found</div>;

  return (
    <div className="bg-gray-900 rounded-lg p-4 sm:p-8 shadow-xl border-2 border-gray-700">
      <h2 className="text-2xl sm:text-4xl font-bold text-gold-primary mb-4 sm:mb-6">Order #{order.trackingNumber}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border-2 border-gray-700">
          <h3 className="text-xl sm:text-2xl font-bold text-gold-primary mb-3 sm:mb-4">Order Information</h3>
          <div className="space-y-3 sm:space-y-4 text-base sm:text-xl">
            <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span className="font-bold text-white mb-1 sm:mb-0">Status:</span>
              <span className="text-gold-primary font-semibold">{order.status}</span>
            </p>
            <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span className="font-bold text-white mb-1 sm:mb-0">Date:</span>
              <span className="text-gold-primary font-semibold">{new Date(order.createdAt).toLocaleDateString()}</span>
            </p>
            <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span className="font-bold text-white mb-1 sm:mb-0">Total:</span>
              <span className="text-gold-primary font-semibold">₦{order.price.toLocaleString()}</span>
            </p>
            <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span className="font-bold text-white mb-1 sm:mb-0">Estimated Delivery:</span>
              <span className="text-gold-primary font-semibold">{new Date(order.estimatedDeliveryDate).toLocaleDateString()}</span>
            </p>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border-2 border-gray-700">
          <h3 className="text-xl sm:text-2xl font-bold text-gold-primary mb-3 sm:mb-4">Delivery Details</h3>
          <div className="space-y-3 sm:space-y-4 text-base sm:text-xl">
            <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span className="font-bold text-white mb-1 sm:mb-0">Recipient:</span>
              <span className="text-gold-primary font-semibold">{order.deliveryAddress.recipientName}</span>
            </p>
            <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span className="font-bold text-white mb-1 sm:mb-0">Address:</span>
              <span className="text-gold-primary font-semibold">{order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
            </p>
            <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span className="font-bold text-white mb-1 sm:mb-0">Phone:</span>
              <span className="text-gold-primary font-semibold">{order.deliveryAddress.recipientPhone}</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 sm:mt-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gold-primary mb-3 sm:mb-4">Items</h3>
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-2 border-gray-700">
          {order.items.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:py-4 border-b-2 border-gray-700 last:border-0">
              <div className="mb-2 sm:mb-0">
                <p className="text-base sm:text-xl">
                  <span className="font-bold text-white">Product ID:</span>{" "}
                  <span className="text-gold-primary">{item.productId}</span>
                </p>
                <p className="text-base sm:text-xl mt-1 sm:mt-2">
                  <span className="font-bold text-white">Quantity:</span>{" "}
                  <span className="text-gold-primary">{item.quantity}</span>
                </p>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gold-primary">
                ₦{item.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {order.specialInstructions && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gold-primary mb-3 sm:mb-4">Special Instructions</h3>
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-2 border-gray-700">
            <p className="text-base sm:text-xl text-white">{order.specialInstructions}</p>
          </div>
        </div>
      )}
    </div>
  );
}