"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Clear cart after successful checkout
    localStorage.removeItem('adaptiv-cart');
  }, []);

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-8 py-6 border-b border-gray-200 mb-5 bg-white">
        <a href="/" className="hover:opacity-80 transition">
          <svg className="h-8 md:h-10 w-auto" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
            <g stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M10 30 L25 8 L40 30"/>
              <path d="M45 8 L60 30 L75 8"/>
            </g>
          </svg>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 lg:gap-8 text-sm font-medium text-gray-600">
          <a href="/quiz" className="hover:text-black transition">QUIZ</a>
          <a href="/start-from-scratch" className="hover:text-black transition">START FROM SCRATCH</a>
          <a href="/products" className="hover:text-black transition">PRODUCTS</a>
          <a href="/contact" className="hover:text-black transition">CONTACT</a>
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="bg-black text-white px-3 md:px-4 py-2 rounded font-semibold text-sm">
          <a href="/cart" className="text-white">CART</a>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-50 border-b border-gray-200 px-4 py-4">
          <nav className="flex flex-col gap-4 text-sm font-medium text-gray-600">
            <a href="/quiz" className="hover:text-black transition py-2">QUIZ</a>
            <a href="/start-from-scratch" className="hover:text-black transition py-2">START FROM SCRATCH</a>
            <a href="/products" className="hover:text-black transition py-2">PRODUCTS</a>
            <a href="/contact" className="hover:text-black transition py-2">CONTACT</a>
          </nav>
        </div>
      )}

      <main className="min-h-screen bg-gray-50 text-black px-6 py-12 font-sans">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-2">
              Thank you for your purchase. Your order has been successfully processed.
            </p>
            {sessionId && (
              <p className="text-sm text-gray-500">
                Order ID: {sessionId}
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
            <div className="text-left space-y-3 text-gray-600">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <p>You'll receive an order confirmation email shortly</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <p>Our team will begin preparing your custom supplement blend</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <p>You'll receive tracking information once your order ships</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link 
              href="/"
              className="block w-full bg-black text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:bg-gray-800 transition min-h-[44px]"
            >
              Return to Home
            </Link>
            <Link 
              href="/contact"
              className="block w-full bg-white text-black border-2 border-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition min-h-[44px]"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>
    </>
  );
} 