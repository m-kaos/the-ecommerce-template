import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Vendure Store</h3>
            <p className="text-gray-600 text-sm mb-4">
              Your trusted e-commerce destination for quality products and exceptional service.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm font-semibold"
            >
              Contact Us
            </Link>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/products" className="hover:text-primary-600 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary-600 transition">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary-600 transition">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-primary-600 transition">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Information</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-primary-600 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary-600 transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary-600 transition">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary-600 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:support@vendurestore.com" className="hover:text-primary-600 transition">
                  support@vendurestore.com
                </a>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>1-800-VENDURE</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Mon-Fri: 9 AM - 6 PM EST</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Vendure Store. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/about" className="hover:text-primary-600 transition">Privacy Policy</Link>
            <Link href="/about" className="hover:text-primary-600 transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
