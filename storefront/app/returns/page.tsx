import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refunds - Vendure Store',
  description: 'Our hassle-free return and refund policy. Learn how to return products and get refunds.',
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Returns & Refunds</h1>

        <div className="prose prose-lg max-w-none">
          <div className="bg-primary-50 border-l-4 border-primary-600 p-6 mb-8">
            <p className="text-lg font-semibold text-gray-900 mb-2">30-Day Money-Back Guarantee</p>
            <p className="text-gray-700">
              We want you to be completely satisfied with your purchase. If you're not happy with your order
              for any reason, you can return it within 30 days for a full refund.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
            <p className="text-gray-700 mb-4">
              To be eligible for a return, items must meet the following conditions:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Returned within 30 days of delivery</li>
              <li>In original, unused condition</li>
              <li>With all original packaging and tags</li>
              <li>Include proof of purchase (order number or receipt)</li>
              <li>Free from damage, wear, or alterations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How to Return an Item</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Start Your Return</h3>
                  <p className="text-gray-700">
                    Log into your account and go to Order History. Select the order and click "Return Items"
                    or contact our support team at support@vendurestore.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Package Your Return</h3>
                  <p className="text-gray-700">
                    Securely pack the item(s) in the original packaging if possible. Include all accessories,
                    manuals, and documentation that came with the product.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Ship Your Return</h3>
                  <p className="text-gray-700">
                    Use the prepaid return label we provide or ship to our returns center. We recommend using
                    a trackable shipping method.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Get Your Refund</h3>
                  <p className="text-gray-700">
                    Once we receive and inspect your return, we'll process your refund within 5-7 business days.
                    You'll receive an email confirmation when it's processed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Refund Methods</h2>
            <p className="text-gray-700 mb-4">
              Refunds will be issued to your original payment method:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Credit/Debit Card:</strong> 5-10 business days</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>PayPal:</strong> 3-5 business days</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Store Credit:</strong> Instant (optional, 10% bonus)</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Return Shipping Costs</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-green-200 bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Free Returns</h3>
                <p className="text-green-800 text-sm">
                  If the return is due to our error (wrong item, defective product, etc.),
                  we'll provide a prepaid return label at no cost to you.
                </p>
              </div>
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Customer Returns</h3>
                <p className="text-gray-700 text-sm">
                  For returns due to change of mind, a $5.99 return shipping fee will be
                  deducted from your refund.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
            <p className="text-gray-700 mb-4">
              Need a different size or color? We make exchanges easy:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
              <li>Return the original item following our return process</li>
              <li>Place a new order for the item you want</li>
              <li>Your refund will be processed once we receive the return</li>
            </ol>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mt-4">
              <p className="text-sm text-blue-900">
                <strong>Tip:</strong> To ensure you get the item you want in stock, we recommend placing
                the new order first, then initiating the return.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Non-Returnable Items</h2>
            <p className="text-gray-700 mb-4">
              For health and safety reasons, the following items cannot be returned:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Personal care items (opened)</li>
              <li>Perishable goods</li>
              <li>Custom or personalized items</li>
              <li>Digital downloads</li>
              <li>Gift cards</li>
              <li>Final sale items (marked as such at purchase)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Damaged or Defective Items</h2>
            <p className="text-gray-700 mb-4">
              If you receive a damaged or defective item:
            </p>
            <div className="bg-red-50 border-l-4 border-red-600 p-6">
              <ol className="list-decimal list-inside text-gray-800 space-y-2">
                <li>Contact us immediately (within 48 hours of delivery)</li>
                <li>Provide photos of the damage or defect</li>
                <li>Keep all original packaging</li>
                <li>We'll arrange a free replacement or full refund</li>
              </ol>
            </div>
          </section>

          <section className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-700 mb-4">
              Our customer service team is here to help with any return or refund questions.
            </p>
            <div className="flex gap-4">
              <a
                href="/contact"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Contact Support
              </a>
              <a
                href="/faq"
                className="inline-block border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                View FAQ
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
