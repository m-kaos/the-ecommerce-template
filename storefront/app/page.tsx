import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_PRODUCTS } from '@/lib/queries';
import { ProductListResponse } from '@/types';

// Force dynamic rendering - no caching, always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProducts() {
  try {
    
    const result = await graphqlClient.query<ProductListResponse>(
      GET_PRODUCTS,
      { options: { take: 6 } }
    );

    return result.data?.products.items || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 mb-12">
        <h1 className="text-5xl font-bold mb-4">Welcome to Vendure Store</h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing products at great prices
        </p>
        <Link
          href="/products"
          className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition inline-block"
        >
          Shop Now
        </Link>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link
            href="/products"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            View All →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">
              No products available yet. Please check back later.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Make sure the Vendure backend is running and populated with products.
            </p>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">🚚</div>
          <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
          <p className="text-gray-600 text-sm">
            On orders over $50
          </p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
          <p className="text-gray-600 text-sm">
            100% secure transactions
          </p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-4">↩️</div>
          <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
          <p className="text-gray-600 text-sm">
            30-day return policy
          </p>
        </div>
      </section>
    </div>
  );
}
