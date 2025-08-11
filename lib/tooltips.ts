// Scientific tooltips for supplement ingredients
export const INGREDIENT_TOOLTIPS: Record<string, string> = {
  // Base ingredients
  "Creatine Monohydrate": "Phosphocreatine precursor that enhances ATP regeneration during high-intensity exercise, improving strength and power output.",
  "Beta-Alanine": "Amino acid that increases muscle carnosine levels, buffering acid buildup and delaying fatigue during intense training.",
  "Caffeine Anhydrous": "Central nervous system stimulant that enhances alertness, focus, and exercise performance by blocking adenosine receptors.",
  "L-Citrulline Malate": "Amino acid that increases nitric oxide production, improving blood flow and oxygen delivery to working muscles.",
  "Theobromine": "Methylxanthine compound that provides sustained energy without jitters, supporting endurance and mental clarity.",
  "Betaine Anhydrous": "Methyl donor that supports protein synthesis and cellular hydration, enhancing muscle growth and recovery.",
  
  // Electrolytes
  "Sodium Chloride": "Essential electrolyte that maintains fluid balance, nerve function, and muscle contractions during exercise.",
  "Magnesium Malate": "Mineral that supports energy production, muscle relaxation, and protein synthesis for optimal recovery.",
  "Potassium Chloride": "Electrolyte that regulates muscle contractions, nerve impulses, and maintains cellular fluid balance.",
  "Calcium Citrate": "Mineral essential for muscle contractions, bone health, and proper nerve function during exercise.",
  
  // Nootropics
  "L-Tyrosine": "Amino acid precursor to dopamine and norepinephrine, enhancing mental focus and stress resilience during training.",
  "L-Theanine": "Amino acid that promotes alpha brain wave activity, reducing stress while maintaining cognitive performance.",
  "Alpha-GPC": "Choline compound that increases acetylcholine levels, improving memory, focus, and neuromuscular function.",
  "Taurine": "Amino acid that regulates calcium levels in muscle cells, supporting muscle contractions and reducing oxidative stress.",
  
  // Vitamins & Minerals
  "B6": "Pyridoxine supports protein metabolism, red blood cell formation, and neurotransmitter synthesis for optimal performance.",
  "B12": "Cobalamin essential for energy production, red blood cell formation, and maintaining healthy nerve cells.",
  "B5": "Pantothenic acid is crucial for energy metabolism and the synthesis of coenzyme A for cellular energy production.",
  "B2": "Riboflavin supports energy metabolism and acts as an antioxidant, protecting cells from oxidative damage.",
};

// Tooltips for ingredient categories
export const CATEGORY_TOOLTIPS: Record<string, string> = {
  "Electrolytes": "Essential minerals that maintain fluid balance, nerve function, and muscle contractions during exercise.",
  "Nootropics": "Cognitive enhancers that improve mental focus, memory, and stress resilience during training.",
  "Vitamins & Minerals": "Essential micronutrients that support energy production, recovery, and overall cellular function.",
};

// Get tooltip for any ingredient or category
export function getTooltip(name: string): string {
  return INGREDIENT_TOOLTIPS[name] || CATEGORY_TOOLTIPS[name] || "Information not available.";
} 