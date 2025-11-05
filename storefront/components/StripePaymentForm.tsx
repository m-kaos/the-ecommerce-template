'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

interface StripePaymentFormProps {
  onSuccess: () => void;
  onBack: () => void;
  totalAmount: number;
}

export default function StripePaymentForm({ onSuccess, onBack, totalAmount }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Payment failed');
        setLoading(false);
        return;
      }

      // Confirm the payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        setLoading(false);
      } else {
        // Payment succeeded
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <PaymentElement />
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : `Pay ${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(totalAmount / 100)}`}
        </button>
      </div>
    </form>
  );
}
