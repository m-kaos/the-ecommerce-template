import { gql } from 'urql';

export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    order(id: $id) {
      id
      code
      state
      orderPlacedAt
      totalWithTax
      shippingWithTax
      subTotalWithTax
      currencyCode
      shippingAddress {
        fullName
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        phoneNumber
      }
      lines {
        id
        quantity
        linePriceWithTax
        productVariant {
          id
          name
          sku
          priceWithTax
          product {
            name
            featuredAsset {
              preview
            }
          }
        }
      }
      shippingLines {
        shippingMethod {
          name
          description
        }
        priceWithTax
      }
    }
  }
`;

export const GET_ACTIVE_CUSTOMER_ORDERS = gql`
  query GetActiveCustomerOrders($options: OrderListOptions) {
    activeCustomer {
      id
      orders(options: $options) {
        items {
          id
          code
          state
          orderPlacedAt
          totalWithTax
          currencyCode
          lines {
            id
            quantity
            productVariant {
              id
              name
              product {
                name
                featuredAsset {
                  preview
                }
              }
            }
          }
        }
        totalItems
      }
    }
  }
`;
