'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from './SearchBar';
import { useState, useEffect, useRef } from 'react';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_COLLECTIONS } from '@/lib/queries';

interface Collection {
  id: string;
  name: string;
  slug: string;
}

export default function Header() {
  const { totalItems } = useCart();
  const { customer, loading } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const result = await graphqlClient.query(GET_COLLECTIONS, {
          options: { take: 10 }
        });
        if (result.data?.collections?.items) {
          setCollections(result.data.collections.items);
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-gray-700 hover:text-primary-600 transition flex items-center gap-1"
              >
                Categories
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && collections.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/products"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    All Products
                  </Link>
                  <div className="border-t border-gray-100 my-2"></div>
                  {collections.map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/products?collection=${collection.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/products"
              className="text-gray-700 hover:text-primary-600 transition"
            >
              Products
            </Link>

            <Link
              href="/contact"
              className="text-gray-700 hover:text-primary-600 transition font-semibold"
            >
              Contact
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
