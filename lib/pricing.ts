// Ingredient pricing per mg (from your Excel sheet) - Multiplied by 30 for 30 servings per bottle, then 2x for profit margin
export const INGREDIENT_PRICING: Record<string, number> = {
  // Base ingredients
  "Creatine Monohydrate": 0.0014382,     // $0.00002397 × 30 × 2 = $0.0014382 per mg
  "Beta-Alanine": 0.0013782,             // $0.00002297 × 30 × 2 = $0.0013782 per mg
  "Caffeine Anhydrous": 0.0011568,       // $0.00001928 × 30 × 2 = $0.0011568 per mg
  "L-Citrulline Malate": 0.0014982,      // $0.00002497 × 30 × 2 = $0.0014982 per mg
  "Theobromine": 0.0013182,              // $0.00002197 × 30 × 2 = $0.0013182 per mg
  "Betaine Anhydrous": 0.0014982,        // $0.00002497 × 30 × 2 = $0.0014982 per mg
  
  // Electrolytes
  "Sodium Chloride": 0.0011430,          // $0.00001905 × 30 × 2 = $0.0011430 per mg
  "Magnesium Malate": 0.0015582,         // $0.00002597 × 30 × 2 = $0.0015582 per mg
  "Potassium Chloride": 0.0024582,       // $0.00004097 × 30 × 2 = $0.0024582 per mg
  "Calcium Citrate": 0.0014982,          // $0.00002497 × 30 × 2 = $0.0014982 per mg
  
  // Nootropics
  "L-Tyrosine": 0.0021582,               // $0.00003597 × 30 × 2 = $0.0021582 per mg
  "L-Theanine": 0.0028782,               // $0.00004797 × 30 × 2 = $0.0028782 per mg
  "Alpha-GPC": 0.0011982,                // $0.00001997 × 30 × 2 = $0.0011982 per mg
  "Taurine": 0.0015582,                  // $0.00002597 × 30 × 2 = $0.0015582 per mg
  
  // Vitamins & Minerals
  "B6": 0.0029658,                       // $0.00004943 × 30 × 2 = $0.0029658 per mg
  "B12": 0.0045738,                      // $0.00007623 × 30 × 2 = $0.0045738 per mg
  "B5": 0.0011490,                       // $0.00001915 × 30 × 2 = $0.0011490 per mg
  "B2": 0.0057564,                       // $0.00009594 × 30 × 2 = $0.0057564 per mg
};

// Base costs that don't change with ingredient amounts
export const BASE_COSTS = {
  CUSTOM_MANUFACTURING: 14.97,     // $14.97 for custom manufacturing
  QUALITY_TESTING: 3.25,           // $3.25 for quality testing
  PACKAGING_SHIPPING: 10.49,       // $10.49 for packaging & shipping
};

// Calculate ingredient cost based on amount and unit
export function calculateIngredientCost(name: string, amount: number, unit: string): number {
  if (amount <= 0) return 0;
  
  let adjustedAmount = amount;
  
  // Convert units to mg for consistent pricing
  if (unit === 'mcg') {
    adjustedAmount = amount / 1000; // Convert mcg to mg
  } else if (unit === 'g') {
    adjustedAmount = amount * 1000; // Convert g to mg
  }
  
  const pricePerMg = INGREDIENT_PRICING[name] || 0;
  return adjustedAmount * pricePerMg;
}

// Calculate total ingredient cost for a supplement
export function calculateTotalIngredientCost(ingredients: any[]): number {
  let total = 0;
  
  ingredients.forEach(ingredient => {
    if (ingredient.amount && ingredient.unit) {
      total += calculateIngredientCost(ingredient.name, ingredient.amount, ingredient.unit);
    }
    
    if (ingredient.subIngredients) {
      ingredient.subIngredients.forEach((sub: any) => {
        if (sub.amount && sub.unit) {
          total += calculateIngredientCost(sub.name, sub.amount, sub.unit);
        }
      });
    }
  });
  
  return total;
}

// Calculate final price including base costs
export function calculateFinalPrice(ingredients: any[]): number {
  const ingredientCost = calculateTotalIngredientCost(ingredients);
  const baseCost = BASE_COSTS.CUSTOM_MANUFACTURING + BASE_COSTS.QUALITY_TESTING + BASE_COSTS.PACKAGING_SHIPPING;
  
  return ingredientCost + baseCost;
}

// Get cost breakdown for display
export function getCostBreakdown(ingredients: any[]): {
  ingredientCost: number;
  customManufacturing: number;
  qualityTesting: number;
  packagingShipping: number;
  total: number;
} {
  const ingredientCost = calculateTotalIngredientCost(ingredients);
  
  return {
    ingredientCost: Math.round(ingredientCost * 100) / 100,
    customManufacturing: BASE_COSTS.CUSTOM_MANUFACTURING,
    qualityTesting: BASE_COSTS.QUALITY_TESTING,
    packagingShipping: BASE_COSTS.PACKAGING_SHIPPING,
    total: Math.round((ingredientCost + BASE_COSTS.CUSTOM_MANUFACTURING + BASE_COSTS.QUALITY_TESTING + BASE_COSTS.PACKAGING_SHIPPING) * 100) / 100,
  };
} 