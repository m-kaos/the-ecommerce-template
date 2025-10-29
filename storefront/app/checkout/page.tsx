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
} from '@/lib/checkout-queries';

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

  useEffect(() => {
    if (!authLoading && !customer) {
      router.push('/login?redirect=/checkout');
    }

    if (customer && items.length === 0) {
      router.push('/cart');
    }

    // Pre-fill name from customer
    if (customer && !address.fullName) {
      setAddress(prev => ({
        ...prev,
        fullName: `${customer.firstName} ${customer.lastName}`,
        phoneNumber: customer.phoneNumber || '',
      }));
    }
  }, [customer, authLoading, items, router, address.fullName]);

  // Create order when checkout starts
  useEffect(() => {
    const createOrder = async () => {
      if (customer && items.length > 0 && !orderId) {
        try {
          // Add items to Vendure order
          for (const item of items) {
            await graphqlClient.mutation(ADD_ITEM_TO_ORDER, {
              productVariantId: item.variantId,
              quantity: item.quantity,
            });
          }

          // Get the active order ID
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
  }, [customer, items, orderId]);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await graphqlClient.mutation(SET_SHIPPING_ADDRESS, {
        input: address,
      });

      if (result.data?.setOrderShippingAddress?.id) {
        // Fetch shipping methods
        const methodsResult = await graphqlClient.query(GET_ELIGIBLE_SHIPPING_METHODS, {});
        setShippingMethods(methodsResult.data?.eligibleShippingMethods || []);
        setStep('shipping');
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
        setStep('payment');
      } else {
        setError('Failed to set shipping method');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Using dummy payment handler for development
      const result = await graphqlClient.mutation(ADD_PAYMENT_TO_ORDER, {
        input: {
          method: 'dummy-payment-method',
          metadata: {},
        },
      });

      if (result.data?.addPaymentToOrder?.id) {
        // Clear local cart
        clearCart();
        // Redirect to success page
        router.push(`/checkout/success?orderId=${result.data.addPaymentToOrder.id}`);
      } else {
        setError('Payment failed');
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

  if (authLoading || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

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
          {step === 'payment' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Payment</h2>
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
                <p className="font-semibold">Development Mode</p>
                <p className="text-sm">Using dummy payment handler. No real payment will be processed.</p>
              </div>

              <form onSubmit={handlePaymentSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-4 py-2 border rounded-lg"
                      disabled
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border rounded-lg"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-2 border rounded-lg"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </form>
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
