const axios = require('axios');

async function assignToChannel() {
  const API_URL = 'http://localhost:3001/admin-api';
  const SHOP_API_URL = 'http://localhost:3001/shop-api';

  try {
    // Login
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(API_URL, {
      query: `
        mutation {
          login(username: "superadmin", password: "superadmin") {
            ... on CurrentUser {
              id
              identifier
              channels {
                id
                token
                code
              }
            }
          }
        }
      `
    });

    const user = loginResponse.data.data.login;
    const token = user.channels[0].token;
    const channelId = user.channels[0].id;
    const cookies = loginResponse.headers['set-cookie'];
    console.log('✅ Logged in');
    console.log(`   Channel ID: ${channelId}\n`);

    const headers = {
      'vendure-token': token,
      'Cookie': cookies
    };

    // Get all shipping methods
    console.log('=== Assigning Shipping Methods to Channel ===');
    const shippingResponse = await axios.post(API_URL, {
      query: `
        query {
          shippingMethods {
            items {
              id
              code
              name
            }
          }
        }
      `
    }, { headers });

    const shippingMethods = shippingResponse.data.data.shippingMethods.items;
    console.log(`Found ${shippingMethods.length} shipping methods`);

    if (shippingMethods.length > 0) {
      const shippingIds = shippingMethods.map(m => m.id);
      console.log('Assigning to channel...');

      const assignShippingResponse = await axios.post(API_URL, {
        query: `
          mutation {
            assignShippingMethodsToChannel(input: {
              channelId: "${channelId}"
              shippingMethodIds: ${JSON.stringify(shippingIds)}
            }) {
              id
              name
            }
          }
        `
      }, { headers });

      if (assignShippingResponse.data.data?.assignShippingMethodsToChannel) {
        const assigned = assignShippingResponse.data.data.assignShippingMethodsToChannel;
        console.log(`✅ Assigned ${assigned.length} shipping methods to channel`);
        assigned.forEach(m => console.log(`   - ${m.name}`));
      } else if (assignShippingResponse.data.errors) {
        console.log('⚠️  Error:', assignShippingResponse.data.errors[0].message);
      }
    }

    // Get all payment methods
    console.log('\n=== Assigning Payment Methods to Channel ===');
    const paymentResponse = await axios.post(API_URL, {
      query: `
        query {
          paymentMethods {
            items {
              id
              code
              name
              enabled
            }
          }
        }
      `
    }, { headers });

    const paymentMethods = paymentResponse.data.data.paymentMethods.items.filter(m => m.enabled);
    console.log(`Found ${paymentMethods.length} enabled payment methods`);

    if (paymentMethods.length > 0) {
      const paymentIds = paymentMethods.map(m => m.id);
      console.log('Assigning to channel...');

      const assignPaymentResponse = await axios.post(API_URL, {
        query: `
          mutation {
            assignPaymentMethodsToChannel(input: {
              channelId: "${channelId}"
              paymentMethodIds: ${JSON.stringify(paymentIds)}
            }) {
              id
              name
            }
          }
        `
      }, { headers });

      if (assignPaymentResponse.data.data?.assignPaymentMethodsToChannel) {
        const assigned = assignPaymentResponse.data.data.assignPaymentMethodsToChannel;
        console.log(`✅ Assigned ${assigned.length} payment methods to channel`);
        assigned.forEach(m => console.log(`   - ${m.name}`));
      } else if (assignPaymentResponse.data.errors) {
        console.log('⚠️  Error:', assignPaymentResponse.data.errors[0].message);
      }
    }

    // Verify from shop API
    console.log('\n=== Verifying from Shop API ===');

    const verifyShippingResponse = await axios.post(SHOP_API_URL, {
      query: `
        query {
          eligibleShippingMethods {
            id
            name
            description
            priceWithTax
          }
        }
      `
    });

    const eligibleShipping = verifyShippingResponse.data.data?.eligibleShippingMethods || [];
    console.log(`✓ ${eligibleShipping.length} eligible shipping methods:`);
    eligibleShipping.forEach(m => {
      console.log(`   - ${m.name}: $${(m.priceWithTax / 100).toFixed(2)} - ${m.description}`);
    });

    const verifyPaymentResponse = await axios.post(SHOP_API_URL, {
      query: `
        query {
          eligiblePaymentMethods {
            id
            code
            name
            isEligible
          }
        }
      `
    });

    const eligiblePayment = verifyPaymentResponse.data.data?.eligiblePaymentMethods || [];
    console.log(`\n✓ ${eligiblePayment.length} eligible payment methods:`);
    eligiblePayment.forEach(m => {
      console.log(`   - ${m.name} (${m.isEligible ? '✅ Eligible' : '❌ Not eligible'})`);
    });

    console.log('\n🎉 Channel assignment complete!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response?.data?.errors) {
      console.error('GraphQL Errors:', JSON.stringify(error.response.data.errors, null, 2));
    }
  }
}

assignToChannel();
