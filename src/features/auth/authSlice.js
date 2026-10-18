import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { KEYS, loadJSON, saveJSON, removeKey } from "../../utils/storage";
import { hashPassword } from "../../utils/format";

// Frontend-only simulation: users are kept in localStorage.
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    const users = loadJSON(KEYS.users, []);
    const normalized = email.trim().toLowerCase();
    if (users.some((u) => u.email === normalized)) {
      return rejectWithValue("An account with this email already exists.");
    }
    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalized,
      passwordHash: await hashPassword(password, normalized),
    };
    saveJSON(KEYS.users, [...users, user]);
    return { id: user.id, name: user.name, email: user.email };
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    const normalized = email.trim().toLowerCase();
    const user = loadJSON(KEYS.users, []).find((u) => u.email === normalized);
    const hash = await hashPassword(password, normalized);
    if (!user || user.passwordHash !== hash) {
      return rejectWithValue("Email or password is incorrect.");
    }
    return { id: user.id, name: user.name, email: user.email };
  }
);

const startSession = (state, action) => {
  state.status = "idle";
  state.user = action.payload;
  state.error = null;
  saveJSON(KEYS.session, action.payload);
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadJSON(KEYS.session, null), // restores login after a page refresh
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      removeKey(KEYS.session);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(registerUser.fulfilled, startSession)
      .addCase(registerUser.rejected, (s, a) => { s.status = "idle"; s.error = a.payload || "Registration failed."; })
      .addCase(loginUser.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(loginUser.fulfilled, startSession)
      .addCase(loginUser.rejected, (s, a) => { s.status = "idle"; s.error = a.payload || "Login failed."; });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export default authSlice.reducer;
