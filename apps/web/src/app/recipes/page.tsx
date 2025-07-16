"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useState, useRef, useCallback } from "react";
import Calendar, { RecipeEvent } from "@/components/common/Calendar";

export default function RecipesPage() {
  const { user } = useUser();
  const userId = user?.id;
  const [marking, setMarking] = useState<string | null>(null);
  const [draggingRecipeId, setDraggingRecipeId] = useState<string | null>(null);
  const [cellRects, setCellRects] = useState<Record<string, DOMRect>>({});
  const calendarRef = useRef<HTMLDivElement>(null);
  const possibleData = useQuery(
    api.recipes.getPossibleRecipes,
    userId ? { userId } : "skip"
  );
  const mealPlans = useQuery(
    api.mealPlans.getUserMealPlans,
    userId ? { userId } : "skip"
  );
  const allRecipes = useQuery(api.recipes.getAll, {});
  const markAsMade = useMutation(api.recipes.markAsMade);
  const addMealPlan = useMutation(api.mealPlans.addMealPlan);
  const deleteMealPlan = useMutation(api.mealPlans.deleteMealPlan);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  // Register cell positions
  const handleDateCellMount = useCallback((date: Date, rect: DOMRect) => {
    setCellRects(prev => ({ ...prev, [date.toISOString().split('T')[0]]: rect }));
  }, []);

  // Join mealPlans with recipe data to create calendar events
  const calendarEvents: RecipeEvent[] = (mealPlans && allRecipes)
    ? mealPlans.map((plan: any) => {
        const recipe = allRecipes.find((r: any) => r._id === plan.recipeId);
        if (!recipe) return null;
        // Use plan.date as start, add 1 hour for end
        const start = new Date(plan.date);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        return {
          title: recipe.name,
          start,
          end,
          recipeId: recipe._id,
          description: "No description available.",
        };
      }).filter(Boolean) as RecipeEvent[]
    : [];

  // Helper to get all visible days in the current calendar view
  const getVisibleDays = () => {
    // For simplicity, show overlays for the next 35 days (5 weeks)
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const days: Date[] = [];
    for (let i = 0; i < 35; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

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

  // Drop handler for overlay
  const handleDayDrop = async (date: Date) => {
    if (!draggingRecipeId || !userId) return;
    try {
      await addMealPlan({ userId, recipeId: draggingRecipeId, date: date.toISOString() });
      setDraggingRecipeId(null);
    } catch (e) {
      alert('Failed to schedule recipe: ' + (e as Error).message);
    }
  };

  // Handler for calendar date click
  const handleCalendarDateClick = (date: Date) => {
    setScheduleDate(date);
    setShowScheduleModal(true);
    setSelectedRecipeId(null);
  };

  // Handler for scheduling a recipe
  const handleScheduleRecipe = async () => {
    if (!userId || !selectedRecipeId || !scheduleDate) return;
    try {
      await addMealPlan({ userId, recipeId: selectedRecipeId, date: scheduleDate.toISOString() });
      setShowScheduleModal(false);
      setScheduleDate(null);
      setSelectedRecipeId(null);
    } catch (e) {
      alert("Failed to schedule recipe: " + (e as Error).message);
    }
  };

  // Handler to remove a scheduled recipe (meal plan) from the calendar
  const handleRemoveEvent = async (recipeId: string) => {
    if (!mealPlans) return;
    // Find the meal plan for this recipe (on any date)
    const plan = mealPlans.find((p: any) => p.recipeId === recipeId);
    if (!plan) return;
    try {
      await deleteMealPlan({ id: plan._id });
      // Optionally, show a toast or notification
    } catch (e) {
      alert("Failed to remove scheduled recipe: " + (e as Error).message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Directions for users */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded text-blue-900">
        <h2 className="font-bold mb-2">How to use the Meal Planner:</h2>
        <ul className="list-disc list-inside ml-4">
          <li>Click a day on the calendar to schedule a recipe.</li>
          <li>To remove a scheduled recipe, click on the recipe event in the calendar and use the “Remove” button.</li>
        </ul>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center">Recipes</h1>
      <div className="space-y-8" ref={calendarRef} style={{ position: 'relative' }}>
        {/* Calendar for scheduling recipes */}
        <Calendar
          events={calendarEvents}
          onDateCellMount={handleDateCellMount}
          onSelectDate={handleCalendarDateClick}
          onRemoveEvent={handleRemoveEvent}
        />
        {/* Overlay drop zones when dragging */}
        {draggingRecipeId && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 20 }}>
            {Object.entries(cellRects).map(([dateStr, rect]) => (
              <div
                key={dateStr}
                style={{
                  position: 'absolute',
                  left: rect.left - (calendarRef.current?.getBoundingClientRect().left || 0),
                  top: rect.top - (calendarRef.current?.getBoundingClientRect().top || 0),
                  width: rect.width,
                  height: rect.height,
                  background: 'rgba(0,0,255,0.1)',
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                }}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  handleDayDrop(new Date(dateStr));
                }}
              />
            ))}
          </div>
        )}
        {/* Schedule Recipe Modal */}
        {showScheduleModal && scheduleDate && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Schedule a Recipe for {scheduleDate.toLocaleDateString()}</h2>
              <select
                className="w-full p-2 border rounded mb-4"
                value={selectedRecipeId || ""}
                onChange={e => setSelectedRecipeId(e.target.value)}
              >
                <option value="" disabled>Select a recipe...</option>
                {possibleData?.possible?.map((recipe: any) => (
                  <option key={recipe._id} value={recipe._id}>{recipe.name} (You Can Make)</option>
                ))}
                {possibleData?.almost?.map((recipe: any) => (
                  <option key={recipe._id} value={recipe._id}>{recipe.name} (Almost Possible)</option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleScheduleRecipe}
                  disabled={!selectedRecipeId}
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Existing recipes content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-green-700">You Can Make</h2>
            {possibleData?.possible?.length === 0 && (
              <p className="text-gray-500">No recipes are fully possible with your current pantry.</p>
            )}
            {possibleData?.possible?.map((recipe: any, idx: number) => (
              <div
                key={recipe._id}
                className="bg-white rounded-lg shadow p-6 mb-6"
                draggable
                onDragStart={() => setDraggingRecipeId(recipe._id)}
                onDragEnd={() => setDraggingRecipeId(null)}
                style={{ cursor: 'grab' }}
              >
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
            {possibleData?.almost?.map((recipe: any, idx: number) => (
              <div
                key={recipe._id}
                className="bg-yellow-50 rounded-lg shadow p-6 mb-6 border border-yellow-200"
                draggable
                onDragStart={() => setDraggingRecipeId(recipe._id)}
                onDragEnd={() => setDraggingRecipeId(null)}
                style={{ cursor: 'grab' }}
              >
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
    </div>
  );
}

