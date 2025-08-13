import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create transporter for Gmail (you'll need to set up app password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASSWORD, // your Gmail app password
  },
});

export async function POST(request: NextRequest) {
  try {
    const { orderDetails, customerEmail, customerName, orderTotal, supplementFacts } = await request.json();

    // Format supplement facts for manufacturing email
    const formatSupplementFacts = (facts: any) => {
      if (!facts) {
        return '<p><em>Supplement facts data not available</em></p>';
      }

      let html = '<div style="margin: 20px 0;">';
      
      // Add serving information if available
      if (facts.servingSize || facts.servingsPerContainer) {
        html += `
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #333;">Serving Information</h4>
            ${facts.servingSize ? `<p><strong>Serving Size:</strong> ${facts.servingSize}</p>` : ''}
            ${facts.servingsPerContainer ? `<p><strong>Servings Per Container:</strong> ${facts.servingsPerContainer}</p>` : ''}
          </div>
        `;
      }

      // Format ingredients by category
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

      // Fallback for old format if categories don't exist
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
            <p><strong>Order Total:</strong> $${orderTotal}</p>
            <p><strong>Order ID:</strong> ${orderDetails.id}</p>
          </div>
          <p>We'll send you tracking information once your order ships.</p>
          <p>Best regards,<br>The ADAPTIV Team</p>
        </div>
      `,
    };

    // Email to manufacturing team (you)
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
            <p><strong>Order Total:</strong> $${orderTotal}</p>
            <p><strong>Order ID:</strong> ${orderDetails.id}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
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
    await transporter.sendMail(customerMailOptions);
    await transporter.sendMail(adminMailOptions);

    return NextResponse.json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}
