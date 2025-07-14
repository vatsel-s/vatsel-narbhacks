import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all nutrition goals for a specific user
export const getUserNutritionGoals = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const goals = await ctx.db
      .query("nutritionGoals")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return goals;
  },
});

// Get a specific nutrition goal by type for a user
export const getUserNutritionGoalByType = query({
  args: { 
    userId: v.string(),
    type: v.string()
  },
  handler: async (ctx, args) => {
    const goal = await ctx.db
      .query("nutritionGoals")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("type"), args.type)
        )
      )
      .first();
    return goal;
  },
});

// Add a new nutrition goal
export const addNutritionGoal = mutation({
  args: {
    userId: v.string(),
    type: v.string(),
    targetValue: v.number(),
    unit: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const goalId = await ctx.db.insert("nutritionGoals", {
      userId: args.userId,
      type: args.type,
      targetValue: args.targetValue,
      unit: args.unit,
      startDate: args.startDate,
      endDate: args.endDate,
    });
    return goalId;
  },
});

// Delete a nutrition goal
export const deleteNutritionGoal = mutation({
  args: { id: v.id("nutritionGoals") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
