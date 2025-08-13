"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCostBreakdown } from "../../lib/pricing";

type Ingredient = {
  name: string;
  amount?: number;
  unit?: string;
  subIngredients?: Ingredient[];
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<{ingredients: Ingredient[], cost: number}[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('adaptiv-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const removeFromCart = (index: number) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
    localStorage.setItem('adaptiv-cart', JSON.stringify(newCart));
  };

  const getTotalCost = () => {
    return cartItems.reduce((total, item) => total + item.cost, 0);
  };

  const createStripeCheckout = async () => {
    setIsLoading(true);
    try {
      // Create the complete supplement facts data structure
      const supplementFacts = {
        servingSize: "1 Scoop",
        servingsPerContainer: 30,
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
        body: JSON.stringify({ cartItems, supplementFacts }),
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
      <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-center text-gray-600 mb-8">Your cart is currently empty.</p>
          <Link 
            href="/" 
            className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 transition min-h-[44px] inline-block"
          >
            Return to Home
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Cart Items */}
          <div className="space-y-6 mb-8">
            {cartItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">Custom Pre Workout x1</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold">${item.cost.toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                {/* Supplement Facts Preview */}
                <div className="border border-gray-300 p-4 bg-gray-50 rounded">
                  <div className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">
                    Supplement Facts
                  </div>
                  <div className="text-sm space-y-1">
                    {item.ingredients.map((ingredient, i) =>
                      ingredient.subIngredients ? (
                        <div key={i} className="ml-4">
                          <div className="font-semibold">{ingredient.name}</div>
                          {ingredient.subIngredients.map((sub, j) => (
                            <div key={j} className="flex justify-between ml-4 text-xs">
                              <span>{sub.name}</span>
                              <span>{sub.amount} {sub.unit}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div key={i} className="flex justify-between text-xs">
                          <span>{ingredient.name}</span>
                          <span>{ingredient.amount} {ingredient.unit}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cost Breakdown */}
          <div className="border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
            <div className="space-y-3">
              {cartItems.map((item, index) => {
                const breakdown = getCostBreakdown(item.ingredients);
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Premium Ingredients</span>
                      <span className="font-semibold">${breakdown.ingredientCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Custom Manufacturing</span>
                      <span className="font-semibold">${breakdown.customManufacturing.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Quality Testing</span>
                      <span className="font-semibold">${breakdown.qualityTesting.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Packaging & Shipping</span>
                      <span className="font-semibold">${breakdown.packagingShipping.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total and Checkout */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold">Total</span>
              <span className="text-2xl font-bold">${getTotalCost().toFixed(2)}</span>
            </div>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/" 
                className="bg-gray-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:bg-gray-600 transition min-h-[44px] inline-block"
              >
                Continue Shopping
              </Link>
              <button
                onClick={createStripeCheckout}
                disabled={isLoading}
                className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 transition min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Checkout...' : 'Buy Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
    </>
  );
} 