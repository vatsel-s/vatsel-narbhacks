import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const add = mutation({
  args: {
    name: v.string(),
    ingredients: v.array(v.object({
      ingredientName: v.string(),
      quantity: v.number(),
      unit: v.string(),
    })),
    nutrition: v.object({
      calories: v.number(),
      protein: v.number(),
      carbohydrates: v.number(),
      fat: v.number(),
      fiber: v.number(),
      vitaminA: v.number(),
      vitaminC: v.number(),
      iron: v.number(),
      calcium: v.number(),
      sugar: v.number(),
      sodium: v.number(),
      potassium: v.optional(v.number()),
      cholesterol: v.optional(v.number()),
      saturatedFat: v.optional(v.number()),
      transFat: v.optional(v.number()),
      vitaminD: v.optional(v.number()),
    }),
    dietaryTags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("recipes", args);
  },
});

export const markAsMade = mutation({
  args: {
    userId: v.string(),
    recipeId: v.string(),
  },
  handler: async (ctx, { userId, recipeId }) => {
    // Get the recipe
    const recipe = await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("_id"), recipeId))
      .first();
    if (!recipe) throw new Error("Recipe not found");

    // Get user's inventory
    const inventory = await ctx.db
      .query("inventory")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    // Deduct ingredients
    for (const req of recipe.ingredients) {
      const invItem = inventory.find(
        (item) =>
          item.ingredientName === req.ingredientName &&
          item.unit === req.unit &&
          item.quantity >= req.quantity
      );
      if (invItem) {
        // Deduct quantity or remove if zero
        const newQty = invItem.quantity - req.quantity;
        if (newQty > 0) {
          await ctx.db.patch(invItem._id, { quantity: newQty });
        } else {
          await ctx.db.delete(invItem._id);
        }
      }
      // If not found or not enough, skip ("almost possible" logic is handled in UI)
    }

    // Log to friends feed (as a comment with a special type)
    await ctx.db.insert("comments", {
      userId,
      recipeId,
      content: `made this recipe!`,
      timestamp: new Date().toISOString(),
      likes: 0,
    });

    return { success: true };
  },
});

// Add types for recipe and ingredient
interface Ingredient {
  ingredientName: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  name: string;
  ingredients: Ingredient[];
  nutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    vitaminA: number;
    vitaminC: number;
    iron: number;
    calcium: number;
    sugar: number;
    sodium: number;
    potassium?: number;
    cholesterol?: number;
    saturatedFat?: number;
    transFat?: number;
    vitaminD?: number;
  };
  dietaryTags: string[];
}

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("recipes").collect();
  },
});

export const getPossibleRecipes = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const recipes = await ctx.db.query("recipes").collect();
    const inventory = await ctx.db
      .query("inventory")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    function canMake(recipe: Recipe) {
      return recipe.ingredients.every((req: Ingredient) => {
        const invItem = inventory.find(
          (item) =>
            item.ingredientName === req.ingredientName &&
            item.unit === req.unit &&
            item.quantity >= req.quantity
        );
        return !!invItem;
      });
    }

    function almostCanMake(recipe: Recipe) {
      let missing = 0;
      for (const req of recipe.ingredients) {
        const invItem = inventory.find(
          (item) =>
            item.ingredientName === req.ingredientName &&
            item.unit === req.unit &&
            item.quantity >= req.quantity
        );
        if (!invItem) missing++;
        if (missing > 2) return false;
      }
      return missing > 0 && missing <= 2;
    }

    return {
      possible: recipes.filter(canMake),
      almost: recipes.filter(almostCanMake),
    };
  },
}); 