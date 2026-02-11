import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "../redux/app/hook";
import { useToast } from "../components/Toast";
import axios from "../config/axios";

interface NutritionGoal {
  id: string;
  goalType: "calories" | "protein" | "carbs" | "fat" | "fiber" | "sodium";
  targetValue: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
}

interface NutritionEntry {
  id: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  createdAt: string;
}

interface DailyNutritionSummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSodium: number;
  entries: NutritionEntry[];
}

interface NutritionAnalysis {
  weeklyAverage: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
  dailyTrends: DailyNutritionSummary[];
  goalProgress: {
    [key: string]: {
      current: number;
      target: number;
      percentage: number;
    };
  };
}

export default function NutritionDashboard() {
    const {   user } = useAppSelector((state) => state.auth)
  const { showToast } = useToast();

  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoal[]>([]);
  const [todaysNutrition, setTodaysNutrition] =
    useState<DailyNutritionSummary | null>(null);
  const [nutritionAnalysis, setNutritionAnalysis] =
    useState<NutritionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [newEntry, setNewEntry] = useState({
    mealType: "breakfast" as "breakfast" | "lunch" | "dinner" | "snack",
    foodName: "",
    quantity: 1,
    unit: "serving",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sodium: 0,
  });

  const [goalSettings, setGoalSettings] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    fiber: 25,
    sodium: 2300,
  });

  const mealTypes = [
    {
      id: "breakfast",
      name: "Breakfast",
      icon: "🌅",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      id: "lunch",
      name: "Lunch",
      icon: "☀️",
      color: "bg-orange-100 text-orange-800",
    },
    {
      id: "dinner",
      name: "Dinner",
      icon: "🌙",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "snack",
      name: "Snack",
      icon: "🍿",
      color: "bg-green-100 text-green-800",
    },
  ];

  const nutritionTypes = [
    {
      id: "calories",
      name: "Calories",
      unit: "kcal",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      id: "protein",
      name: "Protein",
      unit: "g",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "carbs",
      name: "Carbs",
      unit: "g",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: "fat",
      name: "Fat",
      unit: "g",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      id: "fiber",
      name: "Fiber",
      unit: "g",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      id: "sodium",
      name: "Sodium",
      unit: "mg",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ];

  // useEffect(() => {
  //   if (user) {
  //     fetchNutritionData();
  //   }
  // }, [user, selectedDate]);

  // const fetchNutritionData = async () => {
  //   try {
  //     setIsLoading(true);

  //     // Fetch all nutrition data in parallel
  //     const [goalsResponse, todayResponse, analysisResponse] =
  //       await Promise.all([
  //         axios.get(API_ENDPOINTS.NUTRITION.GET_GOALS),
  //         axios.get(API_ENDPOINTS.NUTRITION.GET_DAILY_SUMMARY, {
  //           params: { date: selectedDate },
  //         }),
  //         axios.get(API_ENDPOINTS.NUTRITION.GET_ANALYSIS, {
  //           params: {
  //             startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  //               .toISOString()
  //               .split("T")[0],
  //             endDate: selectedDate,
  //           },
  //         }),
  //       ]);

  //     setNutritionGoals(goalsResponse.data);
  //     setTodaysNutrition(todayResponse.data);
  //     setNutritionAnalysis(analysisResponse.data);
  //   } catch (error) {
  //     console.error("Error fetching nutrition data:", error);
  //     showToast("Failed to load nutrition data", "error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleAddEntry = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!user) {
  //     showToast("You must be logged in to track nutrition", "error");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     const entryData = {
  //       date: selectedDate,
  //       mealType: newEntry.mealType,
  //       foodName: newEntry.foodName.trim(),
  //       quantity: newEntry.quantity,
  //       unit: newEntry.unit,
  //       calories: newEntry.calories,
  //       protein: newEntry.protein,
  //       carbs: newEntry.carbs,
  //       fat: newEntry.fat,
  //       fiber: newEntry.fiber,
  //       sodium: newEntry.sodium,
  //     };

  //     await axios.post(API_ENDPOINTS.NUTRITION.ADD_ENTRY, entryData);

  //     setShowAddEntryModal(false);
  //     setNewEntry({
  //       mealType: "breakfast",
  //       foodName: "",
  //       quantity: 1,
  //       unit: "serving",
  //       calories: 0,
  //       protein: 0,
  //       carbs: 0,
  //       fat: 0,
  //       fiber: 0,
  //       sodium: 0,
  //     });

  //     await fetchNutritionData(); // Refresh data
  //     showToast("Nutrition entry added successfully!", "success");
  //   } catch (error: any) {
  //     console.error("Error adding nutrition entry:", error);
  //     showToast(
  //       error.response?.data?.message || "Failed to add nutrition entry",
  //       "error"
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleUpdateGoals = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   setIsSubmitting(true);
  //   try {
  //     await axios.put(API_ENDPOINTS.NUTRITION.UPDATE_GOALS, goalSettings);

  //     setShowGoalsModal(false);
  //     await fetchNutritionData(); // Refresh data
  //     showToast("Nutrition goals updated successfully!", "success");
  //   } catch (error: any) {
  //     console.error("Error updating goals:", error);
  //     showToast(
  //       error.response?.data?.message || "Failed to update goals",
  //       "error"
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const getGoalProgress = (nutrientType: string) => {
    if (!todaysNutrition || !nutritionGoals.length)
      return { current: 0, target: 0, percentage: 0 };

    const goal = nutritionGoals.find(
      (g) => g.goalType === nutrientType && g.isActive
    );
    if (!goal) return { current: 0, target: 0, percentage: 0 };

    const current =
      (todaysNutrition[
        `total${
          nutrientType.charAt(0).toUpperCase() + nutrientType.slice(1)
        }` as keyof DailyNutritionSummary
      ] as number) || 0;
    const target = goal.targetValue;
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

    return { current, target, percentage };
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-yellow-500";
    if (percentage >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto max-w-4xl px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Nutrition Dashboard
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to track your nutrition.
          </p>
          <Button onClick={() => (window.location.href = "/signin")}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nutrition Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Track your daily nutrition and achieve your health goals.
          </p>
        </div>

        {/* Date Selector and Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <Button
                onClick={() =>
                  setSelectedDate(new Date().toISOString().split("T")[0])
                }
                variant="outline"
                size="sm"
              >
                Today
              </Button>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddEntryModal(true)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                ➕ Add Food
              </Button>
              <Button onClick={() => setShowGoalsModal(true)} variant="outline">
                🎯 Set Goals
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" message="Loading nutrition data..." />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Daily Progress */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Daily Progress - {new Date(selectedDate).toLocaleDateString()}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {nutritionTypes.map((nutrient) => {
                    const progress = getGoalProgress(nutrient.id);

                    return (
                      <div key={nutrient.id} className="text-center">
                        <div
                          className={`w-20 h-20 mx-auto mb-3 rounded-full ${nutrient.bgColor} flex items-center justify-center`}
                        >
                          <div className="text-center">
                            <div
                              className={`text-lg font-bold ${nutrient.color}`}
                            >
                              {Math.round(progress.current)}
                            </div>
                            <div className="text-xs text-gray-600">
                              {nutrient.unit}
                            </div>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="text-sm font-medium text-gray-900">
                            {nutrient.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {Math.round(progress.current)} /{" "}
                            {Math.round(progress.target)} {nutrient.unit}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                              progress.percentage
                            )}`}
                            style={{
                              width: `${Math.min(progress.percentage, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round(progress.percentage)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Today's Meals */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Today's Food Entries
                </h3>

                {todaysNutrition?.entries &&
                todaysNutrition.entries.length > 0 ? (
                  <div className="space-y-4">
                    {mealTypes.map((mealType) => {
                      const mealEntries = todaysNutrition.entries.filter(
                        (entry) => entry.mealType === mealType.id
                      );

                      if (mealEntries.length === 0) return null;

                      return (
                        <div
                          key={mealType.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">{mealType.icon}</span>
                            <h4 className="font-medium text-gray-900">
                              {mealType.name}
                            </h4>
                          </div>

                          <div className="space-y-2">
                            {mealEntries.map((entry) => (
                              <div
                                key={entry.id}
                                className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                              >
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {entry.foodName}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {entry.quantity} {entry.unit} •{" "}
                                    {entry.calories} cal
                                  </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                  P: {entry.protein}g • C: {entry.carbs}g • F:{" "}
                                  {entry.fat}g
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">🍽️</div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No food entries for this date
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Start tracking your nutrition by adding your first meal!
                    </p>
                    <Button
                      onClick={() => setShowAddEntryModal(true)}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Add Your First Entry
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Weekly Summary */}
              {nutritionAnalysis && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Weekly Average
                  </h3>

                  <div className="space-y-3">
                    {nutritionTypes.map((nutrient) => {
                      const avg =
                        nutritionAnalysis.weeklyAverage[
                          nutrient.id as keyof typeof nutritionAnalysis.weeklyAverage
                        ];

                      return (
                        <div
                          key={nutrient.id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-600">
                            {nutrient.name}:
                          </span>
                          <span className="font-medium">
                            {Math.round(avg)} {nutrient.unit}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h3>

                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {todaysNutrition?.totalCalories || 0}
                    </div>
                    <div className="text-sm text-gray-600">Calories Today</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {todaysNutrition?.totalProtein || 0}g
                      </div>
                      <div className="text-xs text-gray-600">Protein</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600">
                        {todaysNutrition?.totalCarbs || 0}g
                      </div>
                      <div className="text-xs text-gray-600">Carbs</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">
                        {todaysNutrition?.totalFat || 0}g
                      </div>
                      <div className="text-xs text-gray-600">Fat</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>

                <div className="space-y-3">
                  <Button
                    onClick={() => setShowAddEntryModal(true)}
                    variant="outline"
                    className="w-full text-left justify-start"
                  >
                    🍽️ Log Food
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/meal-planning")}
                    variant="outline"
                    className="w-full text-left justify-start"
                  >
                    📅 View Meal Plans
                  </Button>
                  <Button
                    onClick={() => setShowGoalsModal(true)}
                    variant="outline"
                    className="w-full text-left justify-start"
                  >
                    🎯 Update Goals
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddEntryModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Nutrition Entry
                </h3>
                <button
                  onClick={() => setShowAddEntryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
                   {/*  onSubmit={handleAddEntry}       */}
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Type
                  </label>
                  <select
                    value={newEntry.mealType}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        mealType: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {mealTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Name *
                  </label>
                  <input
                    type="text"
                    value={newEntry.foodName}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, foodName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., Grilled Chicken Breast"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={newEntry.quantity}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          quantity: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={newEntry.unit}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, unit: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="serving">serving</option>
                      <option value="cup">cup</option>
                      <option value="tbsp">tbsp</option>
                      <option value="tsp">tsp</option>
                      <option value="piece">piece</option>
                      <option value="slice">slice</option>
                      <option value="g">grams</option>
                      <option value="oz">ounces</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calories
                    </label>
                    <input
                      type="number"
                      value={newEntry.calories}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          calories: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      value={newEntry.protein}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          protein: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      value={newEntry.carbs}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          carbs: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fat (g)
                    </label>
                    <input
                      type="number"
                      value={newEntry.fat}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          fat: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fiber (g)
                    </label>
                    <input
                      type="number"
                      value={newEntry.fiber}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          fiber: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sodium (mg)
                    </label>
                    <input
                      type="number"
                      value={newEntry.sodium}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          sodium: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  >
                    Add Entry
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddEntryModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Set Nutrition Goals
                </h3>
                <button
                  onClick={() => setShowGoalsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
                  {/*    onSubmit={handleUpdateGoals}     */}
              <form  className="space-y-4">
                {nutritionTypes.map((nutrient) => (
                  <div key={nutrient.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {nutrient.name} ({nutrient.unit})
                    </label>
                    <input
                      type="number"
                      value={
                        goalSettings[nutrient.id as keyof typeof goalSettings]
                      }
                      onChange={(e) =>
                        setGoalSettings({
                          ...goalSettings,
                          [nutrient.id]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                      step={nutrient.id === "sodium" ? "1" : "0.1"}
                    />
                  </div>
                ))}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  >
                    Update Goals
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowGoalsModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
