import { NextRequest, NextResponse } from 'next/server';
import { abbreviateIngredient } from '../../lib/ingredient-abbreviations';

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

    const { cartItems } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate total cost
    const totalCost = cartItems.reduce((total: number, item: CartItem) => total + item.cost, 0);

    // Create line items for Stripe
    const lineItems = cartItems.map((item: CartItem) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Custom Pre Workout',
          description: '30 servings of your personalized supplement blend',
        },
        unit_amount: Math.round(item.cost * 100), // Convert to cents
      },
      quantity: 1,
    }));

    // Create abbreviated ingredient summary for metadata (staying under 500 chars)
    const abbreviatedSummary = cartItems.map((item, index) => {
      const ingredientList = item.ingredients.map(ing => 
        `${abbreviateIngredient(ing.name)}:${ing.amount}${ing.unit}`
      ).join(',');
      return `B${index + 1}:${ingredientList}`;
    }).join('|');

    // Store essential metadata in Stripe (under 500 chars)
    const metadata = {
      total_cost: totalCost.toString(),
      item_count: cartItems.length.toString(),
      has_custom_ingredients: 'true',
      order_type: 'custom_blend',
      ingredient_summary: abbreviatedSummary.substring(0, 200) // Limit to 200 chars to be safe
    };

    // Create Stripe Checkout Session with ingredient data in success URL
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}&ingredients=${encodeURIComponent(JSON.stringify(cartItems))}`,
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