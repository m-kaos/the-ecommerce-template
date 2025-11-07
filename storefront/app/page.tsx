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
    console.log('Fetching products from:', graphqlClient.url);
    const result = await graphqlClient.query<ProductListResponse>(
      GET_PRODUCTS,
      { options: { take: 6 } }
    );
    console.log('Products fetched:', result.data?.products.items?.length || 0);
    console.log('Result:', JSON.stringify(result, null, 2));
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
      <section className="text-center py-16 mb-12 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">Bienvenido a KaoStore</h1>
        <p className="text-xl text-gray-700 mb-8">
          Descubre productos increíbles a excelentes precios
        </p>
        <Link
          href="/products"
          className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition inline-block font-semibold"
        >
          Comprar Ahora
        </Link>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Productos Destacados</h2>
          <Link
            href="/products"
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Ver Todos →
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
              Aún no hay productos disponibles. Por favor vuelve más tarde.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Asegúrate de que el backend esté corriendo y tenga productos.
            </p>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">🚚</div>
          <h3 className="font-semibold text-lg mb-2">Envío Gratis</h3>
          <p className="text-gray-600 text-sm">
            En pedidos mayores a $50
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="font-semibold text-lg mb-2">Pago Seguro</h3>
          <p className="text-gray-600 text-sm">
            100% transacciones seguras
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">↩️</div>
          <h3 className="font-semibold text-lg mb-2">Devoluciones Fáciles</h3>
          <p className="text-gray-600 text-sm">
            Política de devolución de 30 días
          </p>
        </div>
      </section>
    </div>
  );
}
