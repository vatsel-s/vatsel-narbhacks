/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as comments from "../comments.js";
import type * as friends from "../friends.js";
import type * as ingredients from "../ingredients.js";
import type * as inventory from "../inventory.js";
import type * as mealPlans from "../mealPlans.js";
import type * as notes from "../notes.js";
import type * as nutritionCategories from "../nutritionCategories.js";
import type * as nutritionGoals from "../nutritionGoals.js";
import type * as openai from "../openai.js";
import type * as recipes from "../recipes.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  comments: typeof comments;
  friends: typeof friends;
  ingredients: typeof ingredients;
  inventory: typeof inventory;
  mealPlans: typeof mealPlans;
  notes: typeof notes;
  nutritionCategories: typeof nutritionCategories;
  nutritionGoals: typeof nutritionGoals;
  openai: typeof openai;
  recipes: typeof recipes;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
