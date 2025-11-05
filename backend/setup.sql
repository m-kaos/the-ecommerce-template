-- Create Country
INSERT INTO country (id, "createdAt", "updatedAt", code, enabled) VALUES (1, NOW(), NOW(), 'US', true) ON CONFLICT DO NOTHING;
INSERT INTO country_translation (id, "createdAt", "updatedAt", "languageCode", name, "countryId") VALUES (1, NOW(), NOW(), 'en', 'United States', 1) ON CONFLICT DO NOTHING;

-- Create Zone
INSERT INTO zone (id, "createdAt", "updatedAt", name) VALUES (1, NOW(), NOW(), 'USA Zone') ON CONFLICT DO NOTHING;
INSERT INTO zone_members_country (zoneId, countryId) VALUES (1, 1) ON CONFLICT DO NOTHING;

-- Create Tax Category
INSERT INTO tax_category (id, "createdAt", "updatedAt", name, "isDefault") VALUES (1, NOW(), NOW(), 'Standard', true) ON CONFLICT DO NOTHING;

-- Create Tax Rate
INSERT INTO tax_rate (id, "createdAt", "updatedAt", name, enabled, value, "categoryId", "zoneId") VALUES (1, NOW(), NOW(), 'Standard Tax', true, 10, 1, 1) ON CONFLICT DO NOTHING;

-- Update Channel with tax zone
UPDATE channel SET "defaultTaxZoneId" = 1, "defaultShippingZoneId" = 1 WHERE id = 1;

-- Create Shipping Methods
INSERT INTO shipping_method (id, "createdAt", "updatedAt", code, checker, calculator)
VALUES (
  1,
  NOW(),
  NOW(),
  'standard-shipping',
  '{"code":"default-shipping-eligibility-checker","args":[{"name":"orderMinimum","value":"0"}]}',
  '{"code":"flat-rate-shipping-calculator","args":[{"name":"rate","value":"500"},{"name":"includesTax","value":"auto"}]}'
) ON CONFLICT DO NOTHING;

INSERT INTO shipping_method_translation (id, "createdAt", "updatedAt", "languageCode", name, description, "shippingMethodId")
VALUES (1, NOW(), NOW(), 'en', 'Standard Shipping', 'Standard shipping (5-7 days)', 1) ON CONFLICT DO NOTHING;

INSERT INTO shipping_method_channels_channel ("shippingMethodId", "channelId") VALUES (1, 1) ON CONFLICT DO NOTHING;

INSERT INTO shipping_method (id, "createdAt", "updatedAt", code, checker, calculator)
VALUES (
  2,
  NOW(),
  NOW(),
  'express-shipping',
  '{"code":"default-shipping-eligibility-checker","args":[{"name":"orderMinimum","value":"0"}]}',
  '{"code":"flat-rate-shipping-calculator","args":[{"name":"rate","value":"1000"},{"name":"includesTax","value":"auto"}]}'
) ON CONFLICT DO NOTHING;

INSERT INTO shipping_method_translation (id, "createdAt", "updatedAt", "languageCode", name, description, "shippingMethodId")
VALUES (2, NOW(), NOW(), 'en', 'Express Shipping', 'Express shipping (2-3 days)', 2) ON CONFLICT DO NOTHING;

INSERT INTO shipping_method_channels_channel ("shippingMethodId", "channelId") VALUES (2, 1) ON CONFLICT DO NOTHING;

-- Create Payment Method
INSERT INTO payment_method (id, "createdAt", "updatedAt", code, enabled, checker, handler)
VALUES (
  1,
  NOW(),
  NOW(),
  'dummy-payment-method',
  true,
  '{"code":"default-payment-method-eligibility-checker","args":[]}',
  '{"code":"dummy-payment-handler","args":[]}'
) ON CONFLICT DO NOTHING;

INSERT INTO payment_method_translation (id, "createdAt", "updatedAt", "languageCode", name, description, "paymentMethodId")
VALUES (1, NOW(), NOW(), 'en', 'Dummy Payment', 'Test payment method', 1) ON CONFLICT DO NOTHING;

INSERT INTO payment_method_channels_channel ("paymentMethodId", "channelId") VALUES (1, 1) ON CONFLICT DO NOTHING;

-- Create Collections
INSERT INTO collection (id, "createdAt", "updatedAt", "isRoot", "position", "isPrivate", filters, "inheritFilters", "featuredAssetId")
VALUES (1, NOW(), NOW(), false, 0, false, '[]', true, NULL) ON CONFLICT DO NOTHING;

INSERT INTO collection_translation (id, "createdAt", "updatedAt", "languageCode", name, slug, description, "collectionId")
VALUES (1, NOW(), NOW(), 'en', 'Clothing', 'clothing', 'Clothing collection', 1) ON CONFLICT DO NOTHING;

INSERT INTO collection_channels_channel ("collectionId", "channelId") VALUES (1, 1) ON CONFLICT DO NOTHING;

INSERT INTO collection (id, "createdAt", "updatedAt", "isRoot", "position", "isPrivate", filters, "inheritFilters", "featuredAssetId")
VALUES (2, NOW(), NOW(), false, 1, false, '[]', true, NULL) ON CONFLICT DO NOTHING;

INSERT INTO collection_translation (id, "createdAt", "updatedAt", "languageCode", name, slug, description, "collectionId")
VALUES (2, NOW(), NOW(), 'en', 'Accessories', 'accessories', 'Accessories collection', 2) ON CONFLICT DO NOTHING;

INSERT INTO collection_channels_channel ("collectionId", "channelId") VALUES (2, 1) ON CONFLICT DO NOTHING;

INSERT INTO collection (id, "createdAt", "updatedAt", "isRoot", "position", "isPrivate", filters, "inheritFilters", "featuredAssetId")
VALUES (3, NOW(), NOW(), false, 2, false, '[]', true, NULL) ON CONFLICT DO NOTHING;

INSERT INTO collection_translation (id, "createdAt", "updatedAt", "languageCode", name, slug, description, "collectionId")
VALUES (3, NOW(), NOW(), 'en', 'Footwear', 'footwear', 'Footwear collection', 3) ON CONFLICT DO NOTHING;

INSERT INTO collection_channels_channel ("collectionId", "channelId") VALUES (3, 1) ON CONFLICT DO NOTHING;

-- Create Products and Variants
-- Product 1: Premium Cotton T-Shirt
INSERT INTO product (id, "createdAt", "updatedAt", enabled, "deletedAt", "featuredAssetId")
VALUES (1, NOW(), NOW(), true, NULL, NULL) ON CONFLICT DO NOTHING;

INSERT INTO product_translation (id, "createdAt", "updatedAt", "languageCode", name, slug, description, "productId")
VALUES (1, NOW(), NOW(), 'en', 'Premium Cotton T-Shirt', 'premium-cotton-tshirt', 'High quality premium cotton t-shirt', 1) ON CONFLICT DO NOTHING;

INSERT INTO product_channels_channel ("productId", "channelId") VALUES (1, 1) ON CONFLICT DO NOTHING;

INSERT INTO product_variant (id, "createdAt", "updatedAt", "deletedAt", enabled, sku, "stockOnHand", "stockAllocated", "outOfStockThreshold", "useGlobalOutOfStockThreshold", "trackInventory", "productId", "taxCategoryId")
VALUES (1, NOW(), NOW(), NULL, true, 'TSHIRT-001', 100, 0, 0, true, 'INHERIT', 1, 1) ON CONFLICT DO NOTHING;

INSERT INTO product_variant_translation (id, "createdAt", "updatedAt", "languageCode", name, "productVariantId")
VALUES (1, NOW(), NOW(), 'en', 'Premium Cotton T-Shirt', 1) ON CONFLICT DO NOTHING;

INSERT INTO product_variant_price (id, "createdAt", "updatedAt", price, "channelId", "variantId", "currencyCode")
VALUES (1, NOW(), NOW(), 2999, 1, 1, 'USD') ON CONFLICT DO NOTHING;

INSERT INTO product_variant_channels_channel ("productVariantId", "channelId") VALUES (1, 1) ON CONFLICT DO NOTHING;

INSERT INTO collection_product_variants_product_variant ("collectionId", "productVariantId") VALUES (1, 1) ON CONFLICT DO NOTHING;

-- Product 2: Classic Denim Jeans
INSERT INTO product (id, "createdAt", "updatedAt", enabled, "deletedAt", "featuredAssetId")
VALUES (2, NOW(), NOW(), true, NULL, NULL) ON CONFLICT DO NOTHING;

INSERT INTO product_translation (id, "createdAt", "updatedAt", "languageCode", name, slug, description, "productId")
VALUES (2, NOW(), NOW(), 'en', 'Classic Denim Jeans', 'classic-denim-jeans', 'Comfortable classic denim jeans', 2) ON CONFLICT DO NOTHING;

INSERT INTO product_channels_channel ("productId", "channelId") VALUES (2, 1) ON CONFLICT DO NOTHING;

INSERT INTO product_variant (id, "createdAt", "updatedAt", "deletedAt", enabled, sku, "stockOnHand", "stockAllocated", "outOfStockThreshold", "useGlobalOutOfStockThreshold", "trackInventory", "productId", "taxCategoryId")
VALUES (2, NOW(), NOW(), NULL, true, 'JEANS-001', 100, 0, 0, true, 'INHERIT', 2, 1) ON CONFLICT DO NOTHING;

INSERT INTO product_variant_translation (id, "createdAt", "updatedAt", "languageCode", name, "productVariantId")
VALUES (2, NOW(), NOW(), 'en', 'Classic Denim Jeans', 2) ON CONFLICT DO NOTHING;

INSERT INTO product_variant_price (id, "createdAt", "updatedAt", price, "channelId", "variantId", "currencyCode")
VALUES (2, NOW(), NOW(), 7999, 1, 2, 'USD') ON CONFLICT DO NOTHING;

INSERT INTO product_variant_channels_channel ("productVariantId", "channelId") VALUES (2, 1) ON CONFLICT DO NOTHING;

INSERT INTO collection_product_variants_product_variant ("collectionId", "productVariantId") VALUES (1, 2) ON CONFLICT DO NOTHING;

-- Product 3: Leather Jacket
INSERT INTO product (id, "createdAt", "updatedAt", enabled, "deletedAt", "featuredAssetId")
VALUES (3, NOW(), NOW(), true, NULL, NULL) ON CONFLICT DO NOTHING;

INSERT INTO product_translation (id, "createdAt", "updatedAt", "languageCode", name, slug, description, "productId")
VALUES (3, NOW(), NOW(), 'en', 'Leather Jacket', 'leather-jacket', 'Premium leather jacket', 3) ON CONFLICT DO NOTHING;

INSERT INTO product_channels_channel ("productId", "channelId") VALUES (3, 1) ON CONFLICT DO NOTHING;

INSERT INTO product_variant (id, "createdAt", "updatedAt", "deletedAt", enabled, sku, "stockOnHand", "stockAllocated", "outOfStockThreshold", "useGlobalOutOfStockThreshold", "trackInventory", "productId", "taxCategoryId")
VALUES (3, NOW(), NOW(), NULL, true, 'JACKET-001', 50, 0, 0, true, 'INHERIT', 3, 1) ON CONFLICT DO NOTHING;

INSERT INTO product_variant_translation (id, "createdAt", "updatedAt", "languageCode", name, "productVariantId")
VALUES (3, NOW(), NOW(), 'en', 'Leather Jacket', 3) ON CONFLICT DO NOTHING;

INSERT INTO product_variant_price (id, "createdAt", "updatedAt", price, "channelId", "variantId", "currencyCode")
VALUES (3, NOW(), NOW(), 19999, 1, 3, 'USD') ON CONFLICT DO NOTHING;

INSERT INTO product_variant_channels_channel ("productVariantId", "channelId") VALUES (3, 1) ON CONFLICT DO NOTHING;

INSERT INTO collection_product_variants_product_variant ("collectionId", "productVariantId") VALUES (1, 3) ON CONFLICT DO NOTHING;

-- Product 4: Running Shoes
INSERT INTO product (id, "createdAt", "updatedAt", enabled, "deletedAt", "featuredAssetId")
VALUES (4, NOW(), NOW(), true, NULL, NULL) ON CONFLICT DO NOTHING;

INSERT INTO product_translation (id, "createdAt", "updatedAt", "languageCode", name, slug, description, "productId")
VALUES (4, NOW(), NOW(), 'en', 'Running Shoes', 'running-shoes', 'Comfortable running shoes', 4) ON CONFLICT DO NOTHING;

INSERT INTO product_channels_channel ("productId", "channelId") VALUES (4, 1) ON CONFLICT DO NOTHING;

INSERT INTO product_variant (id, "createdAt", "updatedAt", "deletedAt", enabled, sku, "stockOnHand", "stockAllocated", "outOfStockThreshold", "useGlobalOutOfStockThreshold", "trackInventory", "productId", "taxCategoryId")
VALUES (4, NOW(), NOW(), NULL, true, 'SHOES-001', 75, 0, 0, true, 'INHERIT', 4, 1) ON CONFLICT DO NOTHING;

INSERT INTO product_variant_translation (id, "createdAt", "updatedAt", "languageCode", name, "productVariantId")
VALUES (4, NOW(), NOW(), 'en', 'Running Shoes', 4) ON CONFLICT DO NOTHING;

INSERT INTO product_variant_price (id, "createdAt", "updatedAt", price, "channelId", "variantId", "currencyCode")
VALUES (4, NOW(), NOW(), 8999, 1, 4, 'USD') ON CONFLICT DO NOTHING;

INSERT INTO product_variant_channels_channel ("productVariantId", "channelId") VALUES (4, 1) ON CONFLICT DO NOTHING;

INSERT INTO collection_product_variants_product_variant ("collectionId", "productVariantId") VALUES (3, 4) ON CONFLICT DO NOTHING;

-- Product 5: Canvas Backpack
INSERT INTO product (id, "createdAt", "updatedAt", enabled, "deletedAt", "featuredAssetId")
VALUES (5, NOW(), NOW(), true, NULL, NULL) ON CONFLICT DO NOTHING;

INSERT INTO product_translation (id, "createdAt", "updatedAt", "languageCode", name, slug, description, "productId")
VALUES (5, NOW(), NOW(), 'en', 'Canvas Backpack', 'canvas-backpack', 'Durable canvas backpack', 5) ON CONFLICT DO NOTHING;

INSERT INTO product_channels_channel ("productId", "channelId") VALUES (5, 1) ON CONFLICT DO NOTHING;

INSERT INTO product_variant (id, "createdAt", "updatedAt", "deletedAt", enabled, sku, "stockOnHand", "stockAllocated", "outOfStockThreshold", "useGlobalOutOfStockThreshold", "trackInventory", "productId", "taxCategoryId")
VALUES (5, NOW(), NOW(), NULL, true, 'BAG-001', 80, 0, 0, true, 'INHERIT', 5, 1) ON CONFLICT DO NOTHING;

INSERT INTO product_variant_translation (id, "createdAt", "updatedAt", "languageCode", name, "productVariantId")
VALUES (5, NOW(), NOW(), 'en', 'Canvas Backpack', 5) ON CONFLICT DO NOTHING;

INSERT INTO product_variant_price (id, "createdAt", "updatedAt", price, "channelId", "variantId", "currencyCode")
VALUES (5, NOW(), NOW(), 5999, 1, 5, 'USD') ON CONFLICT DO NOTHING;

INSERT INTO product_variant_channels_channel ("productVariantId", "channelId") VALUES (5, 1) ON CONFLICT DO NOTHING;

INSERT INTO collection_product_variants_product_variant ("collectionId", "productVariantId") VALUES (2, 5) ON CONFLICT DO NOTHING;

-- Product 6: Sports Cap
INSERT INTO product (id, "createdAt", "updatedAt", enabled, "deletedAt", "featuredAssetId")
VALUES (6, NOW(), NOW(), true, NULL, NULL) ON CONFLICT DO NOTHING;

INSERT INTO product_translation (id, "createdAt", "updatedAt", "languageCode", name, slug, description, "productId")
VALUES (6, NOW(), NOW(), 'en', 'Sports Cap', 'sports-cap', 'Stylish sports cap', 6) ON CONFLICT DO NOTHING;

INSERT INTO product_channels_channel ("productId", "channelId") VALUES (6, 1) ON CONFLICT DO NOTHING;

INSERT INTO product_variant (id, "createdAt", "updatedAt", "deletedAt", enabled, sku, "stockOnHand", "stockAllocated", "outOfStockThreshold", "useGlobalOutOfStockThreshold", "trackInventory", "productId", "taxCategoryId")
VALUES (6, NOW(), NOW(), NULL, true, 'CAP-001', 150, 0, 0, true, 'INHERIT', 6, 1) ON CONFLICT DO NOTHING;

INSERT INTO product_variant_translation (id, "createdAt", "updatedAt", "languageCode", name, "productVariantId")
VALUES (6, NOW(), NOW(), 'en', 'Sports Cap', 6) ON CONFLICT DO NOTHING;

INSERT INTO product_variant_price (id, "createdAt", "updatedAt", price, "channelId", "variantId", "currencyCode")
VALUES (6, NOW(), NOW(), 1999, 1, 6, 'USD') ON CONFLICT DO NOTHING;

INSERT INTO product_variant_channels_channel ("productVariantId", "channelId") VALUES (6, 1) ON CONFLICT DO NOTHING;

INSERT INTO collection_product_variants_product_variant ("collectionId", "productVariantId") VALUES (2, 6) ON CONFLICT DO NOTHING;
