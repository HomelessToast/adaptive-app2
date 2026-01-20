// app/contact/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <header className="bg-white border-b-8 border-black p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <Link href="/" className="hover:opacity-80 transition">
            <svg className="h-10 w-auto" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
              <g stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M10 30 L25 8 L40 30"/>
                <path d="M45 8 L60 30 L75 8"/>
              </g>
            </svg>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <Link href="/quiz" className="hover:text-black transition">QUIZ</Link>
            <Link href="/start-from-scratch" className="hover:text-black transition">START FROM SCRATCH</Link>
            <Link href="/products" className="hover:text-black transition">PRODUCTS</Link>
            <Link href="/contact" className="text-black font-semibold">CONTACT</Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 border border-gray-300 rounded"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="bg-black text-white px-4 py-2 rounded font-semibold text-sm">
            <Link href="/cart" className="text-white">CART</Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4">
          <nav className="flex flex-col gap-4 text-sm font-medium text-gray-600">
            <Link href="/quiz" className="hover:text-black transition py-2">QUIZ</Link>
            <Link href="/start-from-scratch" className="hover:text-black transition py-2">START FROM SCRATCH</Link>
            <Link href="/products" className="hover:text-black transition py-2">PRODUCTS</Link>
            <Link href="/contact" className="text-black font-semibold py-2">CONTACT</Link>
          </nav>
        </div>
      )}

      {/* Contact Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Have a question? Want to be an affiliate? Contact us anytime, our new dedicated support team will respond within 24 hours
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 border">
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
            <form 
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                setSubmitStatus({ type: null, message: '' });

                try {
                  const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, message }),
                  });

                  const data = await response.json();

                  if (response.ok) {
                    setSubmitStatus({ type: 'success', message: data.message || 'Your message has been sent successfully!' });
                    setName('');
                    setEmail('');
                    setMessage('');
                  } else {
                    setSubmitStatus({ type: 'error', message: data.error || 'Failed to send message. Please try again.' });
                  }
                } catch (error) {
                  setSubmitStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  placeholder="Tell us what's on your mind..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
              {submitStatus.type && (
                <div className={`p-4 rounded-lg ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <p className="text-sm font-medium">{submitStatus.message}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8 border">
              <h3 className="text-xl font-semibold mb-4">Get in touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">hello@adaptiv.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Response Time</p>
                    <p className="text-gray-600">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 border">
              <h3 className="text-xl font-semibold mb-4">Common Questions</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• How do I customize my pre-workout?</p>
                <p>• What ingredients are available?</p>
                <p>• How is dosing calculated?</p>
                <p>• Shipping and delivery information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20 p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="hover:opacity-80 transition">
            <svg className="h-8 w-auto" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
              <g stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M10 30 L25 8 L40 30"/>
                <path d="M45 8 L60 30 L75 8"/>
              </g>
            </svg>
          </Link>
          <nav className="flex flex-wrap gap-4 md:gap-8 text-sm font-medium text-gray-600 justify-center">
            <Link href="/quiz" className="hover:text-black transition">QUIZ</Link>
            <Link href="/start-from-scratch" className="hover:text-black transition">START FROM SCRATCH</Link>
            <Link href="/products" className="hover:text-black transition">PRODUCTS</Link>
            <Link href="/contact" className="hover:text-black transition">CONTACT</Link>
          </nav>
          <div className="bg-black text-white px-4 py-2 rounded font-semibold text-sm">
            <Link href="/cart" className="text-white">CART</Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 