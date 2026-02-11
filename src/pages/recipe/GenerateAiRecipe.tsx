
import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import VoiceInput from "../../components/VoiceInput";
import CameraScanner from "../../components/CameraScanner";
import { useToast } from "../../components/Toast";
import { matchGenerateRecipe } from "../../redux/features/recipe/recipeSlice";
import { useAppDispatch, useAppSelector } from "../../redux/app/hook";
import  { Recipe } from "../../types/recipe";

 import { PantryItem as ApiPantryItem } from "../../types/pantry";

interface PantryItemUI extends Omit<ApiPantryItem, "id"> {
  imageUrl?: string;
}



  


export default function GenerateAiRecipe() {
  const [ingredients, setIngredients] = useState("");
 
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchMethod, setSearchMethod] = useState<
    "text" | "voice" | "image" | null
  >(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isPantryModalOpen, setIsPantryModalOpen] = useState(false);
  const [pantryItems, setPantryItems] = useState<PantryItemUI[]>([]);
  const [isPantryLoading, setIsPantryLoading] = useState(false);
  const { showToast } = useToast();
  const dispatch = useAppDispatch()

   const {loading, error,  matchedRecipes } = useAppSelector((state) => state.recipe)
console.log(matchedRecipes)
  const handleVoiceInput = (text: string) => {
    setIngredients(text);
    setSearchMethod("voice");
    showToast("Voice input detected! Ready to search.", "info");
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIngredients(e.target.value);
  };

  const handleImageScanResult = (result: { type: string; data: any }) => {
    if (result.type === "ingredient") {
      setIngredients((prev) =>
        prev ? `${prev}, ${result.data}` : result.data
      );
      showToast("Ingredients detected from image! Ready to search.", "success");
    }
    setShowScanner(false);
  };

  const handleReset = () => {
    setIngredients("");
    setRecipes([]);

    setSearchMethod(null);
    setShowScanner(false);
    showToast("Form reset successfully", "info");
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!ingredients.trim()) {
    showToast("Please enter some ingredients", "warning");
    return;
  }

  // Default search method → text
  const method = searchMethod || "text";
  setSearchMethod(method);

  ;
  setRecipes([]);

  try {
    console.log(`Search initiated via: ${method}`);

    // Build thunk payload
    const thunkPayload: {
      inputText: string;
      filters?: any;
      files?: File[];
    } = {
      inputText: ingredients,
      filters: { searchMethod: method },
    };

    // If later you support image uploads, attach them here:
    // thunkPayload.files = uploadedImages

    // Dispatch Redux thunk
     await dispatch(matchGenerateRecipe(thunkPayload));

      if (matchedRecipes && matchedRecipes.length > 0) {
        setRecipes(matchedRecipes);

        const methodText =
          method === "voice"
            ? "voice input"
            : method === "image"
            ? "image scanning"
            : "text input";

        showToast(`Recipes found via ${methodText}!`, "success");
      } else {
        // fallback mock recipes
        setRecipes([]);
        showToast(
          `Generated sample recipes based on your ${method} input.`,
          "success"
        );
      }
  

  
   
  } catch (err) {
    console.error("Unexpected error:", err);

    
    setRecipes([]);

    showToast("Generated sample recipes (Demo mode)", "warning");
  } finally {
    loading
  }
};

  // Fetch pantry items
  // const fetchPantryItems = async () => {
  //   try {
  //     setIsPantryLoading(true);
  //     const response = await ApiService.getPantryItems();
  //     const availableItems = (response.data || []).filter(
  //       (item: PantryItemUI) => {
  //         const quantity =
  //           typeof item.quantity === "string"
  //             ? parseFloat(item.quantity)
  //             : item.quantity;
  //         return !isNaN(quantity!) && quantity! > 0;
  //       }
  //     );
  //     setPantryItems(availableItems);
  //     if (availableItems.length === 0) {
  //       showToast("No ingredients available in your pantry", "warning");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching pantry items:", error);
  //     showToast("Failed to load pantry items", "error");
  //   } finally {
  //     setIsPantryLoading(false);
  //   }
  // };

  // Use pantry ingredients
  const handleUsePantryIngredients = () => {
    if (pantryItems.length === 0) {
      showToast("Your pantry is empty. Add some ingredients first!", "warning");
      return;
    }
    const pantryIngredients = pantryItems.map((item) => item.name).join(", ");
    setIngredients(pantryIngredients);
    setSearchMethod("text");
    showToast("Pantry ingredients loaded successfully!", "success");
    setIsPantryModalOpen(false);
  };

  useEffect(() => {
    if (isPantryModalOpen) {
      // fetchPantryItems();
    }
  }, [isPantryModalOpen]);

  return (
    <div className="container-max px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Generate Recipe with AI
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Enter your ingredients and let AI create delicious Jollof recipes for
          you.
        </p>

        {/* Navigation Buttons */}
        <div className="mb-8 flex justify-center space-x-4">
          <Button
            onClick={() => setIsPantryModalOpen(true)}
            variant="outline"
            className="inline-flex items-center space-x-2"
          >
            <span>🗄️</span>
            <span>Use Ingredients from Pantry</span>
          </Button>
        </div>

        {/* Pantry Modal */}
        {isPantryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <h3 className="text-xl font-bold mb-4">
                Your Pantry Ingredients
              </h3>
              {pantryItems.length > 0 ? (
                <div className="max-h-96 overflow-y-auto mb-4">
                  <ul className="space-y-2">
                    {pantryItems.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span>{item.name}</span>
                        <span className="text-gray-500">
                          {item.quantity} {item.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 mb-4">
                  No ingredients in your pantry yet.
                </p>
              )}
              <div className="flex justify-end space-x-4">
                <Button
                  onClick={() => setIsPantryModalOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUsePantryIngredients}
                  disabled={pantryItems.length === 0}
                >
                  Use These Ingredients
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Search Method Indicator */}
        {searchMethod && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium text-center ${
              searchMethod === "voice"
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : searchMethod === "image"
                ? "bg-orange-100 text-orange-800 border border-orange-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {searchMethod === "voice" ? (
                <>
                  🎤{" "}
                  <span>
                    Voice input detected - Ready to search with spoken
                    ingredients
                  </span>
                </>
              ) : searchMethod === "image" ? (
                <>
                  📸{" "}
                  <span>
                    Image scanning mode - Use camera to detect ingredients
                  </span>
                </>
              ) : (
                <>
                  ⌨️{" "}
                  <span>Text input mode - Type your ingredients manually</span>
                </>
              )}
            </div>
          </div>
        )}
{/*onSubmit={handleSubmit} */}
        <form onSubmit={handleSubmit}  className="space-y-6">
          {/* Input Method Selection */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Button
              type="button"
              onClick={() => setSearchMethod("text")}
              variant={searchMethod === "text" ? "primary" : "outline"}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="text-2xl mb-2">⌨️</span>
              <span>Text Input</span>
            </Button>
            <Button
              type="button"
              onClick={() => setSearchMethod("voice")}
              variant={searchMethod === "voice" ? "primary" : "outline"}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="text-2xl mb-2">🎤</span>
              <span>Voice Input</span>
            </Button>
            <Button
              type="button"
              onClick={() => {
                setSearchMethod("image");
                setShowScanner(true);
              }}
              variant={searchMethod === "image" ? "primary" : "outline"}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="text-2xl mb-2">📸</span>
              <span>Image Input</span>
            </Button>
          </div>

          {/* Text Input Section */}
          {searchMethod === "text" && (
            <div>
              <label
                htmlFor="ingredients"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Type Your Ingredients
              </label>
              <textarea
                id="ingredients"
                value={ingredients}
                onChange={handleTextInput}
                placeholder="Enter ingredients separated by commas (e.g., rice, tomatoes, chicken, onions)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                rows={4}
                required
              />
            </div>
          )}

          {/* Voice Input Section */}
          {searchMethod === "voice" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice Input
              </label>
              <div className="mb-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                💡 <strong>Voice Input Tips:</strong>
                <ul className="mt-1 ml-4 list-disc">
                  <li>Allow microphone permissions when prompted</li>
                  <li>Works best in Chrome/Edge browsers</li>
                  <li>Requires HTTPS or localhost</li>
                  <li>Speak clearly and wait for processing</li>
                </ul>
              </div>
              <VoiceInput
                onTranscript={handleVoiceInput}
                placeholder="Click the microphone and describe your ingredients..."
                className="mb-2"
              />
            </div>
          )}

          {/* Image Input Section */}
          {showScanner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
              <div className="bg-white p-4 rounded-lg w-full max-w-lg">
                <CameraScanner
                  onScanResult={handleImageScanResult}
                  onClose={() => setShowScanner(false)}
                  scanType="ingredient"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {(searchMethod || ingredients) && (
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading || !ingredients.trim()}
                loading={loading}
                className="flex-1"
                size="lg"
              >
                Generate Recipes
              </Button>
              <Button
                type="button"
                onClick={handleReset}
                variant="secondary"
                disabled={loading}
                className="px-6"
                size="lg"
              >
                Reset
              </Button>
            </div>
          )}
        </form>

        {/* Loading State */}
        {loading && (
          <div className="mt-8 text-center">
            <LoadingSpinner size="lg" message="Creating your recipes..." />
          </div>
        )}

        {/* Recipe Cards */}
        {matchedRecipes.length > 0 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold text-center">
              Your Generated Recipes
            </h2>
            {matchedRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                {recipe.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/rice-image.jpg"; // Fallback to main rice image
                    }}
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{recipe.title}</h3>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Ingredients:
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-gray-700">
                          {ingredient.name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Instructions:
                    </h4>
                    <ol className="list-decimal list-inside space-y-2">
                      {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="text-gray-700">
                          {instruction.description}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
