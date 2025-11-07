# Stripe Integration Setup Guide

## Overview

This ecommerce template integrates Stripe for secure payment processing. Follow this guide to set up Stripe for your store.

## Prerequisites

- Stripe account (create one at https://stripe.com)
- Docker and Docker Compose installed
- Node.js 22+ installed locally for development

## Step 1: Get Your Stripe API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Copy your **Secret key** (starts with `sk_test_` for test mode)

⚠️ **Security Note**: NEVER commit your secret key to version control!

## Step 2: Configure Environment Variables

1. Navigate to the storefront directory:
   ```bash
   cd storefront
   ```

2. Create a `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

3. Edit `.env.local` and add your Stripe keys:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
   ```

## Step 3: Rebuild Docker Containers

The Stripe packages have been added to `package.json`. Rebuild your containers to install them:

```bash
# From the root directory
docker-compose down
docker-compose build
docker-compose up -d
```

Wait for all services to start (about 30-60 seconds).

## Step 4: Test the Integration

1. Navigate to your storefront: http://localhost:3000
2. Add products to your cart
3. Proceed to checkout
4. Fill in shipping information
5. On the payment page, use Stripe's test card numbers:

### Test Card Numbers

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Card Declined:**
- Card: `4000 0000 0000 0002`

**Insufficient Funds:**
- Card: `4000 0000 0000 9995`

**3D Secure Required:**
- Card: `4000 0025 0000 3155`

More test cards: https://stripe.com/docs/testing

## Architecture

### Payment Flow

1. **Customer adds items to cart** → Local state + Vendure order created
2. **Shipping method selected** → Creates Stripe Payment Intent via API route
3. **Customer enters payment** → Stripe Elements (secure iframe)
4. **Payment confirmed** → Stripe processes payment
5. **Order completed** → Payment added to Vendure order
6. **Success page** → Order confirmation

### Files Modified/Created

#### New Files:
- `storefront/lib/stripe.ts` - Stripe.js client initialization
- `storefront/app/api/create-payment-intent/route.ts` - Payment Intent API
- `storefront/components/StripePaymentForm.tsx` - Payment form component

#### Modified Files:
- `storefront/app/checkout/page.tsx` - Integrated Stripe checkout
- `storefront/package.json` - Added Stripe dependencies

### Security Features

✅ **PCI Compliance**: Stripe Elements ensures card data never touches your server
✅ **Network-only queries**: Prevents stale order data from cache
✅ **State management**: Robust order state transitions
✅ **Error handling**: Comprehensive error messages and recovery
✅ **Loading states**: Prevents duplicate payments

## Troubleshooting

### "Payment Intent creation failed"
- Check that `STRIPE_SECRET_KEY` is set in `.env.local`
- Verify the key starts with `sk_test_` or `sk_live_`
- Check API route logs in terminal

### "Stripe has not loaded yet"
- Check that `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Verify the key starts with `pk_test_` or `pk_live_`
- Check browser console for errors

### "No active order found"
- Clear browser cookies
- Restart from cart page
- Check Vendure backend is running: `docker ps`

### Auth loop issues
- Clear browser cache and cookies
- Delete `.next` folder and restart: `rm -rf .next && npm run dev`
- Check Docker logs: `docker-compose logs storefront`

## Going Live

Before deploying to production:

1. **Switch to live keys**:
   - Get live keys from https://dashboard.stripe.com/apikeys
   - Update environment variables in production
   - Keys start with `pk_live_` and `sk_live_`

2. **Enable payment methods**:
   - Configure payment methods in Stripe Dashboard
   - Enable Apple Pay/Google Pay if desired
   - Set up webhooks for order updates

3. **Test thoroughly**:
   - Test with real cards in live mode
   - Verify order completion in Vendure admin
   - Check email notifications work

4. **Monitor**:
   - Set up Stripe webhook monitoring
   - Enable Stripe Radar for fraud detection
   - Monitor failed payments in dashboard

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Vendure Payment Documentation](https://docs.vendure.io/guides/core-concepts/payment/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## Support

If you encounter issues:
1. Check Docker container logs: `docker-compose logs`
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Ensure backend data is properly configured (zones, shipping, tax)
