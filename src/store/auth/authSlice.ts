import { TLoading } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import actAuthLogin from "./act/actAuthLogin";
import actGoogleLogin from "./act/actGoogleLogin";
import { isString } from "@/types/gurads";

type TAuthState = {
  user: {
    id?: number;
    email: string;
    phone?: string;
    first_name: string;
    last_name: string;
    token: string;
  } | null;
  loading: TLoading;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  loading: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // Regular Login
    builder.addCase(actAuthLogin.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actAuthLogin.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.user = action.payload.user;
    });
    builder.addCase(actAuthLogin.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });

    // Google Login
    builder.addCase(actGoogleLogin.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actGoogleLogin.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.user = {
        email: action.payload.email,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        token: action.payload.token,
      }
    });
    builder.addCase(actGoogleLogin.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });
  },
});

export const { logout } = authSlice.actions;

export { actAuthLogin, actGoogleLogin };

export default authSlice.reducer;
