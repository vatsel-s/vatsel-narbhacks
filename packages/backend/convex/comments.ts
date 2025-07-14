import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all comments, sorted by timestamp descending
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const comments = await ctx.db.query("comments").collect();
    return comments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
});

// Add a comment to a recipe or meal plan
export const addComment = mutation({
  args: {
    userId: v.string(),
    content: v.string(),
    timestamp: v.string(),
    recipeId: v.optional(v.string()),
    mealPlanId: v.optional(v.string()),
    likes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("comments", {
      userId: args.userId,
      content: args.content,
      timestamp: args.timestamp,
      recipeId: args.recipeId,
      mealPlanId: args.mealPlanId,
      likes: args.likes,
    });
  },
});

// Optionally, delete a comment
export const deleteComment = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.commentId);
  },
}); 