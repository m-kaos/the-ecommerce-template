'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_PRODUCTS, GET_COLLECTIONS } from '@/lib/queries';
import { Product } from '@/types';

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface ProductsWithFiltersProps {
  initialProducts: Product[];
}

export default function ProductsWithFilters({ initialProducts }: ProductsWithFiltersProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000 });
  const [sortBy, setSortBy] = useState<string>('name-asc');

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
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const options: any = { take: 50 };

        // Apply sorting
        if (sortBy === 'name-asc') {
          options.sort = { name: 'ASC' };
        } else if (sortBy === 'name-desc') {
          options.sort = { name: 'DESC' };
        } else if (sortBy === 'price-asc') {
          options.sort = { price: 'ASC' };
        } else if (sortBy === 'price-desc') {
          options.sort = { price: 'DESC' };
        }

        // Apply collection filter
        if (selectedCollection) {
          const collection = collections.find(c => c.id === selectedCollection);
          if (collection) {
            options.filter = {
              slug: { in: [collection.slug] }
            };
          }
        }

        const result = await graphqlClient.query(GET_PRODUCTS, { options });

        if (result.data?.products?.items) {
          let filteredProducts = result.data.products.items;

          // Apply price filter client-side
          if (priceRange.min > 0 || priceRange.max < 100000) {
            filteredProducts = filteredProducts.filter((product: Product) => {
              const price = product.variants[0]?.priceWithTax || 0;
              return price >= priceRange.min && price <= priceRange.max;
            });
          }

          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCollection, priceRange, sortBy, collections]);

  const handleClearFilters = () => {
    setSelectedCollection('');
    setPriceRange({ min: 0, max: 100000 });
    setSortBy('name-asc');
  };

  const activeFiltersCount =
    (selectedCollection ? 1 : 0) +
    (priceRange.min > 0 || priceRange.max < 100000 ? 1 : 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Filters</h2>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            >
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
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
                <label className="text-xs text-gray-600">Min Price ($)</label>
                <input
                  type="number"
                  value={priceRange.min / 100}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) * 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Max Price ($)</label>
                <input
                  type="number"
                  value={priceRange.max / 100}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) * 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="1000"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Active Filters Badge */}
          {activeFiltersCount > 0 && (
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              {activeFiltersCount} active filter{activeFiltersCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="lg:col-span-3">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <p className="text-gray-600 mb-6">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-gray-600 text-lg mb-4">No products match your filters</p>
            <button
              onClick={handleClearFilters}
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
