import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: {
    name: v.string(),
    unit: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("nutritionCategories", args);
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("nutritionCategories").collect();
  },
}); 