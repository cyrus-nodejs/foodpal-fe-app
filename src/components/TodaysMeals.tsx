import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import { useToast } from "./Toast";
import axios, { API_ENDPOINTS } from "../config/api";

interface TodayMealPlan {
  id: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  recipeId: string;
  recipeName: string;
  servings: number;
  notes?: string;
  recipe?: {
    id: string;
    title: string;
    imageUrl?: string;
    prepTime: number;
    cookTime: number;
    difficulty: string;
  };
}

interface TodaysMealsProps {
  className?: string;
}

export default function TodaysMeals({ className = "" }: TodaysMealsProps) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [todaysMeals, setTodaysMeals] = useState<TodayMealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mealTypes = [
    {
      id: "breakfast",
      name: "Breakfast",
      icon: "🌅",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    {
      id: "lunch",
      name: "Lunch",
      icon: "☀️",
      color: "bg-orange-100 text-orange-800 border-orange-200",
    },
    {
      id: "dinner",
      name: "Dinner",
      icon: "🌙",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      id: "snack",
      name: "Snack",
      icon: "🍿",
      color: "bg-green-100 text-green-800 border-green-200",
    },
  ];

  useEffect(() => {
    if (user) {
      fetchTodaysMeals();
    }
  }, [user]);

  const fetchTodaysMeals = async () => {
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split("T")[0];

      const response = await axios.get(API_ENDPOINTS.MEAL_PLANS.GET_PLANS, {
        params: {
          startDate: today,
          endDate: today,
        },
      });

      setTodaysMeals(response.data);
    } catch (error) {
      console.error("Error fetching today's meals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = async (mealType: string) => {
    try {
      // Redirect to meal planning page with pre-selected date and meal type
      const today = new Date().toISOString().split("T")[0];
      window.location.href = `/meal-planning?date=${today}&mealType=${mealType}`;
    } catch (error) {
      showToast("Failed to navigate to meal planning", "error");
    }
  };

  const getMealTypeInfo = (mealTypeId: string) => {
    return mealTypes.find((type) => type.id === mealTypeId) || mealTypes[0];
  };

  if (!user) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Today's Meals
          </h3>
          <p className="text-gray-600 mb-4">Sign in to see your meal plans</p>
          <Button size="sm" onClick={() => (window.location.href = "/signin")}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Today's Meals</h3>
        <Button
          size="sm"
          onClick={() => (window.location.href = "/meal-planning")}
          variant="outline"
        >
          View Full Plan
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      ) : (
        <div className="space-y-4">
          {mealTypes.map((mealType) => {
            const meal = todaysMeals.find((m) => m.mealType === mealType.id);
            const mealTypeInfo = getMealTypeInfo(mealType.id);

            return (
              <div
                key={mealType.id}
                className={`border rounded-lg p-4 ${mealTypeInfo.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{mealType.icon}</span>
                    <div>
                      <h4 className="font-medium">{mealType.name}</h4>
                      {meal ? (
                        <div className="mt-1">
                          <p className="text-sm font-medium text-gray-900">
                            {meal.recipeName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {meal.servings} serving
                            {meal.servings !== 1 ? "s" : ""}
                            {meal.recipe && (
                              <span className="ml-2">
                                • {meal.recipe.prepTime + meal.recipe.cookTime}{" "}
                                min • {meal.recipe.difficulty}
                              </span>
                            )}
                          </p>
                          {meal.notes && (
                            <p className="text-xs text-gray-600 mt-1 italic">
                              "{meal.notes}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 mt-1">
                          No meal planned
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {meal ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          (window.location.href = `/recipe/${meal.recipeId}`)
                        }
                        className="text-xs"
                      >
                        View Recipe
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleQuickAdd(mealType.id)}
                        className="text-xs bg-white/50 hover:bg-white/80 text-gray-700"
                      >
                        Add Meal
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {todaysMeals.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🍽️</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No meals planned for today
              </h4>
              <p className="text-gray-600 mb-4">
                Start planning your meals to stay organized and eat well!
              </p>
              <Button
                onClick={() => (window.location.href = "/meal-planning")}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Plan Today's Meals
              </Button>
            </div>
          )}

          {todaysMeals.length > 0 && todaysMeals.length < 4 && (
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                You have {4 - todaysMeals.length} meal
                {4 - todaysMeals.length !== 1 ? "s" : ""} left to plan for today
              </p>
              <Button
                size="sm"
                onClick={() => (window.location.href = "/meal-planning")}
                variant="outline"
              >
                Complete Your Meal Plan
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
