'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { totalItems } = useCart();
  const { customer, loading } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-700 transition">
            KaoStore
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/products"
              className="text-gray-700 hover:text-red-600 transition font-medium"
            >
              Productos
            </Link>

            <Link
              href="/contact"
              className="text-gray-700 hover:text-red-600 transition font-medium"
            >
              Contacto
            </Link>

            {!loading && (
              <>
                {customer ? (
                  <Link
                    href="/account"
                    className="text-gray-700 hover:text-red-600 transition font-medium"
                  >
                    Mi Cuenta
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-red-600 transition font-medium"
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </>
            )}

            <Link
              href="/cart"
              className="text-gray-700 hover:text-red-600 transition relative font-medium"
            >
              Carrito
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
