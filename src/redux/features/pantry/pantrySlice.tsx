import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../../config/axios";

/* -------------------------------------------------------------------------- */
/*                                  INTERFACES                                */
/* -------------------------------------------------------------------------- */

export interface PantryItem {
  _id: string;
  user: string;
  name: string;
  category:
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
  expiryDate?: string;
  lowStockThreshold?: number;
  addedDate?: string;
  embedding?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  name: string;
  quantity?: number;
  unit?: string;
}

export interface SuggestedRecipe {
  _id: string;
  title: string;
  description: string;
  image?: string;
  ingredients: RecipeIngredient[];
  similarity: number;
  advice: string;
}

export interface APIError {
  message: string;
}

export interface PantryState {
  items: PantryItem[];
  suggestions: SuggestedRecipe[];
  status: "idle" | "pending" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
  message: string;
}

const initialState: PantryState = {
  items: [],
  suggestions: [],
  status: "idle",
  isLoading: false,
  error: null,
  message: "",
};

/* -------------------------------------------------------------------------- */
/*                               ERROR HANDLER                                 */
/* -------------------------------------------------------------------------- */

const extractError = (err: any): APIError =>
  err?.response?.data ?? { message: "An unexpected error occurred" };

/* -------------------------------------------------------------------------- */
/*                                 THUNKS                                     */
/* -------------------------------------------------------------------------- */

export const getPantryItems = createAsyncThunk<PantryItem[], void, { rejectValue: APIError }>(
  "pantry/getPantryItems",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/pantry", { withCredentials: true });
      return res.data as PantryItem[];
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const addPantryItem = createAsyncThunk<PantryItem, Partial<PantryItem>, { rejectValue: APIError }>(
  "pantry/addPantryItem",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/pantry", data, { withCredentials: true });
      return res.data as PantryItem;
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const updatePantryItem = createAsyncThunk<PantryItem, { id: string; data: Partial<PantryItem> }, { rejectValue: APIError }>(
  "pantry/updatePantryItem",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/pantry/${id}`, data, { withCredentials: true });
      return res.data as PantryItem;
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const deletePantryItem = createAsyncThunk<{ id: string }, string, { rejectValue: APIError }>(
  "pantry/deletePantryItem",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/pantry/${id}`, { withCredentials: true });
      return { id };
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const suggestRecipesFromPantry = createAsyncThunk<{ data: SuggestedRecipe[]; message: string }, void, { rejectValue: APIError }>(
  "pantry/suggestRecipesFromPantry",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/pantry/suggestions", { withCredentials: true });
      return res.data as { data: SuggestedRecipe[]; message: string };
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  }
);

/* -------------------------------------------------------------------------- */
/*                                   SLICE                                    */
/* -------------------------------------------------------------------------- */

export const pantrySlice = createSlice({
  name: "pantry",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state: PantryState) => {
      state.isLoading = true;
      state.status = "pending";
      state.error = null;
      state.message = "";
    };

    const handleRejected = (state: PantryState, action: PayloadAction<APIError | undefined>) => {
      state.isLoading = false;
      state.status = "failed";
      state.error = action.payload?.message || "Something went wrong";
    };

    /* --------------------------- GET PANTRY ITEMS -------------------------- */
    builder
      .addCase(getPantryItems.pending, handlePending)
      .addCase(getPantryItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
        state.isLoading = false;
      })
      .addCase(getPantryItems.rejected, handleRejected);

    /* ----------------------------- ADD PANTRY ITEM ----------------------------- */
    builder
      .addCase(addPantryItem.pending, handlePending)
      .addCase(addPantryItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.message = "Item added successfully";
        state.status = "succeeded";
        state.isLoading = false;
      })
      .addCase(addPantryItem.rejected, handleRejected);

    /* ---------------------------- UPDATE PANTRY ITEM --------------------------- */
    builder
      .addCase(updatePantryItem.pending, handlePending)
      .addCase(updatePantryItem.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((i) => (i._id === updated._id ? updated : i));
        state.message = "Item updated successfully";
        state.status = "succeeded";
        state.isLoading = false;
      })
      .addCase(updatePantryItem.rejected, handleRejected);

    /* ---------------------------- DELETE PANTRY ITEM --------------------------- */
    builder
      .addCase(deletePantryItem.pending, handlePending)
      .addCase(deletePantryItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload.id);
        state.message = "Item deleted successfully";
        state.status = "succeeded";
        state.isLoading = false;
      })
      .addCase(deletePantryItem.rejected, handleRejected);

    /* ----------------------------- SUGGEST RECIPES ----------------------------- */
    builder
      .addCase(suggestRecipesFromPantry.pending, handlePending)
      .addCase(suggestRecipesFromPantry.fulfilled, (state, action) => {
        state.suggestions = action.payload.data || [];
        state.message = action.payload.message || "";
        state.status = "succeeded";
        state.isLoading = false;
      })
      .addCase(suggestRecipesFromPantry.rejected, handleRejected);
  },
});

export default pantrySlice.reducer;
