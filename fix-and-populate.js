const axios = require('axios');

async function fixAndPopulate() {
  const API_URL = 'http://localhost:3001/admin-api';
  const SHOP_API_URL = 'http://localhost:3001/shop-api';

  try {
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
    const channelId = loginResponse.data.data.login.channels[0].id;
    const cookies = loginResponse.headers['set-cookie'];
    console.log('✅ Logged in\n');

    const headers = {
      'vendure-token': token,
      'Cookie': cookies
    };

    // Get all products from admin API
    console.log('=== Checking Products ===');
    const productsResponse = await axios.post(API_URL, {
      query: `
        query {
          products(options: { take: 100 }) {
            items {
              id
              name
              enabled
              variants {
                id
                name
                sku
              }
            }
          }
        }
      `
    }, { headers });

    const allProducts = productsResponse.data.data.products.items;
    console.log(`Found ${allProducts.length} total products`);

    // Find products with variants
    const productsWithVariants = allProducts.filter(p => p.variants && p.variants.length > 0);
    console.log(`   ${productsWithVariants.length} have variants`);

    // Delete products without variants to clean up
    const productsWithoutVariants = allProducts.filter(p => !p.variants || p.variants.length === 0);
    console.log(`   ${productsWithoutVariants.length} WITHOUT variants (will be deleted)\n`);

    console.log('=== Cleaning up products without variants ===');
    for (const product of productsWithoutVariants.slice(0, 10)) {
      await axios.post(API_URL, {
        query: `
          mutation {
            deleteProduct(id: "${product.id}") {
              result
            }
          }
        `
      }, { headers });
      console.log(`   ✓ Deleted: ${product.name}`);
    }

    // Assign products with variants to channel
    if (productsWithVariants.length > 0) {
      console.log('\n=== Assigning products to channel ===');
      const productIds = productsWithVariants.map(p => p.id);

      const assignResponse = await axios.post(API_URL, {
        query: `
          mutation {
            assignProductsToChannel(input: {
              channelId: "${channelId}"
              productIds: ${JSON.stringify(productIds)}
            }) {
              id
              name
            }
          }
        `
      }, { headers });

      if (assignResponse.data.data?.assignProductsToChannel) {
        console.log(`✅ Assigned ${productsWithVariants.length} products to channel`);
      }
    }

    // Verify from shop API
    console.log('\n=== Verifying from Shop API ===');
    const shopProductsResponse = await axios.post(SHOP_API_URL, {
      query: `
        query {
          products(options: { take: 10 }) {
            totalItems
            items {
              id
              name
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

    const shopProducts = shopProductsResponse.data.data.products;
    console.log(`\n✓ ${shopProducts.totalItems} products available in shop`);

    const purchasableProducts = shopProducts.items.filter(p => p.variants && p.variants.length > 0);
    console.log(`✓ ${purchasableProducts.length} products are purchasable (have variants)\n`);

    purchasableProducts.forEach(p => {
      console.log(`   📦 ${p.name}`);
      p.variants.forEach(v => {
        console.log(`      • ${v.sku}: $${(v.priceWithTax / 100).toFixed(2)} (Stock: ${v.stockLevel})`);
      });
    });

    if (purchasableProducts.length > 0) {
      console.log('\n🎉 Success! Your store now has purchasable products!');
      console.log('\n💡 Try adding one of these products to your cart now.');
    } else {
      console.log('\n⚠️  No purchasable products found. Creating some now...\n');

      // Create products
      const productsToCreate = [
        { name: 'Cotton T-Shirt', sku: 'TSHIRT-001', price: 2999 },
        { name: 'Running Shoes', sku: 'SHOES-001', price: 8999 },
        { name: 'Water Bottle', sku: 'BOTTLE-001', price: 2499 }
      ];

      for (const item of productsToCreate) {
        console.log(`Creating: ${item.name}...`);

        const createProductResponse = await axios.post(API_URL, {
          query: `
            mutation {
              createProduct(input: {
                translations: [{
                  languageCode: en
                  name: "${item.name}"
                  slug: "${item.name.toLowerCase().replace(/ /g, '-')}"
                  description: "A great ${item.name.toLowerCase()}"
                }]
              }) {
                id
                name
              }
            }
          `
        }, { headers });

        const product = createProductResponse.data.data.createProduct;

        await axios.post(API_URL, {
          query: `
            mutation {
              createProductVariants(input: [{
                productId: "${product.id}"
                sku: "${item.sku}"
                price: ${item.price}
                stockOnHand: 100
                translations: [{
                  languageCode: en
                  name: "${item.name}"
                }]
              }]) {
                id
              }
            }
          `
        }, { headers });

        await axios.post(API_URL, {
          query: `
            mutation {
              updateProduct(input: {
                id: "${product.id}"
                enabled: true
              }) {
                id
              }
            }
          `
        }, { headers });

        await axios.post(API_URL, {
          query: `
            mutation {
              assignProductsToChannel(input: {
                channelId: "${channelId}"
                productIds: ["${product.id}"]
              }) {
                id
              }
            }
          `
        }, { headers });

        console.log(`   ✅ ${item.name} created and available!`);
      }

      console.log('\n🎉 Products created! Try adding to cart now.');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response?.data?.errors) {
      console.error('Errors:', JSON.stringify(error.response.data.errors, null, 2));
    }
  }
}

fixAndPopulate();
