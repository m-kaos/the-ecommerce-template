# Stripe Payment Integration Setup

This guide will help you set up Stripe payment processing for your e-commerce storefront.

## Prerequisites

- A Stripe account (sign up at https://stripe.com)
- Access to your Stripe Dashboard

## Step 1: Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Click on "Developers" in the left sidebar
3. Click on "API keys"
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode)

## Step 2: Configure Environment Variables

1. Open the `.env.local` file in the `storefront` directory
2. Replace the placeholder values with your actual Stripe keys:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/shop-api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
```

**Important Security Notes:**
- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore`
- Never share your secret key publicly
- Use test keys (`pk_test_` and `sk_test_`) during development
- Use live keys (`pk_live_` and `sk_live_`) only in production

## Step 3: Test the Integration

### Using Test Cards

Stripe provides test card numbers that you can use during development:

**Successful Payment:**
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Payment Requires Authentication (3D Secure):**
- Card Number: `4000 0025 0000 3155`
- Follow the same format for other fields

**Declined Payment:**
- Card Number: `4000 0000 0000 9995`
- Follow the same format for other fields

### Testing the Checkout Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Add items to your cart
3. Proceed to checkout
4. Fill in shipping address
5. Select a shipping method
6. Enter a test card number on the payment page
7. Complete the payment

## Step 4: Monitor Payments in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click on "Payments" in the left sidebar
3. You'll see all test payments here
4. Click on any payment to see detailed information

## Step 5: Enable Additional Payment Methods (Optional)

Stripe supports multiple payment methods beyond credit cards:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click on "Settings" → "Payment methods"
3. Enable additional methods:
   - Apple Pay
   - Google Pay
   - Link
   - Afterpay/Clearpay
   - And more...

The integration automatically shows all enabled payment methods in the checkout form.

## Step 6: Going Live

When you're ready to accept real payments:

1. Complete Stripe account verification in the Dashboard
2. Switch to "Live mode" in the Stripe Dashboard (toggle in top right)
3. Get your live API keys from "Developers" → "API keys"
4. Update your production environment variables with live keys:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
   STRIPE_SECRET_KEY=sk_live_your_live_secret_key
   ```

## Webhook Setup (Optional but Recommended)

For production, set up webhooks to handle payment events:

1. Go to "Developers" → "Webhooks" in Stripe Dashboard
2. Click "Add endpoint"
3. Enter your endpoint URL: `https://yourdomain.com/api/stripe-webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret
6. Add it to your environment variables:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

## Troubleshooting

### "Stripe publishable key is not set" error
- Check that `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set in `.env.local`
- Restart your dev server after changing environment variables

### "No such PaymentIntent" error
- Ensure your secret key matches the publishable key (both test or both live)
- Check that the payment intent was created successfully

### Payment form doesn't appear
- Check browser console for errors
- Verify Stripe libraries are installed: `npm list @stripe/stripe-js @stripe/react-stripe-js`

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Payment Element](https://stripe.com/docs/payments/payment-element)
- [Stripe API Reference](https://stripe.com/docs/api)

## Support

For Stripe-specific issues, visit:
- [Stripe Support](https://support.stripe.com)
- [Stripe Community](https://support.stripe.com/community)
