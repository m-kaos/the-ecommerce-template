import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Vendure Store
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/products"
              className="text-gray-700 hover:text-primary-600 transition"
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="text-gray-700 hover:text-primary-600 transition"
            >
              Cart
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
