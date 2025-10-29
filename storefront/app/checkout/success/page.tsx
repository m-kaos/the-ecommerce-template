'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('orderId');
    setOrderId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        {orderId && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Order ID</p>
            <p className="text-2xl font-mono font-semibold">{orderId}</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-gray-700">
            A confirmation email has been sent to your email address with order details.
          </p>

          <div className="flex gap-4 justify-center pt-6">
            <Link
              href="/account"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              View Orders
            </Link>
            <Link
              href="/products"
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
