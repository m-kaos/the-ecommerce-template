const axios = require('axios');

async function createProducts() {
  const API_URL = 'http://localhost:3001/admin-api';

  try {
    // Login
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(API_URL, {
      query: `
        mutation {
          login(username: "superadmin", password: "superadmin") {
            ... on CurrentUser {
              id
              channels {
                id
                token
              }
            }
          }
        }
      `
    });

    const token = loginResponse.data.data.login.channels[0].token;
    const cookies = loginResponse.headers['set-cookie'];
    console.log('✅ Logged in\n');

    const headers = {
      'vendure-token': token,
      'Cookie': cookies
    };

    // Product data
    const productsToCreate = [
      {
        name: 'Classic Cotton T-Shirt',
        slug: 'classic-cotton-tshirt',
        description: 'A comfortable premium cotton t-shirt perfect for everyday wear',
        sku: 'TSHIRT-001',
        price: 2999
      },
      {
        name: 'Running Shoes',
        slug: 'running-shoes',
        description: 'Lightweight running shoes with excellent cushioning and support',
        sku: 'SHOES-001',
        price: 8999
      },
      {
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        sku: 'AUDIO-001',
        price: 14999
      }
    ];

    console.log('=== Creating Products with Variants ===\n');

    for (const productData of productsToCreate) {
      console.log(`Creating: ${productData.name}...`);

      // Create product
      const createProductResponse = await axios.post(API_URL, {
        query: `
          mutation {
            createProduct(input: {
              translations: [{
                languageCode: en
                name: "${productData.name}"
                slug: "${productData.slug}"
                description: "${productData.description}"
              }]
            }) {
              id
              name
              slug
            }
          }
        `
      }, { headers });

      if (createProductResponse.data.errors) {
        console.log(`❌ Error creating ${productData.name}:`, createProductResponse.data.errors[0].message);
        continue;
      }

      const product = createProductResponse.data.data.createProduct;
      console.log(`   ✓ Product created (ID: ${product.id})`);

      // Create product variant
      const createVariantResponse = await axios.post(API_URL, {
        query: `
          mutation {
            createProductVariants(input: [{
              productId: "${product.id}"
              sku: "${productData.sku}"
              price: ${productData.price}
              stockOnHand: 100
              translations: [{
                languageCode: en
                name: "${productData.name}"
              }]
            }]) {
              id
              name
              sku
              price
            }
          }
        `
      }, { headers });

      if (createVariantResponse.data.errors) {
        console.log(`   ❌ Error creating variant:`, createVariantResponse.data.errors[0].message);
        continue;
      }

      const variants = createVariantResponse.data.data.createProductVariants;
      if (variants && variants.length > 0) {
        const variant = variants[0];
        console.log(`   ✓ Variant created: ${variant.sku} - $${(variant.price / 100).toFixed(2)}`);
      }

      // Publish product
      await axios.post(API_URL, {
        query: `
          mutation {
            updateProduct(input: {
              id: "${product.id}"
              enabled: true
            }) {
              id
              enabled
            }
          }
        `
      }, { headers });

      console.log(`   ✓ Product published\n`);
    }

    // Verify products
    console.log('=== Verifying Products ===');
    const verifyResponse = await axios.post('http://localhost:3001/shop-api', {
      query: `
        query {
          products(options: { take: 10 }) {
            totalItems
            items {
              id
              name
              slug
              variants {
                id
                name
                sku
                price
                priceWithTax
                stockLevel
              }
            }
          }
        }
      `
    });

    const products = verifyResponse.data.data.products;
    console.log(`\n✓ Total products in shop: ${products.totalItems}`);

    let productsWithVariants = 0;
    products.items.forEach(p => {
      const variantCount = p.variants?.length || 0;
      if (variantCount > 0) productsWithVariants++;
      console.log(`   - ${p.name} (${variantCount} variant${variantCount !== 1 ? 's' : ''})`);
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach(v => {
          console.log(`     • ${v.sku}: $${(v.priceWithTax / 100).toFixed(2)} (Stock: ${v.stockLevel})`);
        });
      }
    });

    console.log(`\n✅ ${productsWithVariants} products have variants and can be purchased!`);
    console.log('\n🎉 Setup complete! You can now add items to your cart.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response?.data?.errors) {
      console.error('GraphQL Errors:', JSON.stringify(error.response.data.errors, null, 2));
    }
  }
}

createProducts();
