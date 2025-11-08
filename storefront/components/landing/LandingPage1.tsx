import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_PRODUCTS } from '@/lib/queries';
import { ProductListResponse } from '@/types';

export default function LandingPage1() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const result = await graphqlClient.query<ProductListResponse>(
          GET_PRODUCTS,
          { options: { take: 6 } }
        );
        setProducts(result.data?.products.items || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
      {/* Hero Section - Modern & Minimal */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 backdrop-blur-3xl"></div>
        <div className="container mx-auto px-4 py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
              ✨ Nueva Colección 2025
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 bg-clip-text text-transparent leading-tight">
              Estilo que define
              <br />tu personalidad
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Descubre una experiencia de compra única con productos cuidadosamente seleccionados para ti
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/products"
                className="group relative px-8 py-4 bg-red-600 text-white rounded-full font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50"
              >
                <span className="relative z-10">Explorar Colección</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-red-600 hover:text-red-600 transition-all"
              >
                Nuestra Historia
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Productos Destacados
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selección premium de nuestros productos más populares
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="transform hover:scale-105 transition-transform duration-300">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 text-xl mb-2">
              Próximamente nuevos productos
            </p>
            <p className="text-sm text-gray-500">
              Estamos preparando algo increíble para ti
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-lg group"
          >
            Ver Toda la Colección
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* Features - Modern Cards */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="text-5xl mb-6">🚀</div>
              <h3 className="font-bold text-2xl mb-3 text-gray-900">Envío Rápido</h3>
              <p className="text-gray-600">
                Recibe tus productos en 24-48 horas. Envío gratis en compras mayores a $50
              </p>
            </div>
          </div>

          <div className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="text-5xl mb-6">🔒</div>
              <h3 className="font-bold text-2xl mb-3 text-gray-900">Pago Seguro</h3>
              <p className="text-gray-600">
                Transacciones 100% seguras con tecnología de encriptación avanzada
              </p>
            </div>
          </div>

          <div className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="text-5xl mb-6">💎</div>
              <h3 className="font-bold text-2xl mb-3 text-gray-900">Calidad Garantizada</h3>
              <p className="text-gray-600">
                Devoluciones sin complicaciones hasta 30 días después de tu compra
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para empezar?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-red-50 max-w-2xl mx-auto">
              Únete a miles de clientes satisfechos y descubre por qué somos su tienda favorita
            </p>
            <Link
              href="/products"
              className="inline-block px-10 py-5 bg-white text-red-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl"
            >
              Comenzar a Comprar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
