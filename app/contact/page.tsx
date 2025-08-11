"use client";

import { useState } from "react";

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-8 py-6 border-b border-gray-200 w-full bg-white text-black">
        <a href="/" className="text-xl md:text-2xl font-bold hover:opacity-80 transition">ADAPTIV</a>
        
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
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4">
          <nav className="flex flex-col gap-4 text-sm font-medium text-gray-600">
            <a href="/quiz" className="hover:text-black transition py-2">QUIZ</a>
            <a href="/start-from-scratch" className="hover:text-black transition py-2">START FROM SCRATCH</a>
            <a href="/products" className="hover:text-black transition py-2">PRODUCTS</a>
            <a href="/contact" className="hover:text-black transition py-2">CONTACT</a>
          </nav>
        </div>
      )}

      {/* Contact Form Content */}
      <main className="min-h-screen bg-white text-black font-sans px-4 md:px-6 py-8 md:py-12 flex flex-col items-center text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-xl">
          Have a question, or recommending a new ingredient? Reach out to us anytime.
        </p>

        <form className="flex flex-col w-full max-w-md gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 border border-gray-300 rounded min-h-[44px]"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-3 border border-gray-300 rounded min-h-[44px]"
          />
          <textarea
            placeholder="Your Message"
            className="p-3 border border-gray-300 rounded h-32"
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition min-h-[44px]"
          >
            Send Message
          </button>
        </form>
      </main>
    </>
  );
}