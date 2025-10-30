'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from './SearchBar';

export default function Header() {
  const { totalItems } = useCart();
  const { customer, loading } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="text-2xl font-bold text-primary-600 flex-shrink-0">
            Vendure Store
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <SearchBar />
          </div>

          <div className="flex items-center space-x-6 flex-shrink-0">
            <Link
              href="/products"
              className="text-gray-700 hover:text-primary-600 transition"
            >
              Products
            </Link>

            {!loading && (
              <>
                {customer ? (
                  <Link
                    href="/account"
                    className="text-gray-700 hover:text-primary-600 transition"
                  >
                    Account
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-primary-600 transition"
                  >
                    Login
                  </Link>
                )}
              </>
            )}

            <Link
              href="/cart"
              className="text-gray-700 hover:text-primary-600 transition relative"
            >
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
