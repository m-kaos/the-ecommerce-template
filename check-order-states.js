const axios = require('axios');

async function checkOrderStates() {
  const API_URL = 'http://localhost:3001/shop-api';

  try {
    // Get active order and its available transitions
    const result = await axios.post(API_URL, {
      query: `
        query {
          activeOrder {
            id
            code
            state
            active
            totalWithTax
            shippingAddress {
              fullName
              city
            }
            shippingLines {
              shippingMethod {
                id
                name
              }
            }
            lines {
              id
              quantity
            }
          }
        }
      `
    });

    const order = result.data.data?.activeOrder;
    
    if (!order) {
      console.log('❌ No active order found');
      return;
    }

    console.log('\n📋 Current Order State:');
    console.log('  ID:', order.id);
    console.log('  Code:', order.code);
    console.log('  State:', order.state);
    console.log('  Active:', order.active);
    console.log('  Total:', `$${(order.totalWithTax / 100).toFixed(2)}`);
    console.log('  Lines:', order.lines.length);
    console.log('  Has Shipping Address:', !!order.shippingAddress);
    if (order.shippingAddress) {
      console.log('    Address:', order.shippingAddress.fullName, '-', order.shippingAddress.city);
    }
    console.log('  Shipping Lines:', order.shippingLines.length);
    if (order.shippingLines.length > 0) {
      order.shippingLines.forEach(line => {
        console.log('    Method:', line.shippingMethod.name);
      });
    }

    console.log('\n✅ Order details retrieved successfully');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response?.data?.errors) {
      console.error('Errors:', JSON.stringify(error.response.data.errors, null, 2));
    }
  }
}

checkOrderStates();
