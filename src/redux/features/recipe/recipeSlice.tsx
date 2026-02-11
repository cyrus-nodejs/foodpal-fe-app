// store/recipeSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../config/axios";
import { Recipe } from "../../../types/recipe";   // <-- USE THE NEW MODEL

interface RecipeState {
  recipes: Recipe[];
  myRecipes: Recipe[];
  matchedRecipes: Recipe[];
  currentRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: RecipeState = {
  recipes: [],
  myRecipes: [],
  matchedRecipes: [],
  currentRecipe: null,
  loading: false,
  error: null,
  message: "",
  status: "idle",
};

const BASEURL = import.meta.env.VITE_APP_BASE_URL;

// ──────────────────────────────── ASYNC THUNKS ────────────────────────────────

// Create Recipe (as before)
export const createRecipe = createAsyncThunk<
  Recipe,
  FormData,
  { rejectValue: string }
>("recipes/createRecipe", async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`/api/recipes`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data as Recipe;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Failed to create recipe");
  }
});

// Match / Generate Recipe (as before)
export const matchGenerateRecipe = createAsyncThunk<
  Recipe[],
  { inputText: string; filters?: any; files?: File[] },
  { rejectValue: string }
>("recipes/matchGenerateRecipe", async (payload, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("inputText", payload.inputText);
    if (payload.filters) {
      formData.append("filters", JSON.stringify(payload.filters));
    }
    if (payload.files) {
      payload.files.forEach((f) => formData.append("images", f));
    }

    const res = await axios.post(`/api/recipes/generate-recipe`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.recipes as Recipe[];
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Failed to match/generate recipe");
  }
});

// Fetch “For You” Recipes
export const fetchForYouRecipes = createAsyncThunk<
  Recipe[],
  string,
  { rejectValue: string }
>("recipes/fetchForYouRecipes", async (userId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/api/recipes/my-recipe`, {
      params: { userId },
      withCredentials: true,
    });
    return res.data.recommendations as Recipe[];
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Failed to fetch personalized recipes");
  }
});

// Fetch All Recipes
export const fetchAllRecipes = createAsyncThunk<
  Recipe[],
  void,
  { rejectValue: string }
>("recipes/fetchAllRecipes", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/api/recipes`, {
      withCredentials: false,
    });
    return res.data.data as Recipe[];
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch recipes");
  }
});

// **New**: Fetch a single recipe by ID
export const fetchRecipeById = createAsyncThunk<
  Recipe,
  string,
  { rejectValue: string }
>("recipes/fetchRecipeById", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/api/recipes/${id}`, {
      withCredentials: false,
    });
    return res.data.data as Recipe;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch recipe");
  }
});

// **New**: Update a recipe
export const updateRecipe = createAsyncThunk<
  Recipe,
  { id: string; data: Partial<Recipe> },
  { rejectValue: string }
>("recipes/updateRecipe", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/api/recipes/${id}`, data, {
      withCredentials: true,
    });
    return res.data.data as Recipe;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to update recipe");
  }
});

// **New**: Delete a recipe
export const deleteRecipe = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>("recipes/deleteRecipe", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/recipes/${id}`, {
      withCredentials: true,
    });
    return { id };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete recipe");
  }
});

// ──────────────────────────────── SLICE ────────────────────────────────

export const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    clearMatchedRecipes(state) {
      state.matchedRecipes = [];
    },
    clearMessages(state) {
      state.message = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // createRecipe
    builder
      .addCase(createRecipe.pending, (state) => {
        state.status = "pending";
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
       
        state.message = "Recipe created successfully";
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload as string;
      });

    // matchGenerateRecipe
    builder
      .addCase(matchGenerateRecipe.pending, (state) => {
        state.status = "pending";
        state.loading = true;
        state.error = null;
      })
      .addCase(matchGenerateRecipe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.matchedRecipes = action.payload;
        state.message = "Recipes matched/generated successfully";
      })
      .addCase(matchGenerateRecipe.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchForYouRecipes
    builder
      .addCase(fetchForYouRecipes.pending, (state) => {
        state.status = "pending";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForYouRecipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.myRecipes = action.payload;
        state.message = "Personalized recipes fetched";
      })
      .addCase(fetchForYouRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchAllRecipes
    builder
      .addCase(fetchAllRecipes.pending, (state) => {
        state.status = "pending";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRecipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.recipes = action.payload;
        state.message = "All recipes fetched";
      })
      .addCase(fetchAllRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchRecipeById
    builder
      .addCase(fetchRecipeById.pending, (state) => {
        state.status = "pending";
        state.loading = true;
        state.error = null;
        state.currentRecipe = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload as string;
      });

    // updateRecipe
    builder
      .addCase(updateRecipe.pending, (state) => {
        state.status = "pending";
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        const updated = action.payload;
        const idx = state.recipes.findIndex((r) => r._id === updated._id);
        if (idx !== -1) state.recipes[idx] = updated;
        state.message = "Recipe updated successfully";
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload as string;
      });

    // deleteRecipe
    builder
      .addCase(deleteRecipe.pending, (state) => {
        state.status = "pending";
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.recipes = state.recipes.filter((r) => r._id !== action.payload.id);
        state.message = "Recipe deleted successfully";
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMatchedRecipes, clearMessages } = recipeSlice.actions;
export default recipeSlice.reducer;
