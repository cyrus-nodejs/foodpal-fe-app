import React, { useState, useMemo } from "react";
import CameraScanner from "../components/CameraScanner";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
  nutritionPer100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  commonUses: string[];
  substitutes: string[];
  origin: string;
  season?: string;
}

const SAMPLE_INGREDIENTS: Ingredient[] = [
  {
    id: "rice",
    name: "Jasmine Rice",
    category: "Grains",
    description:
      "Long-grain rice with a subtle floral aroma, perfect for Jollof rice.",
    imageUrl: "/ingredients/jasmine-rice.jpg",
    nutritionPer100g: {
      calories: 365,
      protein: 7,
      carbs: 80,
      fat: 0.6,
      fiber: 1.4,
    },
    commonUses: ["Jollof Rice", "Fried Rice", "Rice and Beans"],
    substitutes: ["Basmati Rice", "Long-grain White Rice"],
    origin: "Thailand",
    season: "Year-round",
  },
  {
    id: "tomatoes",
    name: "Roma Tomatoes",
    category: "Vegetables",
    description:
      "Meaty tomatoes with low water content, ideal for rich stews and sauces.",
    imageUrl: "/ingredients/roma-tomatoes.jpg",
    nutritionPer100g: {
      calories: 18,
      protein: 0.9,
      carbs: 3.9,
      fat: 0.2,
      fiber: 1.2,
    },
    commonUses: ["Tomato Base", "Stews", "Pepper Soup"],
    substitutes: ["Canned Tomatoes", "Cherry Tomatoes"],
    origin: "Mediterranean",
    season: "Summer",
  },
  {
    id: "scotch-bonnet",
    name: "Scotch Bonnet Peppers",
    category: "Spices",
    description:
      "Hot peppers with fruity flavor, essential for authentic West African cuisine.",
    imageUrl: "/ingredients/scotch-bonnet-peppers.jpg",
    nutritionPer100g: {
      calories: 40,
      protein: 1.9,
      carbs: 9.5,
      fat: 0.4,
      fiber: 1.5,
    },
    commonUses: ["Pepper Sauce", "Jollof Rice", "Suya Spice"],
    substitutes: ["Habanero Peppers", "Jalapeño (milder)"],
    origin: "Caribbean/West Africa",
    season: "Year-round",
  },
  {
    id: "plantain",
    name: "Green Plantains",
    category: "Fruits",
    description:
      "Starchy cooking bananas, versatile for both sweet and savory dishes.",
    imageUrl: "/ingredients/green-plantains.jpg",
    nutritionPer100g: {
      calories: 122,
      protein: 1.3,
      carbs: 32,
      fat: 0.4,
      fiber: 2.3,
    },
    commonUses: ["Fried Plantain", "Plantain Chips", "Dodo"],
    substitutes: ["Bananas (cooking)", "Sweet Potatoes"],
    origin: "West Africa",
    season: "Year-round",
  },
  {
    id: "palm-oil",
    name: "Red Palm Oil",
    category: "Oils",
    description:
      "Rich, red oil with distinctive flavor, cornerstone of West African cooking.",
    nutritionPer100g: {
      calories: 884,
      protein: 0,
      carbs: 0,
      fat: 100,
      fiber: 0,
    },
    commonUses: ["Jollof Rice", "Palm Nut Soup", "Banga Stew"],
    substitutes: ["Vegetable Oil + Paprika", "Coconut Oil"],
    origin: "West/Central Africa",
  },
  {
    id: "ginger",
    name: "Fresh Ginger",
    category: "Spices",
    description:
      "Aromatic root with warm, spicy flavor used in many African dishes.",
    nutritionPer100g: {
      calories: 80,
      protein: 1.8,
      carbs: 18,
      fat: 0.8,
      fiber: 2,
    },
    commonUses: ["Ginger Tea", "Suya Spice", "Pepper Soup"],
    substitutes: ["Ground Ginger", "Galangal"],
    origin: "Southeast Asia",
    season: "Year-round",
  },
  {
    id: "cassava",
    name: "Cassava Root",
    category: "Vegetables",
    description:
      "Starchy root vegetable, staple food across Africa. Can be boiled, fried, or processed into flour.",
    nutritionPer100g: {
      calories: 160,
      protein: 1.4,
      carbs: 38,
      fat: 0.3,
      fiber: 1.8,
    },
    commonUses: ["Fufu", "Cassava Chips", "Tapioca"],
    substitutes: ["Sweet Potato", "Yam", "Potato"],
    origin: "West Africa",
    season: "Year-round",
  },
  {
    id: "yam",
    name: "White Yam",
    category: "Vegetables",
    description:
      "Large tuber with white flesh, essential for fufu and pounded yam.",
    nutritionPer100g: {
      calories: 118,
      protein: 1.5,
      carbs: 28,
      fat: 0.2,
      fiber: 4.1,
    },
    commonUses: ["Pounded Yam", "Boiled Yam", "Yam Porridge"],
    substitutes: ["Sweet Potato", "Cassava", "Potato"],
    origin: "West Africa",
    season: "Dry season",
  },
  {
    id: "egusi",
    name: "Melon Seeds (Egusi)",
    category: "Proteins",
    description:
      "Ground melon seeds that form the base of Nigeria's famous Egusi soup.",
    nutritionPer100g: {
      calories: 557,
      protein: 28,
      carbs: 15,
      fat: 47,
      fiber: 11,
    },
    commonUses: ["Egusi Soup", "Melon Seed Stew"],
    substitutes: ["Pumpkin Seeds", "Sunflower Seeds"],
    origin: "West Africa",
    season: "Year-round",
  },
  {
    id: "okra",
    name: "Fresh Okra",
    category: "Vegetables",
    description:
      "Green pods with natural thickening properties, popular in soups and stews.",
    nutritionPer100g: {
      calories: 33,
      protein: 1.9,
      carbs: 7,
      fat: 0.2,
      fiber: 3.2,
    },
    commonUses: ["Okra Soup", "Gumbo", "Bamya"],
    substitutes: ["Frozen Okra", "Cornstarch (thickening)"],
    origin: "East Africa",
    season: "Summer",
  },
  {
    id: "berbere",
    name: "Berbere Spice Mix",
    category: "Spices",
    description:
      "Ethiopian spice blend with chili peppers, fenugreek, and aromatic spices.",
    nutritionPer100g: {
      calories: 315,
      protein: 14,
      carbs: 64,
      fat: 6,
      fiber: 35,
    },
    commonUses: ["Doro Wat", "Kitfo", "Ethiopian Stews"],
    substitutes: ["Paprika + Cayenne", "Harissa"],
    origin: "Ethiopia",
    season: "Year-round",
  },
  {
    id: "coconut",
    name: "Fresh Coconut",
    category: "Fruits",
    description:
      "Tropical fruit providing milk, oil, and meat for cooking and desserts.",
    nutritionPer100g: {
      calories: 354,
      protein: 3.3,
      carbs: 15,
      fat: 33,
      fiber: 9,
    },
    commonUses: ["Coconut Rice", "Coconut Soup", "Desserts"],
    substitutes: ["Coconut Milk (canned)", "Coconut Flakes"],
    origin: "Coastal Africa",
    season: "Year-round",
  },
  {
    id: "groundnuts",
    name: "Groundnuts (Peanuts)",
    category: "Proteins",
    description:
      "Versatile legumes used whole, ground, or as paste in African cuisine.",
    nutritionPer100g: {
      calories: 567,
      protein: 26,
      carbs: 16,
      fat: 49,
      fiber: 9,
    },
    commonUses: ["Groundnut Soup", "Suya Spice", "Ndolé"],
    substitutes: ["Almonds", "Cashews"],
    origin: "West Africa",
    season: "Dry season",
  },
  {
    id: "bitter-leaf",
    name: "Bitter Leaf",
    category: "Vegetables",
    description:
      "Dark green leafy vegetable with bitter taste, rich in nutrients.",
    nutritionPer100g: {
      calories: 22,
      protein: 3.1,
      carbs: 4.2,
      fat: 0.3,
      fiber: 2.8,
    },
    commonUses: ["Bitter Leaf Soup", "Ndolé", "Ofe Onugbu"],
    substitutes: ["Spinach", "Kale", "Collard Greens"],
    origin: "West/Central Africa",
    season: "Rainy season",
  },
  {
    id: "teff",
    name: "Teff Grain",
    category: "Grains",
    description:
      "Tiny grain used to make injera, Ethiopia's staple sourdough flatbread.",
    nutritionPer100g: {
      calories: 367,
      protein: 13,
      carbs: 73,
      fat: 2.4,
      fiber: 8,
    },
    commonUses: ["Injera", "Teff Porridge", "Gluten-free Baking"],
    substitutes: ["Buckwheat Flour", "Quinoa Flour"],
    origin: "Ethiopia",
    season: "Year-round",
  },
  {
    id: "baobab",
    name: "Baobab Fruit Powder",
    category: "Fruits",
    description:
      "Superfruit powder rich in vitamin C, fiber, and antioxidants.",
    nutritionPer100g: {
      calories: 250,
      protein: 3,
      carbs: 50,
      fat: 0.5,
      fiber: 45,
    },
    commonUses: ["Smoothies", "Porridge", "Traditional Drinks"],
    substitutes: ["Acai Powder", "Vitamin C Supplements"],
    origin: "Savanna Africa",
    season: "Dry season",
  },
  {
    id: "moringa",
    name: "Moringa Leaves",
    category: "Vegetables",
    description:
      "Nutrient-dense leaves from the 'miracle tree', used fresh or dried.",
    nutritionPer100g: {
      calories: 64,
      protein: 9.4,
      carbs: 8.3,
      fat: 1.4,
      fiber: 2,
    },
    commonUses: ["Moringa Soup", "Tea", "Smoothies"],
    substitutes: ["Spinach", "Kale"],
    origin: "East Africa",
    season: "Year-round",
  },
  {
    id: "millet",
    name: "Pearl Millet",
    category: "Grains",
    description:
      "Drought-resistant grain, staple food in Sahel regions of Africa.",
    nutritionPer100g: {
      calories: 378,
      protein: 11,
      carbs: 73,
      fat: 4.2,
      fiber: 8.5,
    },
    commonUses: ["Millet Porridge", "Tô", "Millet Bread"],
    substitutes: ["Quinoa", "Brown Rice", "Bulgur"],
    origin: "West Africa",
    season: "Dry season",
  },
  {
    id: "tamarind",
    name: "Tamarind Paste",
    category: "Spices",
    description:
      "Tangy paste from tamarind pods, adds sourness to stews and drinks.",
    nutritionPer100g: {
      calories: 239,
      protein: 2.8,
      carbs: 63,
      fat: 0.6,
      fiber: 5.1,
    },
    commonUses: ["Thieboudienne", "Tamarind Drink", "Sour Soups"],
    substitutes: ["Lime Juice", "Vinegar", "Lemon Juice"],
    origin: "East Africa",
    season: "Year-round",
  },
  {
    id: "dried-fish",
    name: "Dried Fish",
    category: "Proteins",
    description: "Preserved fish that adds umami flavor to soups and stews.",
    nutritionPer100g: {
      calories: 375,
      protein: 82,
      carbs: 0,
      fat: 3,
      fiber: 0,
    },
    commonUses: ["Pepper Soup", "Egusi Soup", "Jollof Rice"],
    substitutes: ["Smoked Fish", "Fish Stock Cubes"],
    origin: "Coastal Africa",
    season: "Year-round",
  },
  {
    id: "shea-butter",
    name: "Shea Butter",
    category: "Oils",
    description:
      "Natural fat extracted from shea nuts, used in cooking and skincare.",
    nutritionPer100g: {
      calories: 884,
      protein: 0,
      carbs: 0,
      fat: 100,
      fiber: 0,
    },
    commonUses: ["Traditional Cooking", "Frying", "Skincare"],
    substitutes: ["Coconut Oil", "Butter"],
    origin: "West Africa",
    season: "Year-round",
  },
  {
    id: "cameroon-pepper",
    name: "Cameroon Pepper",
    category: "Spices",
    description:
      "Dried and ground pepper blend, essential for Central African cuisine.",
    nutritionPer100g: {
      calories: 318,
      protein: 12,
      carbs: 56,
      fat: 17,
      fiber: 35,
    },
    commonUses: ["Ndolé", "Pepper Soup", "Meat Seasoning"],
    substitutes: ["Black Pepper + Cayenne", "White Pepper"],
    origin: "Cameroon",
    season: "Year-round",
  },
  {
    id: "sorghum",
    name: "Sorghum Grain",
    category: "Grains",
    description: "Drought-tolerant grain used for porridge, beer, and flour.",
    nutritionPer100g: {
      calories: 329,
      protein: 10,
      carbs: 72,
      fat: 3.5,
      fiber: 6.7,
    },
    commonUses: ["Sorghum Beer", "Porridge", "Gluten-free Flour"],
    substitutes: ["Millet", "Quinoa", "Brown Rice"],
    origin: "Northeast Africa",
    season: "Year-round",
  },
  {
    id: "hibiscus",
    name: "Dried Hibiscus Flowers",
    category: "Spices",
    description:
      "Tart flowers used to make refreshing drinks and natural food coloring.",
    nutritionPer100g: {
      calories: 37,
      protein: 0.4,
      carbs: 7.4,
      fat: 0.6,
      fiber: 0.3,
    },
    commonUses: ["Hibiscus Tea", "Zobo Drink", "Natural Coloring"],
    substitutes: ["Cranberry Juice", "Red Food Coloring"],
    origin: "West Africa",
    season: "Year-round",
  },
  {
    id: "african-potato",
    name: "African Potato",
    category: "Vegetables",
    description: "Wild tuber used in traditional medicine and cooking.",
    nutritionPer100g: {
      calories: 87,
      protein: 2,
      carbs: 20,
      fat: 0.1,
      fiber: 2.2,
    },
    commonUses: ["Traditional Medicine", "Porridge", "Stews"],
    substitutes: ["Sweet Potato", "Regular Potato"],
    origin: "Southern Africa",
    season: "Winter",
  },
  {
    id: "african-spinach",
    name: "African Spinach",
    category: "Vegetables",
    description:
      "Heat-tolerant leafy green with mild flavor, rich in vitamins.",
    nutritionPer100g: {
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
      fiber: 2.2,
    },
    commonUses: ["Spinach Stew", "Mixed Vegetables", "Soup"],
    substitutes: ["Regular Spinach", "Swiss Chard"],
    origin: "West Africa",
    season: "Rainy season",
  },
];

const CATEGORIES = [
  "All",
  "Grains",
  "Vegetables",
  "Fruits",
  "Spices",
  "Oils",
  "Proteins",
];

export default function Ingredients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const filteredIngredients = useMemo(() => {
    return SAMPLE_INGREDIENTS.filter((ingredient) => {
      const matchesSearch =
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ingredient.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || ingredient.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container-max px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ingredient Database
            </h1>
            <p className="text-xl text-gray-600">
              Discover authentic African ingredients, their nutritional
              benefits, and how to use them in your cooking.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container-max px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Found {filteredIngredients.length} ingredient
              {filteredIngredients.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients Grid */}
      <section className="py-8">
        <div className="container-max px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIngredients.map((ingredient) => (
              <div
                key={ingredient.id}
                onClick={() => setSelectedIngredient(ingredient)}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              >
                {ingredient.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={ingredient.imageUrl}
                      alt={ingredient.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = "/ingredients/placeholder.svg";
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {ingredient.name}
                    </h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {ingredient.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {ingredient.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-medium text-gray-900">
                        Calories:
                      </span>
                      <span className="text-gray-600 ml-1">
                        {ingredient.nutritionPer100g.calories}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        Protein:
                      </span>
                      <span className="text-gray-600 ml-1">
                        {ingredient.nutritionPer100g.protein}g
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {ingredient.commonUses.slice(0, 2).map((use, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {use}
                      </span>
                    ))}
                    {ingredient.commonUses.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{ingredient.commonUses.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredIngredients.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No ingredients found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Ingredient Detail Modal */}
      {selectedIngredient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {selectedIngredient.imageUrl && (
              <div className="h-64 overflow-hidden rounded-t-lg">
                <img
                  src={selectedIngredient.imageUrl}
                  alt={selectedIngredient.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/ingredients/placeholder.svg";
                  }}
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedIngredient.name}
                  </h2>
                  <p className="text-primary font-medium">
                    {selectedIngredient.category}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedIngredient(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                {selectedIngredient.description}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Nutrition (per 100g)
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Calories:</span>
                      <span className="font-medium">
                        {selectedIngredient.nutritionPer100g.calories}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protein:</span>
                      <span className="font-medium">
                        {selectedIngredient.nutritionPer100g.protein}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbohydrates:</span>
                      <span className="font-medium">
                        {selectedIngredient.nutritionPer100g.carbs}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fat:</span>
                      <span className="font-medium">
                        {selectedIngredient.nutritionPer100g.fat}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fiber:</span>
                      <span className="font-medium">
                        {selectedIngredient.nutritionPer100g.fiber}g
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Origin:</span>
                      <span className="text-gray-600 ml-2">
                        {selectedIngredient.origin}
                      </span>
                    </div>
                    {selectedIngredient.season && (
                      <div>
                        <span className="font-medium">Season:</span>
                        <span className="text-gray-600 ml-2">
                          {selectedIngredient.season}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Common Uses
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredient.commonUses.map((use, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Substitutes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredient.substitutes.map((substitute, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {substitute}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
