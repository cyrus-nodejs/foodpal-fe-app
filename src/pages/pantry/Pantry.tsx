import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useToast } from "../../components/Toast";

import {
  getPantryItems,
  addPantryItem,
  updatePantryItem,
  deletePantryItem,
} from "../../redux/features/pantry/pantrySlice";

import { useAppDispatch, useAppSelector } from "../../redux/app/hook";

export default function Pantry() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const { items: pantryItems, isLoading, error, message } = useAppSelector(
    (state) => state.pantry
  );

  const { showToast } = useToast();

  // UI states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    unit: "pieces",
    category: "vegetables",
    expiryDate: "",
    lowStockThreshold: 5,
    image: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Load pantry items
  useEffect(() => {
    if (user) dispatch(getPantryItems());
  }, [user, dispatch]);

  // Toast handling
  useEffect(() => {
    if (message) showToast(message, "success");
    if (error) showToast(error, "error");
  }, [message, error]);

  // Image preview
  useEffect(() => {
    if (newItem.image) {
      const url = URL.createObjectURL(newItem.image);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [newItem.image]);

  /* ------------------------------------------------------------
    HANDLERS
  ------------------------------------------------------------ */

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return showToast("You must be logged in", "error");

    setIsSubmitting(true);

    const payload: any = {
      name: newItem.name.trim(),
      quantity: newItem.quantity,
      unit: newItem.unit,
      category: newItem.category,
      lowStockThreshold: newItem.lowStockThreshold,
      expiryDate: newItem.expiryDate || undefined,
    };

    await dispatch(addPantryItem(payload)).unwrap();

    setShowAddModal(false);
    setIsSubmitting(false);
    setNewItem({
      name: "",
      quantity: 1,
      unit: "pieces",
      category: "vegetables",
      expiryDate: "",
      lowStockThreshold: 5,
      image: null,
    });
  };

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    if (quantity < 0) return;

    await dispatch(updatePantryItem({ id, data: { quantity } })).unwrap();
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    await dispatch(deletePantryItem(id)).unwrap();
  };

  /* ------------------------------------------------------------
    FILTER LOGIC
  ------------------------------------------------------------ */

  const filteredItems = pantryItems.filter((item) => {
    const inCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return inCategory && matchesSearch;
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

  /* ------------------------------------------------------------
    EARLY RETURNS
  ------------------------------------------------------------ */

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Pantry Management</h1>
          <p className="text-gray-600 mb-6">Please sign in to continue.</p>
          <Button onClick={() => (window.location.href = "/signin")}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  /* ------------------------------------------------------------
    MAIN UI
  ------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Pantry</h1>

          <Button onClick={() => setShowAddModal(true)}>+ Add Item</Button>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-md mb-6"
        />

        {/* CATEGORY PANEL (Card with Shadow) */}
<div className="w-64 bg-white shadow-md rounded-xl p-5 h-fit">
  <h3 className="text-lg font-semibold mb-4">Categories</h3>

  <div className="flex flex-col gap-2">
    {/* All Category */}
    <button
      onClick={() => setSelectedCategory("all")}
      className={`w-full px-4 py-2 rounded-lg border text-left transition ${
        selectedCategory === "all"
          ? "bg-green-600 text-white border-green-700"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
    >
      All
    </button>

    {/* Dynamic categories */}
    {categories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => setSelectedCategory(cat.id)}
        className={`w-full px-4 py-2 rounded-lg border flex items-center gap-2 text-left transition ${
          selectedCategory === cat.id
            ? "bg-green-600 text-white border-green-700"
            : "bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <span className="text-xl">{cat.icon}</span>
        <span>{cat.name}</span>
      </button>
    ))}
  </div>
</div>


        {/* GRID */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {filteredItems.map((item) => {
            const isLowStock =
              item.lowStockThreshold &&
              item?.quantity! <= item.lowStockThreshold;

            const isExpiring =
              item.expiryDate &&
              new Date(item.expiryDate) <=
                new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

            return (
              <div
                key={item._id}
                className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                  isExpiring
                    ? "border-red-500"
                    : isLowStock
                    ? "border-yellow-500"
                    : "border-green-500"
                }`}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded mb-4"
                  />
                )}

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-500 capitalize">{item.category}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    🗑️
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity! - 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span className="font-semibold">{item.quantity}</span>

                  <button
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity! + 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Item</h2>

            <form onSubmit={handleAddItem} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Item name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full p-2 border rounded"
              />

              <div className="flex gap-3">
                <input
                  type="number"
                  min={1}
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      quantity: Number(e.target.value),
                    })
                  }
                  className="w-1/2 p-2 border rounded"
                />

                <input
                  type="text"
                  value={newItem.unit}
                  onChange={(e) =>
                    setNewItem({ ...newItem, unit: e.target.value })
                  }
                  className="w-1/2 p-2 border rounded"
                />
              </div>

              <select
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={newItem.expiryDate}
                onChange={(e) =>
                  setNewItem({ ...newItem, expiryDate: e.target.value })
                }
                className="w-full p-2 border rounded"
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Item"}
              </Button>

              <Button
                variant="secondary"
                onClick={() => setShowAddModal(false)}
                className="w-full mt-2"
              >
                Cancel
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
