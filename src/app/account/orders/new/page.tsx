'use client';

import { Suspense } from 'react';
import OrderFormContent from '@/components/account/orders/OrderFormContent';

export default function NewOrderPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-primary"></div>
        </div>
      }
    >
      <OrderFormContent />
    </Suspense>
  );
} 