"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Import the client component with no SSR
const OrderDetailsClient = dynamic(
  () => import('@/components/account/orders/OrderDetailsClient'),
  { 
    ssr: false,
    loading: () => <div className="text-gold-primary text-base sm:text-xl font-bold p-4">Loading order details...</div>
  }
);

interface OrderDetailsWrapperProps {
  orderId: string;
}

export default function OrderDetailsWrapper({ orderId }: OrderDetailsWrapperProps) {
  if (!orderId) {
    return <div className="text-gold-primary text-base sm:text-xl font-bold p-4">No order ID provided</div>;
  }

  return (
    <Suspense fallback={<div className="text-gold-primary text-base sm:text-xl font-bold p-4">Loading order details...</div>}>
      <div className="p-4 sm:p-0">
      <OrderDetailsClient orderId={orderId} />
      </div>
    </Suspense>
  );
} 