// This file should be renamed to ingredients.ts and all references to 'pantryItems' should be 'ingredients'.
// Ensure the schema has 'ingredients' as a table. If not, update schema.ts accordingly.
import { query } from "./_generated/server";
import { v } from "convex/values";

// No add mutation exported, as ingredients are pregenerated

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("ingredients").collect();
  },
});

export const get = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ingredients")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();
  },
}); 