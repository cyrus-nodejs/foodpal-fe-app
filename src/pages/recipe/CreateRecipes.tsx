// @ts-nocheck

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppSelector, useAppDispatch } from "../../redux/app/hook";

import CameraScanner from "../../components/CameraScanner";
import Button from "../../components/Button";
import { uploadToCloudinary } from "../../utils/uploadImage";
import { createRecipe } from "../../redux/features/recipe/recipeSlice";

import { useFormikContext } from "formik";

interface ErrorMessageProps {
  name: string;
}


interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

interface Instruction {
  id: string;
  step: number;
  description: string;
}

interface NutritionForm {
  calories: string | number;
  protein: string | number;
  fat: string | number;
  carbohydrates: string | number;
  fiber: string | number;
  richIn: string; // comma-separated
  notes: string;
}

interface RecipeFormValues {
  title: string;
  description: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  cuisine: string;

  ingredients: Ingredient[];
  instructions: Instruction[];

  moodTags: string[];
  costLevel: "low" | "medium" | "high";

  nutrition: NutritionForm;

  image: File | null;
}

// Validation Schema
const recipeValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Recipe title is required"),

  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),

  servings: Yup.number().min(1).max(100).required("Required"),
  prepTime: Yup.number().min(0).max(1440).required("Required"),
  cookTime: Yup.number().min(0).max(1440).required("Required"),

  difficulty: Yup.string()
    .oneOf(["Easy", "Medium", "Hard"])
    .required("Required"),

  category: Yup.string().required("Required"),
  cuisine: Yup.string().required("Required"),

  ingredients: Yup.array()
    .min(1, "At least one ingredient is required")
    .required(),

  instructions: Yup.array()
    .min(1, "At least one instruction is required")
    .required(),

  costLevel: Yup.string()
    .oneOf(["low", "medium", "high"])
    .required(),

  moodTags: Yup.array().of(Yup.string()),

  nutrition: Yup.object().shape({
    calories: Yup.number().min(0).required("Calories required"),
    protein: Yup.number().min(0).nullable(),
    fat: Yup.number().min(0).nullable(),
    carbohydrates: Yup.number().min(0).nullable(),
    fiber: Yup.number().min(0).nullable(),
    richIn: Yup.string(),
    notes: Yup.string().max(500),
  }),
});

export default function CreateRecipe() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("basic");
  const [showScanner, setShowScanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newIngredient, setNewIngredient] = useState({
    name: "",
    amount: "",
    unit: "cups",
  });

  const [newInstruction, setNewInstruction] = useState("");
  const [newTag, setNewTag] = useState("");

  const categories = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Dessert",
    "Appetizer",
    "Side Dish",
    "Soup",
    "Salad",
    "Beverage",
  ];

  const cuisines = [
    "Nigerian",
    "African",
    "Italian",
    "Chinese",
    "Mexican",
    "Indian",
    "French",
    "Japanese",
    "Thai",
    "Mediterranean",
    "American",
    "Other",
  ];

  const units = [
    "cups",
    "tbsp",
    "tsp",
    "oz",
    "lbs",
    "g",
    "kg",
    "ml",
    "l",
    "pieces",
    "cloves",
    "slices",
    "whole",
  ];

  // Formik setup
  const formik = useFormik<RecipeFormValues>({
    initialValues: {
      title: "",
      description: "",
      servings: 4,
      prepTime: 30,
      cookTime: 30,
      difficulty: "Medium",
      category: "",
      cuisine: "",

      ingredients: [],
      instructions: [],

      moodTags: [],
      costLevel: "medium",

      nutrition: {
        calories: "",
        protein: "",
        fat: "",
        carbohydrates: "",
        fiber: "",
        richIn: "",
        notes: "",
      },

      image: null,
    },

    validationSchema: recipeValidationSchema,

    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const formData = new FormData();

        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("servings", values.servings.toString());
        formData.append("prepTime", values.prepTime.toString());
        formData.append("cookTime", values.cookTime.toString());
        formData.append("difficulty", values.difficulty);
        formData.append("category", values.category);
        formData.append("cuisine", values.cuisine);
        formData.append("costLevel", values.costLevel);

        formData.append("ingredients", JSON.stringify(values.ingredients));
        formData.append("instructions", JSON.stringify(values.instructions));
        formData.append("moodTags", JSON.stringify(values.moodTags));

        // Build nutrition array
        const nutritionArray = [
          {
            id: Date.now().toString(),
            calories: Number(values.nutrition.calories),
            protein: Number(values.nutrition.protein || 0),
            fat: Number(values.nutrition.fat || 0),
            carbohydrates: Number(values.nutrition.carbohydrates || 0),
            fiber: Number(values.nutrition.fiber || 0),
            richIn: values.nutrition.richIn
              ? values.nutrition.richIn.split(",").map((v) => v.trim())
              : [],
            notes: values.nutrition.notes,
          },
        ];

        formData.append("nutrition", JSON.stringify(nutritionArray));

        if (values.image) {
          const imageUrl = await uploadToCloudinary(values.image);
          formData.append("imageUrl", imageUrl);
        }

        const created = await dispatch(createRecipe(formData)).unwrap();

        alert("Recipe created successfully!");
        navigate(`/recipe/${created._id}`);
      } catch (error: any) {
        alert(error || "Failed to create recipe");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Helpers
  const addIngredient = () => {
    if (newIngredient.name && newIngredient.amount) {
      const ingredient: Ingredient = {
        id: Date.now().toString(),
        ...newIngredient,
      };
      formik.setFieldValue("ingredients", [
        ...formik.values.ingredients,
        ingredient,
      ]);
      setNewIngredient({ name: "", amount: "", unit: "cups" });
    }
  };

  const removeIngredient = (id: string) => {
    formik.setFieldValue(
      "ingredients",
      formik.values.ingredients.filter((ing) => ing.id !== id)
    );
  };

  const addInstruction = () => {
    if (newInstruction.trim()) {
      const instruction: Instruction = {
        id: Date.now().toString(),
        step: formik.values.instructions.length + 1,
        description: newInstruction.trim(),
      };
      formik.setFieldValue("instructions", [
        ...formik.values.instructions,
        instruction,
      ]);
      setNewInstruction("");
    }
  };

  const removeInstruction = (id: string) => {
    const filtered = formik.values.instructions.filter((i) => i.id !== id);
    const renumbered = filtered.map((i, index) => ({
      ...i,
      step: index + 1,
    }));
    formik.setFieldValue("instructions", renumbered);
  };

  const addTag = () => {
    if (
      newTag.trim() &&
      !formik.values.moodTags.includes(newTag.trim())
    ) {
      formik.setFieldValue("moodTags", [
        ...formik.values.moodTags,
        newTag.trim(),
      ]);
      setNewTag("");
    }
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) formik.setFieldValue("image", file);
  };

  const handleScanResult = (result: any) => {
    if (result.type === "ingredient") {
      setNewIngredient((prev) => ({ ...prev, name: result.name }));
    }
    setShowScanner(false);
  };

  const ErrorMessage = ({ name }: any) => {
    const error = formik?.touched[name] && formik?.errors[name];
    return error ? (
      <p className="text-red-500 text-sm mt-1">{error as string}</p>
    ) : null;
  };

  // Auth Guard
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Sign In Required</h1>
          <p className="mb-6">Please sign in to create a recipe.</p>
          <Button
            onClick={() =>
              navigate("/signin", { state: { from: location.pathname } })
            }
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">Create New Recipe</h1>
            <p>Share your culinary creativity</p>
          </div>

          {/* TABS */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: "basic", label: "Basic Info", icon: "👨‍🍳" },
                { id: "ingredients", label: "Ingredients", icon: "🥕" },
                { id: "instructions", label: "Instructions", icon: "📝" },
                { id: "nutrition", label: "Nutrition", icon: "📊" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500"
                  } py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* TAB CONTENT */}
          <div className="p-6">

            {/* BASIC INFO */}
            {activeTab === "basic" && (
              <div className="space-y-6">

                {/* Title + Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm mb-2">Recipe Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md ${
                        formik.touched.title && formik.errors.title
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <ErrorMessage name="title" />
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block text-sm mb-2">Recipe Image</label>
                    <div className="flex space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="flex-1 px-3 py-2 border rounded-md"
                      />
                      <Button
                        type="button"
                        onClick={() => setShowScanner(true)}
                        className="px-3 py-2 bg-blue-500 text-white rounded-md"
                      >
                        📸
                      </Button>
                    </div>

                    {formik.values.image && (
                      <img
                        src={URL.createObjectURL(formik.values.image)}
                        alt="preview"
                        className="mt-2 w-32 h-32 object-cover rounded-md border"
                      />
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md ${
                      formik.touched.description &&
                      formik.errors.description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage name="description" />
                </div>

                {/* Servings / Times */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Servings *</label>
                    <input
                      type="number"
                      name="servings"
                      value={formik.values.servings}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <ErrorMessage name="servings" />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Prep Time *</label>
                    <input
                      type="number"
                      name="prepTime"
                      value={formik.values.prepTime}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <ErrorMessage name="prepTime" />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Cook Time *</label>
                    <input
                      type="number"
                      name="cookTime"
                      value={formik.values.cookTime}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <ErrorMessage name="cookTime" />
                  </div>
                </div>

                {/* Difficulty / Category / Cuisine / Cost */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                  <div>
                    <label className="block text-sm mb-2">Difficulty *</label>
                    <select
                      name="difficulty"
                      value={formik.values.difficulty}
                      onChange={formik.handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                    <ErrorMessage name="difficulty" />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Category *</label>
                    <select
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage name="category" />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Cuisine *</label>
                    <select
                      name="cuisine"
                      value={formik.values.cuisine}
                      onChange={formik.handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">Select cuisine</option>
                      {cuisines.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage name="cuisine" />
                  </div>

                  {/* Cost Level */}
                  <div>
                    <label className="block text-sm mb-2">Cost Level *</label>
                    <select
                      name="costLevel"
                      value={formik.values.costLevel}
                      onChange={formik.handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <ErrorMessage name="costLevel" />
                  </div>
                </div>

                {/* Mood Tags */}
              <div>
  <label className="block text-sm mb-2">Mood Tags</label>

  <div className="flex space-x-2 mb-2">
    <input
      type="text"
      list="mood-options"
      value={newTag}
      onChange={(e) => setNewTag(e.target.value)}
      onKeyDown={(e) =>
        e.key === "Enter" && (e.preventDefault(), addTag())
      }
      className="flex-1 px-3 py-2 border rounded-md"
      placeholder="Choose or type a mood"
    />

    <datalist id="mood-options">
      <option value="comforting" />
      <option value="light" />
      <option value="indulgent" />
      <option value="energizing" />
      <option value="romantic" />
      <option value="festive" />
      <option value="cozy" />
      <option value="quick" />
      <option value="healthy" />
      <option value="rainy-day" />
    </datalist>

    <Button
      type="button"
      onClick={addTag}
      className="px-4 py-2 bg-gray-500 text-white rounded-md"
    >
      Add
    </Button>
  </div>

  <div className="flex flex-wrap gap-2">
    {formik.values.moodTags?.map((t) => (
      <span
        key={t}
        className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
      >
        {t}
        <button
          type="button"
          onClick={() =>
            formik.setFieldValue(
              "moodTags",
              formik.values.moodTags.filter((m) => m !== t)
            )
          }
          className="ml-1 text-orange-600"
        >
          ✕
        </button>
      </span>
    ))}
  </div>
</div>
              </div>
            )}

            {/* INGREDIENTS */}
            {activeTab === "ingredients" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

                  <div>
                    <label className="block text-sm mb-2">Name</label>
                    <input
                      type="text"
                      value={newIngredient.name}
                      onChange={(e) =>
                        setNewIngredient((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Amount</label>
                    <input
                      type="text"
                      value={newIngredient.amount}
                      onChange={(e) =>
                        setNewIngredient((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Unit</label>
                    <select
                      value={newIngredient.unit}
                      onChange={(e) =>
                        setNewIngredient((prev) => ({
                          ...prev,
                          unit: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {units.map((u) => (
                        <option key={u}>{u}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      onClick={addIngredient}
                      className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      ➕ Add
                    </Button>

                    <Button
                      type="button"
                      onClick={() => setShowScanner(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      📸
                    </Button>
                  </div>
                </div>

                {formik.touched.ingredients && formik.errors.ingredients && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.ingredients as string}
                  </p>
                )}

                <div>
                  <h3 className="font-semibold mb-2">
                    Ingredients List ({formik.values.ingredients.length})
                  </h3>

                  {formik.values.ingredients.length === 0 ? (
                    <p className="text-gray-500">
                      No ingredients yet. Add at least one.
                    </p>
                  ) : (
                    formik.values.ingredients.map((ing) => (
                      <div
                        key={ing.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-md mb-2"
                      >
                        <span>
                          {ing.amount} {ing.unit} {ing.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeIngredient(ing.id)}
                          className="text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* INSTRUCTIONS */}
            {activeTab === "instructions" && (
              <div className="space-y-6">
                <div className="flex space-x-2">
                  <textarea
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        e.preventDefault();
                        addInstruction();
                      }
                    }}
                    rows={3}
                    className="flex-1 px-3 py-2 border rounded-md"
                    placeholder="Add instruction... (Ctrl+Enter to add)"
                  />
                  <Button
                    type="button"
                    onClick={addInstruction}
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                  >
                    ➕
                  </Button>
                </div>

                {formik.touched.instructions &&
                  formik.errors.instructions && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.instructions as string}
                    </p>
                  )}

                <div>
                  <h3 className="font-semibold mb-2">
                    Steps ({formik.values.instructions.length})
                  </h3>

                  {formik.values.instructions.length === 0 ? (
                    <p className="text-gray-500">
                      No instructions added yet.
                    </p>
                  ) : (
                    formik.values.instructions.map((step) => (
                      <div
                        key={step.id}
                        className="flex items-start p-4 bg-gray-50 rounded-md mb-3"
                      >
                        <div className="bg-orange-500 text-white w-8 h-8 flex items-center justify-center rounded-full mr-3">
                          {step.step}
                        </div>
                        <p className="flex-1">{step.description}</p>
                        <button
                          type="button"
                          onClick={() => removeInstruction(step.id)}
                          className="text-red-500 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* NUTRITION */}
            {activeTab === "nutrition" && (
              <div className="space-y-6">

                {/* Calories */}
                <div>
                  <label className="block text-sm mb-2">Calories *</label>
                  <input
                    type="number"
                    name="nutrition.calories"
                    value={formik.values.nutrition.calories}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <ErrorMessage name="nutrition.calories" />
                </div>

                {/* Macros */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Protein (g)</label>
                    <input
                      type="number"
                      name="nutrition.protein"
                      value={formik.values.nutrition.protein}
                      onChange={formik.handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Fat (g)</label>
                    <input
                      type="number"
                      name="nutrition.fat"
                      value={formik.values.nutrition.fat}
                      onChange={formik.handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">
                      Carbohydrates (g)
                    </label>
                    <input
                      type="number"
                      name="nutrition.carbohydrates"
                      value={formik.values.nutrition.carbohydrates}
                      onChange={formik.handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Fiber (g)</label>
                    <input
                      type="number"
                      name="nutrition.fiber"
                      value={formik.values.nutrition.fiber}
                      onChange={formik.handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                {/* Rich In */}
                <div>
                  <label className="block text-sm mb-2">
                    Rich In (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="nutrition.richIn"
                    value={formik.values.nutrition.richIn}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Vitamin C, Iron..."
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm mb-2">Nutrition Notes</label>
                  <textarea
                    name="nutrition.notes"
                    value={formik.values.nutrition.notes}
                    onChange={formik.handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between">
            <Button
              type="button"
              onClick={() => navigate("/recipe-discovery")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !formik.isValid}
              className={`px-6 py-2 rounded-md ${
                formik.isValid && !isSubmitting
                  ? "bg-orange-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Recipe"}
            </Button>
          </div>
        </div>
      </form>

      {/* CAMERA SCANNER */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">Scan Ingredient</h3>
              <button
                type="button"
                onClick={() => setShowScanner(false)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <CameraScanner
              onScanResult={handleScanResult}
              onClose={() => setShowScanner(false)}
              scanType="ingredient"
            />
          </div>
        </div>
      )}
    </div>
  );
}
