const fetch = require('node-fetch');

const ADMIN_API = 'http://localhost:3001/admin-api';
const CREDENTIALS = {
  username: 'superadmin',
  password: 'superadmin'
};

async function authenticate() {
  const query = `
    mutation {
      login(username: "${CREDENTIALS.username}", password: "${CREDENTIALS.password}") {
        ... on CurrentUser {
          id
          identifier
        }
      }
    }
  `;

  const response = await fetch(ADMIN_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    credentials: 'include'
  });

  const result = await response.json();

  if (result.errors) {
    console.error('❌ Authentication failed:', result.errors);
    console.log('💡 Please go to http://localhost:3001/admin and create a superadmin user first');
    process.exit(1);
  }

  // Extract cookies from response
  const cookies = response.headers.raw()['set-cookie'];
  return cookies;
}

async function createProduct(name, slug, price, sku, cookies) {
  const createProductMutation = `
    mutation {
      createProduct(input: {
        translations: [{ languageCode: en, name: "${name}", slug: "${slug}", description: "High quality ${name}" }]
      }) {
        id
        name
      }
    }
  `;

  const createResponse = await fetch(ADMIN_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies.join('; ')
    },
    body: JSON.stringify({ query: createProductMutation })
  });

  const createResult = await createResponse.json();

  if (createResult.errors) {
    console.error(`❌ Failed to create product ${name}:`, createResult.errors);
    return null;
  }

  const productId = createResult.data.createProduct.id;
  console.log(`✅ Created product: ${name} (ID: ${productId})`);

  // Create variant
  const createVariantMutation = `
    mutation {
      createProductVariants(input: [{
        productId: "${productId}"
        sku: "${sku}"
        price: ${price}
        translations: [{ languageCode: en, name: "${name}" }]
      }]) {
        ... on ProductVariant {
          id
          name
        }
      }
    }
  `;

  const variantResponse = await fetch(ADMIN_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies.join('; ')
    },
    body: JSON.stringify({ query: createVariantMutation })
  });

  const variantResult = await variantResponse.json();

  if (variantResult.errors) {
    console.error(`❌ Failed to create variant for ${name}:`, variantResult.errors);
    return null;
  }

  console.log(`✅ Created variant: ${name}`);

  // Enable product
  const updateMutation = `
    mutation {
      updateProduct(input: { id: "${productId}", enabled: true }) {
        id
        enabled
      }
    }
  `;

  await fetch(ADMIN_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies.join('; ')
    },
    body: JSON.stringify({ query: updateMutation })
  });

  console.log(`✅ Enabled product: ${name}\n`);
  return productId;
}

async function populateProducts() {
  console.log('🚀 Starting product population...\n');

  const cookies = await authenticate();
  console.log('✅ Authenticated\n');

  const products = [
    { name: 'Premium Cotton T-Shirt', slug: 'premium-cotton-tshirt', price: 2999, sku: 'TSHIRT-001' },
    { name: 'Classic Denim Jeans', slug: 'classic-denim-jeans', price: 7999, sku: 'JEANS-001' },
    { name: 'Leather Jacket', slug: 'leather-jacket', price: 19999, sku: 'JACKET-001' },
    { name: 'Running Shoes', slug: 'running-shoes', price: 8999, sku: 'SHOES-001' },
    { name: 'Canvas Backpack', slug: 'canvas-backpack', price: 5999, sku: 'BAG-001' },
    { name: 'Wool Sweater', slug: 'wool-sweater', price: 6999, sku: 'SWEATER-001' },
    { name: 'Cotton Hoodie', slug: 'cotton-hoodie', price: 4999, sku: 'HOODIE-001' },
    { name: 'Sports Cap', slug: 'sports-cap', price: 1999, sku: 'CAP-001' },
    { name: 'Silk Scarf', slug: 'silk-scarf', price: 3499, sku: 'SCARF-001' },
    { name: 'Leather Belt', slug: 'leather-belt', price: 2499, sku: 'BELT-001' },
  ];

  for (const product of products) {
    await createProduct(product.name, product.slug, product.price, product.sku, cookies);
  }

  console.log('🎉 Population complete! Created', products.length, 'products');
}

populateProducts().catch(console.error);
