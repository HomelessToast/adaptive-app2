import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

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
        
        // Extract supplement facts data from success URL
        let supplementFacts: any = null;
        
        if (session.success_url) {
          try {
            const url = new URL(session.success_url);
            const supplementFactsParam = url.searchParams.get('supplement_facts');
            if (supplementFactsParam) {
              supplementFacts = JSON.parse(decodeURIComponent(supplementFactsParam));
              console.log('Extracted supplement facts from URL:', supplementFacts);
            }
          } catch (parseError) {
            console.error('Error parsing supplement facts from URL:', parseError);
          }
        }
        
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
              supplementFacts: supplementFacts,
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
              hasSupplementFacts: !!supplementFacts,
              supplementFactsData: supplementFacts
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
        } catch (emailError: any) {
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