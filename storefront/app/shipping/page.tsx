import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Information - Vendure Store',
  description: 'Learn about our shipping options, delivery times, and shipping costs.',
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Shipping Information</h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Shipping Options</h2>
            <p className="text-gray-700 mb-4">
              We offer multiple shipping options to meet your needs:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Standard Shipping</h3>
                <p className="text-gray-600 mb-2">5-7 business days</p>
                <p className="text-2xl font-bold text-primary-600">$5.00</p>
                <p className="text-sm text-gray-600 mt-2">Perfect for non-urgent orders</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Express Shipping</h3>
                <p className="text-gray-600 mb-2">2-3 business days</p>
                <p className="text-2xl font-bold text-primary-600">$15.00</p>
                <p className="text-sm text-gray-600 mt-2">For when you need it fast</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Free Shipping</h2>
            <div className="bg-green-50 border-l-4 border-green-600 p-6">
              <p className="text-gray-700">
                <strong>Enjoy FREE Standard Shipping on all orders over $50!</strong>
              </p>
              <p className="text-gray-600 mt-2 text-sm">
                Simply add qualifying items to your cart and the discount will be applied automatically at checkout.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Processing Time</h2>
            <p className="text-gray-700 mb-4">
              Orders are typically processed within 1-2 business days. Orders placed on weekends or holidays
              will be processed the next business day.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Orders placed before 2:00 PM EST are usually shipped the same day</li>
              <li>Orders placed after 2:00 PM EST will ship the next business day</li>
              <li>Custom or personalized orders may require additional processing time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Shipping Destinations</h2>
            <p className="text-gray-700 mb-4">
              We currently ship to addresses within the United States and select international locations:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Domestic Shipping</h3>
                <p className="text-sm text-gray-600">
                  All 50 U.S. states, including Alaska and Hawaii
                  (additional charges may apply for remote locations)
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">International Shipping</h3>
                <p className="text-sm text-gray-600">
                  Canada, Mexico, United Kingdom, and select European countries.
                  Customs fees may apply.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Order Tracking</h2>
            <p className="text-gray-700 mb-4">
              Once your order ships, you'll receive a confirmation email with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Tracking number</li>
              <li>Carrier information</li>
              <li>Estimated delivery date</li>
              <li>Link to track your package</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You can also track your order anytime by logging into your account and viewing your order history.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Delivery Issues</h2>
            <p className="text-gray-700 mb-4">
              If you experience any issues with your delivery:
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6">
              <ul className="text-gray-700 space-y-2">
                <li><strong>Package not received:</strong> Contact us within 7 days of expected delivery</li>
                <li><strong>Damaged package:</strong> Take photos and contact us immediately</li>
                <li><strong>Wrong address:</strong> Contact us as soon as possible to update</li>
                <li><strong>Missing items:</strong> Reach out within 48 hours of delivery</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">International Customers</h2>
            <p className="text-gray-700 mb-4">
              Please note for international orders:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Shipping times vary by destination (typically 7-21 business days)</li>
              <li>Customers are responsible for any customs duties or import taxes</li>
              <li>Packages may be subject to customs inspection</li>
              <li>International orders cannot be expedited</li>
            </ul>
          </section>

          <section className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Questions?</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about shipping or your order, please don't hesitate to contact us:
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
