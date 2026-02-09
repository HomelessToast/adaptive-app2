import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

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
    const { sessionId, paymentIntentId } = await request.json();

    if (!sessionId && !paymentIntentId) {
      return NextResponse.json(
        { error: 'Either sessionId or paymentIntentId is required' },
        { status: 400 }
      );
    }

    let session: Stripe.Checkout.Session | null = null;

    // Try to retrieve by session ID first
    if (sessionId) {
      try {
        session = await stripe.checkout.sessions.retrieve(sessionId);
      } catch (error) {
        console.error('Error retrieving session:', error);
      }
    }

    // If no session found and we have payment intent ID, try to find the session
    if (!session && paymentIntentId) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        // Try to find the checkout session that created this payment intent
        // We'll need to search for sessions or use the metadata
        const sessions = await stripe.checkout.sessions.list({
          limit: 100,
        });
        session = sessions.data.find(s => s.payment_intent === paymentIntentId) || null;
      } catch (error) {
        console.error('Error retrieving payment intent:', error);
      }
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Could not find checkout session' },
        { status: 404 }
      );
    }

    console.log('Retrieved session:', session.id);
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
      line1: session.shipping_details?.address?.line1 || session.customer_details?.address?.line1 || '',
      line2: session.shipping_details?.address?.line2 || session.customer_details?.address?.line2 || '',
      city: session.shipping_details?.address?.city || session.customer_details?.address?.city || '',
      state: session.shipping_details?.address?.state || session.customer_details?.address?.state || '',
      postalCode: session.shipping_details?.address?.postal_code || session.customer_details?.address?.postal_code || '',
      country: session.shipping_details?.address?.country || session.customer_details?.address?.country || '',
      phone: session.shipping_details?.phone || session.customer_details?.phone || '',
    };

    // Email to manufacturing team
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'gardnercmatthew@gmail.com',
      subject: `[RECOVERED] New Order Received - ADAPTIV Manufacturing - ${session.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <h1 style="color: #000;">[RECOVERED ORDER] New Order Received - Manufacturing Required</h1>
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 2px solid #ffc107;">
            <p style="color: #856404; margin: 0; font-weight: bold;">⚠️ This order was recovered from Stripe and may have been missed previously.</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Customer Information:</h3>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Order Total:</strong> ${orderTotal}</p>
            <p><strong>Order ID:</strong> ${session.id}</p>
            <p><strong>Payment Intent:</strong> ${session.payment_intent || paymentIntentId || 'N/A'}</p>
            <p><strong>Order Date:</strong> ${new Date(session.created * 1000).toLocaleDateString()}</p>
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

    // Send manufacturing email
    console.log('Sending recovered manufacturing email to: gardnercmatthew@gmail.com');
    await transporter.sendMail(adminMailOptions);
    console.log('Recovered manufacturing email sent successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Order recovered and manufacturing email sent',
      sessionId: session.id,
      customerEmail: customerEmail,
      orderTotal: orderTotal,
      hasSupplementFacts: !!supplementFacts,
    });
  } catch (error: any) {
    console.error('Error recovering order:', error);
    return NextResponse.json(
      { error: 'Failed to recover order', details: error.message },
      { status: 500 }
    );
  }
}
