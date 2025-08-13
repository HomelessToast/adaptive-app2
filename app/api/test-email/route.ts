import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create transporter for Gmail
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function GET() {
  try {
    console.log('Testing email system...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);
    
    // Send a test email to you
    const testMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'gardnercmatthew@gmail.com',
      subject: 'Test Email - ADAPTIV Email System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Test Email Success!</h1>
          <p>If you're receiving this, your ADAPTIV email system is working correctly.</p>
          <p>Test sent at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    };

    await transporter.sendMail(testMailOptions);
    console.log('Test email sent successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      emailUser: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASSWORD
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email', 
        details: error.message,
        emailUser: process.env.EMAIL_USER,
        hasPassword: !!process.env.EMAIL_PASSWORD
      },
      { status: 500 }
    );
  }
}
