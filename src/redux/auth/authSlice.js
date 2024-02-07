import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  snowflakeToken: {
    refresh:
      'ver:2-hint:39500814315526-did:2016-ETMsDgAAAY1qRvEKABRBRVMvQ0JDL1BLQ1M1UGFkZGluZwEAABAAEJRAurtaAViLJPUpYb2MCjgAAADwTkFsq+8DzvGMLljWqGlUk6vZn82XMq9BVQbgwIAvAjiUclTEqZFIFqVnGPYkbvYTPi+AcyR+QkP0F5UN4X7g8Io3uwKFumbkWVTRfBmQY1WfrAdGCV3VMzmHsJTZ3mrJ+ilam0vAf2sEXRdQXJyskekz4l0MnDoYbNFt93TlpREzvLHmJquaG5VuyxME4yIq1sbrnThfyP+mkSreSVOnH42InkZLM+VS7msF8BmYb9A0JbmkSGlHGrt0QRrObujSHjJumP/AcQwhkkCA+JoVkKErfps93BcMjtEbPsC5VwB4gmk+2Fnph4+LLdbiB7ssABQhFA3eht4JhmmVWjHGLW2mlQ/yNA==","access',
    access:
      "ver:1-hint:39500814307338-ETMsDgAAAY1qRvELABRBRVMvQ0JDL1BLQ1M1UGFkZGluZwEAABAAEI/O1xrZJ8q0FG6FeL99+3sAAABQjGrEoEoQTi0D87i4HIc0L0q7aqpRXf7h91O5EI1fHUmvEVTrw/z5PZfeCL6bcG1HwwxiiCBYppwSIq+1IpgOVgutjw7vNQAqXkhEOP6NnKoAFI4f+J9+o3pLIarVCskSyCeJxrfd"
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
  logout,
  setUser,
  setToken,
  setUserRoles,
  setAuthorized,
  setSnowflakeToken,
  setSnowflakeRefreshToken
} = authSlice.actions;

export default authSlice.reducer;
