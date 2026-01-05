import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create transporter for Gmail (using same config as order emails)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASSWORD, // your Gmail app password
  },
});

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Email to admin (you)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'gardnercmatthew@gmail.com',
      subject: `Contact Form Submission from ${name} - ADAPTIV`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <h1 style="color: #000;">New Contact Form Submission</h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Information:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background: #e7f5ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bee3ff;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">This message was sent from the ADAPTIV contact form.</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(adminMailOptions);

    // Optional: Send confirmation email to the customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting ADAPTIV',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Thank you for reaching out!</h1>
          <p>Hi ${name},</p>
          <p>We've received your message and will get back to you within 24 hours.</p>
          <p>If you have any urgent questions, feel free to reach out directly at hello@adaptiv.com</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">Best regards,<br>The ADAPTIV Team</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(customerMailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Your message has been sent successfully!' 
    });
  } catch (error: any) {
    console.error('Error sending contact form email:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

