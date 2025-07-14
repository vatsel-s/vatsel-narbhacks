import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User inventory table to track ingredients
  inventory: defineTable({
    userId: v.string(),
    ingredientName: v.string(),
    quantity: v.number(),
    unit: v.string(),
    expirationDate: v.string(), // ISO date string
    dateAdded: v.string(), // ISO date string
  }),

  // Pregenerated recipes table
  recipes: defineTable({
    name: v.string(),
    ingredients: v.array(v.object({
      ingredientName: v.string(),
      quantity: v.number(),
      unit: v.string(),
    })),
    nutrition: v.object({
      calories: v.optional(v.number()),
      protein: v.optional(v.number()),
      carbs: v.optional(v.number()),
      fat: v.optional(v.number()),
      fiber: v.optional(v.number()),
      vitaminA: v.optional(v.number()),
      vitaminC: v.optional(v.number()),
      iron: v.optional(v.number()),
      calcium: v.optional(v.number()),
      sugar: v.optional(v.number()),
      sodium: v.optional(v.number()),
      potassium: v.optional(v.number()),
      cholesterol: v.optional(v.number()),
      saturatedFat: v.optional(v.number()),
      transFat: v.optional(v.number()),
      vitaminD: v.optional(v.number()),
    }),
  }),

  // Pregenerated nutrition categories table
  nutritionCategories: defineTable({
    name: v.string(), // e.g., 'Calories', 'Protein', etc.
    unit: v.string(), // e.g., 'kcal', 'grams', etc.
  }),

  // Pregenerated ingredients table
  ingredients: defineTable({
    name: v.string(),
    unit: v.string(),
    calories: v.number(),
    protein: v.number(),
    carbohydrates: v.number(),
    fat: v.number(),
    fiber: v.optional(v.number()),
    vitaminA: v.optional(v.number()),
    vitaminC: v.optional(v.number()),
    iron: v.optional(v.number()),
    calcium: v.optional(v.number()),
    sugar: v.optional(v.number()),
    sodium: v.optional(v.number()),
    potassium: v.optional(v.number()),
    cholesterol: v.optional(v.number()),
    saturatedFat: v.optional(v.number()),
    transFat: v.optional(v.number()),
    vitaminD: v.optional(v.number()),
  }),

  // Nutrition goals table
  nutritionGoals: defineTable({
    userId: v.string(),
    type: v.string(), // References nutritionCategories.name
    targetValue: v.number(),
    unit: v.string(),
    startDate: v.string(), // ISO date string
    endDate: v.optional(v.string()), // ISO date string
  }),

  // Meal plans table
  mealPlans: defineTable({
    userId: v.string(),
    recipeId: v.string(),
    date: v.string(), // ISO date string
  }),

  // Friends/relationships table
  friends: defineTable({
    userId: v.string(),
    friendId: v.string(),
    status: v.string(), // pending, accepted, rejected, blocked
    dateConnected: v.string(), // ISO date string
  }),

  // Comments table for meal plans and recipes
  comments: defineTable({
    userId: v.string(),
    mealPlanId: v.optional(v.string()), // Reference to mealPlans table
    recipeId: v.optional(v.string()), // Reference to recipes table
    content: v.string(),
    timestamp: v.string(), // ISO date string
    likes: v.optional(v.number()),
  }),
});

