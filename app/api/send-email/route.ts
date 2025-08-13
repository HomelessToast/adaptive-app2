import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create transporter for Gmail (you'll need to set up app password)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASSWORD, // your Gmail app password
  },
});

export async function POST(request: NextRequest) {
  try {
    const { orderDetails, customerEmail, customerName, orderTotal } = await request.json();

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

    // Email to you (gardnercmatthew@gmail.com)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'gardnercmatthew@gmail.com',
      subject: 'New Order Received - ADAPTIV',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">New Order Received!</h1>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Order Total:</strong> $${orderTotal}</p>
            <p><strong>Order ID:</strong> ${orderDetails.id}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>Please process this order and update inventory accordingly.</p>
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
