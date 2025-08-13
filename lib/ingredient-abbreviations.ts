// Ingredient abbreviations to save characters in Stripe metadata
export const ingredientAbbreviations: Record<string, string> = {
  // Main ingredients
  'Creatine Monohydrate': 'Creatine',
  'Beta-Alanine': 'Beta-Ala',
  'Caffeine Anhydrous': 'Caffeine',
  'L-Citrulline Malate': 'Citrulline',
  'Theobromine': 'Theo',
  'Betaine Anhydrous': 'Betaine',
  
  // Electrolytes
  'Sodium Chloride': 'NaCl',
  'Magnesium Malate': 'Mg-Malate',
  'Potassium Chloride': 'KCl',
  'Calcium Citrate': 'Ca-Citrate',
  
  // Nootropics
  'L-Tyrosine': 'Tyrosine',
  'L-Theanine': 'Theanine',
  'Alpha-GPC': 'A-GPC',
  'Taurine': 'Taurine',
  
  // Vitamins & Minerals
  'B6': 'B6',
  'B12': 'B12',
  'B5': 'B5',
  'B2': 'B2',
  
  // Common units
  'mg': 'mg',
  'mcg': 'mcg',
  'g': 'g'
};

// Reverse mapping for manufacturing emails
export const ingredientFullNames: Record<string, string> = Object.fromEntries(
  Object.entries(ingredientAbbreviations).map(([full, abbrev]) => [abbrev, full])
);

// Function to abbreviate ingredient names
export function abbreviateIngredient(name: string): string {
  return ingredientAbbreviations[name] || name;
}

// Function to get full ingredient name
export function getFullIngredientName(abbreviation: string): string {
  return ingredientFullNames[abbreviation] || abbreviation;
}
