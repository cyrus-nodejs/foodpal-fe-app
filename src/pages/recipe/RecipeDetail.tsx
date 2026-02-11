// @ts-nocheck
import  { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import Button from "../../components/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import CookingProgress from "../../components/CookingProgress";
import AIChat from "../../components/AIChat";
import RatingComponent from "../../components/RatingComponent";
import { useToast } from "../../components/Toast";
import { useAppDispatch, useAppSelector } from "../../redux/app/hook";
import {fetchRecipeById} from '../../redux/features/recipe/recipeSlice'
import { Recipe } from "../../types/recipe";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
   const {  currentRecipe } = useAppSelector((state) => state.recipe)
   console.log(currentRecipe)
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "ingredients" | "instructions" | "nutrition"
  >("ingredients");
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const { showToast } = useToast();


  const dispatch = useAppDispatch()
  useEffect(() => {
    fetchRecipe();

    if (id){
  dispatch(fetchRecipeById(id))
    }
    
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);

      // First try to fetch from API
      try {
     
        setRecipe(currentRecipe);
      } catch (apiError) {
        // If API fails, use mock data that matches RecipeDiscovery
        const mockRecipes = [
          {
            id: "1",
            title: "Classic Jollof Rice",
            description:
              "The crown jewel of West African cuisine, a one-pot rice dish cooked with tomatoes, onions, peppers, and aromatic spices. Each country has its own variation, creating friendly rivalries over the 'best' Jollof.",
            imageUrl: "/recipes/picai29.jpeg",
            ingredients: [
              "2 cups jasmine rice",
              "3 tomatoes",
              "1 onion",
              "2 bell peppers",
              "3 cloves garlic",
              "1 tsp thyme",
              "2 bay leaves",
              "2 cups chicken stock",
              "Salt and pepper",
              "Vegetable oil",
            ],
            instructions: [
              "Blend tomatoes and peppers",
              "Fry the paste until oil separates",
              "Add rice and stock",
              "Season and simmer until tender",
            ],
            prepTime: 30,
            cookTime: 45,
            servings: 6,
            difficulty: "Medium" as const,
            cuisine: "Nigerian",
            rating: 4.8,
            reviews: 124,
            nutrition: { calories: 320, protein: 8, carbs: 58, fat: 7 },
          },
          {
            id: "2",
            title: "Fufu with Egusi Soup",
            description:
              "A staple starchy side made from boiled and pounded plantains, cassava, or yams served with rich, hearty soup made with ground melon seeds and leafy vegetables.",
            imageUrl: "/images/fufu and egusi soup.png",
            ingredients: [
              "2 cups yam flour",
              "4 cups water",
              "1 cup egusi seeds",
              "Spinach leaves",
              "Palm oil",
              "Seasoning cubes",
              "Assorted meat",
            ],
            instructions: [
              "Boil water and gradually add yam flour",
              "Stir continuously until smooth",
              "Prepare egusi soup separately",
              "Serve fufu with soup",
            ],
            prepTime: 60,
            cookTime: 90,
            servings: 8,
            difficulty: "Hard" as const,
            cuisine: "Nigerian",
            rating: 4.9,
            reviews: 189,
            nutrition: { calories: 450, protein: 15, carbs: 65, fat: 18 },
          },
          {
            id: "19",
            title: "Nigerian Pounded Yam with Egusi",
            description:
              "Smooth, stretchy yam dough served with rich egusi soup made from ground melon seeds, leafy vegetables, and assorted meats or fish.",
            imageUrl: "/images/nigeria poundd yam with egusi soup.png",
            ingredients: [
              "3 lbs fresh yam",
              "1 cup egusi seeds (ground)",
              "1 lb assorted meat (beef, goat meat)",
              "1/2 lb dried fish",
              "2 cups spinach leaves",
              "1 cup ugu leaves",
              "1/2 cup palm oil",
              "2 stock cubes",
              "Salt and pepper to taste",
              "1 onion (chopped)",
              "2 scotch bonnet peppers",
            ],
            instructions: [
              "Peel and cut yam into chunks, boil until tender",
              "Pound boiled yam in a mortar until smooth and stretchy",
              "Cook assorted meat and fish with seasonings",
              "Heat palm oil and fry ground egusi for 5 minutes",
              "Add meat stock and simmer egusi for 15 minutes",
              "Add cooked meat, fish, and chopped vegetables",
              "Season with salt, pepper, and stock cubes",
              "Simmer for 10 minutes until vegetables are tender",
              "Serve hot pounded yam with egusi soup",
            ],
            prepTime: 30,
            cookTime: 90,
            servings: 6,
            difficulty: "Hard" as const,
            cuisine: "Nigerian",
            rating: 4.9,
            reviews: 278,
            nutrition: { calories: 520, protein: 25, carbs: 68, fat: 18 },
          },
          {
            id: "3",
            title: "Ghanaian Kelewele",
            description:
              "Spicy fried plantain cubes seasoned with ginger, nutmeg, cloves, and cayenne pepper. A popular street food with a sweet and spicy flavor profile.",
            imageUrl: "/images/ghana kelewele.png",
            ingredients: [
              "4 ripe plantains",
              "1 tsp ginger powder",
              "1/2 tsp nutmeg",
              "1/4 tsp cloves",
              "1 tsp cayenne pepper",
              "Salt",
              "Vegetable oil for frying",
            ],
            instructions: [
              "Cut plantains into cubes",
              "Mix spices with salt",
              "Season plantain cubes",
              "Deep fry until golden brown",
            ],
            prepTime: 15,
            cookTime: 10,
            servings: 4,
            difficulty: "Easy" as const,
            cuisine: "Ghanaian",
            rating: 4.7,
            reviews: 156,
            nutrition: { calories: 280, protein: 3, carbs: 45, fat: 12 },
          },
          {
            id: "9",
            title: "Nigerian Amala and Ewedu",
            description:
              "Traditional Yoruba meal featuring smooth yam flour dumplings (amala) served with nutritious jute leaf soup (ewedu) and gbegiri. A beloved comfort food.",
            imageUrl: "/images/Amla and ewedu.png",
            ingredients: [
              "2 cups yam flour",
              "Ewedu leaves",
              "Locust beans",
              "Palm oil",
              "Crayfish",
              "Seasoning cubes",
              "Salt",
            ],
            instructions: [
              "Boil water and add yam flour gradually",
              "Stir to avoid lumps",
              "Prepare ewedu soup with blended leaves",
              "Serve hot together",
            ],
            prepTime: 30,
            cookTime: 45,
            servings: 6,
            difficulty: "Medium" as const,
            cuisine: "Nigerian",
            rating: 4.8,
            reviews: 245,
            nutrition: { calories: 350, protein: 12, carbs: 52, fat: 14 },
          },
          // Add more recipes as needed...
        ];

        const foundRecipe = mockRecipes.find((r) => r.id === id);
        if (foundRecipe) {
          setRecipe(foundRecipe);
        } else {
          setRecipe(null);
        }
      }

      // Check if recipe is saved
      const savedRecipes = JSON.parse(
        localStorage.getItem("savedRecipes") || "[]"
      );
      setIsSaved(savedRecipes.includes(id));
    } catch (error) {
      showToast("Failed to load recipe", "error");
      console.error("Recipe fetch error:", error);
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveRecipe = () => {
    const savedRecipes = JSON.parse(
      localStorage.getItem("savedRecipes") || "[]"
    );

    if (isSaved) {
      const updatedSaved = savedRecipes.filter(
        (savedId: string) => savedId !== id
      );
      localStorage.setItem("savedRecipes", JSON.stringify(updatedSaved));
      setIsSaved(false);
      showToast("Recipe removed from saved", "success");
    } else {
      savedRecipes.push(id);
      localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
      setIsSaved(true);
      showToast("Recipe saved successfully", "success");
    }
  };

  const startCooking = () => {
    if (!recipe) return;
    setIsCookingMode(true);
    showToast("Entering cooking mode! 👨‍🍳", "success");
  };

  const exitCookingMode = () => {
    setIsCookingMode(false);
    showToast("Cooking mode ended", "info");
  };

  const onCookingComplete = () => {
    setIsCookingMode(false);
    showToast("🎉 Congratulations! You've completed the recipe!", "success");
  };

  // Convert recipe to cooking format with detailed steps
  const convertToCookingSteps = (recipe: Recipe) => {
    const steps = [];

    // Add preparation steps
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      steps.push({
        id: "prep-ingredients",
        instruction: `Gather and prepare all ingredients: ${recipe.ingredients.join(
          ", "
        )}. Wash, chop, and measure everything according to the recipe.`,
        duration: Math.min(recipe.prepTime, 15),
        type: "prep" as const,
        tips: [
          "Having all ingredients prepped before cooking is called 'mise en place'",
          "This makes the cooking process much smoother",
          "Chop vegetables uniformly for even cooking",
        ],
        equipment: ["Cutting board", "Sharp knife", "Measuring cups", "Bowls"],
      });
    }

    // Convert instructions to detailed cooking steps
    if (recipe.instructions && recipe.instructions.length > 0) {
      recipe.instructions.forEach((instruction, index) => {
        const stepDuration = Math.ceil(
          recipe.cookTime / recipe.instructions.length
        );

        steps.push({
          id: `cook-step-${index + 1}`,
          instruction: instruction,
          duration: stepDuration,
          type:
            index === recipe.instructions.length - 1
              ? ("serve" as const)
              : ("cook" as const),
          tips: getCookingTips(instruction.description, recipe.cuisine),
          equipment: getEquipmentForStep(instruction.id),
        });
      });
    } else {
      // Default cooking steps for common recipes
      steps.push(
        {
          id: "cook-main",
          instruction: `Cook the ${recipe.title} according to traditional ${recipe.cuisine} methods. Follow proper heat control and timing.`,
          duration: recipe.cookTime - 5,
          type: "cook" as const,
          tips: [
            "Taste and adjust seasoning as you cook",
            "Maintain consistent heat level",
            "Stir occasionally to prevent sticking",
          ],
        },
        {
          id: "final-rest",
          instruction:
            "Let the dish rest for a few minutes before serving. This allows flavors to settle and temperature to equalize.",
          duration: 5,
          type: "rest" as const,
          tips: ["Resting improves flavor and texture", "Cover to keep warm"],
        },
        {
          id: "serve",
          instruction: `Serve your delicious ${recipe.title} while warm. Garnish as desired and enjoy!`,
          duration: 0,
          type: "serve" as const,
          tips: [
            "Serve immediately for best taste",
            "Consider traditional accompaniments",
          ],
        }
      );
    }

    return {
      id: recipe._id,
      title: recipe.title,
      steps: steps,
      totalTime: recipe.prepTime + recipe.cookTime,
    };
  };

  const getCookingTips = (instruction: string, cuisine: string): string[] => {
    const tips = [];
    const lowerInstruction = instruction.toLowerCase();

    if (lowerInstruction.includes("rice")) {
      tips.push("Use 1:2 ratio of rice to liquid for fluffy rice");
      tips.push("Don't lift the lid while rice is cooking");
    }

    if (lowerInstruction.includes("oil") || lowerInstruction.includes("fry")) {
      tips.push("Heat oil until it shimmers but doesn't smoke");
      tips.push("Test oil temperature with a small piece of food");
    }

    if (lowerInstruction.includes("onion")) {
      tips.push("Cook onions until translucent for best flavor");
      tips.push("Add a pinch of salt to help onions cook faster");
    }

    if (cuisine === "Nigerian" || cuisine === "West African") {
      tips.push(
        "Traditional Nigerian cooking emphasizes building flavors in layers"
      );
    }

    return tips.length > 0 ? tips : ["Cook with patience and taste frequently"];
  };

  const getEquipmentForStep = (instruction: string): string[] => {
    const equipment = [];
    const lowerInstruction = instruction.toLowerCase();

    if (lowerInstruction.includes("blend")) equipment.push("Blender");
    if (lowerInstruction.includes("fry") || lowerInstruction.includes("cook"))
      equipment.push("Pan or pot");
    if (lowerInstruction.includes("stir")) equipment.push("Wooden spoon");
    if (lowerInstruction.includes("chop") || lowerInstruction.includes("dice"))
      equipment.push("Knife", "Cutting board");
    if (lowerInstruction.includes("measure")) equipment.push("Measuring cups");

    return equipment.length > 0 ? equipment : ["Basic cooking utensils"];
  };

  const shareRecipe = () => {
    setShowShareModal(true);
  };

  const copyRecipeLink = async () => {
    const recipeUrl = `${window.location.origin}/recipe/${id}`;
    try {
      await navigator.clipboard.writeText(recipeUrl);
      showToast("Recipe link copied to clipboard!", "success");
      setShowShareModal(false);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = recipeUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showToast("Recipe link copied to clipboard!", "success");
      setShowShareModal(false);
    }
  };

  const shareToSocial = (platform: string) => {
    if (!recipe) return;

    const recipeUrl = `${window.location.origin}/recipe/${id}`;
    const shareText = `Check out this amazing ${recipe.cuisine} recipe: ${recipe.title} 🍽️`;
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          recipeUrl
        )}&quote=${encodeURIComponent(shareText)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(
          recipeUrl
        )}&hashtags=JollofAI,AfricanFood,Recipe`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          shareText + " " + recipeUrl
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          recipeUrl
        )}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
          recipeUrl
        )}&description=${encodeURIComponent(
          shareText
        )}&media=${encodeURIComponent(recipe.imageUrl || "")}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
    setShowShareModal(false);
    showToast(
      `Shared to ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`,
      "success"
    );
  };

  const shareViaWebAPI = async () => {
    if (!recipe) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this amazing ${recipe.cuisine} recipe: ${recipe.title}`,
          url: `${window.location.origin}/recipe/${id}`,
        });
        showToast("Recipe shared successfully!", "success");
        setShowShareModal(false);
      } catch (error) {
        console.log("Web Share API error:", error);
        // User cancelled sharing or error occurred
      }
    } else {
      showToast("Web sharing not supported on this device", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading recipe..." />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recipe not found
          </h2>
          <Button onClick={() => navigate("/recipes")}>Browse Recipes</Button>
        </div>
      </div>
    );
  }

  // Render cooking mode if active
  if (isCookingMode) {
    const cookingRecipe = convertToCookingSteps(recipe);
    return (
      <div className="h-screen bg-gray-50">
        <CookingProgress
          recipe={cookingRecipe}
          onComplete={onCookingComplete}
          onExit={exitCookingMode}
          className="h-full"
        />

        {/* AI Chat Overlay */}
        {showAIChat && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold">Cooking Assistant</h3>
                <button
                  onClick={() => setShowAIChat(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg
                    className="w-5 h-5"
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
              <AIChat
                context={{
                  type: "recipe",
                  data: recipe,
                }}
                className="h-full"
              />
            </div>
          </div>
        )}

        {/* AI Chat Button */}
        <button
          onClick={() => setShowAIChat(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center z-40"
        >
          <span className="text-xl">🤖</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-30 transition-colors"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Recipe Title & Info */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{recipe.prepTime + recipe.cookTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span>{recipe.servings} servings</span>
            </div>
            {recipe.rating && (
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>
                  {recipe.rating} ({recipe.reviews} reviews)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="container mx-auto max-w-4xl px-6 py-6">
        <div className="flex gap-4 mb-8">
          <Button
            onClick={startCooking}
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-3"
          >
            🍳 Start Cooking Mode
          </Button>
          <Button
            onClick={() => setShowAIChat(true)}
            variant="secondary"
            className="px-6 py-3"
          >
            <span className="mr-2">🤖</span>
            Ask AI
          </Button>
          <Button
            onClick={toggleSaveRecipe}
            variant={isSaved ? "primary" : "outline"}
            className={`px-6 py-3 ${
              isSaved
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "border-primary text-primary hover:bg-primary hover:text-white"
            }`}
          >
            {isSaved ? (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                Saved
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Save Recipe
              </>
            )}
          </Button>
          <Button
            onClick={shareRecipe}
            variant="secondary"
            className="px-6 py-3"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            Share Recipe
          </Button>
        </div>

        {/* Description */}
        {recipe.description && (
          <div className="bg-white rounded-lg p-6 mb-6">
            <p className="text-gray-700 leading-relaxed">
              {recipe.description}
            </p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {["ingredients", "instructions", "nutrition"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-4 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Ingredients Tab */}
            {activeTab === "ingredients" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-gray-700">{ingredient.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructions Tab */}
            {activeTab === "instructions" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Instructions</h3>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {instruction.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Nutrition Tab */}
            {activeTab === "nutrition" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Nutrition Information
                </h3>
                {recipe.nutrition ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {recipe.nutrition.calories}
                      </div>
                      <div className="text-sm text-gray-600">Calories</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {recipe.nutrition.protein}g
                      </div>
                      <div className="text-sm text-gray-600">Protein</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {recipe.nutrition.carbs}g
                      </div>
                      <div className="text-sm text-gray-600">Carbs</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {recipe.nutrition.fat}g
                      </div>
                      <div className="text-sm text-gray-600">Fat</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Nutrition information not available
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Ratings and Reviews */}
        <div className="container mx-auto max-w-4xl px-6 py-8">
          <RatingComponent recipeId={recipe._id} />
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-large max-w-md w-full p-6 neumorphic">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold text-neutral-800">
                Share Recipe
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-neutral-600"
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

            {/* Recipe Info */}
            <div className="mb-6 p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center gap-3">
                {recipe?.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h4 className="font-display font-semibold text-neutral-800">
                    {recipe?.title}
                  </h4>
                  <p className="text-sm text-neutral-600">
                    {recipe?.cuisine} • {recipe?.difficulty}
                  </p>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-4">
              {/* Native Share (Mobile) */}
              {navigator.share && typeof navigator.share === "function" && (
                <button
                  onClick={shareViaWebAPI}
                  className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-primary/10 transition-all duration-200 border-2 border-primary/20"
                >
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-display font-medium text-neutral-800">
                      Share via Device
                    </div>
                    <div className="text-sm text-neutral-600">
                      Use your device's native sharing
                    </div>
                  </div>
                </button>
              )}

              {/* Copy Link */}
              <button
                onClick={copyRecipeLink}
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-secondary/10 transition-all duration-200 border-2 border-secondary/20"
              >
                <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-display font-medium text-neutral-800">
                    Copy Link
                  </div>
                  <div className="text-sm text-neutral-600">
                    Copy recipe link to clipboard
                  </div>
                </div>
              </button>

              {/* Social Media Grid */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => shareToSocial("whatsapp")}
                  className="flex items-center gap-2 p-3 rounded-xl hover:bg-green-50 transition-all duration-200 border-2 border-green-200"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </div>
                  <span className="font-display font-medium text-green-700">
                    WhatsApp
                  </span>
                </button>

                <button
                  onClick={() => shareToSocial("facebook")}
                  className="flex items-center gap-2 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 border-2 border-blue-200"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="font-display font-medium text-blue-700">
                    Facebook
                  </span>
                </button>

                <button
                  onClick={() => shareToSocial("twitter")}
                  className="flex items-center gap-2 p-3 rounded-xl hover:bg-sky-50 transition-all duration-200 border-2 border-sky-200"
                >
                  <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </div>
                  <span className="font-display font-medium text-sky-700">
                    Twitter
                  </span>
                </button>

                <button
                  onClick={() => shareToSocial("pinterest")}
                  className="flex items-center gap-2 p-3 rounded-xl hover:bg-red-50 transition-all duration-200 border-2 border-red-200"
                >
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.001z" />
                    </svg>
                  </div>
                  <span className="font-display font-medium text-red-700">
                    Pinterest
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Modal */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">Cooking Assistant</h3>
              <button
                onClick={() => setShowAIChat(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
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
            <AIChat
              context={{
                type: "recipe",
                data: recipe,
              }}
              className="h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
