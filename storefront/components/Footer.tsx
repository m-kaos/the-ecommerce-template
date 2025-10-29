export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Vendure Store</h3>
            <p className="text-gray-600 text-sm">
              Your trusted e-commerce destination for quality products.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/products" className="hover:text-primary-600">
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-primary-600">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-primary-600">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/shipping" className="hover:text-primary-600">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/returns" className="hover:text-primary-600">
                  Returns
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-primary-600">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Vendure Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
