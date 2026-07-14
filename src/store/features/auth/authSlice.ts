import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState, LoginRequest, RegisterRequest } from '../../../types/auth';
import { login as loginService, register as registerService } from '../../../services/auth.service';
import { getToken, getRole, getName, setToken, setRole, setName, clearAuth } from '../../../utils/token';
import type { RootState } from '../../index';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginService(data);
      setToken(response.token);
      if (response.role) {
        setRole(response.role);
      }
      if (response.fullName) {
        setName(response.fullName);
      }
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await registerService(data);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

const initialState: AuthState = {
  token: getToken(),
  role: getRole(),
  fullName: getName(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.fullName = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuth();
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.role = action.payload.role || null;
        state.fullName = action.payload.fullName || null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUserRole = (state: RootState) => state.auth.role;
export const selectUserName = (state: RootState) => state.auth.fullName;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
