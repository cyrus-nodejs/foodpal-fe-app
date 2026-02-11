import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hook";
import { getUserProfile, updateUserProfile } from "../../redux/features/profile/profileSlice";
import Button from "../../components/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useToast } from "../../components/Toast";

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.profile);
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Updated form state
  const [editForm, setEditForm] = useState({
    fullName: "",
    culturalBackground: "",
    calorieTarget: "",
    dietaryPreferences: "",
    allergens: "",
    dietaryMode: "",
    skillLevel: "beginner",
    mealFrequency: "daily",
    prefersQuickMeals: "true",
    goalType: "maintenance",
    dailyCalories: "",
  });

  // Fetch profile
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  // Populate form
  useEffect(() => {
    if (user) {
      setEditForm({
        fullName: user.name || "",
        culturalBackground: user.preferences?.culturalBackground || "",
        calorieTarget: user.preferences?.calorieTarget || "",
        dietaryPreferences: user.preferences?.dietaryPreferences?.join(", ") || "",
        allergens: user.preferences?.allergens?.join(", ") || "",
        dietaryMode: user.preferences?.dietaryMode || "",
        skillLevel: user.preferences?.cookingHabits?.skillLevel || "beginner",
        mealFrequency: user.preferences?.cookingHabits?.mealFrequency || "daily",
        prefersQuickMeals: user.preferences?.cookingHabits?.prefersQuickMeals ? "true" : "false",
        goalType: user.preferences?.fitnessGoals?.goalType || "maintenance",
        dailyCalories: user.preferences?.fitnessGoals?.dailyCalories || "",
      });
    }
  }, [user]);

  // Handle save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updateData = {
        name: editForm.fullName,
        preferences: {
          culturalBackground: editForm.culturalBackground,
          calorieTarget: editForm.calorieTarget,
          dietaryPreferences: editForm.dietaryPreferences.split(",").map(i => i.trim()).filter(Boolean),
          allergens: editForm.allergens.split(",").map(i => i.trim()).filter(Boolean),
          dietaryMode: editForm.dietaryMode,
          cookingHabits: {
            skillLevel: editForm.skillLevel,
            mealFrequency: editForm.mealFrequency,
            prefersQuickMeals: editForm.prefersQuickMeals === "true",
          },
          fitnessGoals: {
            goalType: editForm.goalType,
            dailyCalories: Number(editForm.dailyCalories),
          },
        },
      };

      const resultAction = await dispatch(updateUserProfile(updateData));
      if (updateUserProfile.fulfilled.match(resultAction)) {
        showToast("Profile updated successfully!", "success");
        setIsEditing(false);
      } else {
        showToast(resultAction.payload?.message || "Failed to update profile", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto max-w-4xl px-6 py-8 flex justify-center">
          <LoadingSpinner size="lg" message="Loading profile..." />
        </div>
      </div>
    );
  }

  // Profile not found
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Profile Not Found</h1>
        <p className="text-gray-600">Could not load your profile information.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto max-w-4xl px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">

          {/* HEADER — unchanged */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-12 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-white/80">{user.email}</p>
                </div>
              </div>

              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="secondary"
                className="bg-red-500 text-primary hover:bg-gray-100"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-8">

            {/* ------------------- EDIT MODE ------------------- */}
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                {/* Cultural Background */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cultural Background</label>
                  <input
                    value={editForm.culturalBackground}
                    onChange={(e) => setEditForm({ ...editForm, culturalBackground: e.target.value })}
                    className="input-field"
                  />
                </div>

                {/* Dietary Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Mode</label>
                  <select
                    value={editForm.dietaryMode}
                    onChange={(e) => setEditForm({ ...editForm, dietaryMode: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select...</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                    <option value="halal">Halal</option>
                    <option value="pescatarian">Pescatarian</option>
                  </select>
                </div>

                {/* Dietary Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Preferences (comma separated)
                  </label>
                  <input
                    value={editForm.dietaryPreferences}
                    onChange={(e) => setEditForm({ ...editForm, dietaryPreferences: e.target.value })}
                    className="input-field"
                  />
                </div>

                {/* Allergens */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergens (comma separated)
                  </label>
                  <input
                    value={editForm.allergens}
                    onChange={(e) => setEditForm({ ...editForm, allergens: e.target.value })}
                    className="input-field"
                  />
                </div>

                {/* Calorie Target */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calorie Target</label>
                  <input
                    value={editForm.calorieTarget}
                    onChange={(e) => setEditForm({ ...editForm, calorieTarget: e.target.value })}
                    className="input-field"
                  />
                </div>

                {/* Skill Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cooking Skill Level</label>
                  <select
                    value={editForm.skillLevel}
                    onChange={(e) => setEditForm({ ...editForm, skillLevel: e.target.value })}
                    className="input-field"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Meal Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meal Frequency</label>
                  <select
                    value={editForm.mealFrequency}
                    onChange={(e) => setEditForm({ ...editForm, mealFrequency: e.target.value })}
                    className="input-field"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {/* Prefers quick meals */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prefers Quick Meals?</label>
                  <select
                    value={editForm.prefersQuickMeals}
                    onChange={(e) => setEditForm({ ...editForm, prefersQuickMeals: e.target.value })}
                    className="input-field"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                {/* Fitness goal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Goal</label>
                  <select
                    value={editForm.goalType}
                    onChange={(e) => setEditForm({ ...editForm, goalType: e.target.value })}
                    className="input-field"
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Daily calories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daily Calories</label>
                  <input
                    type="number"
                    value={editForm.dailyCalories}
                    onChange={(e) => setEditForm({ ...editForm, dailyCalories: e.target.value })}
                    className="input-field"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button type="submit" loading={isSaving} disabled={isSaving} className="bg-primary text-white">
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline" disabled={isSaving} onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              /* ------------------- VIEW MODE ------------------- */

              <div className="space-y-10">

                {/* Cultural Background */}
                {user.preferences?.culturalBackground && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Cultural Background</h3>
                    <p className="text-gray-600">{user.preferences.culturalBackground}</p>
                  </div>
                )}

                {/* Dietary Info */}
                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* Dietary Mode */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Dietary Mode</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                      {user.preferences?.dietaryMode || "None"}
                    </span>
                  </div>

                  {/* Calorie Target */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Calorie Target</h3>
                    <p className="text-gray-600">
                      {user.preferences?.calorieTarget || "Not specified"}
                    </p>
                  </div>

                  {/* Dietary Preferences */}
                  {user.preferences?.dietaryPreferences?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Dietary Preferences</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.preferences.dietaryPreferences.map((pref: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Allergens */}
                  {user.preferences?.allergens?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Allergens</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.preferences.allergens.map((allergy: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Cooking Habits */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Cooking Habits</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Skill Level:</strong> <span className="capitalize">{user.preferences?.cookingHabits?.skillLevel}</span></p>
                    <p><strong>Meal Frequency:</strong> {user.preferences?.cookingHabits?.mealFrequency}</p>
                    <p>
                      <strong>Prefers Quick Meals:</strong>{" "}
                      {user.preferences?.cookingHabits?.prefersQuickMeals ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                {/* Fitness Goals */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Fitness Goals</h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Goal Type:</strong>{" "}
                      <span className="capitalize">
                        {user.preferences?.fitnessGoals?.goalType?.replace("_", " ")}
                      </span>
                    </p>
                    <p><strong>Daily Calories:</strong> {user.preferences?.fitnessGoals?.dailyCalories || "Not set"}</p>
                  </div>
                </div>

                {/* Member Since */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Member Since</h3>
                  <p className="text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
