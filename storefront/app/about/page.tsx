import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - Vendure Store',
  description: 'Learn more about our mission, values, and the team behind Vendure Store.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded with a passion for delivering exceptional products and outstanding customer service,
              Vendure Store has grown from a small startup to a trusted destination for quality goods.
              We believe in the power of commerce to connect people with products they love, and we're
              committed to making that experience as seamless and enjoyable as possible.
            </p>
            <p className="text-gray-700 mb-4">
              What started as a vision to create a better shopping experience has evolved into a
              platform that serves thousands of satisfied customers worldwide. Every product we offer
              is carefully selected to meet our high standards of quality, value, and sustainability.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              Our mission is simple: to provide our customers with the best products, competitive prices,
              and exceptional service. We're dedicated to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Curating a diverse selection of high-quality products</li>
              <li>Ensuring fast and reliable shipping</li>
              <li>Providing responsive and helpful customer support</li>
              <li>Maintaining transparent and fair pricing</li>
              <li>Supporting sustainable and ethical business practices</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Quality First</h3>
                <p className="text-gray-700">
                  We never compromise on quality. Every product in our catalog meets strict quality
                  standards and undergoes thorough vetting before we offer it to our customers.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
                <p className="text-gray-700">
                  Our customers are at the heart of everything we do. We listen to feedback,
                  continuously improve, and go the extra mile to ensure satisfaction.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-700">
                  We embrace technology and innovation to enhance the shopping experience,
                  streamline operations, and stay ahead of industry trends.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
                <p className="text-gray-700">
                  We're committed to reducing our environmental impact through responsible sourcing,
                  eco-friendly packaging, and sustainable business practices.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
            <p className="text-gray-700 mb-4">
              Shopping with us means more than just making a purchase. It means joining a community
              of conscious consumers who value quality, integrity, and excellent service. Here's what
              sets us apart:
            </p>
            <div className="bg-primary-50 border-l-4 border-primary-600 p-6 mb-4">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Curated Selection:</strong> Every product is handpicked for quality and value</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Fast Shipping:</strong> Quick and reliable delivery to your doorstep</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Secure Shopping:</strong> Your data and transactions are protected</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Easy Returns:</strong> Hassle-free returns within 30 days</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>24/7 Support:</strong> Our customer service team is always here to help</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-gray-700 mb-6">
              Have questions or want to learn more? We'd love to hear from you!
              Whether you have feedback, need assistance, or just want to say hello,
              our team is ready to help.
            </p>
            <div className="flex gap-4">
              <Link
                href="/contact"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Contact Us
              </Link>
              <Link
                href="/faq"
                className="inline-block border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                View FAQ
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
