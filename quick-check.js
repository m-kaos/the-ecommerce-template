const axios = require('axios');

axios.post('http://localhost:3001/shop-api', {
  query: `
    query {
      products(options: { take: 100 }) {
        totalItems
        items {
          id
          name
          variants {
            id
            sku
            price
          }
        }
      }
    }
  `
}).then(response => {
  const products = response.data.data.products;
  console.log(`Total: ${products.totalItems} products`);
  const withVariants = products.items.filter(p => p.variants?.length > 0);
  console.log(`With variants: ${withVariants.length}`);
  withVariants.forEach(p => {
    console.log(`  - ${p.name}: ${p.variants.length} variant(s)`);
    p.variants.forEach(v => console.log(`    • ${v.sku}: $${(v.price/100).toFixed(2)}`));
  });
}).catch(err => console.error(err.message));
