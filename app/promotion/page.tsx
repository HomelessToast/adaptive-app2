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
        {/* Trust Section */}
        <div className="max-w-6xl mx-auto mb-8 md:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Trust Factor 1: Clinical Doses */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-8 text-center shadow-md hover:shadow-lg transition-all duration-200">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-lg md:text-xl mb-2">100% Full Clinical Doses</h4>
              <p className="text-sm md:text-base text-gray-600">Every ingredient is dosed at clinically-proven effective levels for maximum performance</p>
            </div>

            {/* Trust Factor 2: Trusted by Athletes */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-8 text-center shadow-md hover:shadow-lg transition-all duration-200">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-lg md:text-xl mb-2">Trusted by 100+ Athletes</h4>
              <p className="text-sm md:text-base text-gray-600">Elite athletes across sports trust ADAPTIV for their performance needs</p>
            </div>

            {/* Trust Factor 3: Third Party Tested */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-8 text-center shadow-md hover:shadow-lg transition-all duration-200">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-purple-100">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-bold text-lg md:text-xl mb-2">Always Clean & Tested</h4>
              <p className="text-sm md:text-base text-gray-600">Every batch is 3rd party tested to ensure purity and safety standards</p>
            </div>
          </div>
        </div>

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
            </div>
            <h3 className="font-bold text-2xl md:text-3xl mb-3">Fast Twitch Mix</h3>
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
              Buy Now
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
