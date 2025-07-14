"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";

export default function RecipesPage() {
  const { user } = useUser();
  const userId = user?.id;
  const [marking, setMarking] = useState<string | null>(null);
  const possibleData = useQuery(
    api.recipes.getPossibleRecipes,
    userId ? { userId } : "skip"
  );
  const markAsMade = useMutation(api.recipes.markAsMade);

  const handleMarkAsMade = async (recipeId: string) => {
    if (!userId) return;
    setMarking(recipeId);
    try {
      await markAsMade({ userId, recipeId });
    } catch (e) {
      alert("Failed to mark as made: " + (e as Error).message);
    } finally {
      setMarking(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-green-700">You Can Make</h2>
          {possibleData?.possible?.length === 0 && (
            <p className="text-gray-500">No recipes are fully possible with your current pantry.</p>
          )}
          {possibleData?.possible?.map((recipe: any) => (
            <div key={recipe._id} className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{recipe.name}</h3>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={() => handleMarkAsMade(recipe._id)}
                  disabled={marking === recipe._id}
                >
                  {marking === recipe._id ? "Marking..." : "Mark as Made"}
                </button>
              </div>

              <div className="mb-2">
                <strong>Nutrition:</strong> {recipe.nutrition.calories} kcal, {recipe.nutrition.protein}g protein, {recipe.nutrition.carbs}g carbs, {recipe.nutrition.fat}g fat
              </div>
              <div>
                <strong>Ingredients:</strong>
                <ul className="list-disc list-inside ml-4">
                  {recipe.ingredients.map((ing: any, idx: number) => (
                    <li key={idx}>{ing.ingredientName} - {ing.quantity} {ing.unit}</li>
                  ))}
                </ul>
              </div>
              {/* Comments and social features will go here */}
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-yellow-700">Almost Possible</h2>
          {possibleData?.almost?.length === 0 && (
            <p className="text-gray-500">No almost possible recipes found.</p>
          )}
          {possibleData?.almost?.map((recipe: any) => (
            <div key={recipe._id} className="bg-yellow-50 rounded-lg shadow p-6 mb-6 border border-yellow-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{recipe.name}</h3>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={() => handleMarkAsMade(recipe._id)}
                  disabled={marking === recipe._id}
                >
                  {marking === recipe._id ? "Marking..." : "Mark as Made"}
                </button>
              </div>
              <div className="mb-2">
                <strong>Nutrition:</strong> {recipe.nutrition.calories} kcal, {recipe.nutrition.protein}g protein, {recipe.nutrition.carbs}g carbs, {recipe.nutrition.fat}g fat
              </div>
              <div>
                <strong>Ingredients:</strong>
                <ul className="list-disc list-inside ml-4">
                  {recipe.ingredients.map((ing: any, idx: number) => (
                    <li key={idx}>{ing.ingredientName} - {ing.quantity} {ing.unit}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-2 text-sm text-yellow-800">
                Missing 1-2 ingredients. Add them to your pantry to make this recipe!
              </div>
              {/* Comments and social features will go here */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

