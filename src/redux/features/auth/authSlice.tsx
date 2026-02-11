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
  preferences?: string;
  savedRecipes: string[];
  likedRecipes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface APIError {
  message: string;
}

export interface AuthState {
  user: USER | null;
  isAuthenticated: boolean;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  message: string;
  token: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  message: "",
  status: "idle",
  token: null,
  error: null,
  isLoading: false,
};

/* -------------------------------------------------------------------------- */
/*                              ASYNC THUNK HELPERS                            */
/* -------------------------------------------------------------------------- */

const extractError = (err: any): APIError => {
  return err?.response?.data ?? { message: "An unexpected error occurred" };
};

/* -------------------------------------------------------------------------- */
/*                                  ASYNC THUNKS                              */
/* -------------------------------------------------------------------------- */

export const CurrentUser = createAsyncThunk<
  any,
  void,
  { rejectValue: APIError }
>("auth/CurrentUser", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/api/auth/me`, { withCredentials: true });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(extractError(err));
  }
});

export const Login = createAsyncThunk<
  any,
  { email: string; password: string },
  { rejectValue: APIError }
>("auth/Login", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`/api/auth/login`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(extractError(err));
  }
});

export const Register = createAsyncThunk<
  any,
  { name: string; email: string; password: string },
  { rejectValue: APIError }
>("auth/Register", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`/api/auth/register`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(extractError(err));
  }
});

export const RefreshToken = createAsyncThunk<
  any,
  void,
  { rejectValue: APIError }
>("auth/RefreshToken", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/api/auth/refresh`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(extractError(err));
  }
});

export const Logout = createAsyncThunk<
  any,
  void,
  { rejectValue: APIError }
>("auth/Logout", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.post(`/api/auth/logout`, {}, { withCredentials: true });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(extractError(err));
  }
});

export const ForgotPassword = createAsyncThunk<
  any,
  { email: string },
  { rejectValue: APIError }
>("auth/ForgotPassword", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`/api/auth/reset-password`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(extractError(err));
  }
});

export const ResetPassword = createAsyncThunk<
  any,
  { token: string; password: string },
  { rejectValue: APIError }
>("auth/ResetPassword", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`/api/auth/reset/${data.token}`, {
      password: data.password,
    });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(extractError(err));
  }
});

/* -------------------------------------------------------------------------- */
/*                                   SLICE                                    */
/* -------------------------------------------------------------------------- */

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* ----------------------------- CURRENT USER ---------------------------- */
    builder
      .addCase(CurrentUser.pending, (state) => {
        state.status = "pending";
        state.isLoading = true;
      })
      .addCase(CurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user ?? null;
        state.isAuthenticated = true;
        state.message = action.payload.message;
        state.status = "succeeded";
        state.isLoading = false;
      })
      .addCase(CurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Could not load user";
        state.isLoading = false;
      });

    /* --------------------------------- LOGIN ------------------------------- */
    builder
      .addCase(Login.pending, (state) => {
        state.status = "pending";
        state.isLoading = true;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.user = action.payload.user ?? null;
        state.message = action.payload.message;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.isLoading = false;
      })
      .addCase(Login.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        const rawMsg = action.payload?.message || "Login failed";
       switch (rawMsg) {
      case "User not found":
      case "Invalid credentials":
        state.error = "Invalid email or password";
        break;
      default:
        state.error = rawMsg;
    }
      });

    /* ------------------------------ REGISTER ------------------------------ */
    builder
      .addCase(Register.pending, (state) => {
        state.status = "pending";
        state.isLoading = true;
      })
      .addCase(Register.fulfilled, (state, action) => {
        state.user = action.payload.user ?? null;
        state.message = action.payload.message;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.isLoading = false;
      })
      .addCase(Register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Registration failed";
        state.isLoading = false;
      });

    /* -------------------------------- LOGOUT ------------------------------ */
    builder
      .addCase(Logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.message = "Logged out successfully";
      })
      .addCase(Logout.rejected, (state, action) => {
        state.error = action.payload?.message || "Logout failed";
      });

    /* ----------------------------- FORGOT PASSWORD ------------------------- */
    builder
      .addCase(ForgotPassword.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(ForgotPassword.rejected, (state, action) => {
        state.error = action.payload?.message || "Password request failed";
      });

    /* ----------------------------- RESET PASSWORD -------------------------- */
    builder
      .addCase(ResetPassword.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(ResetPassword.rejected, (state, action) => {
        state.error = action.payload?.message || "Password reset failed";
      });
  },
});

export default authSlice.reducer;
