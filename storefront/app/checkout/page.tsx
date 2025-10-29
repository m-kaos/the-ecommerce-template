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

type Step = 'address' | 'shipping' | 'payment' | 'review';

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  priceWithTax: number;
}

export default function CheckoutPage() {
  console.log('=== CHECKOUT PAGE RENDER ===');
  const { customer, loading: authLoading } = useAuth();
  const { items, clearCart, totalPrice } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>('address');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);

  console.log('1. Checkout State:', {
    hasCustomer: !!customer,
    customerEmail: customer?.emailAddress,
    authLoading,
    itemsCount: items.length,
    items: items.map(i => ({ id: i.variantId, name: i.productName, qty: i.quantity })),
    orderId,
    step
  });

  // Address form
  const [address, setAddress] = useState({
    fullName: '',
    streetLine1: '',
    streetLine2: '',
    city: '',
    province: '',
    postalCode: '',
    countryCode: 'US', // United States country code
    phoneNumber: '',
  });

  // Shipping
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>('');

  // Flag to prevent redirect when payment is being processed
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    console.log('2. First useEffect - Auth/Redirect Check');
    if (!authLoading && !customer) {
      console.log('   -> Not logged in, redirecting to login');
      router.push('/login?redirect=/checkout');
    }

    if (customer && items.length === 0 && !isProcessingPayment) {
      console.log('   -> Cart is empty, redirecting to cart');
      router.push('/cart');
    }

    // Pre-fill name from customer
    if (customer && !address.fullName) {
      console.log('   -> Pre-filling customer name:', customer.firstName, customer.lastName);
      setAddress(prev => ({
        ...prev,
        fullName: `${customer.firstName} ${customer.lastName}`,
        phoneNumber: customer.phoneNumber || '',
      }));
    }
  }, [customer, authLoading, items, router, address.fullName, isProcessingPayment]);

  // Create order when checkout starts
  useEffect(() => {
    console.log('3. Second useEffect - Order Creation');
    const createOrder = async () => {
      console.log('   -> Checking conditions: customer?', !!customer, 'items?', items.length, 'orderId?', orderId);

      if (customer && items.length > 0) {
        // First, check if there's already an active order
        console.log('   -> Checking for existing active order...');
        try {
          const checkResult = await graphqlClient.query(GET_ACTIVE_ORDER, {});
          console.log('   -> Active order check result:', JSON.stringify(checkResult, null, 2));

          if (checkResult.data?.activeOrder?.id) {
            const existingOrderId = checkResult.data.activeOrder.id;
            const existingOrder = checkResult.data.activeOrder;
            console.log('   -> ✓ Found existing active order:', existingOrderId);
            console.log('   -> Order has', existingOrder.lines?.length || 0, 'line items');

            // Check if order already has items
            if (existingOrder.lines && existingOrder.lines.length > 0) {
              console.log('   -> Order already has items, no need to add more');
              if (orderId !== existingOrderId) {
                console.log('   -> Updating orderId state from', orderId, 'to', existingOrderId);
                setOrderId(existingOrderId);
              }
              return; // Order already exists with items
            } else {
              console.log('   -> Order exists but is empty, will add items');
              // Continue to add items below
            }
          }

          // No active order, create one
          console.log('   -> No active order found, creating new one');
          console.log('   -> Items to add:', items);

          // Add items to Vendure order
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            console.log(`   -> Adding item ${i + 1}/${items.length}:`, {
              variantId: item.variantId,
              name: item.productName,
              quantity: item.quantity
            });

            const addResult = await graphqlClient.mutation(ADD_ITEM_TO_ORDER, {
              productVariantId: item.variantId,
              quantity: item.quantity,
            });

            console.log(`   -> Item ${i + 1} full result:`, JSON.stringify(addResult, null, 2));

            if (addResult.data?.addItemToOrder?.errorCode) {
              console.error(`   -> ❌ ERROR adding item ${i + 1}:`, addResult.data.addItemToOrder);
              console.error(`   -> Error code: ${addResult.data.addItemToOrder.errorCode}`);
              console.error(`   -> Error message: ${addResult.data.addItemToOrder.message}`);
            } else if (addResult.data?.addItemToOrder?.id) {
              console.log(`   -> ✅ Item ${i + 1} added successfully to order ${addResult.data.addItemToOrder.id}`);
            }

            if (addResult.error) {
              console.error(`   -> ❌ GraphQL ERROR adding item ${i + 1}:`, addResult.error);
            }
          }

          // Get the newly created active order ID
          console.log('   -> All items processed, fetching active order...');
          const result = await graphqlClient.query(GET_ACTIVE_ORDER, {});
          console.log('   -> Active order query result:', JSON.stringify(result, null, 2));

          if (result.data?.activeOrder?.id) {
            console.log('   -> ✓ Order created successfully! ID:', result.data.activeOrder.id);
            setOrderId(result.data.activeOrder.id);
          } else {
            console.error('   -> ✗ No active order found in response');
            console.error('   -> This means items were not added to order successfully');
          }
        } catch (err) {
          console.error('   -> ✗ EXCEPTION creating order:', err);
        }
      } else {
        console.log('   -> ✗ Conditions not met, skipping order creation');
        console.log('      - Has customer?', !!customer);
        console.log('      - Has items?', items.length > 0);
      }
    };

    createOrder();
  }, [customer, items]);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    console.log('4. SUBMIT ADDRESS CLICKED');
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('   -> Address to submit:', address);
      console.log('   -> Current orderId:', orderId);

      console.log('   -> Calling setOrderShippingAddress mutation...');
      const result = await Promise.race([
        graphqlClient.mutation(SET_SHIPPING_ADDRESS, {
          input: address,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Mutation timeout after 10s')), 10000)
        )
      ]);

      console.log('   -> Address mutation completed');
      console.log('   -> Full result:', JSON.stringify(result, null, 2));

      if (result.data?.setOrderShippingAddress?.id) {
        console.log('   -> ✓ Address set successfully!');
        // Fetch shipping methods
        console.log('   -> Fetching shipping methods...');
        const methodsResult = await graphqlClient.query(GET_ELIGIBLE_SHIPPING_METHODS, {});
        console.log('   -> Shipping methods result:', JSON.stringify(methodsResult, null, 2));
        console.log('   -> Shipping methods count:', methodsResult.data?.eligibleShippingMethods?.length || 0);

        const methods = methodsResult.data?.eligibleShippingMethods || [];
        if (methods.length === 0) {
          console.warn('   -> ⚠️  WARNING: No shipping methods returned!');
          console.warn('   -> This could mean:');
          console.warn('      1. Shipping methods not configured in Vendure');
          console.warn('      2. Shipping methods not assigned to channel');
          console.warn('      3. No shipping methods eligible for this order');
        } else {
          console.log('   -> Found methods:', methods.map(m => m.name).join(', '));
        }

        setShippingMethods(methods);
        setStep('shipping');
        console.log('   -> ✓ Moving to shipping step');
      } else if (result.data?.setOrderShippingAddress?.errorCode) {
        console.error('   -> ✗ Address error:', result.data.setOrderShippingAddress);
        setError(result.data.setOrderShippingAddress.message || 'Failed to set shipping address');
      } else {
        console.error('   -> ✗ No ID and no error in response');
        setError('Failed to set shipping address');
      }
    } catch (err: any) {
      console.error('   -> ✗ EXCEPTION:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    console.log('4.5 SHIPPING SUBMIT CLICKED');
    e.preventDefault();

    console.log('   -> Selected shipping method:', selectedShipping);

    if (!selectedShipping) {
      console.warn('   -> ✗ No shipping method selected!');
      setError('Please select a shipping method');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('   -> Calling setOrderShippingMethod mutation...');
      const result = await graphqlClient.mutation(SET_SHIPPING_METHOD, {
        shippingMethodId: [selectedShipping],
      });

      console.log('   -> Shipping method result:', JSON.stringify(result, null, 2));

      if (result.data?.setOrderShippingMethod?.id) {
        console.log('   -> ✓ Shipping method set successfully!');
        console.log('   -> Moving to payment step...');
        setStep('payment');
      } else if (result.data?.setOrderShippingMethod?.errorCode) {
        console.error('   -> ✗ Shipping method error:', result.data.setOrderShippingMethod);
        setError(result.data.setOrderShippingMethod.message || 'Failed to set shipping method');
      } else {
        console.error('   -> ✗ Unknown error setting shipping method');
        setError('Failed to set shipping method');
      }
    } catch (err: any) {
      console.error('   -> ✗ EXCEPTION:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    console.log('5. PAYMENT SUBMIT CLICKED');
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('   -> Submitting payment with method: dummy-payment-method');
      console.log('   -> Current orderId:', orderId);

      // First, transition order to ArrangingPayment state
      console.log('   -> Transitioning order to ArrangingPayment state...');
      const transitionResult = await graphqlClient.mutation(TRANSITION_TO_STATE, {
        state: 'ArrangingPayment',
      });

      console.log('   -> Transition result:', JSON.stringify(transitionResult, null, 2));

      if (transitionResult.data?.transitionOrderToState?.errorCode) {
        console.error('   -> ✗ Transition error:', transitionResult.data.transitionOrderToState);
        setError(transitionResult.data.transitionOrderToState.message || 'Failed to prepare order for payment');
        return;
      }

      console.log('   -> ✓ Order transitioned successfully');

      // Now add payment
      console.log('   -> Adding payment...');
      const result = await graphqlClient.mutation(ADD_PAYMENT_TO_ORDER, {
        input: {
          method: 'dummy-payment-method',
          metadata: {},
        },
      });

      console.log('   -> Payment mutation result:', JSON.stringify(result, null, 2));

      if (result.data?.addPaymentToOrder?.id) {
        console.log('   -> ✓ Payment successful! Order ID:', result.data.addPaymentToOrder.id);
        // Set flag to prevent cart redirect
        setIsProcessingPayment(true);
        // Clear local cart
        clearCart();
        // Redirect to success page
        console.log('   -> Redirecting to success page...');
        router.push(`/checkout/success?orderId=${result.data.addPaymentToOrder.id}`);
      } else if (result.data?.addPaymentToOrder?.errorCode) {
        console.error('   -> ✗ Payment error:', result.data.addPaymentToOrder);
        console.error('   -> Error code:', result.data.addPaymentToOrder.errorCode);
        console.error('   -> Error message:', result.data.addPaymentToOrder.message);
        setError(result.data.addPaymentToOrder.message || 'Payment failed');
      } else {
        console.error('   -> ✗ Payment failed - no ID and no error in response');
        setError('Payment failed');
      }
    } catch (err: any) {
      console.error('   -> ✗ EXCEPTION during payment:', err);
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
          {step === 'payment' && (() => {
            console.log('🎨 RENDERING PAYMENT FORM - step is:', step);
            return (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Payment</h2>
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
                <p className="font-semibold">Development Mode</p>
                <p className="text-sm">Using dummy payment handler. No real payment will be processed.</p>
              </div>

              <form onSubmit={(e) => {
                console.log('📝 FORM SUBMIT EVENT FIRED');
                handlePaymentSubmit(e);
              }}>
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
                    type="button"
                    disabled={loading}
                    onClick={(e) => {
                      alert('BUTTON CLICKED!');
                      console.log('🔴 BUTTON CLICKED DIRECTLY!');
                      handlePaymentSubmit(e as any);
                    }}
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
            );
          })()}
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
