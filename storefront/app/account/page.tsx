'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AccountPage() {
  const { customer, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !customer) {
      router.push('/login');
    }
  }, [customer, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Account</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">
                  {customer.title && `${customer.title} `}
                  {customer.firstName} {customer.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{customer.emailAddress}</p>
              </div>
              {customer.phoneNumber && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{customer.phoneNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href="/account/orders"
                className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <p className="font-semibold">Order History</p>
                <p className="text-sm text-gray-600">View your past orders</p>
              </a>
              <a
                href="/account/addresses"
                className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <p className="font-semibold">Addresses</p>
                <p className="text-sm text-gray-600">Manage shipping addresses</p>
              </a>
              <a
                href="/account/settings"
                className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <p className="font-semibold">Account Settings</p>
                <p className="text-sm text-gray-600">Update your information</p>
              </a>
            </div>
          </div>
        </div>

        {/* Recent Orders Placeholder */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
          <div className="text-center py-8 text-gray-600">
            <p>You haven't placed any orders yet.</p>
            <a href="/products" className="text-primary-600 hover:text-primary-700 font-semibold mt-2 inline-block">
              Start Shopping →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
