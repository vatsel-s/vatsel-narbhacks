import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api";

const Recipes = () => {
  const { user } = useUser();
  const userId = user?.id;
  const allRecipes = useQuery(api.recipes.getAll, {}) || [];
  const possibleData = useQuery(api.recipes.getPossibleRecipes, userId ? { userId } : "skip");
  const nutritionGoals = useQuery(api.nutritionGoals.getUserNutritionGoals, userId ? { userId } : "skip") || [];

  // Simple scoring: sum of absolute differences for each goal type
  function scoreRecipe(recipe) {
    if (!nutritionGoals.length) return 0;
    let score = 0;
    for (const goal of nutritionGoals) {
      const value = recipe.nutrition[goal.type];
      if (typeof value === "number") {
        score += Math.abs(value - goal.targetValue);
      } else {
        score += 1000; // Penalize missing values
      }
    }
    return score;
  }

  // Sort recipes by score (lower is better)
  const sortedRecipes = [...allRecipes].sort((a, b) => scoreRecipe(a) - scoreRecipe(b));

  return (
    <div>
      <h1>Recipes</h1>
      <p>User ID: {userId}</p>
      <h2>Possible Recipes</h2>
      {possibleData.length === 0 ? (
        <p>No possible recipes found for your goals.</p>
      ) : (
        <ul>
          {possibleData.map((recipe) => (
            <li key={recipe.id}>
              {recipe.name} (Score: {scoreRecipe(recipe)})
            </li>
          ))}
        </ul>
      )}

      <h2>All Recipes</h2>
      {sortedRecipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <ul>
          {sortedRecipes.map((recipe) => (
            <li key={recipe.id}>
              {recipe.name} (Score: {scoreRecipe(recipe)})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Recipes; 