"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import ImageSlider from "../components/ImageSlider";

export default function Home() {
  const [currentWord, setCurrentWord] = useState("Athletes");
  const [index, setIndex] = useState(0);
  const [finalWord, setFinalWord] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rotatingWords = useMemo(() => ["Sprinters", "Swimmers", "Bodybuilders", "Cyclists", "Lifters", "You"], []);

  const textRef = useRef<HTMLHeadingElement | null>(null);

  // Mouse proximity logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!textRef.current || triggered) return;

      const rect = textRef.current.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const distance = Math.sqrt(
        Math.pow(mouseX - (rect.left + rect.width / 2), 2) +
        Math.pow(mouseY - (rect.top + rect.height / 2), 2)
      );

      if (distance < 500) {
        setTriggered(true);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [triggered]);

  // Word rotation logic
  useEffect(() => {
    if (!triggered || finalWord) return;

    const interval = setInterval(() => {
      if (index < rotatingWords.length - 1) {
        setCurrentWord(rotatingWords[index]);
        setIndex((prev) => prev + 1);
      } else {
        setCurrentWord("You");
        setFinalWord(true);
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [triggered, index, finalWord, rotatingWords]);

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-8 py-6 border-b-8 border-black mb-5 bg-white">
        <Link href="/" className="hover:opacity-80 transition">
          <svg className="h-8 md:h-10 w-auto" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
            <g stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M10 30 L25 8 L40 30"/>
              <path d="M45 8 L60 30 L75 8"/>
            </g>
          </svg>
        </Link>
        
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
        <div className="md:hidden bg-gray-50 border-b border-gray-200 px-4 py-4">
          <nav className="flex flex-col gap-4 text-sm font-medium text-gray-600">
            <Link href="/quiz" className="hover:text-black transition py-2">QUIZ</Link>
            <Link href="/start-from-scratch" className="hover:text-black transition py-2">START FROM SCRATCH</Link>
            <Link href="/products" className="hover:text-black transition py-2">PRODUCTS</Link>
            <Link href="/contact" className="hover:text-black transition py-2">CONTACT</Link>
          </nav>
        </div>
      )}

{/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between min-h-[80vh] px-4 md:px-6 mt-2">
        <div className="w-full md:w-1/2 md:ml-24 flex flex-col items-center justify-start text-center pt-0 -mt-16">
          <div className="max-w-7xl w-full">
            <h1
              ref={textRef}
              className="text-4xl md:text-5xl lg:text-6xl font-light mb-3 leading-tight text-center"
              style={{ perspective: "1000px" }}
            >
              Create completely custom pre-workout for{" "}
              <span
                key={currentWord}
                className="font-bold animate-spinY inline-block text-center"
                style={{ display: "inline-block", minWidth: "11ch" }}
              >
                {currentWord}.
              </span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg mb-6 px-4">
              ADAPTIV lets you create a completely custom blend for any sport, activity, or intensity.
            </p>
            <a
              href="/quiz"
              className="bg-black text-white px-6 py-4 md:py-3 rounded-full text-base md:text-lg hover:bg-gray-800 transition inline-block min-h-[44px] flex items-center justify-center"
            >
              Start Your Quiz
            </a>
          </div>
        </div>
        {/* Right: ImageSlider */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end pr-0 md:pr-14 mt-8 md:mt-0">
          <div className="w-full max-w-[500px] px-4 md:px-0">
            <ImageSlider />
          </div>
        </div>
      </section>
      
      {/* Divider */}
<div className="flex items-center justify-center my-20">
  <hr className="flex-grow border-gray-300" />
  <span className="px-4 text-sm text-gray-400 uppercase tracking-widest">Control your workout</span>
  <hr className="flex-grow border-gray-300" />
</div>
      
      {/* Image Section */}
      <section className="flex flex-col md:flex-row items-center justify-start mt-20 px-4 md:px-6 gap-8 md:gap-12">
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <img
            src="/Bottles%20Picture.png"
            alt="ADAPTIV Powder Bottles"
            className="w-full max-w-[900px] object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="text-gray-700 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-md text-center px-4">
    <p>
      Every scoop of <span className="font-semibold">ADAPTIV</span> is built for you. A male
      bodybuilder has different needs than a female basketball player. So why would either take a
      generic preworkout?
    </p>
            <p className="mt-8 md:mt-12">
      We let you pick every aspect of your custom blend, and our products are
      dosed based on your weight, tolerance, and performance goals. No fillers, no fluff. Just clean,
      research-backed ingredients tailored for <span className="font-semibold">you</span>.
    </p>
            <div className="mt-8 md:mt-12 text-center">
              <a
                href="/start-from-scratch"
                className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition inline-block"
              >
                Build your custom formula NOW
              </a>
            </div>
  </div>
</div>
      </section>
      
    {/* Divider */}
<div className="flex items-center justify-center my-20">
  <hr className="flex-grow border-gray-300" />
  <span className="px-4 text-sm text-gray-400 uppercase tracking-widest">Fuel Performance</span>
  <hr className="flex-grow border-gray-300" />
</div>
      
      {/* Benefits Section */}
      <section className="mt-24 px-4 md:px-6 text-center">
        <h2 className="text-base md:text-lg font-semibold text-blue-600 tracking-wide uppercase mb-2">
          The only
        </h2>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-black">completely custom</span> pre-workout for athletes
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-sm md:text-base">
          Your formula, your goals. Choose ingredients and exact dosages that are based on your sport,
          schedule, and experience level — built just for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 md:p-8 flex flex-col items-center border border-blue-100 hover:shadow-2xl transition-all duration-200 relative">
            {/* Tooltip Icon */}
            <div className="absolute top-4 right-4 group">
              <button type="button" tabIndex={0} className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <text x="12" y="16" textAnchor="middle" fontSize="13" fill="currentColor" fontFamily="Arial">?</text>
                </svg>
              </button>
              <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity absolute z-10 right-0 mt-2 w-48 bg-gray-800 text-white text-xs rounded-lg shadow-lg p-3 text-left">
                Placeholder tooltip text for this benefit.
              </div>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-blue-50 mb-4 md:mb-5">
              <svg width="24" height="24" className="md:w-8 md:h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg md:text-xl mb-2 text-gray-900">Tailored to Your Sport</h3>
            <p className="text-sm md:text-base text-gray-500">
              From endurance to strength, get exactly what your performance demands.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 md:p-8 flex flex-col items-center border border-blue-100 hover:shadow-2xl transition-all duration-200 relative">
            {/* Tooltip Icon */}
            <div className="absolute top-4 right-4 group">
              <button type="button" tabIndex={0} className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <text x="12" y="16" textAnchor="middle" fontSize="13" fill="currentColor" fontFamily="Arial">?</text>
                </svg>
              </button>
              <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity absolute z-10 right-0 mt-2 w-48 bg-gray-800 text-white text-xs rounded-lg shadow-lg p-3 text-left">
                Placeholder tooltip text for this benefit.
              </div>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-blue-50 mb-4 md:mb-5">
              <svg width="24" height="24" className="md:w-8 md:h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg md:text-xl mb-2 text-gray-900">Clinically Backed Ingredients</h3>
            <p className="text-sm md:text-base text-gray-500">
              No fluff. Every compound has a reason to be there.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 md:p-8 flex flex-col items-center border border-blue-100 hover:shadow-2xl transition-all duration-200 relative">
            {/* Tooltip Icon */}
            <div className="absolute top-4 right-4 group">
              <button type="button" tabIndex={0} className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <text x="12" y="16" textAnchor="middle" fontSize="13" fill="currentColor" fontFamily="Arial">?</text>
                </svg>
              </button>
              <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity absolute z-10 right-0 mt-2 w-48 bg-gray-800 text-white text-xs rounded-lg shadow-lg p-3 text-left">
                Placeholder tooltip text for this benefit.
              </div>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-blue-50 mb-4 md:mb-5">
              <svg width="24" height="24" className="md:w-8 md:h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg md:text-xl mb-2 text-gray-900">Precision Dosed</h3>
            <p className="text-sm md:text-base text-gray-500">
              Based on your weight, time of day, and caffeine preference.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Buttons */}
      <section className="text-center py-16 md:py-20 px-4 md:px-6 bg-gray-100 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <Link href="/products" className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 md:p-8 flex flex-col items-center border border-blue-100 hover:shadow-2xl transition-all duration-200 min-h-[44px]">
            <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-blue-50 mb-4 md:mb-5">
              <svg width="24" height="24" className="md:w-8 md:h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h2" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h4 className="font-bold text-lg md:text-xl mb-2 text-gray-900">Help me choose based off my sport</h4>
            <p className="text-sm md:text-base text-gray-600">We&apos;ll guide you to the right ingredients based on your activity type.</p>
          </Link>
          {/* Card 2 */}
          <Link href="/quiz" className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 md:p-8 flex flex-col items-center border border-blue-100 hover:shadow-2xl transition-all duration-200 min-h-[44px]">
            <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-blue-50 mb-4 md:mb-5">
              <svg width="24" height="24" className="md:w-8 md:h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8M8 16h8M8 8h8" />
              </svg>
            </div>
            <h4 className="font-bold text-lg md:text-xl mb-2 text-gray-900">Take a quiz to create your custom blend</h4>
            <p className="text-sm md:text-base text-gray-600">Answer a few quick questions and we&apos;ll build your perfect formula.</p>
          </Link>
          {/* Card 3 */}
          <Link href="/start-from-scratch" className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 md:p-8 flex flex-col items-center border border-blue-100 hover:shadow-2xl transition-all duration-200 min-h-[44px]">
            <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-blue-50 mb-4 md:mb-5">
              <svg width="24" height="24" className="md:w-8 md:h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h4 className="font-bold text-lg md:text-xl mb-2 text-gray-900">I want to start from scratch</h4>
            <p className="text-sm md:text-base text-gray-600">Pick and choose every ingredient yourself and build it your way.</p>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-6 border-t border-gray-200 mt-20 gap-4 md:gap-0">
        <Link href="/" className="hover:opacity-80 transition">
          <img src="/adaptiv-logo.svg" alt="ADAPTIV" className="h-8 md:h-10" />
        </Link>
        <nav className="flex flex-wrap gap-4 md:gap-8 text-sm font-medium text-gray-600 justify-center">
          <Link href="/quiz" className="hover:text-black transition">QUIZ</Link>
          <Link href="/start-from-scratch" className="hover:text-black transition">START FROM SCRATCH</Link>
          <Link href="/products" className="hover:text-black transition">PRODUCTS</Link>
          <Link href="/contact" className="hover:text-black transition">CONTACT</Link>
        </nav>
        <div className="bg-black text-white px-3 md:px-4 py-2 rounded font-semibold text-sm">
          <Link href="/cart" className="text-white">CART</Link>
        </div>
      </footer>
    </main>
  );
}