import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/app/hook";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../components/Toast";


interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isCompleted: boolean;
  addedDate: string;
  notes?: string;
}

interface PantrySuggestion {
  id: string;
  name: string;
  reason: string;
  urgency: "high" | "medium" | "low";
  suggestedQuantity: number;
  suggestedUnit: string;
  category: string;
}

export default function ShoppingList() {
    const {   user } = useAppSelector((state) => state.auth)
  const { showToast } = useToast();

  const [shoppingItems, setShoppingItems] = useState<ShoppingListItem[]>([]);
  const [suggestions, setSuggestions] = useState<PantrySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    unit: "pieces",
    category: "vegetables",
    notes: "",
  });

  const categories = [
    { id: "vegetables", name: "Vegetables", icon: "🥕" },
    { id: "fruits", name: "Fruits", icon: "🍎" },
    { id: "grains", name: "Grains & Rice", icon: "🌾" },
    { id: "proteins", name: "Proteins", icon: "🥩" },
    { id: "dairy", name: "Dairy", icon: "🥛" },
    { id: "spices", name: "Spices", icon: "🌶️" },
    { id: "oils", name: "Oils & Fats", icon: "🫒" },
    { id: "pantry", name: "Pantry Staples", icon: "🥫" },
    { id: "frozen", name: "Frozen", icon: "🧊" },
    { id: "other", name: "Other", icon: "📦" },
  ];

  const units = [
    "pieces",
    "kg",
    "g",
    "lbs",
    "oz",
    "cups",
    "tbsp",
    "tsp",
    "liters",
    "ml",
    "bottles",
    "cans",
    "packets",
    "bunches",
  ];

  // useEffect(() => {
  //   if (user) {
  //     fetchShoppingList();
  //     fetchSuggestions();
  //   }
  // }, [user]);

  // const fetchShoppingList = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.get(API_ENDPOINTS.PANTRY.SHOPPING_LIST);
  //     setShoppingItems(response.data);
  //   } catch (error) {
  //     console.error("Error fetching shopping list:", error);
  //     showToast("Failed to load shopping list", "error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const fetchSuggestions = async () => {
  //   try {
  //     const response = await axios.get(API_ENDPOINTS.PANTRY.SUGGESTIONS);
  //     setSuggestions(response.data);
  //   } catch (error) {
  //     console.error("Error fetching suggestions:", error);
  //   }
  // };

  // const handleAddItem = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!user) {
  //     showToast("You must be logged in to manage shopping list", "error");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     const itemData = {
  //       name: newItem.name.trim(),
  //       quantity: newItem.quantity,
  //       unit: newItem.unit,
  //       category: newItem.category,
  //       notes: newItem.notes.trim() || undefined,
  //     };

  //     const response = await axios.post(
  //       API_ENDPOINTS.PANTRY.ADD_TO_SHOPPING_LIST,
  //       itemData
  //     );
  //     setShoppingItems([...shoppingItems, response.data]);

  //     setShowAddModal(false);
  //     setNewItem({
  //       name: "",
  //       quantity: 1,
  //       unit: "pieces",
  //       category: "vegetables",
  //       notes: "",
  //     });

  //     showToast("Item added to shopping list!", "success");
  //   } catch (error: any) {
  //     console.error("Error adding shopping item:", error);
  //     showToast(error.response?.data?.message || "Failed to add item", "error");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleToggleCompleted = async (
  //   itemId: string,
  //   isCompleted: boolean
  // ) => {
  //   try {
  //     await axios.put(
  //       API_ENDPOINTS.PANTRY.UPDATE_SHOPPING_ITEM.replace(":id", itemId),
  //       { isCompleted }
  //     );

  //     setShoppingItems((prevItems) =>
  //       prevItems.map((item) =>
  //         item.id === itemId ? { ...item, isCompleted } : item
  //       )
  //     );
  //   } catch (error: any) {
  //     console.error("Error updating item:", error);
  //     showToast("Failed to update item", "error");
  //   }
  // };

  // const handleDeleteItem = async (itemId: string) => {
  //   try {
  //     await axios.delete(
  //       API_ENDPOINTS.PANTRY.DELETE_SHOPPING_ITEM.replace(":id", itemId)
  //     );
  //     setShoppingItems((prevItems) =>
  //       prevItems.filter((item) => item.id !== itemId)
  //     );
  //     showToast("Item removed from shopping list", "success");
  //   } catch (error: any) {
  //     console.error("Error deleting item:", error);
  //     showToast("Failed to remove item", "error");
  //   }
  // };

  // const handleAddSuggestion = async (suggestion: PantrySuggestion) => {
  //   try {
  //     const itemData = {
  //       name: suggestion.name,
  //       quantity: suggestion.suggestedQuantity,
  //       unit: suggestion.suggestedUnit,
  //       category: suggestion.category,
  //       notes: suggestion.reason,
  //     };

  //     const response = await axios.post(
  //       API_ENDPOINTS.PANTRY.ADD_TO_SHOPPING_LIST,
  //       itemData
  //     );
  //     setShoppingItems([...shoppingItems, response.data]);
  //     setSuggestions((prevSuggestions) =>
  //       prevSuggestions.filter((s) => s.id !== suggestion.id)
  //     );

  //     showToast(`${suggestion.name} added to shopping list!`, "success");
  //   } catch (error: any) {
  //     console.error("Error adding suggestion:", error);
  //     showToast("Failed to add suggestion", "error");
  //   }
  // };

  // const handleClearCompleted = async () => {
  //   try {
  //     const completedItems = shoppingItems.filter((item) => item.isCompleted);

  //     await Promise.all(
  //       completedItems.map((item) =>
  //         axios.delete(
  //           API_ENDPOINTS.PANTRY.DELETE_SHOPPING_ITEM.replace(":id", item.id)
  //         )
  //       )
  //     );

  //     setShoppingItems((prevItems) =>
  //       prevItems.filter((item) => !item.isCompleted)
  //     );
  //     showToast("Completed items cleared!", "success");
  //   } catch (error: any) {
  //     console.error("Error clearing completed items:", error);
  //     showToast("Failed to clear completed items", "error");
  //   }
  // };

  const filteredItems = shoppingItems.filter((item) => {
    return selectedCategory === "all" || item.category === selectedCategory;
  });

  const completedCount = shoppingItems.filter(
    (item) => item.isCompleted
  ).length;
  const totalCount = shoppingItems.length;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "border-red-500 bg-red-50";
      case "medium":
        return "border-yellow-500 bg-yellow-50";
      case "low":
        return "border-green-500 bg-green-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto max-w-4xl px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Shopping List
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to manage your shopping list.
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
            Shopping List
          </h1>
          <p className="text-lg text-gray-600">
            Keep track of what you need to buy and never forget an ingredient.
          </p>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {totalCount}
                </div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-green-600">
                  {completedCount}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <span className="text-2xl">💡</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-orange-600">
                  {suggestions.length}
                </div>
                <div className="text-sm text-gray-600">Suggestions</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Suggestions Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Smart Suggestions
              </h3>

              {suggestions.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No suggestions at the moment.
                </p>
              ) : (
                <div className="space-y-3">
                  {suggestions.slice(0, 5).map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className={`border-l-4 p-3 rounded-r-lg ${getUrgencyColor(
                        suggestion.urgency
                      )}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {suggestion.name}
                        </span>
                        <span>{getUrgencyIcon(suggestion.urgency)}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {suggestion.reason}
                      </p>
                      <Button
                        size="sm"
                        // onClick={() => handleAddSuggestion(suggestion)}
                        className="w-full bg-primary hover:bg-primary/90 text-white text-xs"
                      >
                        Add to List
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h3>

              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 transition-colors ${
                  selectedCategory === "all"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>📁</span>
                  <span>All Items</span>
                </div>
                <span className="text-sm">{shoppingItems.length}</span>
              </button>

              {categories.map((category) => {
                const count = shoppingItems.filter(
                  (item) => item.category === category.id
                ).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary text-white"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <span className="text-sm">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shopping List */}
          <div className="lg:col-span-3">
            {/* Actions Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Progress: {completedCount}/{totalCount} items
                  </span>
                  {totalCount > 0 && (
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(completedCount / totalCount) * 100}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    ➕ Add Item
                  </Button>
                  {completedCount > 0 && (
                    <Button
                      // onClick={handleClearCompleted}
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      🗑️ Clear Completed
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Shopping Items */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" message="Loading shopping list..." />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Your shopping list is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Add items to your shopping list or check out our smart
                  suggestions.
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Add Your First Item
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-6 transition-all duration-200 ${
                      item.isCompleted ? "bg-gray-50 opacity-75" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        // onClick={() =>
                        //   // handleToggleCompleted(item.id, !item.isCompleted)
                        // }
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 hover:border-green-500"
                        }`}
                      >
                        {item.isCompleted && (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>

                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">
                          {categories.find((c) => c.id === item.category)
                            ?.icon || "📦"}
                        </span>
                        <div className="flex-1">
                          <h3
                            className={`font-semibold ${
                              item.isCompleted
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.quantity} {item.unit} •{" "}
                            {
                              categories.find((c) => c.id === item.category)
                                ?.name
                            }
                          </p>
                          {item.notes && (
                            <p className="text-xs text-gray-500 mt-1">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        // onClick={() => handleDeleteItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Shopping Item
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
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
{/* onSubmit={handleAddItem} */}
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., Tomatoes"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          quantity: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={newItem.unit}
                      onChange={(e) =>
                        setNewItem({ ...newItem, unit: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newItem.notes}
                    onChange={(e) =>
                      setNewItem({ ...newItem, notes: e.target.value })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Any additional notes..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  >
                    Add Item
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
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
