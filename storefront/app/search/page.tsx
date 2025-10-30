'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_PRODUCTS, GET_COLLECTIONS } from '@/lib/queries';

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
  collectionIds: string[];
}

interface FacetValue {
  count: number;
  facetValue: {
    id: string;
    name: string;
    facet: {
      id: string;
      name: string;
    };
  };
}

interface Collection {
  id: string;
  name: string;
  slug: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [facetValues, setFacetValues] = useState<FacetValue[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000 });
  const [sortBy, setSortBy] = useState<string>('relevance');

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const result = await graphqlClient.query(GET_COLLECTIONS, {
          options: { take: 50 },
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
    const searchProducts = async () => {
      if (!query.trim()) {
        setResults([]);
        setTotalItems(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Use GET_PRODUCTS with filter instead of search since search index isn't working
        const options: any = {
          filter: {
            name: { contains: query }
          },
          take: 50,
        };

        // Apply sorting
        if (sortBy === 'price-asc') {
          options.sort = { price: 'ASC' };
        } else if (sortBy === 'price-desc') {
          options.sort = { price: 'DESC' };
        } else if (sortBy === 'name') {
          options.sort = { name: 'ASC' };
        }

        const result = await graphqlClient.query(GET_PRODUCTS, { options });

        if (result.data?.products?.items) {
          // Convert to search result format
          let filteredResults = result.data.products.items.map((product: any) => ({
            productId: product.id,
            productName: product.name,
            slug: product.slug,
            description: product.description,
            productAsset: product.featuredAsset,
            priceWithTax: {
              value: product.variants[0]?.priceWithTax || 0,
            },
            currencyCode: product.variants[0]?.currencyCode || 'USD',
            collectionIds: [],
          }));

          // Apply price filter
          if (priceRange.min > 0 || priceRange.max < 100000) {
            filteredResults = filteredResults.filter((item: SearchResult) => {
              const price = item.priceWithTax.value || item.priceWithTax.min || 0;
              return price >= priceRange.min && price <= priceRange.max;
            });
          }

          // Apply collection filter
          if (selectedCollection) {
            // This would need collection data in products query, skipping for now
          }

          setResults(filteredResults);
          setTotalItems(filteredResults.length);
          setFacetValues([]);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query, selectedCollection, priceRange, sortBy, collections]);

  const formatPrice = (priceData: SearchResult['priceWithTax'], currencyCode: string) => {
    const price = priceData.value || priceData.min || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price / 100);
  };

  const handleClearFilters = () => {
    setSelectedCollection('');
    setPriceRange({ min: 0, max: 100000 });
    setSortBy('relevance');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        {query && (
          <p className="text-gray-600">
            {loading ? 'Searching...' : `${totalItems} results for "${query}"`}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
              >
                Clear All
              </button>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* Collection Filter */}
            {collections.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="">All Categories</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Price Range</label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Min Price</label>
                  <input
                    type="number"
                    value={priceRange.min / 100}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) * 100 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Max Price</label>
                  <input
                    type="number"
                    value={priceRange.max / 100}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) * 100 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No results found</h2>
              <p className="text-gray-600 mb-6">
                {query ? `Try adjusting your search or filters` : 'Enter a search term to find products'}
              </p>
              <Link
                href="/products"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((product) => (
                <Link
                  key={product.productId}
                  href={`/products/${product.slug}`}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.productAsset?.preview ? (
                      <Image
                        src={product.productAsset.preview}
                        alt={product.productName}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.productName}</h3>
                    <p className="text-primary-600 font-bold text-xl">
                      {formatPrice(product.priceWithTax, product.currencyCode)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
