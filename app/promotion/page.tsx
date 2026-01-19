"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PromotionPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [fastTwitchFlavor, setFastTwitchFlavor] = useState("Sour Blue Raz");
  const [hybridFlavor, setHybridFlavor] = useState("Sour Blue Raz");
  const [enduranceFlavor, setEnduranceFlavor] = useState("Sour Blue Raz");
  const [fastTwitchShowLabel, setFastTwitchShowLabel] = useState(false);
  const [hybridShowLabel, setHybridShowLabel] = useState(false);
  const [enduranceShowLabel, setEnduranceShowLabel] = useState(false);
  
  const flavorOptions = ["Sour Blue Raz", "Green Apple", "Fruit Punch Slam", "Pina Colada Breeze"];

  // Fast Twitch Blend specific ingredients
  const getFastTwitchBlendIngredients = () => [
    { name: "Creatine Monohydrate", amount: 5000, unit: "mg" },
    { name: "Beta Alanine", amount: 4000, unit: "mg" },
    { name: "Caffeine Anhydrous", amount: 350, unit: "mg" },
    { name: "L Citrulline Malate", amount: 5000, unit: "mg" },
    { name: "Theobromine", amount: 200, unit: "mg" },
    { name: "Betaine Anhydrous", amount: 1000, unit: "mg" },
    {
      name: "Electrolytes",
      subIngredients: [
        { name: "Sodium Chloride", amount: 300, unit: "mg" },
        { name: "Magnesium Malate", amount: 100, unit: "mg" },
        { name: "Potassium Chloride", amount: 150, unit: "mg" },
        { name: "Calcium citrate", amount: 50, unit: "mg" },
      ],
    },
    {
      name: "Nootropics",
      subIngredients: [
        { name: "L Tyrosine", amount: 1000, unit: "mg" },
        { name: "L theanine", amount: 150, unit: "mg" },
        { name: "Alpha GPC", amount: 600, unit: "mg" },
        { name: "Taurine", amount: 1000, unit: "mg" },
      ],
    },
    {
      name: "Vitamins & Minerals",
      subIngredients: [
        { name: "B6", amount: 5, unit: "mg" },
        { name: "B12", amount: 0.5, unit: "mg" },
        { name: "B5", amount: 5, unit: "mg" },
        { name: "B2", amount: 3, unit: "mg" },
      ],
    },
  ];

  // Hybrid Blend specific ingredients
  const getHybridBlendIngredients = () => [
    { name: "Creatine Monohydrate", amount: 5000, unit: "mg" },
    { name: "Beta Alanine", amount: 4000, unit: "mg" },
    { name: "Caffeine Anhydrous", amount: 275, unit: "mg" },
    { name: "L Citrulline Malate", amount: 5500, unit: "mg" },
    { name: "Theobromine", amount: 200, unit: "mg" },
    { name: "Betaine Anhydrous", amount: 1500, unit: "mg" },
    {
      name: "Electrolytes",
      subIngredients: [
        { name: "Sodium Chloride", amount: 550, unit: "mg" },
        { name: "Magnesium Malate", amount: 150, unit: "mg" },
        { name: "Potassium Chloride", amount: 225, unit: "mg" },
        { name: "Calcium citrate", amount: 50, unit: "mg" },
      ],
    },
    {
      name: "Nootropics",
      subIngredients: [
        { name: "L Tyrosine", amount: 1000, unit: "mg" },
        { name: "L theanine", amount: 175, unit: "mg" },
        { name: "Alpha GPC", amount: 450, unit: "mg" },
        { name: "Taurine", amount: 1000, unit: "mg" },
      ],
    },
    {
      name: "Vitamins & Minerals",
      subIngredients: [
        { name: "B6", amount: 5, unit: "mg" },
        { name: "B12", amount: 0.5, unit: "mg" },
        { name: "B5", amount: 5, unit: "mg" },
        { name: "B2", amount: 3, unit: "mg" },
      ],
    },
  ];

  // Endurance Blend specific ingredients
  const getEnduranceBlendIngredients = () => [
    { name: "Creatine Monohydrate", amount: 5000, unit: "mg" },
    { name: "Beta Alanine", amount: 4000, unit: "mg" },
    { name: "Caffeine Anhydrous", amount: 200, unit: "mg" },
    { name: "L Citrulline Malate", amount: 6000, unit: "mg" },
    { name: "Theobromine", amount: 200, unit: "mg" },
    { name: "Betaine Anhydrous", amount: 2000, unit: "mg" },
    {
      name: "Electrolytes",
      subIngredients: [
        { name: "Sodium Chloride", amount: 800, unit: "mg" },
        { name: "Magnesium Malate", amount: 200, unit: "mg" },
        { name: "Potassium Chloride", amount: 300, unit: "mg" },
        { name: "Calcium citrate", amount: 50, unit: "mg" },
      ],
    },
    {
      name: "Nootropics",
      subIngredients: [
        { name: "L Tyrosine", amount: 1000, unit: "mg" },
        { name: "L theanine", amount: 200, unit: "mg" },
        { name: "Alpha GPC", amount: 300, unit: "mg" },
        { name: "Taurine", amount: 1000, unit: "mg" },
      ],
    },
    {
      name: "Vitamins & Minerals",
      subIngredients: [
        { name: "B6", amount: 5, unit: "mg" },
        { name: "B12", amount: 0.5, unit: "mg" },
        { name: "B5", amount: 5, unit: "mg" },
        { name: "B2", amount: 3, unit: "mg" },
      ],
    },
  ];

  const buyNow = (productName: string, flavor: string, ingredients: any[]) => {
    const cartItem = {
      ingredients: ingredients,
      cost: 54.99,
      flavor: flavor,
      productName: productName
    };
    
    // Clear existing cart and set only this item for direct checkout
    const cartItems = [cartItem];
    
    // Save to localStorage
    localStorage.setItem('adaptiv-cart', JSON.stringify(cartItems));
    
    // Redirect directly to checkout
    router.push('/checkout');
  };

  const buyEnduranceBlend = () => buyNow("Endurance Blend", enduranceFlavor, getEnduranceBlendIngredients());
  const buyHybridBlend = () => buyNow("Hybrid Blend", hybridFlavor, getHybridBlendIngredients());
  const buyFastTwitchBlend = () => buyNow("Fast Twitch Blend", fastTwitchFlavor, getFastTwitchBlendIngredients());

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
        {/* Featured Fast Twitch Blend - Prominently Displayed */}
        <div className="max-w-2xl mx-auto mb-8 md:mb-12">
          <div className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6 md:p-8 border-2 border-red-200 hover:shadow-3xl transition-all duration-200 flex flex-col items-center text-center relative overflow-hidden">
            {/* Red MOST POPULAR Badge */}
            <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-xs md:text-sm uppercase tracking-wide shadow-lg z-10">
              Most Popular
            </div>
            
            <div className={`relative mb-6 ${fastTwitchShowLabel ? 'w-64 h-80 md:w-80 md:h-96' : 'w-80 h-[26rem] md:w-[28rem] md:h-[32rem]'}`}>
              <Image
                src={fastTwitchShowLabel ? "/Fast Twitch Label.png" : "/ChatGPT Image Dec 22, 2025 at 11_13_00 AM.png"}
                alt={fastTwitchShowLabel ? "Fast Twitch Label" : "Fast Twitch Blend"}
                fill
                className="object-contain"
              />
              <button
                onClick={() => setFastTwitchShowLabel(!fastTwitchShowLabel)}
                className={`absolute top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-2 rounded-full transition-all ${fastTwitchShowLabel ? 'left-2' : 'right-2'}`}
                aria-label={fastTwitchShowLabel ? "Show product image" : "Show label"}
              >
                {fastTwitchShowLabel ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
              
              {/* Trust Chips Overlay on Image */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
                <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Clinically Dosed
                </span>
              </div>
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
                <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  3rd-Party Tested
                </span>
              </div>
            </div>
            <h3 className="font-bold text-2xl md:text-3xl mb-2">Fast Twitch Mix</h3>
            {/* Trust Ribbon */}
            <div className="mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600">
                Trusted by 100+ Athletes
              </span>
            </div>
            <p className="text-gray-600 text-base md:text-lg mb-4 max-w-md">Designed for athletes looking for maximum power output</p>
            <div className="w-full max-w-xs mb-4">
              <label className="block text-sm text-gray-600 mb-2">Flavor</label>
              <select
                value={fastTwitchFlavor}
                onChange={(e) => setFastTwitchFlavor(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-3 text-base bg-white text-black"
              >
                {flavorOptions.map((flavor) => (
                  <option key={flavor} value={flavor}>{flavor}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="text-xl md:text-2xl text-gray-400 line-through">$64.99</div>
              <div className="text-3xl md:text-4xl font-bold text-red-600">$54.99</div>
            </div>
            <button
              onClick={buyFastTwitchBlend}
              className="bg-black text-white px-8 py-4 rounded-full text-lg md:text-xl font-semibold hover:bg-gray-800 transition w-full max-w-xs"
            >
              Get Fast Twitch Blend
            </button>
          </div>
        </div>

        {/* Other Products - Mobile Format Below */}
        <div className="max-w-lg mx-auto space-y-6 md:space-y-8">
          {/* Hybrid Blend */}
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-4 md:p-6 border border-blue-100 hover:shadow-2xl transition-all duration-200 flex flex-col items-center text-center">
            <div className={`relative mb-4 ${hybridShowLabel ? 'w-48 h-64 md:w-56 md:h-72' : 'w-56 h-[20rem] md:w-64 md:h-[24rem]'}`}>
              <Image
                src={hybridShowLabel ? "/Hybrid Label.png" : "/ChatGPT Image Dec 22, 2025 at 11_17_20 AM.png"}
                alt={hybridShowLabel ? "Hybrid Label" : "Hybrid Blend"}
                fill
                className="object-contain"
              />
              <button
                onClick={() => setHybridShowLabel(!hybridShowLabel)}
                className={`absolute top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-2 rounded-full transition-all ${hybridShowLabel ? 'left-2' : 'right-2'}`}
                aria-label={hybridShowLabel ? "Show product image" : "Show label"}
              >
                {hybridShowLabel ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
            <h3 className="font-bold text-lg md:text-xl mb-2">Hybrid Mix</h3>
            <p className="text-gray-600 text-sm md:text-base mb-3">A middle blend between power and endurance.</p>
            <div className="w-full mb-3">
              <label className="block text-xs text-gray-600 mb-1">Flavor</label>
              <select
                value={hybridFlavor}
                onChange={(e) => setHybridFlavor(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-black"
              >
                {flavorOptions.map((flavor) => (
                  <option key={flavor} value={flavor}>{flavor}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-center mb-4">
              <div className="text-lg md:text-xl text-gray-400 line-through">$64.99</div>
              <div className="text-xl md:text-2xl font-bold text-red-600">$54.99</div>
            </div>
            <button
              onClick={buyHybridBlend}
              className="bg-black text-white px-6 py-2 rounded-full text-sm md:text-base font-semibold hover:bg-gray-800 transition w-full"
            >
              Buy Now
            </button>
          </div>

          {/* Endurance Blend */}
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-4 md:p-6 border border-blue-100 hover:shadow-2xl transition-all duration-200 flex flex-col items-center text-center">
            <div className={`relative mb-4 ${enduranceShowLabel ? 'w-48 h-64 md:w-56 md:h-72' : 'w-56 h-[20rem] md:w-64 md:h-[24rem]'}`}>
              <Image
                src={enduranceShowLabel ? "/Endurance Blend.png" : "/ChatGPT Image Dec 22, 2025 at 11_19_29 AM.png"}
                alt={enduranceShowLabel ? "Endurance Blend Label" : "Endurance Blend"}
                fill
                className="object-contain"
              />
              <button
                onClick={() => setEnduranceShowLabel(!enduranceShowLabel)}
                className={`absolute top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white p-2 rounded-full transition-all ${enduranceShowLabel ? 'left-2' : 'right-2'}`}
                aria-label={enduranceShowLabel ? "Show product image" : "Show label"}
              >
                {enduranceShowLabel ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
            <h3 className="font-bold text-lg md:text-xl mb-2">Endurance Blend</h3>
            <p className="text-gray-600 text-sm md:text-base mb-3">Stay locked in for the entire game.</p>
            <div className="w-full mb-3">
              <label className="block text-xs text-gray-600 mb-1">Flavor</label>
              <select
                value={enduranceFlavor}
                onChange={(e) => setEnduranceFlavor(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-black"
              >
                {flavorOptions.map((flavor) => (
                  <option key={flavor} value={flavor}>{flavor}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-center mb-4">
              <div className="text-lg md:text-xl text-gray-400 line-through">$64.99</div>
              <div className="text-xl md:text-2xl font-bold text-red-600">$54.99</div>
            </div>
            <button
              onClick={buyEnduranceBlend}
              className="bg-black text-white px-6 py-2 rounded-full text-sm md:text-base font-semibold hover:bg-gray-800 transition w-full"
            >
              Buy Now
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
