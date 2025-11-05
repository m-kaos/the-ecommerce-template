const axios = require('axios');

async function testCart() {
  const SHOP_API_URL = 'http://localhost:3001/shop-api';

  try {
    console.log('=== Testing Cart Functionality ===\n');

    // Step 1: Get products
    console.log('1️⃣  Fetching products...');
    const productsResponse = await axios.post(SHOP_API_URL, {
      query: `
        query {
          products(options: { take: 5 }) {
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

    const products = productsResponse.data.data?.products?.items || [];
    console.log(`✓ Found ${products.length} products`);

    if (products.length === 0) {
      console.log('\n❌ No products found in the database!');
      console.log('   You need to populate the database with products first.');
      console.log('   Run: cd backend && npm run populate');
      return;
    }

    // Show first few products
    products.slice(0, 3).forEach(p => {
      console.log(`   - ${p.name}`);
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach(v => {
          console.log(`     • ${v.name || 'Default variant'}: $${(v.priceWithTax / 100).toFixed(2)}`);
        });
      }
    });

    // Step 2: Add item to cart
    // Find first product with variants
    const productWithVariant = products.find(p => p.variants && p.variants.length > 0);
    if (!productWithVariant) {
      console.log('\n❌ No products with variants found!');
      return;
    }
    const firstVariant = productWithVariant.variants[0];
    console.log(`\n2️⃣  Adding to cart: ${productWithVariant.name} - ${firstVariant.name || 'Default variant'}`);

    const addToCartResponse = await axios.post(SHOP_API_URL, {
      query: `
        mutation {
          addItemToOrder(productVariantId: "${firstVariant.id}", quantity: 1) {
            ... on Order {
              id
              code
              totalQuantity
              subTotal
              subTotalWithTax
              total
              totalWithTax
              lines {
                id
                productVariant {
                  id
                  name
                }
                quantity
                linePriceWithTax
              }
              state
            }
            ... on ErrorResult {
              errorCode
              message
            }
          }
        }
      `
    });

    const addResult = addToCartResponse.data.data?.addItemToOrder;

    if (addResult && !addResult.errorCode) {
      console.log('✅ Item added to cart!');
      console.log(`   Order ID: ${addResult.code}`);
      console.log(`   Total items: ${addResult.totalQuantity}`);
      console.log(`   Subtotal: $${(addResult.subTotalWithTax / 100).toFixed(2)}`);
      console.log(`   Total: $${(addResult.totalWithTax / 100).toFixed(2)}`);
      console.log(`   State: ${addResult.state}`);

      // Step 3: Check eligible shipping methods (requires address)
      console.log('\n3️⃣  Setting shipping address...');

      const setAddressResponse = await axios.post(SHOP_API_URL, {
        query: `
          mutation {
            setOrderShippingAddress(input: {
              fullName: "Test User"
              streetLine1: "123 Main St"
              city: "New York"
              province: "NY"
              postalCode: "10001"
              countryCode: "US"
            }) {
              ... on Order {
                id
                shippingAddress {
                  fullName
                  city
                  countryCode
                }
              }
              ... on ErrorResult {
                errorCode
                message
              }
            }
          }
        `
      });

      const addressResult = setAddressResponse.data.data?.setOrderShippingAddress;

      if (addressResult && !addressResult.errorCode) {
        console.log('✅ Shipping address set!');
        console.log(`   ${addressResult.shippingAddress.fullName}`);
        console.log(`   ${addressResult.shippingAddress.city}, ${addressResult.shippingAddress.countryCode}`);

        // Step 4: Get eligible shipping methods
        console.log('\n4️⃣  Checking eligible shipping methods...');

        const shippingMethodsResponse = await axios.post(SHOP_API_URL, {
          query: `
            query {
              eligibleShippingMethods {
                id
                name
                description
                priceWithTax
                metadata
              }
            }
          `
        });

        const shippingMethods = shippingMethodsResponse.data.data?.eligibleShippingMethods || [];
        console.log(`✓ Found ${shippingMethods.length} eligible shipping methods`);

        if (shippingMethods.length > 0) {
          shippingMethods.forEach(m => {
            console.log(`   - ${m.name}: $${(m.priceWithTax / 100).toFixed(2)}`);
            console.log(`     ${m.description}`);
          });

          // Step 5: Set shipping method
          console.log(`\n5️⃣  Setting shipping method: ${shippingMethods[0].name}`);

          const setShippingResponse = await axios.post(SHOP_API_URL, {
            query: `
              mutation {
                setOrderShippingMethod(shippingMethodId: "${shippingMethods[0].id}") {
                  ... on Order {
                    id
                    shipping
                    shippingWithTax
                    total
                    totalWithTax
                  }
                  ... on ErrorResult {
                    errorCode
                    message
                  }
                }
              }
            `
          });

          const shippingResult = setShippingResponse.data.data?.setOrderShippingMethod;

          if (shippingResult && !shippingResult.errorCode) {
            console.log('✅ Shipping method set!');
            console.log(`   Shipping cost: $${(shippingResult.shippingWithTax / 100).toFixed(2)}`);
            console.log(`   Order total: $${(shippingResult.totalWithTax / 100).toFixed(2)}`);
          } else {
            console.log('❌ Error setting shipping:', shippingResult?.message);
          }

          // Step 6: Check payment methods
          console.log('\n6️⃣  Checking eligible payment methods...');

          const paymentMethodsResponse = await axios.post(SHOP_API_URL, {
            query: `
              query {
                eligiblePaymentMethods {
                  id
                  code
                  name
                  description
                  isEligible
                }
              }
            `
          });

          const paymentMethods = paymentMethodsResponse.data.data?.eligiblePaymentMethods || [];
          console.log(`✓ Found ${paymentMethods.length} eligible payment methods`);

          if (paymentMethods.length > 0) {
            paymentMethods.forEach(m => {
              const status = m.isEligible ? '✅' : '❌';
              console.log(`   ${status} ${m.name}: ${m.description || 'No description'}`);
            });
          }

          console.log('\n🎉 Cart functionality test complete!');
          console.log('\n📝 Summary:');
          console.log('   ✅ Products are available');
          console.log('   ✅ Items can be added to cart');
          console.log('   ✅ Shipping address can be set');
          console.log(`   ${shippingMethods.length > 0 ? '✅' : '❌'} Shipping methods are available`);
          console.log(`   ${paymentMethods.length > 0 ? '✅' : '❌'} Payment methods are available`);
          console.log('\n💡 Your cart should now be working! Try it in the storefront.');

        } else {
          console.log('❌ No shipping methods are eligible');
          console.log('   This might be because:');
          console.log('   - Shipping methods are not assigned to the zone');
          console.log('   - The zone does not include the US country');
        }
      } else {
        console.log('❌ Error setting address:', addressResult?.message);
      }

    } else {
      console.log('❌ Error adding to cart:', addResult?.message);
      console.log('\nPossible reasons:');
      console.log('   - Product variant not found');
      console.log('   - Out of stock');
      console.log('   - Product not assigned to channel');
    }

  } catch (error) {
    console.error('\n❌ Error during test:', error.message);
    if (error.response?.data?.errors) {
      console.error('GraphQL Errors:', JSON.stringify(error.response.data.errors, null, 2));
    }
  }
}

testCart();
