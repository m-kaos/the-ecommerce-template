const fetch = require('node-fetch');

const ADMIN_API = 'http://localhost:3001/admin-api';
let cookies = [];

async function graphqlRequest(query, variables = {}) {
  const response = await fetch(ADMIN_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies.join('; ')
    },
    body: JSON.stringify({ query, variables })
  });

  // Update cookies if we got new ones
  const newCookies = response.headers.raw()['set-cookie'];
  if (newCookies) {
    cookies = newCookies;
  }

  const result = await response.json();

  if (result.errors) {
    console.error('GraphQL Error:', JSON.stringify(result.errors, null, 2));
    throw new Error(result.errors[0].message);
  }

  return result.data;
}

async function createSuperAdmin() {
  console.log('👤 Creating superadmin user...');

  const query = `
    mutation {
      createAdministrator(input: {
        emailAddress: "superadmin@vendure.io"
        firstName: "Super"
        lastName: "Admin"
        password: "superadmin"
        roleIds: ["1"]
      }) {
        ... on Administrator {
          id
          emailAddress
        }
        ... on ErrorResult {
          errorCode
          message
        }
      }
    }
  `;

  try {
    await graphqlRequest(query);
    console.log('✅ Superadmin created\n');
  } catch (err) {
    // Might already exist, that's okay
    console.log('ℹ️  Superadmin might already exist\n');
  }
}

async function authenticate() {
  console.log('🔐 Authenticating...');

  const query = `
    mutation {
      login(username: "superadmin@vendure.io", password: "superadmin") {
        ... on CurrentUser {
          id
          identifier
        }
        ... on ErrorResult {
          errorCode
          message
        }
      }
    }
  `;

  await graphqlRequest(query);
  console.log('✅ Authenticated\n');
}

async function createCountry() {
  console.log('🌍 Creating country (USA)...');

  const query = `
    mutation {
      createCountry(input: {
        code: "US"
        translations: [{ languageCode: en, name: "United States" }]
        enabled: true
      }) {
        id
        code
      }
    }
  `;

  try {
    const data = await graphqlRequest(query);
    console.log('✅ Country created\n');
    return data.createCountry.id;
  } catch (err) {
    console.log('ℹ️  Country might already exist\n');
    return 1;
  }
}

async function createZone(countryId) {
  console.log('🗺️  Creating tax zone...');

  const query = `
    mutation {
      createZone(input: {
        name: "USA Zone"
        memberIds: ["${countryId}"]
      }) {
        id
        name
      }
    }
  `;

  try {
    const data = await graphqlRequest(query);
    console.log('✅ Zone created\n');
    return data.createZone.id;
  } catch (err) {
    console.log('ℹ️  Zone might already exist\n');
    return 1;
  }
}

async function createTaxCategory() {
  console.log('💰 Creating tax category...');

  const query = `
    mutation {
      createTaxCategory(input: {
        name: "Standard"
        isDefault: true
      }) {
        id
        name
      }
    }
  `;

  try {
    const data = await graphqlRequest(query);
    console.log('✅ Tax category created\n');
    return data.createTaxCategory.id;
  } catch (err) {
    console.log('ℹ️  Tax category might already exist\n');
    return 1;
  }
}

async function createTaxRate(zoneId, taxCategoryId) {
  console.log('📊 Creating tax rate...');

  const query = `
    mutation {
      createTaxRate(input: {
        name: "Standard Tax"
        enabled: true
        value: 10
        categoryId: "${taxCategoryId}"
        zoneId: "${zoneId}"
      }) {
        id
        name
      }
    }
  `;

  try {
    await graphqlRequest(query);
    console.log('✅ Tax rate created\n');
  } catch (err) {
    console.log('ℹ️  Tax rate might already exist\n');
  }
}

async function updateChannel(zoneId) {
  console.log('📺 Updating default channel with tax zone...');

  const query = `
    mutation {
      updateChannel(input: {
        id: "1"
        defaultTaxZoneId: "${zoneId}"
        defaultShippingZoneId: "${zoneId}"
      }) {
        id
        code
      }
    }
  `;

  await graphqlRequest(query);
  console.log('✅ Channel updated\n');
}

async function createShippingMethod(zoneId) {
  console.log('🚚 Creating shipping methods...');

  const standardQuery = `
    mutation {
      createShippingMethod(input: {
        code: "standard-shipping"
        translations: [
          {
            languageCode: en
            name: "Standard Shipping"
            description: "Standard shipping (5-7 days)"
          }
        ]
        checker: {
          code: "default-shipping-eligibility-checker"
          arguments: [{ name: "orderMinimum", value: "0" }]
        }
        calculator: {
          code: "flat-rate-shipping-calculator"
          arguments: [{ name: "rate", value: "500" }, { name: "includesTax", value: "auto" }]
        }
      }) {
        id
        code
      }
    }
  `;

  const expressQuery = `
    mutation {
      createShippingMethod(input: {
        code: "express-shipping"
        translations: [
          {
            languageCode: en
            name: "Express Shipping"
            description: "Express shipping (2-3 days)"
          }
        ]
        checker: {
          code: "default-shipping-eligibility-checker"
          arguments: [{ name: "orderMinimum", value: "0" }]
        }
        calculator: {
          code: "flat-rate-shipping-calculator"
          arguments: [{ name: "rate", value: "1000" }, { name: "includesTax", value: "auto" }]
        }
      }) {
        id
        code
      }
    }
  `;

  try {
    await graphqlRequest(standardQuery);
    console.log('✅ Standard shipping created');
    await graphqlRequest(expressQuery);
    console.log('✅ Express shipping created\n');
  } catch (err) {
    console.log('ℹ️  Shipping methods might already exist\n');
  }
}

async function createPaymentMethod() {
  console.log('💳 Creating payment method...');

  const query = `
    mutation {
      createPaymentMethod(input: {
        code: "dummy-payment-method"
        translations: [
          {
            languageCode: en
            name: "Dummy Payment"
            description: "Dummy payment for testing"
          }
        ]
        enabled: true
        handler: {
          code: "dummy-payment-handler"
          arguments: []
        }
      }) {
        id
        code
      }
    }
  `;

  try {
    await graphqlRequest(query);
    console.log('✅ Payment method created\n');
  } catch (err) {
    console.log('ℹ️  Payment method might already exist\n');
  }
}

async function createCollection(name, slug) {
  console.log(`📁 Creating collection: ${name}...`);

  const query = `
    mutation {
      createCollection(input: {
        isPrivate: false
        translations: [
          {
            languageCode: en
            name: "${name}"
            slug: "${slug}"
            description: "${name} collection"
          }
        ]
        filters: []
      }) {
        id
        name
      }
    }
  `;

  const data = await graphqlRequest(query);
  console.log(`✅ Collection created: ${name}\n`);
  return data.createCollection.id;
}

async function createProduct(name, slug, price, sku, collectionId) {
  const createProductQuery = `
    mutation {
      createProduct(input: {
        translations: [
          {
            languageCode: en
            name: "${name}"
            slug: "${slug}"
            description: "High quality ${name.toLowerCase()}"
          }
        ]
      }) {
        id
        name
      }
    }
  `;

  const createResult = await graphqlRequest(createProductQuery);
  const productId = createResult.createProduct.id;

  // Create variant
  const createVariantQuery = `
    mutation {
      createProductVariants(input: [{
        productId: "${productId}"
        sku: "${sku}"
        price: ${price}
        stockOnHand: 100
        trackInventory: INHERIT
        translations: [{ languageCode: en, name: "${name}" }]
      }]) {
        ... on ProductVariant {
          id
          name
        }
        ... on ErrorResult {
          errorCode
          message
        }
      }
    }
  `;

  await graphqlRequest(createVariantQuery);

  // Add to collection
  if (collectionId) {
    const addToCollectionQuery = `
      mutation {
        updateCollection(input: {
          id: "${collectionId}"
          productVariantIds: { add: ["${productId}"] }
        }) {
          id
        }
      }
    `;
    await graphqlRequest(addToCollectionQuery);
  }

  // Enable product
  const updateQuery = `
    mutation {
      updateProduct(input: { id: "${productId}", enabled: true }) {
        id
        enabled
      }
    }
  `;

  await graphqlRequest(updateQuery);
  console.log(`✅ Created: ${name}`);

  return productId;
}

async function populateProducts() {
  console.log('📦 Creating collections...\n');

  const clothingId = await createCollection('Clothing', 'clothing');
  const accessoriesId = await createCollection('Accessories', 'accessories');
  const shoesId = await createCollection('Footwear', 'footwear');

  console.log('🛍️  Creating products...\n');

  const products = [
    { name: 'Premium Cotton T-Shirt', slug: 'premium-cotton-tshirt', price: 2999, sku: 'TSHIRT-001', collection: clothingId },
    { name: 'Classic Denim Jeans', slug: 'classic-denim-jeans', price: 7999, sku: 'JEANS-001', collection: clothingId },
    { name: 'Leather Jacket', slug: 'leather-jacket', price: 19999, sku: 'JACKET-001', collection: clothingId },
    { name: 'Wool Sweater', slug: 'wool-sweater', price: 6999, sku: 'SWEATER-001', collection: clothingId },
    { name: 'Cotton Hoodie', slug: 'cotton-hoodie', price: 4999, sku: 'HOODIE-001', collection: clothingId },

    { name: 'Running Shoes', slug: 'running-shoes', price: 8999, sku: 'SHOES-001', collection: shoesId },
    { name: 'Leather Boots', slug: 'leather-boots', price: 12999, sku: 'BOOTS-001', collection: shoesId },

    { name: 'Canvas Backpack', slug: 'canvas-backpack', price: 5999, sku: 'BAG-001', collection: accessoriesId },
    { name: 'Sports Cap', slug: 'sports-cap', price: 1999, sku: 'CAP-001', collection: accessoriesId },
    { name: 'Silk Scarf', slug: 'silk-scarf', price: 3499, sku: 'SCARF-001', collection: accessoriesId },
    { name: 'Leather Belt', slug: 'leather-belt', price: 2499, sku: 'BELT-001', collection: accessoriesId },
    { name: 'Sunglasses', slug: 'sunglasses', price: 4999, sku: 'GLASS-001', collection: accessoriesId },
  ];

  for (const product of products) {
    await createProduct(product.name, product.slug, product.price, product.sku, product.collection);
  }

  console.log('\n🎉 Created', products.length, 'products!');
}

async function main() {
  console.log('🚀 Starting Vendure setup and population...\n');

  try {
    await createSuperAdmin();
    await authenticate();

    const countryId = await createCountry();
    const zoneId = await createZone(countryId);
    const taxCategoryId = await createTaxCategory();
    await createTaxRate(zoneId, taxCategoryId);
    await updateChannel(zoneId);
    await createShippingMethod(zoneId);
    await createPaymentMethod();

    await populateProducts();

    console.log('\n✨ Setup complete!\n');
    console.log('Login credentials:');
    console.log('  Email: superadmin@vendure.io');
    console.log('  Password: superadmin\n');

  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
}

main();
