'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

const faqs = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping takes 5-7 business days, while Express shipping takes 2-3 business days. Orders are typically processed within 1-2 business days before shipping.'
      },
      {
        q: 'Do you offer international shipping?',
        a: 'Yes! We ship to Canada, Mexico, United Kingdom, and select European countries. International orders typically arrive within 7-21 business days. Please note that customs duties and import taxes may apply.'
      },
      {
        q: 'Can I track my order?',
        a: 'Absolutely! Once your order ships, you\'ll receive a confirmation email with a tracking number. You can also track your order by logging into your account and viewing your order history.'
      },
      {
        q: 'Can I change my shipping address after placing an order?',
        a: 'If your order hasn\'t shipped yet, we may be able to update the address. Please contact us immediately at support@vendurestore.com with your order number.'
      }
    ]
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day money-back guarantee. Items must be in original, unused condition with all packaging and tags. Simply initiate a return from your order history or contact our support team.'
      },
      {
        q: 'How long do refunds take?',
        a: 'Once we receive and inspect your return, refunds are processed within 5-7 business days. The funds will appear in your account within 5-10 business days depending on your bank.'
      },
      {
        q: 'Do I have to pay for return shipping?',
        a: 'If the return is due to our error (wrong item, defective product), we provide a free prepaid return label. For other returns, a $5.99 shipping fee is deducted from your refund.'
      },
      {
        q: 'Can I exchange an item?',
        a: 'Yes! Return the original item and place a new order for what you want. We\'ll process your refund once we receive the return. This ensures you get the size/color you need while it\'s still in stock.'
      }
    ]
  },
  {
    category: 'Account & Payment',
    questions: [
      {
        q: 'Do I need an account to place an order?',
        a: 'While you can checkout as a guest, creating an account allows you to track orders, save addresses, view order history, and checkout faster on future purchases.'
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay. All transactions are secured with SSL encryption.'
      },
      {
        q: 'Is it safe to use my credit card on your site?',
        a: 'Absolutely! We use industry-standard SSL encryption to protect your personal and payment information. We never store your credit card details on our servers.'
      },
      {
        q: 'I forgot my password. What should I do?',
        a: 'Click on "Login" and then "Forgot Password". Enter your email address and we\'ll send you instructions to reset your password.'
      }
    ]
  },
  {
    category: 'Products & Stock',
    questions: [
      {
        q: 'Are your products authentic?',
        a: 'Yes, 100%! We source all products directly from authorized distributors and manufacturers. Every item in our catalog is guaranteed to be authentic.'
      },
      {
        q: 'What if an item is out of stock?',
        a: 'You can sign up for restock notifications on the product page. We\'ll email you as soon as the item is back in stock.'
      },
      {
        q: 'Do you offer gift wrapping?',
        a: 'Currently, we don\'t offer gift wrapping, but all orders come in discreet packaging. You can add a gift message at checkout which we\'ll include with your order.'
      },
      {
        q: 'Can I cancel or modify my order?',
        a: 'Orders can be cancelled or modified within 2 hours of placement. After that, orders are processed and shipped quickly. Contact us immediately if you need to make changes.'
      }
    ]
  },
  {
    category: 'Customer Support',
    questions: [
      {
        q: 'How can I contact customer service?',
        a: 'You can reach us via email at support@vendurestore.com, through our contact form, or by phone at 1-800-VENDURE. We typically respond within 24 hours.'
      },
      {
        q: 'What are your customer service hours?',
        a: 'Our support team is available Monday-Friday, 9 AM - 6 PM EST. Email inquiries are monitored 24/7 and we strive to respond within 24 hours, even on weekends.'
      },
      {
        q: 'Do you have a physical store?',
        a: 'We\'re an online-only retailer, which allows us to offer better prices and a wider selection. However, our customer service team is always available to help you with any questions.'
      }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-8">
          Find answers to common questions about orders, shipping, returns, and more.
          Can't find what you're looking for? <a href="/contact" className="text-primary-600 hover:text-primary-700 font-semibold">Contact us</a>
        </p>

        <div className="space-y-8">
          {faqs.map((category, catIndex) => (
            <div key={catIndex}>
              <h2 className="text-2xl font-semibold mb-4 text-primary-600">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((faq, qIndex) => {
                  const key = `${catIndex}-${qIndex}`;
                  const isOpen = openIndex === key;

                  return (
                    <div
                      key={qIndex}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(catIndex, qIndex)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                        <svg
                          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
          <p className="text-gray-700 mb-6">
            Our support team is here to help! Get in touch and we'll respond as quickly as possible.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
