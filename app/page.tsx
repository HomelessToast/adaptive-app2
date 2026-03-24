"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ImageSlider from "../components/ImageSlider";

export default function Home() {
  const [currentWord, setCurrentWord] = useState("Athletes");
  const [index, setIndex] = useState(0);
  const [finalWord, setFinalWord] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const rotatingWords = useMemo(() => ["Sprinters", "Swimmers", "Bodybuilders", "Cyclists", "Lifters", "You"], []);
  const textRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setTriggered(true), 500);
    return () => clearTimeout(timer);
  }, []);

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

  const addToCart = (productName: string, ingredients: { name: string; amount?: number; unit?: string; subIngredients?: { name: string; amount: number; unit: string }[] }[]) => {
    const cartItem = {
      ingredients,
      cost: 49.99,
      flavor: "Sour Blue Raz",
      productName,
    };
    const existingCart = localStorage.getItem("adaptiv-cart");
    const cartItems = existingCart ? JSON.parse(existingCart) : [];
    cartItems.push(cartItem);
    localStorage.setItem("adaptiv-cart", JSON.stringify(cartItems));
    router.push("/cart");
  };

  const trendingProducts = [
    {
      name: "Fast Twitch Mix",
      description: "Maximum power output for explosive athletes",
      price: "$49.99",
      image: "/ChatGPT Image Dec 22, 2025 at 11_13_00 AM.png",
      ingredients: [
        { name: "Creatine Monohydrate", amount: 5000, unit: "mg" },
        { name: "Beta Alanine", amount: 4000, unit: "mg" },
        { name: "Caffeine Anhydrous", amount: 350, unit: "mg" },
        { name: "L Citrulline Malate", amount: 5000, unit: "mg" },
      ],
    },
    {
      name: "Hybrid Mix",
      description: "Balanced blend of power and endurance",
      price: "$49.99",
      image: "/ChatGPT Image Dec 22, 2025 at 11_17_20 AM.png",
      ingredients: [
        { name: "Creatine Monohydrate", amount: 5000, unit: "mg" },
        { name: "Beta Alanine", amount: 4000, unit: "mg" },
        { name: "Caffeine Anhydrous", amount: 275, unit: "mg" },
        { name: "L Citrulline Malate", amount: 5500, unit: "mg" },
      ],
    },
    {
      name: "Endurance Blend",
      description: "Stay locked in for the entire game",
      price: "$49.99",
      image: "/ChatGPT Image Dec 22, 2025 at 11_19_29 AM.png",
      ingredients: [
        { name: "Creatine Monohydrate", amount: 5000, unit: "mg" },
        { name: "Beta Alanine", amount: 4000, unit: "mg" },
        { name: "Caffeine Anhydrous", amount: 200, unit: "mg" },
        { name: "L Citrulline Malate", amount: 6000, unit: "mg" },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Announcement Banner */}
      <div className="bg-blue-600 text-white text-center py-2.5 text-xs sm:text-sm font-medium tracking-wide">
        FREE SHIPPING ON U.S. ORDERS $75+ &nbsp;|&nbsp; BUILD YOUR CUSTOM BLEND TODAY
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-8 py-4 md:py-5 border-b border-gray-200 bg-white sticky top-0 z-50">
        <Link href="/" className="hover:opacity-80 transition">
          <svg className="h-6 md:h-8 lg:h-10 w-auto" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
            <g stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M10 30 L25 8 L40 30" />
              <path d="M45 8 L60 30 L75 8" />
            </g>
          </svg>
        </Link>

        <nav className="hidden md:flex gap-6 lg:gap-8 text-sm font-semibold text-gray-700 tracking-wide">
          <Link href="/quiz" className="nav-link hover:text-black transition">QUIZ</Link>
          <Link href="/start-from-scratch" className="nav-link hover:text-black transition">START FROM SCRATCH</Link>
          <Link href="/products" className="nav-link hover:text-black transition">PRODUCTS</Link>
          <Link href="/contact" className="nav-link hover:text-black transition">CONTACT</Link>
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link href="/cart" className="bg-black text-white px-3 md:px-4 py-2 rounded font-semibold text-xs md:text-sm hover:bg-gray-800 transition">
          CART
        </Link>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 sticky top-[52px] z-40">
          <nav className="flex flex-col gap-3 text-sm font-semibold text-gray-700">
            <Link href="/quiz" className="hover:text-black transition py-2 px-2 rounded hover:bg-gray-50">QUIZ</Link>
            <Link href="/start-from-scratch" className="hover:text-black transition py-2 px-2 rounded hover:bg-gray-50">START FROM SCRATCH</Link>
            <Link href="/products" className="hover:text-black transition py-2 px-2 rounded hover:bg-gray-50">PRODUCTS</Link>
            <Link href="/contact" className="hover:text-black transition py-2 px-2 rounded hover:bg-gray-50">CONTACT</Link>
          </nav>
        </div>
      )}

      {/* Hero Section - Dark */}
      <section className="bg-black text-white">
        <div className="flex flex-col md:flex-row items-center justify-between min-h-[85vh] px-4 md:px-12 lg:px-20">
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center text-center md:text-left pt-12 md:pt-0">
            <div className="max-w-xl w-full">
              <h1
                ref={textRef}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 leading-tight"
                style={{ perspective: "1000px" }}
              >
                Create completely custom
                <br />
                pre-workout for
                <br />
                <span
                  key={currentWord}
                  className="font-bold animate-spinY inline-block text-blue-400"
                  style={{ display: "inline-block" }}
                >
                  {currentWord}.
                </span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-8">
                ADAPTIV lets you create a completely custom blend for any sport, activity, or intensity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/quiz"
                  className="bg-blue-600 text-white px-8 py-4 rounded-full text-base md:text-lg font-semibold hover:bg-blue-700 transition inline-flex items-center justify-center"
                >
                  Start Your Quiz
                </Link>
                <Link
                  href="/start-from-scratch"
                  className="border-2 border-white text-white px-8 py-4 rounded-full text-base md:text-lg font-semibold hover:bg-white hover:text-black transition inline-flex items-center justify-center"
                >
                  Build From Scratch
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
            <div className="w-full max-w-[520px] px-4 md:px-0">
              <ImageSlider />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-gray-100 py-6 border-y border-gray-200">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center text-sm font-semibold text-gray-700 tracking-wide">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            RESEARCH-BACKED INGREDIENTS
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            CUSTOM-BUILT FOR YOU
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
            MADE IN THE USA
          </div>
        </div>
      </section>

      {/* Product Story Section - Light */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto gap-10 md:gap-16">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/Stacked PRe.png"
              alt="ADAPTIV Stacked Products"
              className="w-full max-w-[500px] object-contain"
            />
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed max-w-md text-center md:text-left">
              <p>
                Every scoop of <span className="font-semibold text-black">ADAPTIV</span> is built for you. A male
                bodybuilder has different needs than a female basketball player. So why would either take a
                generic preworkout?
              </p>
              <p className="mt-6">
                We let you pick every aspect of your custom blend, and our products are
                dosed based on your weight, tolerance, and performance goals. No fillers, no fluff. Just clean,
                research-backed ingredients tailored for <span className="font-semibold text-black">you</span>.
              </p>
              <div className="mt-8">
                <Link
                  href="/start-from-scratch"
                  className="bg-blue-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-blue-700 transition inline-flex items-center justify-center"
                >
                  Build your custom formula NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products Section - Dark */}
      <section className="bg-gray-950 text-white py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold text-blue-400 tracking-widest uppercase mb-2">Popular Blends</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold">Trending Products</h3>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
              Not sure where to start? Try one of our premade sport blends, crafted by the pros.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {trendingProducts.map((product) => (
              <div
                key={product.name}
                className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="relative w-48 h-64 md:w-56 md:h-72 mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h4 className="font-bold text-lg mb-1">{product.name}</h4>
                <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                <div className="text-2xl font-bold text-blue-400 mb-5">{product.price}</div>
                <div className="flex flex-col gap-2 w-full mt-auto">
                  <button
                    onClick={() => addToCart(product.name, product.ingredients)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-700 transition w-full"
                  >
                    Add to Cart
                  </button>
                  <Link
                    href="/products"
                    className="border border-gray-600 text-gray-300 px-6 py-3 rounded-full text-sm font-semibold hover:border-white hover:text-white transition w-full text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Light */}
      <section className="py-16 md:py-24 px-4 md:px-6 text-center bg-white">
        <h2 className="text-sm sm:text-base font-semibold text-blue-600 tracking-widest uppercase mb-2">
          The only
        </h2>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2">
          completely custom pre-workout for athletes
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10 md:mb-14 text-sm md:text-base px-4">
          Your formula, your goals. Choose ingredients and exact dosages based on your sport,
          schedule, and experience level — built just for you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {[
            { title: "Tailored to Your Sport", desc: "From endurance to strength, get exactly what your performance demands.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            { title: "Clinically Backed Ingredients", desc: "No fluff. Every compound has a reason to be there.", icon: "M12 4v16m8-8H4" },
            { title: "Precision Dosed", desc: "Based on your weight, time of day, and caffeine preference.", icon: "M12 6v6l4 2" },
          ].map((card) => (
            <div key={card.title} className="bg-gray-50 rounded-2xl p-6 md:p-8 flex flex-col items-center border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 mb-5">
                <svg width="28" height="28" className="text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-900">{card.title}</h4>
              <p className="text-sm text-gray-500">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section - Dark */}
      <section className="bg-gray-950 text-white py-16 md:py-20 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {[
            { href: "/products", title: "Help me choose based off my sport", desc: "We'll guide you to the right ingredients based on your activity type.", icon: "M9 17v-2a4 4 0 014-4h2" },
            { href: "/quiz", title: "Take a quiz to create your custom blend", desc: "Answer a few quick questions and we'll build your perfect formula.", icon: "M8 12h8M8 16h8M8 8h8" },
            { href: "/start-from-scratch", title: "I want to start from scratch", desc: "Pick and choose every ingredient yourself and build it your way.", icon: "M12 6v6l4 2" },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="bg-gray-900 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center border border-gray-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600/20 mb-5">
                <svg width="28" height="28" className="text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-2">{card.title}</h4>
              <p className="text-sm text-gray-400">{card.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer - Dark */}
      <footer className="bg-black text-gray-400 pt-16 pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            {/* Column 1 - Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <svg className="h-8 w-auto" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    <path d="M10 30 L25 8 L40 30" />
                    <path d="M45 8 L60 30 L75 8" />
                  </g>
                </svg>
              </Link>
              <p className="text-sm leading-relaxed">
                The only completely custom pre-workout. Built for your sport, your body, your goals.
              </p>
            </div>

            {/* Column 2 - Shop */}
            <div>
              <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Shop</h5>
              <nav className="flex flex-col gap-2.5 text-sm">
                <Link href="/quiz" className="hover:text-white transition">Quiz</Link>
                <Link href="/start-from-scratch" className="hover:text-white transition">Start from Scratch</Link>
                <Link href="/products" className="hover:text-white transition">Products</Link>
                <Link href="/cart" className="hover:text-white transition">Cart</Link>
              </nav>
            </div>

            {/* Column 3 - Support */}
            <div>
              <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Support</h5>
              <nav className="flex flex-col gap-2.5 text-sm">
                <Link href="/contact" className="hover:text-white transition">Contact</Link>
                <span className="text-gray-600 cursor-default">FAQ</span>
                <span className="text-gray-600 cursor-default">Shipping</span>
                <span className="text-gray-600 cursor-default">Returns</span>
              </nav>
            </div>

            {/* Column 4 - Social */}
            <div>
              <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Follow Us</h5>
              <div className="flex gap-3">
                {/* Instagram */}
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
                {/* TikTok */}
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition" aria-label="TikTok">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.28 8.28 0 005.58 2.16V11.7a4.83 4.83 0 01-3.77-1.24V6.69h3.77z" /></svg>
                </a>
                {/* X / Twitter */}
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
            &copy; {new Date().getFullYear()} ADAPTIV. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
