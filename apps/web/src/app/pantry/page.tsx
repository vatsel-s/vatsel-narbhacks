"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { useState } from "react";
import { Id } from "@packages/backend/convex/_generated/dataModel";

interface IngredientFormData {
  ingredientName: string;
  quantity: number;
  expirationDate: string;
}

const initialFormState: IngredientFormData = {
  ingredientName: "",
  quantity: 1,
  expirationDate: "",
};

interface IngredientDisplayData {
  _id: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  expirationDate: string;
  dateAdded: string;
}

interface IngredientData {
  name: string;
  unit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  vitaminA?: number;
  vitaminC?: number;
  iron?: number;
  calcium?: number;
  sugar?: number;
  sodium?: number;
  potassium?: number;
  cholesterol?: number;
  saturatedFat?: number;
  transFat?: number;
  vitaminD?: number;
}

export default function Ingredients() {
  const [formData, setFormData] = useState<IngredientFormData>(initialFormState);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const ingredients = useQuery(api.inventory.getIngredients) as IngredientDisplayData[] | null;
  const addIngredient = useMutation(api.inventory.addIngredient);
  const deleteIngredient = useMutation(api.inventory.deleteIngredient);
  const allIngredients = useQuery(api.ingredients.getAll) as IngredientData[] | null;

  const selectedIngredient = allIngredients?.find(i => i.name === formData.ingredientName);
  const unit = selectedIngredient?.unit || "unit";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addIngredient({
        ingredientName: formData.ingredientName,
        unit: unit,
        quantity: formData.quantity,
        expirationDate: formData.expirationDate,
      });
      setFormData(initialFormState);
    } catch (error) {
      console.error("Failed to add ingredient:", error);
    }
  };

  const handleDelete = async (ingredientId: string) => {
    try {
      await deleteIngredient({ ingredientId: ingredientId as Id<"inventory"> });
    } catch (error) {
      console.error("Failed to delete ingredient:", error);
    }
  };

  const handleIngredientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      ingredientName: e.target.value,
      quantity: 1, // reset quantity to 1 when changing ingredient
    });
  };

  const getNutrition = (ingredientName: string) => {
    return allIngredients?.find((i) => i.name === ingredientName);
  };

  // Filter ingredients by search
  const filteredIngredients = allIngredients?.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Pantry Ingredients</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label htmlFor="ingredientSearch" className="block text-sm font-medium">
            Search Ingredients
          </label>
          <input
            type="text"
            id="ingredientSearch"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            placeholder="Search for an ingredient..."
          />
        </div>
        <div>
          <label htmlFor="ingredientName" className="block text-sm font-medium">
            Ingredient Name
          </label>
          <select
            id="ingredientName"
            value={formData.ingredientName}
            onChange={handleIngredientChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            required
          >
            <option value="" disabled>Select an ingredient</option>
            {filteredIngredients?.map((item) => (
              <option key={item.name} value={item.name}>{item.name} ({item.unit})</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium">
            Quantity <span className="text-gray-500">({unit})</span>
          </label>
          <input
            type="number"
            id="quantity"
            value={formData.quantity ?? 1}
            onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            required
            min="1"
          />
        </div>
        <div>
          <label htmlFor="expirationDate" className="block text-sm font-medium">
            Expiration Date
          </label>
          <input
            type="date"
            id="expirationDate"
            value={formData.expirationDate ?? ""}
            onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Ingredient
        </button>
      </form>
      <div className="space-y-2">
        {ingredients?.map((ingredient) => {
          const isExpanded = expanded === ingredient._id;
          const nutrition = getNutrition(ingredient.ingredientName);
          return (
            <div key={ingredient._id} className="p-3 border rounded">
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Name:</strong> {ingredient.ingredientName}</p>
                  <p><strong>Amount:</strong> {ingredient.quantity} {ingredient.unit}</p>
                  <p><strong>Expires:</strong> {new Date(ingredient.expirationDate).toLocaleDateString()}</p>
                  <p><strong>Added:</strong> {new Date(ingredient.dateAdded).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : ingredient._id)}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    {isExpanded ? "Hide Nutrition" : "Show Nutrition"}
                  </button>
                  <button
                    onClick={() => handleDelete(ingredient._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {isExpanded && nutrition && (
                <div className="mt-2 bg-gray-50 p-2 rounded">
                  <h4 className="font-semibold mb-1">Nutrition Facts (per {nutrition.unit}):</h4>
                  <ul className="grid grid-cols-2 gap-x-4 text-sm">
                    <li><strong>Calories:</strong> {nutrition.calories}</li>
                    <li><strong>Protein:</strong> {nutrition.protein}g</li>
                    <li><strong>Carbs:</strong> {nutrition.carbohydrates}g</li>
                    <li><strong>Fat:</strong> {nutrition.fat}g</li>
                    {nutrition.fiber !== undefined && <li><strong>Fiber:</strong> {nutrition.fiber}g</li>}
                    {nutrition.sugar !== undefined && <li><strong>Sugar:</strong> {nutrition.sugar}g</li>}
                    {nutrition.sodium !== undefined && <li><strong>Sodium:</strong> {nutrition.sodium}mg</li>}
                    {nutrition.calcium !== undefined && <li><strong>Calcium:</strong> {nutrition.calcium}mg</li>}
                    {nutrition.iron !== undefined && <li><strong>Iron:</strong> {nutrition.iron}mg</li>}
                    {nutrition.vitaminA !== undefined && <li><strong>Vitamin A:</strong> {nutrition.vitaminA}μg</li>}
                    {nutrition.vitaminC !== undefined && <li><strong>Vitamin C:</strong> {nutrition.vitaminC}mg</li>}
                    {nutrition.potassium !== undefined && <li><strong>Potassium:</strong> {nutrition.potassium}mg</li>}
                    {nutrition.cholesterol !== undefined && <li><strong>Cholesterol:</strong> {nutrition.cholesterol}mg</li>}
                    {nutrition.saturatedFat !== undefined && <li><strong>Saturated Fat:</strong> {nutrition.saturatedFat}g</li>}
                    {nutrition.transFat !== undefined && <li><strong>Trans Fat:</strong> {nutrition.transFat}g</li>}
                    {nutrition.vitaminD !== undefined && <li><strong>Vitamin D:</strong> {nutrition.vitaminD}μg</li>}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
