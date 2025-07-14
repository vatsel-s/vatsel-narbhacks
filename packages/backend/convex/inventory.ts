import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Auth } from "convex/server";

// Get all ingredients for a specific user
export const getIngredients = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const ingredients = await ctx.db
      .query("inventory")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return ingredients;
  },
});

// Get ingredient for a specific ingredient ID
export const getIngredient = query({
  args: {
    id: v.optional(v.id("inventory")),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    if (!id) return null;
    const ingredient = await ctx.db.get(id);
    return ingredient;
  },
});

// Create a new ingredient for a user
export const addIngredient = mutation({
  args: {
    ingredientName: v.string(),
    quantity: v.number(),
    unit: v.string(),
    expirationDate: v.string(),
  },
  handler: async (ctx, { ingredientName, quantity, unit, expirationDate }) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");
    
    const dateAdded = new Date().toISOString();
    
    const ingredientId = await ctx.db.insert("inventory", {
      userId,
      ingredientName,
      quantity,
      unit,
      expirationDate,
      dateAdded,
    });

    return ingredientId;
  },
});

export const deleteIngredient = mutation({
  args: {
    ingredientId: v.id("inventory"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.ingredientId);
  },
});

export const getUserId = async (ctx: { auth: Auth }) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};


