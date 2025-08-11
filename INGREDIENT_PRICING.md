# Ingredient Pricing Configuration

This file shows how to update ingredient pricing from your Excel sheet.

## Current Pricing (per mg) - From Your Excel Sheet × 30 Servings × 2x Profit Margin

### Base Ingredients
- **Creatine Monohydrate**: $0.0014382 per mg (×30 servings × 2x profit)
- **Beta-Alanine**: $0.0013782 per mg (×30 servings × 2x profit)
- **Caffeine Anhydrous**: $0.0011568 per mg (×30 servings × 2x profit)
- **L-Citrulline Malate**: $0.0014982 per mg (×30 servings × 2x profit)
- **Theobromine**: $0.0013182 per mg (×30 servings × 2x profit)
- **Betaine Anhydrous**: $0.0014982 per mg (×30 servings × 2x profit)

### Electrolytes
- **Sodium Chloride**: $0.0011430 per mg (×30 servings × 2x profit)
- **Magnesium Malate**: $0.0015582 per mg (×30 servings × 2x profit)
- **Potassium Chloride**: $0.0024582 per mg (×30 servings × 2x profit)
- **Calcium Citrate**: $0.0014982 per mg (×30 servings × 2x profit)

### Nootropics
- **L-Tyrosine**: $0.0021582 per mg (×30 servings × 2x profit)
- **L-Theanine**: $0.0028782 per mg (×30 servings × 2x profit)
- **Alpha-GPC**: $0.0011982 per mg (×30 servings × 2x profit)
- **Taurine**: $0.0015582 per mg (×30 servings × 2x profit)

### Vitamins & Minerals
- **B6**: $0.0029658 per mg (×30 servings × 2x profit)
- **B12**: $0.0045738 per mg (×30 servings × 2x profit)
- **B5**: $0.0011490 per mg (×30 servings × 2x profit)
- **B2**: $0.0057564 per mg (×30 servings × 2x profit)

## Base Costs (Fixed)
- **Custom Manufacturing**: $14.97
- **Quality Testing**: $3.25
- **Packaging & Shipping**: $10.49

## How to Update Prices

1. **Open** `lib/pricing.ts`
2. **Find** the `INGREDIENT_PRICING` object
3. **Update** the values with your Excel sheet prices
4. **Save** the file
5. **Restart** your development server

## Example Update

```typescript
export const INGREDIENT_PRICING: Record<string, number> = {
  "Creatine Monohydrate": 0.00018, // Updated from 0.00015
  "Beta-Alanine": 0.00030,         // Updated from 0.00025
  // ... update other ingredients
};
```

## How Dynamic Pricing Works

1. **User selects ingredients** and amounts
2. **System calculates** ingredient cost = amount × price per mg
3. **Adds base costs** (formulation, testing, packaging)
4. **Total price** updates in real-time as user changes amounts
5. **Cart shows** detailed cost breakdown
6. **Stripe checkout** uses the calculated total

## Testing

- Change ingredient amounts on the "Start from Scratch" page
- Watch the price update in real-time
- Add to cart to see the final price
- Checkout with Stripe using the dynamic total

## Notes

- Prices are per mg for consistency
- mcg values are automatically converted to mg
- Base costs remain fixed regardless of ingredients
- All calculations happen in real-time on the frontend 