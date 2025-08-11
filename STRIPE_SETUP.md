# Stripe Dynamic Pricing Setup Guide

This guide will help you set up Stripe Checkout with dynamic pricing for your supplement app.

## Prerequisites

1. A Stripe account (sign up at [stripe.com](https://stripe.com))
2. Your Next.js app running locally

## Step 1: Get Your Stripe API Keys

1. Log into your Stripe Dashboard
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
4. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

## Step 2: Set Up Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Base URL for your application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important:** Replace the placeholder values with your actual Stripe keys.

## Step 3: Set Up Stripe Webhooks (Optional but Recommended)

1. In your Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://your-domain.com/api/webhooks/stripe`
4. Select these events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret and add it to your `.env.local` file

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to your checkout page
3. Add items to your cart
4. Click "Proceed to Secure Checkout"
5. You should be redirected to Stripe's hosted checkout page

## How It Works

1. **User selects ingredients** on your frontend
2. **Frontend calculates total price** in real-time
3. **Checkout button calls your API** (`/api/create-checkout-session`)
4. **API creates Stripe Checkout Session** with the calculated price
5. **User gets redirected to Stripe Checkout** to complete payment
6. **After payment, user returns to success page** with order confirmation

## Security Features

- ✅ Server-side price calculation (prevents price manipulation)
- ✅ Stripe handles all payment data (PCI compliant)
- ✅ Webhook verification for payment confirmations
- ✅ Environment variables for sensitive data

## Customization Options

- **Product Images**: Update the image URL in `create-checkout-session/route.ts`
- **Success/Cancel URLs**: Modify the URLs in the checkout session creation
- **Product Description**: Customize the product name and description
- **Currency**: Change from USD to your preferred currency

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**: Check your `STRIPE_SECRET_KEY` in `.env.local`
2. **Webhook errors**: Verify your webhook endpoint URL and secret
3. **CORS issues**: Ensure your API routes are properly configured
4. **Price calculation errors**: Check that cart items have valid cost properties

### Testing:

- Use Stripe's test card numbers for testing:
  - **Success**: 4242 4242 4242 4242
  - **Decline**: 4000 0000 0000 0002
  - **Expiry**: Any future date
  - **CVC**: Any 3 digits

## Production Deployment

1. Switch to live Stripe keys (`sk_live_` and `pk_live_`)
2. Update `NEXT_PUBLIC_BASE_URL` to your production domain
3. Set up production webhooks
4. Test thoroughly with small amounts before going live

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) 