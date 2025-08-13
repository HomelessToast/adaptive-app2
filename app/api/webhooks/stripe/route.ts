import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFullIngredientName } from '../../../../lib/ingredient-abbreviations';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Payment successful for session:', session.id);
        console.log('Customer email:', session.customer_details?.email);
        console.log('Customer name:', session.customer_details?.name);
        console.log('Order total:', session.amount_total);
        
        // Extract ingredient details from metadata and success URL
        let ingredientDetails: any[] = [];
        
        // Try to get abbreviated summary from metadata
        if (session.metadata?.ingredient_summary) {
          console.log('Ingredient summary from metadata:', session.metadata.ingredient_summary);
          
          // Parse abbreviated summary (format: B1:Creatine:4800mg,Beta-Ala:3840mg|B2:...)
          try {
            const blendSummaries = session.metadata.ingredient_summary.split('|');
            ingredientDetails = blendSummaries.map((blendSummary, index) => {
              const [blendId, ...ingredients] = blendSummary.split(':');
              const blendIngredients = [];
              
              for (let i = 0; i < ingredients.length; i += 3) {
                if (ingredients[i + 1] && ingredients[i + 2]) {
                  blendIngredients.push({
                    name: getFullIngredientName(ingredients[i]),
                    amount: parseInt(ingredients[i + 1]),
                    unit: ingredients[i + 2]
                  });
                }
              }
              
              return {
                blend: index + 1,
                ingredients: blendIngredients,
                cost: 0 // We'll get this from the line items
              };
            });
          } catch (parseError) {
            console.error('Error parsing ingredient summary:', parseError);
          }
        }
        
        console.log('Parsed ingredient details:', ingredientDetails);
        
        // Send order confirmation emails
        try {
          console.log('Attempting to send order confirmation emails...');
          console.log('Base URL:', process.env.NEXT_PUBLIC_BASE_URL);
          
          const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderDetails: {
                id: session.id,
                amount: session.amount_total ? session.amount_total / 100 : 0,
              },
              customerEmail: session.customer_details?.email || 'unknown@email.com',
              customerName: session.customer_details?.name || 'Unknown Customer',
              orderTotal: session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : '$0.00',
              ingredientDetails: ingredientDetails,
              metadata: session.metadata
            }),
          });

          console.log('Email API response status:', emailResponse.status);
          
          if (emailResponse.ok) {
            const emailResult = await emailResponse.json();
            console.log('Order confirmation emails sent successfully:', emailResult);
            return NextResponse.json({ 
              received: true, 
              emailsSent: true,
              customerEmail: session.customer_details?.email,
              orderTotal: session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : '$0.00',
              hasIngredientDetails: ingredientDetails.length > 0,
              ingredientSummary: session.metadata?.ingredient_summary
            });
          } else {
            const errorText = await emailResponse.text();
            console.error('Failed to send order confirmation emails:', errorText);
            return NextResponse.json({ 
              received: true, 
              emailsSent: false,
              emailError: errorText
            });
          }
        } catch (emailError) {
          console.error('Error sending order confirmation emails:', emailError);
          return NextResponse.json({ 
            received: true, 
            emailsSent: false,
            emailError: emailError.message
          });
        }
        
        break;
      
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 