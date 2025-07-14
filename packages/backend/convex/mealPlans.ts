import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addMealPlan = mutation({
  args: {
    userId: v.string(),
    recipeId: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const mealPlanId = await ctx.db.insert("mealPlans", {
      userId: args.userId,
      recipeId: args.recipeId,
      date: args.date,
    });
    return mealPlanId;
  },
});

export const getMealPlan = query({
  args: { id: v.id("mealPlans") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getUserMealPlans = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("mealPlans")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

export const deleteMealPlan = mutation({
  args: { id: v.id("mealPlans") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
