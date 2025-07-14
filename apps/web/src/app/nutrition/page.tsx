"use client";

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { Id } from '@packages/backend/convex/_generated/dataModel';

interface NutritionGoal {
  _id: Id<"nutritionGoals">;
  type: string;
  targetValue: number;
  unit: string;
  startDate: string;
  endDate?: string;
}

interface AddGoalFormData {
  type: string;
  targetValue: number;
  unit: string;
  startDate: string;
  endDate?: string;
}

export default function NutritionGoals() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<AddGoalFormData>({
    type: '',
    targetValue: 0,
    unit: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const userId = 'user-id'; // Replace with actual user ID from your auth system
  const goals = useQuery(api.nutritionGoals.getUserNutritionGoals, { userId });
  const addGoal = useMutation(api.nutritionGoals.addNutritionGoal);
  const deleteGoal = useMutation(api.nutritionGoals.deleteNutritionGoal);
  const nutritionCategories = useQuery(api.nutritionCategories.getAll) as { name: string; unit: string }[] | null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addGoal({
        ...formData,
        userId,
      });
      setShowAddForm(false);
      setFormData({
        type: '',
        targetValue: 0,
        unit: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      });
    } catch (error) {
      console.error('Failed to add nutrition goal:', error);
    }
  };

  const handleDelete = async (goalId: Id<"nutritionGoals">) => {
    try {
      await deleteGoal({ id: goalId });
    } catch (error) {
      console.error('Failed to delete nutrition goal:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nutrition Goals</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showAddForm ? 'Cancel' : 'Add New Goal'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, unit: nutritionCategories?.find(cat => cat.name === e.target.value)?.unit || '' })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="" disabled>Select a category</option>
                {nutritionCategories?.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Target Value</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                  required
                />
                <span className="text-gray-500">{formData.unit}</span>
              </div>
            </div>
            <div>
              <label className="block mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">End Date (Optional)</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Goal
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals?.map((goal: NutritionGoal) => (
          <div key={goal._id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold capitalize">{goal.type}</h3>
              <button
                onClick={() => handleDelete(goal._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
            <p className="mt-2">
              Target: {goal.targetValue} {goal.unit}
            </p>
            <p className="text-sm text-gray-600">
              Start: {new Date(goal.startDate).toLocaleDateString()}
            </p>
            {goal.endDate && (
              <p className="text-sm text-gray-600">
                End: {new Date(goal.endDate).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}