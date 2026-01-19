"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Ingredient = {
  name: string;
  amount?: number;
  unit?: string;
  subIngredients?: Ingredient[];
};

export default function CheckoutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{ingredients: Ingredient[], cost: number, flavor?: string}[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('adaptiv-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const getTotalCost = () => {
    return cartItems.reduce((total, item) => total + item.cost, 0);
  };

  const getDiscountPercentForCode = (code: string | null) => {
    if (!code) return 0;
    const upper = code.toUpperCase();
    if (upper === 'F49D#GD3&') return -1; // special: force total to $0.01
    if (upper === 'ATCOST$40') return 40;
    const tenCodes = new Set(['TRAVIS','HYRUM','MASON','ZARA','DYLAN','KYLE','AMBROSE','FINN','NEWYEARS','NEWYEAR','LOGAN','TIKTOK']);
    return tenCodes.has(upper) ? 10 : 0;
  };

  const discountPercent = getDiscountPercentForCode(appliedCode);
  const isOneCent = discountPercent === -1;
  const minimumCharge = 0.50;
  const isDiscountApplied = isOneCent || discountPercent > 0;
  const discountedTotal = isOneCent
    ? minimumCharge
    : (isDiscountApplied ? +(getTotalCost() * (1 - discountPercent / 100)).toFixed(2) : getTotalCost());

  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    const percent = getDiscountPercentForCode(code);
    if (percent > 0 || percent === -1) {
      setAppliedCode(code);
      setDiscountError(null);
    } else {
      setAppliedCode(null);
      setDiscountError('Invalid code.');
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const createStripeCheckout = async () => {
    setIsLoading(true);
    try {
      // Create the complete supplement facts data structure
      const supplementFacts = {
        servingSize: "1 Scoop",
        servingsPerContainer: 30,
        flavor: cartItems[0]?.flavor || "Unspecified", // Add flavor from cart
        categories: {
          "Amount Per Serving": cartItems.map(item => 
            item.ingredients.filter(ing => !ing.subIngredients)
          ).flat(),
          "Electrolytes": cartItems.map(item => 
            item.ingredients.find(ing => ing.name === "Electrolytes")?.subIngredients || []
          ).flat(),
          "Nootropics": cartItems.map(item => 
            item.ingredients.find(ing => ing.name === "Nootropics")?.subIngredients || []
          ).flat(),
          "Vitamins & Minerals": cartItems.map(item => 
            item.ingredients.find(ing => ing.name === "Vitamins & Minerals")?.subIngredients || []
          ).flat()
        }
      };

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems, supplementFacts, discountCode: appliedCode }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-600 mb-8">Your cart is empty.</p>
        <Link 
          href="/" 
          className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 transition min-h-[44px] inline-block"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-8 py-6 border-b border-gray-200 mb-5 bg-white">
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

      <main className="min-h-screen bg-gray-50 text-black px-6 py-12 font-sans">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="lg:order-2">
              <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Custom Blend x1</h3>
                        <p className="text-sm text-gray-600">30 servings</p>
                      </div>
                      <span className="font-semibold">${item.cost.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-4">
                    {!isDiscountApplied ? (
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-xl font-bold">${getTotalCost().toFixed(2)}</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Subtotal</span>
                          <span className="text-sm line-through text-gray-500">${getTotalCost().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700">Discount {isOneCent ? '(special)' : `(${discountPercent}%)`}</span>
                          <span className="text-sm text-green-700">- ${(getTotalCost() - discountedTotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total</span>
                          <span className="text-xl font-bold">${discountedTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Discount Code */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Have a discount code?</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleApplyDiscount}
                        className="bg-black text-white px-4 py-2 rounded text-sm font-semibold"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedCode && (
                      <p className="text-sm text-green-700 mt-2">Code {appliedCode} applied. 10% off.</p>
                    )}
                    {discountError && (
                      <p className="text-sm text-red-600 mt-2">{discountError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stripe Checkout Redirect */}
            <div className="lg:order-1">
              <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Complete Your Order</h2>
                <p className="text-gray-600 mb-6">
                  Click the button below to complete your purchase securely through Stripe.
                </p>
                <button
                  onClick={createStripeCheckout}
                  disabled={isLoading}
                  className="w-full bg-black text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 transition min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Checkout...' : 'Proceed to Secure Checkout'}
                </button>
                                       <p className="text-xs text-gray-500 mt-4 text-center">
                         You&apos;ll be redirected to Stripe&apos;s secure payment page
                       </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 