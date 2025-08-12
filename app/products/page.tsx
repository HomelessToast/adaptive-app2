"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-8 py-6 border-b border-gray-200 w-full bg-white text-black">
                       <Link href="/" className="text-xl md:text-2xl font-bold hover:opacity-80 transition">ADAPTIV</Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 lg:gap-8 text-sm font-medium text-gray-600">
          <Link href="/quiz" className="hover:text-black transition">QUIZ</Link>
          <Link href="/start-from-scratch" className="hover:text-black transition">START FROM SCRATCH</Link>
          <Link href="/products" className="hover:text-black transition">PRODUCTS</Link>
          <Link href="/contact" className="hover:text-black transition">CONTACT</Link>
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
          <Link href="/cart" className="text-white">CART</Link>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4">
          <nav className="flex flex-col gap-4 text-sm font-medium text-gray-600">
            <Link href="/quiz" className="hover:text-black transition py-2">QUIZ</Link>
            <Link href="/start-from-scratch" className="hover:text-black transition py-2">START FROM SCRATCH</Link>
            <Link href="/products" className="hover:text-black transition py-2">PRODUCTS</Link>
            <Link href="/contact" className="hover:text-black transition py-2">CONTACT</Link>
          </nav>
        </div>
      )}

      <main className="min-h-screen bg-white text-black font-sans px-4 md:px-6 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">Know what sport you&apos;re looking for?</h1>
        <h2 className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 text-center">Try one of our premade sport blends, made by the pros</h2>
        {/* Sport Blend Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
          {/* Row 1 */}
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-4 md:p-6 border border-blue-100 hover:shadow-2xl transition-all duration-200 h-48 md:h-64 flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-base md:text-lg mb-2">Bodybuilding Mix</h3>
            <p className="text-gray-600 text-xs md:text-sm">Maximum pump and performance.</p>
          </div>
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-4 md:p-6 border border-blue-100 hover:shadow-2xl transition-all duration-200 h-48 md:h-64 flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-base md:text-lg mb-2">Powerlifting Mix</h3>
            <p className="text-gray-600 text-xs md:text-sm">Elite focus and intensity.</p>
          </div>
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-4 md:p-6 border border-blue-100 hover:shadow-2xl transition-all duration-200 h-48 md:h-64 flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-base md:text-lg mb-2">Gym Bro Mix</h3>
            <p className="text-gray-600 text-xs md:text-sm">Maximize pump and intensity for every workout (excluding leg day)</p>
          </div>
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-4 md:p-6 border border-blue-100 hover:shadow-2xl transition-all duration-200 h-48 md:h-64 flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-base md:text-lg mb-2">Endurance Mix</h3>
            <p className="text-gray-600 text-xs md:text-sm">High in electrolytes with an endurance focus.</p>
          </div>
          {/* Row 2 */}
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-4 md:p-6 border border-blue-100 hover:shadow-2xl transition-all duration-200 h-48 md:h-64 flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-base md:text-lg mb-2">Dunker Mix</h3>
            <p className="text-gray-600 text-xs md:text-sm">High dose vertical power supplements.</p>
          </div>
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-4 md:p-6 border border-blue-100 hover:shadow-2xl transition-all duration-200 h-48 md:h-64 flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-base md:text-lg mb-2">Soccer Mix</h3>
            <p className="text-gray-600 text-xs md:text-sm">A mix of endurance, speed and power.</p>
          </div>
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-4 md:p-6 border border-blue-100 hover:shadow-2xl transition-all duration-200 h-48 md:h-64 flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-base md:text-lg mb-2">Yoga Mix</h3>
            <p className="text-gray-600 text-xs md:text-sm">Light focus, clean electrolytes, and energy.</p>
          </div>
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-4 md:p-6 border border-blue-100 hover:shadow-2xl transition-all duration-200 h-48 md:h-64 flex flex-col justify-center items-center text-center">
            <h3 className="font-bold text-base md:text-lg mb-2">HIIT Mix</h3>
            <p className="text-gray-600 text-xs md:text-sm">A moderate mix of power, endurance, and energy.</p>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-6 md:mt-8 text-xs md:text-sm">Yes, you can always change any aspect of the formula.</p>
      </main>
    </>
  );
} 