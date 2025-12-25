'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { totalItems } = useCart();
  const { customer, loading } = useAuth();

  return (
    <header className="bg-white shadow-md border-b-4 border-primary-500">
      <div className="bg-primary-500 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>📍 Valle de San Blas | García, N.L.</span>
            <span>📞 (81) 1159-4806</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💬 WhatsApp: (81) 8474-3633</span>
          </div>
        </div>
      </div>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex flex-col text-primary-600 hover:text-primary-700 transition">
            <span className="text-2xl font-bold">Casa de Empeño</span>
            <span className="text-xl font-semibold">La Nación</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/products"
              className="text-gray-700 hover:text-primary-600 transition font-medium"
            >
              Productos
            </Link>

            <Link
              href="/contact"
              className="text-gray-700 hover:text-primary-600 transition font-medium"
            >
              Contacto
            </Link>

            {!loading && (
              <>
                {customer ? (
                  <Link
                    href="/account"
                    className="text-gray-700 hover:text-primary-600 transition font-medium"
                  >
                    Mi Cuenta
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-primary-600 transition font-medium"
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </>
            )}

            <Link
              href="/cart"
              className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg transition relative font-medium"
            >
              Carrito
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
