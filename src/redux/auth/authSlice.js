import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  snowflakeToken: {
    refresh: null,
    access: null
  },
  isUnauthorized: false,
  userRoles: []
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, { payload }) => {
      state.token = payload;
    },
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
    setAuthorized: (state, { payload }) => {
      state.isUnauthorized = payload;
    },
    setSnowflakeToken: (state, { payload }) => {
      state.snowflakeToken.access = payload;
    },
    setSnowflakeRefreshToken: (state, { payload }) => {
      state.snowflakeToken.refresh = payload;
    },
    setUserRoles: (state, { payload }) => {
      state.userRoles = payload;
    }
  }
});

export const {
  setToken,
  setUser,
  logout,
  setAuthorized,
  setUserRoles,
  setSnowflakeToken,
  setSnowflakeRefreshToken
} = authSlice.actions;

export default authSlice.reducer;
