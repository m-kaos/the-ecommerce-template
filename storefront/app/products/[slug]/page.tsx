import Image from 'next/image';
import { notFound } from 'next/navigation';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_PRODUCT_BY_SLUG } from '@/lib/queries';
import { ProductResponse } from '@/types';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string) {
  try {
    const result = await graphqlClient.query<ProductResponse>(
      GET_PRODUCT_BY_SLUG,
      { slug }
    );
    return result.data?.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const defaultVariant = product.variants[0];
  const price = defaultVariant?.priceWithTax || 0;
  const currency = defaultVariant?.currencyCode || 'USD';

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
            {product.featuredAsset ? (
              <Image
                src={product.featuredAsset.preview}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          {/* Thumbnail gallery */}
          {product.assets && product.assets.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.assets.slice(0, 4).map((asset) => (
                <div
                  key={asset.id}
                  className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden"
                >
                  <Image
                    src={asset.preview}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <div className="mb-6">
            <p className="text-3xl font-bold text-primary-600">
              {formatPrice(price)}
            </p>
          </div>

          {product.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Variants */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Available Options</h3>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:border-primary-600 cursor-pointer"
                  >
                    <span>{variant.name}</span>
                    <span className="font-semibold">
                      {formatPrice(variant.priceWithTax)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stock status */}
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              In Stock
            </span>
          </div>

          {/* Add to cart button */}
          <button className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg">
            Add to Cart
          </button>

          {/* Product metadata */}
          {product.collections && product.collections.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                CATEGORIES
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.collections.map((collection) => (
                  <span
                    key={collection.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {collection.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
