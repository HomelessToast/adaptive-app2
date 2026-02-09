import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
        
        // Send order confirmation emails directly
        try {
          console.log('Attempting to send order confirmation emails...');
          
          const customerEmail = session.customer_details?.email || 'unknown@email.com';
          const customerName = session.customer_details?.name || 'Unknown Customer';
          const orderTotal = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : '$0.00';
          const discountCodeUsed = session.metadata?.discount_code || '';
          const discountPercent = session.metadata?.discount_percent || '0';
          const discountPercentDisplay = isNaN(Number(discountPercent))
            ? 'Special (1¢ test)'
            : `${discountPercent}%`;
          const totalBeforeDiscount = session.metadata?.total_cost_before_discount || '';

          // Format supplement facts
          const formatSupplementFacts = (facts: any) => {
            if (!facts) {
              return '<p><em>Supplement facts data not available</em></p>';
            }

            let html = '<div style="margin: 20px 0;">';
            
            if (facts.servingSize || facts.servingsPerContainer || facts.flavor) {
              html += `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                  <h4 style="margin: 0 0 10px 0; color: #333;">Product Specifications</h4>
                  ${facts.servingSize ? `<p><strong>Serving Size:</strong> ${facts.servingSize}</p>` : ''}
                  ${facts.servingsPerContainer ? `<p><strong>Servings Per Container:</strong> ${facts.servingsPerContainer}</p>` : ''}
                  ${facts.flavor ? `<p><strong>Flavor:</strong> <span style="color: #2563eb; font-weight: 600;">${facts.flavor}</span></p>` : ''}
                </div>
              `;
            }

            if (facts.categories) {
              Object.entries(facts.categories).forEach(([categoryName, ingredients]: [string, any]) => {
                if (ingredients && ingredients.length > 0) {
                  html += `
                    <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                      <h4 style="margin: 0 0 15px 0; color: #333; text-transform: capitalize;">${categoryName}</h4>
                      <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                          <tr style="background: #f8f9fa;">
                            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Ingredient</th>
                            <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Amount Per Serving</th>
                            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Unit</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${ingredients.map((ing: any) => `
                            <tr>
                              <td style="padding: 8px; border-bottom: 1px solid #eee;">${ing.name || 'N/A'}</td>
                              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${ing.amount || '0'}</td>
                              <td style="padding: 8px; border-bottom: 1px solid #eee;">${ing.unit || 'mg'}</td>
                            </tr>
                            ${ing.subIngredients ? ing.subIngredients.map((sub: any) => `
                              <tr style="background: #fafafa;">
                                <td style="padding: 8px 8px 8px 20px; border-bottom: 1px solid #eee; color: #666;">└ ${sub.name}</td>
                                <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${sub.amount || '0'}</td>
                                <td style="padding: 8px; border-bottom: 1px solid #eee;">${sub.unit || 'mg'}</td>
                              </tr>
                            `).join('') : ''}
                          `).join('')}
                        </tbody>
                      </table>
                    </div>
                  `;
                }
              });
            }

            if (!facts.categories && facts.ingredients) {
              html += `
                <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                  <h4 style="margin: 0 0 15px 0; color: #333;">Ingredients</h4>
                  <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                      <tr style="background: #f8f9fa;">
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Ingredient</th>
                        <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Amount</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${facts.ingredients.map((ing: any) => `
                        <tr>
                          <td style="padding: 8px; border-bottom: 1px solid #eee;">${ing.name || 'N/A'}</td>
                          <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${ing.amount || '0'}</td>
                          <td style="padding: 8px; border-bottom: 1px solid #eee;">${ing.unit || 'mg'}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              `;
            }

            html += '</div>';
            return html;
          };

          const formatAddress = (addr: any) => {
            if (!addr) return '<em>No shipping address provided</em>';
            const parts = [
              addr.name,
              addr.line1,
              addr.line2,
              [addr.city, addr.state, addr.postalCode].filter(Boolean).join(', '),
              addr.country
            ].filter(Boolean);
            const phone = addr.phone ? `<br/><strong>Phone:</strong> ${addr.phone}` : '';
            return `${parts.join('<br/>')}${phone}`;
          };

          const shippingAddress = {
            name: session.customer_details?.name || '',
            line1: session.customer_details?.address?.line1 || '',
            line2: session.customer_details?.address?.line2 || '',
            city: session.customer_details?.address?.city || '',
            state: session.customer_details?.address?.state || '',
            postalCode: session.customer_details?.address?.postal_code || '',
            country: session.customer_details?.address?.country || '',
            phone: session.customer_details?.phone || '',
          };

          // Email to customer
          const customerMailOptions = {
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: 'Order Confirmation - ADAPTIV',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #000; text-align: center;">Thank you for your order!</h1>
                <p>Hi ${customerName},</p>
                <p>Your order has been confirmed and is being processed.</p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3>Order Details:</h3>
                  <p><strong>Order Total:</strong> ${orderTotal}</p>
                  <p><strong>Order ID:</strong> ${session.id}</p>
                </div>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3>Shipping To:</h3>
                  <p>${formatAddress(shippingAddress)}</p>
                </div>
                <p>We'll send you tracking information once your order ships.</p>
                <p>Best regards,<br>The ADAPTIV Team</p>
              </div>
            `,
          };

          // Email to manufacturing team
          const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: 'gardnercmatthew@gmail.com',
            subject: 'New Order Received - ADAPTIV Manufacturing',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #000;">New Order Received - Manufacturing Required</h1>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3>Customer Information:</h3>
                  <p><strong>Customer:</strong> ${customerName}</p>
                  <p><strong>Email:</strong> ${customerEmail}</p>
                  <p><strong>Order Total:</strong> ${orderTotal}</p>
                  <p><strong>Order ID:</strong> ${session.id}</p>
                  <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>

                <div style="background: #e7f5ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bee3ff;">
                  <h3 style="margin-top: 0;">Ship To:</h3>
                  <p>${formatAddress(shippingAddress)}</p>
                </div>

                <div style="background: #eef6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #cfe2ff;">
                  <h3 style="color: #084298; margin-top: 0;">Discount Information</h3>
                  <p><strong>Discount Code Used:</strong> ${discountCodeUsed || 'None'}</p>
                  <p><strong>Discount Percent:</strong> ${discountCodeUsed ? discountPercentDisplay : '0%'}</p>
                  ${totalBeforeDiscount ? `<p><strong>Subtotal Before Discount:</strong> $${Number(totalBeforeDiscount).toFixed(2)}</p>` : ''}
                </div>

                <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
                  <h3 style="color: #856404; margin-top: 0;">Manufacturing Instructions:</h3>
                  <p style="color: #856404; margin-bottom: 0;"><strong>Please build this custom blend according to the supplement facts below:</strong></p>
                </div>

                <div style="margin: 20px 0;">
                  <h3>Supplement Facts - Manufacturing Specifications:</h3>
                  ${formatSupplementFacts(supplementFacts)}
                </div>

                <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #c3e6cb;">
                  <p style="color: #155724; margin: 0;"><strong>Action Required:</strong> Please process this order and update inventory accordingly.</p>
                </div>
              </div>
            `,
          };

          // Send both emails
          console.log('Sending customer email to:', customerEmail);
          await transporter.sendMail(customerMailOptions);
          console.log('Customer email sent successfully');

          console.log('Sending manufacturing email to: gardnercmatthew@gmail.com');
          await transporter.sendMail(adminMailOptions);
          console.log('Manufacturing email sent successfully');

          console.log('Order confirmation emails sent successfully');
          return NextResponse.json({ 
            received: true, 
            emailsSent: true,
            customerEmail: customerEmail,
            orderTotal: orderTotal,
            hasSupplementFacts: !!supplementFacts,
          });
        } catch (emailError: any) {
          console.error('CRITICAL ERROR: Failed to send order confirmation emails:', emailError);
          console.error('Error details:', {
            message: emailError.message,
            stack: emailError.stack,
            sessionId: session.id,
            customerEmail: session.customer_details?.email,
          });
          // Still return success to Stripe to avoid webhook retries, but log the error
          return NextResponse.json({ 
            received: true, 
            emailsSent: false,
            emailError: emailError.message,
            warning: 'Emails failed but webhook processed successfully'
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