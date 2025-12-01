import { NextRequest, NextResponse } from 'next/server';

// Only import Stripe if we have the required environment variables
let stripe: any = null;
if (process.env.STRIPE_SECRET_KEY) {
  try {
    const Stripe = require('stripe');
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    });
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
  }
}

interface CartItem {
  ingredients: Array<{
    name: string;
    amount?: number;
    unit?: string;
    subIngredients?: Array<{
      name: string;
      amount?: number;
      unit?: string;
    }>;
  }>;
  cost: number;
}

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const { cartItems, supplementFacts, discountCode } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate total cost
    const totalCost = cartItems.reduce((total: number, item: CartItem) => total + item.cost, 0);

    // Validate discount code (case-insensitive) and determine percent
    const normalizedCode = typeof discountCode === 'string' ? discountCode.trim().toUpperCase() : '';
    const tenPercentCodes = new Set(['TRAVIS', 'HYRUM', 'MASON', 'ZARA', 'DYLAN', 'KYLE', 'AMBROSE', 'FINN']);
    const fortyPercentCodes = new Set(['ATCOST$40']);

    const discountPercent = fortyPercentCodes.has(normalizedCode)
      ? 40
      : (tenPercentCodes.has(normalizedCode) ? 10 : 0);
    const isDiscountValid = discountPercent > 0;
    const discountMultiplier = (100 - discountPercent) / 100;

    // Create line items for Stripe
    const lineItems = cartItems.map((item: CartItem) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Custom Pre Workout',
          description: '30 servings of your personalized supplement blend',
        },
        unit_amount: Math.round(item.cost * 100 * discountMultiplier), // Convert to cents with discount if applicable
      },
      quantity: 1,
    }));

    // Store minimal metadata in Stripe (under 500 chars)
    const discountedTotal = +(totalCost * discountMultiplier).toFixed(2);

    const metadata = {
      total_cost: discountedTotal.toString(),
      total_cost_before_discount: totalCost.toString(),
      item_count: cartItems.length.toString(),
      has_custom_ingredients: 'true',
      order_type: 'custom_blend',
      discount_code: isDiscountValid ? normalizedCode : '',
      discount_percent: isDiscountValid ? String(discountPercent) : '0'
    };

    // Create Stripe Checkout Session with complete supplement facts data in success URL
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}&supplement_facts=${encodeURIComponent(JSON.stringify(supplementFacts))}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
      metadata: metadata,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 