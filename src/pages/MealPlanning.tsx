import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/app/hook";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../components/Toast";


interface MealPlan {
  id: string;
  userId: string;
  date: string;
  meals: {
    breakfast?: MealEntry;
    lunch?: MealEntry;
    dinner?: MealEntry;
    snack?: MealEntry;
  };
  createdAt: string;
  updatedAt: string;
  version: number; // For data integrity
  checksum: string; // For corruption detection
}

interface MealEntry {
  id: string;
  recipeId: string;
  recipeName: string;
  servings: number;
  notes?: string;
  calories?: number;
  prepTime?: number;
}

interface Recipe {
  id: string;
  title: string;
  imageUrl?: string;
  prepTime: number;
  cookTime: number;
  difficulty: string;
  calories?: number;
}

export default function MealPlanning() {
    const {   user } = useAppSelector((state) => state.auth)
  const { showToast } = useToast();

  // State management with corruption prevention
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedMeal, setSelectedMeal] = useState<
    keyof MealPlan["meals"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [newMeal, setNewMeal] = useState<Partial<MealEntry>>({
    servings: 1,
    notes: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Data integrity functions
  const generateChecksum = (mealPlan: Omit<MealPlan, "checksum">): string => {
    const dataString = JSON.stringify({
      id: mealPlan.id,
      userId: mealPlan.userId,
      date: mealPlan.date,
      meals: mealPlan.meals,
      version: mealPlan.version,
    });
    // Simple checksum (in production, use a proper hash function)
    return btoa(dataString).slice(0, 16);
  };

  const validateMealPlan = (mealPlan: MealPlan): boolean => {
    try {
      const expectedChecksum = generateChecksum(mealPlan);
      if (mealPlan.checksum !== expectedChecksum) {
        console.warn(`Checksum mismatch for meal plan ${mealPlan.id}`);
        return false;
      }

      // Additional validation
      if (!mealPlan.id || !mealPlan.userId || !mealPlan.date) {
        console.warn(`Invalid meal plan structure: ${mealPlan.id}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error validating meal plan:", error);
      return false;
    }
  };

  // Local storage backup system
  const saveToLocalBackup = (mealPlans: MealPlan[]) => {
    try {
      const backup = {
        data: mealPlans,
        timestamp: new Date().toISOString(),
        userId: user?._id,
      };
      localStorage.setItem(
        `mealPlans_backup_${user?._id}`,
        JSON.stringify(backup)
      );
    } catch (error) {
      console.error("Failed to create local backup:", error);
    }
  };

  const loadFromLocalBackup = (): MealPlan[] => {
    try {
      const backupKey = `mealPlans_backup_${user?._id}`;
      const backup = localStorage.getItem(backupKey);
      if (backup) {
        const parsed = JSON.parse(backup);
        if (parsed.userId === user?._id && parsed.data) {
          return parsed.data.filter(validateMealPlan);
        }
      }
    } catch (error) {
      console.error("Failed to load local backup:", error);
    }
    return [];
  };

  // Fetch data with error recovery
  // const fetchMealPlans = async () => {
  //   try {
  //     setIsLoading(true);
  //     const startDate = new Date(selectedDate);
  //     startDate.setDate(startDate.getDate() - 3); // Load a week's worth
  //     const endDate = new Date(selectedDate);
  //     endDate.setDate(endDate.getDate() + 3);

  //     const response = await axios.get(API_ENDPOINTS.MEAL_PLANS.GET_PLANS, {
  //       params: {
  //         startDate: startDate.toISOString().split("T")[0],
  //         endDate: endDate.toISOString().split("T")[0],
  //       },
  //       timeout: 10000, // 10 second timeout
  //     });

  //     const validPlans = response.data.filter(validateMealPlan);
  //     const corruptedCount = response.data.length - validPlans.length;

  //     if (corruptedCount > 0) {
  //       showToast(
  //         `Found ${corruptedCount} corrupted meal plan(s). Using backup data.`,
  //         "warning"
  //       );
  //       // Attempt to restore from backup
  //       const backupPlans = loadFromLocalBackup();
  //       const mergedPlans = [...validPlans, ...backupPlans].reduce(
  //         (acc: MealPlan[], plan) => {
  //           const existing = acc.find((p: MealPlan) => p.id === plan.id);
  //           if (!existing || plan.version > existing.version) {
  //             acc = acc.filter((p: MealPlan) => p.id !== plan.id);
  //             acc.push(plan);
  //           }
  //           return acc;
  //         },
  //         [] as MealPlan[]
  //       );
  //       setMealPlans(mergedPlans);
  //     } else {
  //       setMealPlans(validPlans);
  //     }

  //     // Create backup after successful load
  //     saveToLocalBackup(validPlans);
  //   } catch (error) {
  //     console.error("Error fetching meal plans:", error);
  //     showToast(
  //       "Failed to load meal plans from server. Loading from backup...",
  //       "warning"
  //     );

  //     // Fallback to local backup
  //     const backupPlans = loadFromLocalBackup();
  //     setMealPlans(backupPlans);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const fetchRecipes = async () => {
  //   try {
  //     const response = await axios.get("/api/recipes", { timeout: 10000 });
  //     setRecipes(response.data);
  //   } catch (error) {
  //     console.error("Error fetching recipes:", error);
  //     showToast("Failed to load recipes", "error");
  //   }
  // };

  // // Save meal plan with corruption prevention
  // const saveMealPlan = async (mealPlan: MealPlan) => {
  //   try {
  //     // Validate before saving
  //     if (!validateMealPlan(mealPlan)) {
  //       throw new Error("Invalid meal plan data");
  //     }

  //     const response = await axios.post(
  //       API_ENDPOINTS.MEAL_PLANS.CREATE,
  //       mealPlan,
  //       {
  //         timeout: 15000,
  //         headers: {
  //           "Content-Type": "application/json",
  //           "X-Data-Version": mealPlan.version.toString(),
  //         },
  //       }
  //     );

  //     // Verify the saved data
  //     if (!validateMealPlan(response.data)) {
  //       throw new Error("Server returned corrupted data");
  //     }

  //     return response.data;
  //   } catch (error) {
  //     console.error("Error saving meal plan:", error);

  //     // Save to local backup if server fails
  //     const currentBackup = loadFromLocalBackup();
  //     const updatedBackup = [
  //       ...currentBackup.filter((p) => p.id !== mealPlan.id),
  //       mealPlan,
  //     ];
  //     saveToLocalBackup(updatedBackup);

  //     throw error;
  //   }
  // };

  // // Add meal with retry logic
  // const addMealToDate = async (
  //   date: string,
  //   mealType: keyof MealPlan["meals"],
  //   meal: MealEntry
  // ) => {
  //   const maxRetries = 3;
  //   let attempt = 0;

  //   while (attempt < maxRetries) {
  //     try {
  //       let existingPlan = mealPlans.find((p) => p.date === date);

  //       if (!existingPlan) {
  //         // Create new meal plan
  //         existingPlan = {
  //           id: `mp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  //           userId: user!._id,
  //           date,
  //           meals: {},
  //           createdAt: new Date().toISOString(),
  //           updatedAt: new Date().toISOString(),
  //           version: 1,
  //           checksum: "",
  //         };
  //       }

  //       // Update the meal plan
  //       const updatedPlan: MealPlan = {
  //         ...existingPlan,
  //         meals: {
  //           ...existingPlan.meals,
  //           [mealType]: meal,
  //         },
  //         updatedAt: new Date().toISOString(),
  //         version: existingPlan.version + 1,
  //         checksum: "",
  //       };

  //       // Generate checksum
  //       updatedPlan.checksum = generateChecksum(updatedPlan);

  //       // Save to server
  //       const savedPlan = await saveMealPlan(updatedPlan);

  //       // Update local state
  //       setMealPlans((prev) => {
  //         const filtered = prev.filter((p) => p.id !== savedPlan.id);
  //         return [...filtered, savedPlan];
  //       });

  //       showToast("Meal added successfully!", "success");
  //       return savedPlan;
  //     } catch (error) {
  //       attempt++;
  //       if (attempt >= maxRetries) {
  //         showToast("Failed to save meal after multiple attempts", "error");
  //         throw error;
  //       }
  //       // Wait before retry
  //       await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
  //     }
  //   }
  // };

  // Remove meal
  // const removeMealFromDate = async (
  //   date: string,
  //   mealType: keyof MealPlan["meals"]
  // ) => {
  //   try {
  //     const existingPlan = mealPlans.find((p) => p.date === date);
  //     if (!existingPlan) return;

  //     const updatedMeals = { ...existingPlan.meals };
  //     delete updatedMeals[mealType];

  //     const updatedPlan: MealPlan = {
  //       ...existingPlan,
  //       meals: updatedMeals,
  //       updatedAt: new Date().toISOString(),
  //       version: existingPlan.version + 1,
  //       checksum: "",
  //     };

  //     updatedPlan.checksum = generateChecksum(updatedPlan);

  //     const savedPlan = await saveMealPlan(updatedPlan);

  //     setMealPlans((prev) => {
  //       const filtered = prev.filter((p) => p.id !== savedPlan.id);
  //       return [...filtered, savedPlan];
  //     });

  //     showToast("Meal removed successfully!", "success");
  //   } catch (error) {
  //     showToast("Failed to remove meal", "error");
  //   }
  // };

  // // Handle adding meal
  // const handleAddMeal = async () => {
  //   if (!newMeal.recipeId || !selectedMeal) return;

  //   setIsAddingMeal(true);
  //   try {
  //     const recipe = recipes.find((r) => r.id === newMeal.recipeId);
  //     if (!recipe) throw new Error("Recipe not found");

  //     const meal: MealEntry = {
  //       id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  //       recipeId: recipe.id,
  //       recipeName: recipe.title,
  //       servings: newMeal.servings || 1,
  //       notes: newMeal.notes || "",
  //       calories: recipe.calories,
  //       prepTime: recipe.prepTime,
  //     };

  //     await addMealToDate(selectedDate, selectedMeal, meal);

  //     // Reset form
  //     setNewMeal({ servings: 1, notes: "" });
  //     setSelectedMeal(null);
  //   } catch (error) {
  //     console.error("Error adding meal:", error);
  //     showToast("Failed to add meal", "error");
  //   } finally {
  //     setIsAddingMeal(false);
  //   }
  // };

  // useEffect(() => {
  //   if (user) {
  //     fetchMealPlans();
  //     fetchRecipes();
  //   }
  // }, [user, selectedDate]);

  // Auto-backup every 5 minutes
  useEffect(() => {
    if (mealPlans.length > 0) {
      const interval = setInterval(() => {
        saveToLocalBackup(mealPlans);
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [mealPlans, user]);

  const currentMealPlan = mealPlans.find((p) => p.date === selectedDate);
  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mealTypes = [
    {
      id: "breakfast" as const,
      name: "Breakfast",
      icon: "🌅",
      color: "bg-yellow-100 border-yellow-300",
    },
    {
      id: "lunch" as const,
      name: "Lunch",
      icon: "☀️",
      color: "bg-orange-100 border-orange-300",
    },
    {
      id: "dinner" as const,
      name: "Dinner",
      icon: "🌙",
      color: "bg-blue-100 border-blue-300",
    },
    {
      id: "snack" as const,
      name: "Snack",
      icon: "🍿",
      color: "bg-green-100 border-green-300",
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto max-w-4xl px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Meal Planning
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to create and manage your meal plans.
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
      <div className="container mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Meal Planning
          </h1>
          <p className="text-lg text-gray-600">
            Plan your meals and maintain a healthy, organized diet.
          </p>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
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
            <div className="text-sm text-gray-500">
              {mealPlans.length} meal plan(s) loaded
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" message="Loading meal plans..." />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Meal Plan Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mealTypes.map((mealType) => {
                  const meal = currentMealPlan?.meals[mealType.id];

                  return (
                    <div
                      key={mealType.id}
                      className={`border-2 rounded-lg p-4 ${mealType.color}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{mealType.icon}</span>
                          <h3 className="font-semibold text-gray-900">
                            {mealType.name}
                          </h3>
                        </div>
                        <Button
                          onClick={() => setSelectedMeal(mealType.id)}
                          size="sm"
                          variant="outline"
                        >
                          {meal ? "Change" : "Add"}
                        </Button>
                      </div>

                      {meal ? (
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-800">
                            {meal.recipeName}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>
                              👥 {meal.servings} serving
                              {meal.servings > 1 ? "s" : ""}
                            </span>
                            {meal.calories && (
                              <span>🔥 {meal.calories} cal</span>
                            )}
                            {meal.prepTime && (
                              <span>⏱️ {meal.prepTime}min</span>
                            )}
                          </div>
                          {meal.notes && (
                            <p className="text-sm text-gray-600 italic">
                              {meal.notes}
                            </p>
                          )}
                          <div className="flex gap-2 mt-3">
                            <Button
                              // onClick={() =>
                              //   // removeMealFromDate(selectedDate, mealType.id)
                              // }
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-500 text-sm mb-2">
                            No meal planned
                          </p>
                          <Button
                            onClick={() => setSelectedMeal(mealType.id)}
                            size="sm"
                          >
                            Add Meal
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recipe Selector Sidebar */}
            <div className="lg:col-span-1">
              {selectedMeal && (
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Add {mealTypes.find((m) => m.id === selectedMeal)?.name}
                    </h3>
                    <Button
                      onClick={() => setSelectedMeal(null)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Recipes
                      </label>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for recipes..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    {/* Recipe Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Recipe
                      </label>
                      <select
                        value={newMeal.recipeId || ""}
                        onChange={(e) =>
                          setNewMeal((prev) => ({
                            ...prev,
                            recipeId: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Choose a recipe</option>
                        {filteredRecipes.map((recipe) => (
                          <option key={recipe.id} value={recipe.id}>
                            {recipe.title} ({recipe.prepTime}min)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Servings */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Servings
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={newMeal.servings || 1}
                        onChange={(e) =>
                          setNewMeal((prev) => ({
                            ...prev,
                            servings: parseInt(e.target.value),
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={newMeal.notes || ""}
                        onChange={(e) =>
                          setNewMeal((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Any special notes..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    {/* Add Button */}
                    <Button
                      // onClick={handleAddMeal}
                      disabled={!newMeal.recipeId || isAddingMeal}
                      loading={isAddingMeal}
                      className="w-full"
                    >
                      Add to Meal Plan
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
