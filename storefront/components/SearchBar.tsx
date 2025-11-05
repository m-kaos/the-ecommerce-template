'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_PRODUCTS } from '@/lib/queries';

interface SearchResult {
  productId: string;
  productName: string;
  slug: string;
  description: string;
  productAsset?: {
    preview: string;
  };
  priceWithTax: {
    min?: number;
    max?: number;
    value?: number;
  };
  currencyCode: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {

        // Use GET_PRODUCTS with filter instead of search since search index isn't working
        const result = await graphqlClient.query(GET_PRODUCTS, {
          options: {
            filter: {
              name: { contains: query }
            },
            take: 5,
          },
        });

        if (result.data?.products?.items) {
          // Convert to search result format
          const searchResults = result.data.products.items.map((product: any) => ({
            productId: product.id,
            productName: product.name,
            slug: product.slug,
            description: product.description,
            productAsset: product.featuredAsset,
            priceWithTax: {
              value: product.variants[0]?.priceWithTax || 0,
            },
            currencyCode: product.variants[0]?.currencyCode || 'USD',
          }));

          setResults(searchResults);
          setIsOpen(true);
        } else {
          
          setResults([]);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const formatPrice = (priceData: SearchResult['priceWithTax'], currencyCode: string) => {
    const price = priceData.value || priceData.min || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price / 100);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
            </div>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="py-2">
            {results.map((result) => (
              <Link
                key={result.productId}
                href={`/products/${result.slug}`}
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                  {result.productAsset?.preview ? (
                    <Image
                      src={result.productAsset.preview}
                      alt={result.productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{result.productName}</p>
                  <p className="text-sm text-gray-600">{formatPrice(result.priceWithTax, result.currencyCode)}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
            <button
              onClick={handleSubmit}
              className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
            >
              View all results for "{query}" →
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && !loading && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-4 py-8 text-center text-gray-600">
            <p>No products found for "{query}"</p>
          </div>
        </div>
      )}
    </div>
  );
}
