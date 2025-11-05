'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { graphqlClient } from '@/lib/graphql-client';
import {
  SET_SHIPPING_ADDRESS,
  GET_ELIGIBLE_SHIPPING_METHODS,
  SET_SHIPPING_METHOD,
  ADD_PAYMENT_TO_ORDER,
  ADD_ITEM_TO_ORDER,
  GET_ACTIVE_ORDER,
  TRANSITION_TO_STATE,
} from '@/lib/checkout-queries';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import StripePaymentForm from '@/components/StripePaymentForm';

type Step = 'address' | 'shipping' | 'payment' | 'review';

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  priceWithTax: number;
}

export default function CheckoutPage() {
  const { customer, loading: authLoading } = useAuth();
  const { items, clearCart, totalPrice } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>('address');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Address form
  const [address, setAddress] = useState({
    fullName: '',
    streetLine1: '',
    streetLine2: '',
    city: '',
    province: '',
    postalCode: '',
    countryCode: 'US',
    phoneNumber: '',
  });

  // Shipping
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (!authLoading && !customer) {
      router.push('/login?redirect=/checkout');
    }

    if (customer && items.length === 0 && !isProcessingPayment) {
      router.push('/cart');
    }

    if (customer && !address.fullName) {
      setAddress(prev => ({
        ...prev,
        fullName: `${customer.firstName} ${customer.lastName}`,
        phoneNumber: customer.phoneNumber || '',
      }));
    }
  }, [customer, authLoading, items, router, address.fullName, isProcessingPayment]);

  useEffect(() => {
    const createOrder = async () => {
      if (customer && items.length > 0) {
        try {
          const checkResult = await graphqlClient.query(GET_ACTIVE_ORDER, {});

          if (checkResult.data?.activeOrder?.id) {
            const existingOrderId = checkResult.data.activeOrder.id;
            const existingOrder = checkResult.data.activeOrder;

            if (existingOrder.lines && existingOrder.lines.length > 0) {
              if (orderId !== existingOrderId) {
                setOrderId(existingOrderId);
              }
              return;
            }
          }

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            await graphqlClient.mutation(ADD_ITEM_TO_ORDER, {
              productVariantId: item.variantId,
              quantity: item.quantity,
            });
          }

          const result = await graphqlClient.query(GET_ACTIVE_ORDER, {});
          if (result.data?.activeOrder?.id) {
            setOrderId(result.data.activeOrder.id);
          }
        } catch (err) {
          console.error('Error creating order:', err);
        }
      }
    };

    createOrder();
  }, [customer, items]);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await Promise.race([
        graphqlClient.mutation(SET_SHIPPING_ADDRESS, {
          input: address,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Mutation timeout after 10s')), 10000)
        )
      ]);

      if (result.data?.setOrderShippingAddress?.id) {
        const methodsResult = await graphqlClient.query(GET_ELIGIBLE_SHIPPING_METHODS, {});
        const methods = methodsResult.data?.eligibleShippingMethods || [];
        setShippingMethods(methods);
        setStep('shipping');
      } else if (result.data?.setOrderShippingAddress?.errorCode) {
        setError(result.data.setOrderShippingAddress.message || 'Failed to set shipping address');
      } else {
        setError('Failed to set shipping address');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedShipping) {
      setError('Please select a shipping method');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await graphqlClient.mutation(SET_SHIPPING_METHOD, {
        shippingMethodId: [selectedShipping],
      });

      if (result.data?.setOrderShippingMethod?.id) {
        // Create Stripe Payment Intent
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalPrice,
            orderId: orderId,
          }),
        });

        const data = await response.json();

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setStep('payment');
        } else {
          setError(data.error || 'Failed to initialize payment');
        }
      } else if (result.data?.setOrderShippingMethod?.errorCode) {
        setError(result.data.setOrderShippingMethod.message || 'Failed to set shipping method');
      } else {
        setError('Failed to set shipping method');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setIsProcessingPayment(true);
    setLoading(true);

    try {
      // Transition to ArrangingPayment
      const transitionResult = await graphqlClient.mutation(TRANSITION_TO_STATE, {
        state: 'ArrangingPayment',
      });

      if (transitionResult.data?.transitionOrderToState?.errorCode) {
        setError(transitionResult.data.transitionOrderToState.message || 'Failed to prepare order');
        return;
      }

      // Add payment metadata to order
      const result = await graphqlClient.mutation(ADD_PAYMENT_TO_ORDER, {
        input: {
          method: 'stripe',
          metadata: {
            paymentIntentId: 'stripe-payment',
          },
        },
      });

      if (result.data?.addPaymentToOrder?.id) {
        clearCart();
        router.push(`/checkout/success?orderId=${result.data.addPaymentToOrder.id}`);
      } else if (result.data?.addPaymentToOrder?.errorCode) {
        setError(result.data.addPaymentToOrder.message || 'Failed to complete order');
      } else {
        setError('Failed to complete order');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading authentication...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p>Please login to continue</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p>Your cart is empty</p>
        </div>
      </div>
    );
  }

  const stripePromise = getStripe();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${step === 'address' ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'address' ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>1</div>
            <span className="ml-2">Address</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center ${step === 'shipping' ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>2</div>
            <span className="ml-2">Shipping</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center ${step === 'payment' ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>3</div>
            <span className="ml-2">Payment</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Address Step */}
          {step === 'address' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address.streetLine1}
                    onChange={(e) => setAddress({ ...address, streetLine1: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Apartment, suite, etc. (optional)</label>
                  <input
                    type="text"
                    value={address.streetLine2}
                    onChange={(e) => setAddress({ ...address, streetLine2: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">State/Province</label>
                    <input
                      type="text"
                      required
                      value={address.province}
                      onChange={(e) => setAddress({ ...address, province: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={address.phoneNumber}
                      onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400"
                >
                  {loading ? 'Processing...' : 'Continue to Shipping'}
                </button>
              </form>
            </div>
          )}

          {/* Shipping Step */}
          {step === 'shipping' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Shipping Method</h2>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className="block p-4 border rounded-lg cursor-pointer hover:border-primary-600"
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={selectedShipping === method.id}
                      onChange={(e) => setSelectedShipping(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-semibold">{method.name}</span>
                    <span className="float-right">{formatPrice(method.priceWithTax)}</span>
                    {method.description && (
                      <p className="text-sm text-gray-600 ml-7">{method.description}</p>
                    )}
                  </label>
                ))}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !selectedShipping}
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400"
                  >
                    {loading ? 'Processing...' : 'Continue to Payment'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Payment Step */}
          {step === 'payment' && clientSecret && stripePromise && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Payment</h2>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm
                  onSuccess={handlePaymentSuccess}
                  onBack={() => setStep('shipping')}
                  totalAmount={totalPrice}
                />
              </Elements>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3">
                  <div className="relative w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-semibold">{item.productName}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{step === 'payment' && selectedShipping ? 'Calculated' : 'TBD'}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
