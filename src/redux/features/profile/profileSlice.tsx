import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../config/axios";

/* -------------------------------------------------------------------------- */
/*                                  INTERFACES                                */
/* -------------------------------------------------------------------------- */

export interface USER {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "staff";
  avatar?: string;
  isGoogleUser: boolean;
  googleId?: string;
  preferences?: any;
  savedRecipes: string[];
  likedRecipes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface APIError {
  message: string;
}

export interface ProfileState {
  user: USER | null;
  allUsers: USER[];
  status: "idle" | "pending" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
  message: string;
}

const initialState: ProfileState = {
  user: null,
  allUsers: [],
  status: "idle",
  isLoading: false,
  error: null,
  message: "",
};

/* -------------------------------------------------------------------------- */
/*                               ASYNC THUNKS                                  */
/* -------------------------------------------------------------------------- */

// Extract error helper
const extractError = (err: any): APIError => err?.response?.data ?? { message: "An unexpected error occurred" };

// Get logged-in user profile
export const getUserProfile = createAsyncThunk<
  any,
  void,
  { rejectValue: APIError }
>("profile/getUserProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get("/api/users/profile", { withCredentials: true });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(extractError(err));
  }
});

// Update user profile
export const updateUserProfile = createAsyncThunk<
  any,
  Partial<USER>,
  { rejectValue: APIError }
>("profile/updateUserProfile", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.put("/api/users/profile", data, { withCredentials: true });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(extractError(err));
  }
});

// Get all users (Admin)
export const getAllUsers = createAsyncThunk<
  any,
  void,
  { rejectValue: APIError }
>("profile/getAllUsers", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get("/api/users/all", { withCredentials: true });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(extractError(err));
  }
});

/* -------------------------------------------------------------------------- */
/*                                   SLICE                                    */
/* -------------------------------------------------------------------------- */

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* -------------------------- GET USER PROFILE -------------------------- */
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.status = "pending";
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.message = action.payload.message || "";
        state.status = "succeeded";
        state.isLoading = false;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch profile";
        state.isLoading = false;
      });

    /* ------------------------ UPDATE USER PROFILE ------------------------- */
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "pending";
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.message = action.payload.message || "Profile updated successfully";
        state.status = "succeeded";
        state.isLoading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update profile";
        state.isLoading = false;
      });

    /* --------------------------- GET ALL USERS ---------------------------- */
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.status = "pending";
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload.users;
        state.message = "Fetched users successfully";
        state.status = "succeeded";
        state.isLoading = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch users";
        state.isLoading = false;
      });
  },
});

export default profileSlice.reducer;
