import { Client, cacheExchange, fetchExchange } from 'urql';

const VENDURE_SHOP_API_URL = process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL || 'http://localhost:3001/shop-api';

export const graphqlClient = new Client({
  url: VENDURE_SHOP_API_URL,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  },
});
