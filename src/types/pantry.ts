
export interface PantryItem {
  id: string;                 // maps from _id in MongoDB
  user?: string;              // user ID (optional if not needed on frontend)
  name: string;
  category?:
    | "dairy"
    | "vegetable"
    | "fruit"
    | "grain"
    | "protein"
    | "canned"
    | "spice"
    | "beverage"
    | "bakery"
    | "other";
  imageUrl?: string;
  quantity?: number;
  unit?: string;
  expiryDate?: string;        // Dates come as ISO strings when JSON-encoded
  lowStockThreshold?: number;
  embedding?: number[];
  addedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}