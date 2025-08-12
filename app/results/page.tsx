"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { calculateFinalPrice, getCostBreakdown } from "../../lib/pricing";
import { getTooltip } from "../../lib/tooltips";

type Ingredient = {
  name: string;
  amount?: number;
  unit?: string;
  subIngredients?: Ingredient[];
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedFlavor, setSelectedFlavor] = useState<string>("Blue Raz");
  const router = useRouter();

  useEffect(() => {
    const raw = searchParams.get("answers");
    if (raw) {
      const decoded = JSON.parse(decodeURIComponent(raw));
      setAnswers(decoded);

      // Determine multiplier based on age group (first answer) and gender (second answer)
      let multiplier = 1;
      if (decoded[0] === "18–25") multiplier *= 1.1;
      else if (decoded[0] === "46–60") multiplier *= 0.8;
      else if (decoded[0] === "Over 60") multiplier *= 0.6;
      // Gender (second answer)
      if (decoded[1] === "Male") multiplier *= 1.2;
      else if (decoded[1] === "Female") multiplier *= 1.2;

      // Set the selected flavor from quiz answer (8th question, index 7)
      if (decoded[7]) {
        setSelectedFlavor(decoded[7]);
      }

      // Helper to apply multiplier to ingredient or sub-ingredient
      function applyMultiplier(ingredient: Ingredient) {
        if (ingredient.amount !== undefined) {
          return { ...ingredient, amount: Math.round(ingredient.amount * multiplier) };
        } else if (ingredient.subIngredients) {
          return {
            ...ingredient,
            subIngredients: ingredient.subIngredients.map(sub =>
              sub.amount !== undefined ? { ...sub, amount: Math.round(sub.amount * multiplier) } : sub
            ),
          };
        }
        return ingredient;
      }

      // Set ingredients with multiplier applied
      const baseIngredients = [
        { name: "Creatine Monohydrate", amount: 4000, unit: "mg" },
        { name: "Beta-Alanine", amount: 3200, unit: "mg" },
        { name: "Caffeine Anhydrous", amount: 200, unit: "mg" },
        { name: "L-Citrulline Malate", amount: 3000, unit: "mg" },
        { name: "Theobromine", amount: 200, unit: "mg" },
        { name: "Betaine Anhydrous", amount: 500, unit: "mg" },
        {
          name: "Electrolytes",
          subIngredients: [
            { name: "Sodium Chloride", amount: 800, unit: "mg" },
            { name: "Magnesium Malate", amount: 60, unit: "mg" },
            { name: "Potassium Chloride", amount: 200, unit: "mg" },
            { name: "Calcium Citrate", amount: 75, unit: "mg" },
          ],
        },
        {
          name: "Nootropics",
          subIngredients: [
            { name: "L-Tyrosine", amount: 500, unit: "mg" },
            { name: "L-Theanine", amount: 100, unit: "mg" },
            { name: "Alpha-GPC", amount: 400, unit: "mg" },
            { name: "Taurine", amount: 500, unit: "mg" },
          ],
        },
        {
          name: "Vitamins & Minerals",
          subIngredients: [
            { name: "B6", amount: 10, unit: "mg" },
            { name: "B12", amount: 500, unit: "mcg" },
            { name: "B5", amount: 10, unit: "mg" },
            { name: "B2", amount: 2, unit: "mg" },
          ],
        },
      ];
      let adjusted = baseIngredients.map(applyMultiplier);
      // Endurance sports logic (third answer)
      if (decoded[2] === "Endurance Sports (Running, Cycling, Swimming)") {
        adjusted = adjusted.map(ing =>
          ing.name === "L-Citrulline Malate"
            ? { ...ing, amount: 0 }
            : ing
        );
      }
      // Power sports logic (third answer)
      if (decoded[2] === "Power Sports (Football, Wrestling)") {
        adjusted = adjusted.map(ing => {
          if (ing.name === "Electrolytes" && ing.subIngredients) {
            return {
              ...ing,
              subIngredients: ing.subIngredients.map(sub =>
                sub.amount !== undefined ? { ...sub, amount: Math.round(sub.amount * 0.2) } : sub
              ),
            };
          }
          if (ing.name === "Nootropics" && ing.subIngredients) {
            return {
              ...ing,
              subIngredients: ing.subIngredients.map(sub =>
                sub.amount !== undefined ? { ...sub, amount: Math.round(sub.amount * 0.5) } : sub
              ),
            };
          }
          return ing;
        });
      }
      // Hybrid sports logic (third answer)
      if (decoded[2] === "Hybrid Sports (Basketball, Soccer)") {
        adjusted = adjusted.map(ing => {
          if (ing.name === "Electrolytes" && ing.subIngredients) {
            return {
              ...ing,
              subIngredients: ing.subIngredients.map(sub =>
                sub.amount !== undefined ? { ...sub, amount: Math.round(sub.amount * 0.8) } : sub
              ),
            };
          }
          return ing;
        });
      }
      // Bodybuilding logic (third answer)
      if (decoded[2] === "Bodybuilding") {
        adjusted = adjusted.map(ing => {
          if (ing.name === "Creatine Monohydrate") {
            return { ...ing, amount: 5000 };
          }
          if (ing.name === "Beta-Alanine") {
            return { ...ing, amount: 4000 };
          }
          return ing;
        });
      }
      // Powerlifting logic (third answer)
      if (decoded[2] === "Powerlifting") {
        adjusted = adjusted.map(ing => {
          if (ing.name === "Caffeine Anhydrous") {
            return { ...ing, amount: 300 };
          }
          if (ing.name === "L-Citrulline Malate") {
            return { ...ing, amount: 4000 };
          }
          return ing;
        });
      }
      // HIIT / Weightlifting logic (third answer)
      if (decoded[2] === "HIIT / Weightlifting") {
        adjusted = adjusted.map(ing => {
          if (ing.name === "Electrolytes" && ing.subIngredients) {
            return {
              ...ing,
              subIngredients: ing.subIngredients.map(sub =>
                sub.amount !== undefined ? { ...sub, amount: Math.round(sub.amount * 1.5) } : sub
              ),
            };
          }
          return ing;
        });
      }
      // Workout time logic (fourth answer)
      if (decoded[4] === "Morning (5am–11am)") {
        adjusted = adjusted.map(ing => {
          if (ing.name === "Caffeine Anhydrous") {
            return { ...ing, amount: Math.round(ing.amount * 1.3) };
          }
          return ing;
        });
      } else if (decoded[4] === "Night (8pm–12am)") {
        adjusted = adjusted.map(ing => {
          if (ing.name === "Caffeine Anhydrous") {
            return { ...ing, amount: Math.round(ing.amount * 0.7) };
          }
          return ing;
        });
      }
      // Beta-alanine preference logic (fifth answer)
      if (decoded[5] === "I dont feel my pre anymore") {
        adjusted = adjusted.map(ing => {
          if (ing.name === "Beta-Alanine") {
            return { ...ing, amount: Math.round(ing.amount * 1.5) };
          }
          return ing;
        });
      } else if (decoded[5] === "Don't like it") {
        adjusted = adjusted.map(ing => {
          if (ing.name === "Beta-Alanine") {
            return { ...ing, amount: 0 };
          }
          return ing;
        });
      }
      // Caffeine preference logic (sixth answer)
      if (decoded[6] === "Very High") {
        adjusted = adjusted.map(ing => {
          if (ing.name === "Caffeine Anhydrous") {
            return { ...ing, amount: Math.round(ing.amount * 1.5) };
          }
          return ing;
        });
      } else if (decoded[6] === "High") {
        adjusted = adjusted.map(ing => {
          if (ing.name === "Caffeine Anhydrous") {
            return { ...ing, amount: Math.round(ing.amount * 1.2) };
          }
          return ing;
        });
      } else if (decoded[6] === "Moderate") {
        // Keep default amount
      } else if (decoded[6] === "Low") {
        adjusted = adjusted.map(ing => {
          if (ing.name === "Caffeine Anhydrous") {
            return { ...ing, amount: Math.round(ing.amount * 0.7) };
          }
          return ing;
        });
      } else if (decoded[6] === "Stim Free") {
        adjusted = adjusted.map(ing => {
          if (ing.name === "Caffeine Anhydrous") {
            return { ...ing, amount: 0 };
          }
          if (ing.name === "Theobromine") {
            return { ...ing, amount: 0 };
          }
          return ing;
        });
      }

      setIngredients(adjusted);
    }
  }, [searchParams]);

  const updateAmount = (index: number, newAmount: number) => {
    setIngredients((prev) =>
      prev.map((ing, i) =>
        i === index ? { ...ing, amount: newAmount } : ing
      )
    );
  };

  const addToCart = () => {
    const cost = calculateFinalPrice(ingredients);
    const cartItem = {
      ingredients: ingredients,
      flavor: selectedFlavor,
      cost: cost
    };
    
    localStorage.setItem('adaptiv-cart', JSON.stringify([cartItem]));
    
    router.push('/cart');
  };

  // ✅ ONE return statement wrapping everything
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-gray-200 bg-white text-black">
        <Link href="/" className="text-2xl font-bold hover:opacity-80 transition">ADAPTIV</Link>
        <nav className="flex gap-8 text-sm font-medium text-gray-600">
          <Link href="/quiz" className="hover:text-black transition">QUIZ</Link>
          <Link href="/start-from-scratch" className="hover:text-black transition">START FROM SCRATCH</Link>
          <Link href="/products" className="hover:text-black transition">PRODUCTS</Link>
          <Link href="/contact" className="hover:text-black transition">CONTACT</Link>
        </nav>
        <div className="bg-black text-white px-4 py-2 rounded font-semibold text-sm">
          <Link href="/cart" className="text-white">CART</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-white text-black px-6 py-12 font-sans">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Your Custom ADAPTIV Blend
        </h1>
        <p className="text-center text-gray-600 mb-8">
          You can change any ingredient dosage to further fit your needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 shadow-sm relative"
            >
              {/* Tooltip Icon */}
              <div className="absolute top-4 right-4 group">
                <button type="button" tabIndex={0} className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                    <text x="12" y="16" textAnchor="middle" fontSize="13" fill="currentColor" fontFamily="Arial">?</text>
                  </svg>
                </button>
                <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity absolute z-10 right-0 mt-2 w-48 bg-gray-800 text-white text-xs rounded-lg shadow-lg p-3 text-left">
                  {getTooltip(ingredient.name)}
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-center">{ingredient.name}</h2>
              {ingredient.subIngredients ? (
                <div className="space-y-4">
                  {ingredient.subIngredients.map((sub, subIndex) => (
                    <div key={subIndex} className="flex items-center gap-2">
                      <label className="w-40">{sub.name}</label>
                      <input
                        type="number"
                        value={sub.amount}
                        step={10}
                        min={0}
                        onChange={(e) => {
                          const newAmount = parseInt(e.target.value, 10);
                          setIngredients((prev) =>
                            prev.map((ing, i) => {
                              if (i === index) {
                                const updatedSubs = ing.subIngredients!.map((s, si) =>
                                  si === subIndex ? { ...s, amount: newAmount } : s
                                );
                                return { ...ing, subIngredients: updatedSubs };
                              }
                              return ing;
                            })
                          );
                        }}
                        className="border rounded px-3 py-1 w-24 text-center"
                      />
                      <span className="text-gray-600">{sub.unit}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 justify-center">
                    <input
                      type="number"
                      value={ingredient.amount ?? 0}
                      step={100}
                      min={0}
                      onChange={(e) =>
                        updateAmount(index, parseInt(e.target.value, 10))
                      }
                      className="border rounded px-3 py-1 w-24 text-center"
                    />
                    <span className="text-gray-600">mg</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cost Breakdown + Nutrition Label */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-6xl mx-auto">
          {/* Left Column - Cost Breakdown */}
          <section className="text-black font-sans">
            <div className="border border-gray-300 p-6 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-6">
                Cost Breakdown
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Premium Ingredients</span>
                  <span className="font-semibold">${getCostBreakdown(ingredients).ingredientCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Custom Manufacturing</span>
                  <span className="font-semibold">${getCostBreakdown(ingredients).customManufacturing.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quality Testing</span>
                  <span className="font-semibold">${getCostBreakdown(ingredients).qualityTesting.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Packaging & Shipping</span>
                  <span className="font-semibold">${getCostBreakdown(ingredients).packagingShipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-4 mt-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Cost</span>
                    <span>${getCostBreakdown(ingredients).total.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    Per 30-serving container
                  </div>
                </div>
              </div>
            </div>

            {/* Flavor Selection */}
            <div className="mt-6 border border-gray-300 p-6 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-semibold mb-4">Choose Your Flavor</div>
              <div className="space-y-4">
                <label htmlFor="flavor-select" className="block text-sm font-medium text-gray-700">
                  Select your preferred flavor:
                </label>
                <select
                  id="flavor-select"
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Blue Raz">Blue Raz</option>
                  <option value="Fruit Punch Slam">Fruit Punch Slam</option>
                  <option value="Lemon Lime Twist">Lemon Lime Twist</option>
                  <option value="Pina Colada">Pina Colada</option>
                  <option value="Blood Orange">Blood Orange</option>
                </select>
                <p className="text-sm text-gray-600">
                  Your supplement will be naturally flavored with: <span className="font-semibold text-blue-600">{selectedFlavor}</span>
                </p>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={addToCart}
              className="w-full mt-6 bg-black text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:bg-gray-800 transition min-h-[44px]"
            >
              Add to Cart - ${getCostBreakdown(ingredients).total.toFixed(2)}
            </button>
          </section>

          {/* Right Column - Nutrition Label */}
          <section className="text-black font-sans">
            <div className="border border-black p-4 bg-white h-full">
              <div className="text-3xl font-extrabold border-b-4 border-black pb-1 mb-2 uppercase">
                Supplement Facts
              </div>
              <div className="text-sm mb-3 leading-tight">
                <div>Serving Size: 1 Scoop</div>
                <div>Servings Per Container: 30</div>
              </div>
              <div className="flex justify-between border-y border-black py-1 font-semibold text-sm">
                <span>Amount Per Serving</span>
                <span>% Daily Value</span>
              </div>
              {ingredients.map((ingredient, i) =>
                ingredient.subIngredients ? (
                  <div key={i} className="mt-2">
                    <div className="font-bold text-sm">{ingredient.name}</div>
                    {ingredient.subIngredients.map((sub, j) => (
                      <div
                        key={j}
                        className="flex justify-between text-sm border-b border-gray-300 py-0.5"
                      >
                        <span className="pl-4">{sub.name}</span>
                        <span>
                          {sub.amount} {sub.unit} <span className="text-gray-500">†</span>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    key={i}
                    className="flex justify-between text-sm border-b border-gray-300 py-0.5"
                  >
                    <span>{ingredient.name}</span>
                    <span>
                      {ingredient.amount} {ingredient.unit} <span className="text-gray-500">†</span>
                    </span>
                  </div>
                )
              )}
              <div className="text-xs mt-4 text-gray-700 border-t pt-2">
                <span className="text-black font-bold">†</span> Daily Value not established.
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
