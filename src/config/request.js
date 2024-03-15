import axios from "axios";
import { store } from "../redux/store";
import {
  setAuthorized,
  setToken,
  setUser,
  setUserRoles
} from "../redux/auth/authSlice";
import { loginRequest } from "./msal";
import { msalInstance } from "../App";
import jwtDecode from "jwt-decode";
import { resolve } from "path-browserify";

export const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
export const COPILOT_API_KEY = process.env.REACT_APP_COPILOT_API_KEY;

export const request = axios.create({
  baseURL: BASE_API_URL
});

export const refreshAzureToken = () =>
  new Promise(async (resolve, reject) => {
    try {
      const username = store.getState().auth.user.username;

      if (!msalInstance.getActiveAccount()) {
        // Replace 'accountIdentifier' with the actual account identifier
        const account = msalInstance.getAccountByUsername(username);
        msalInstance.setActiveAccount(account);
      }

      // Attempt to refresh the token
      const tokenResponse = await msalInstance.acquireTokenSilent({
        ...loginRequest
      });

      resolve(tokenResponse);
    } catch (err) {
      reject(err);
    }
  });

const errorHandler = async (error) => {
  const status = error?.response?.status;
  const originalRequest = error.config;

  if (status === 401 && !originalRequest._retry) {
    originalRequest._retry = true; // Avoid infinite loops

    try {
      const tokenResponse = await refreshAzureToken();

      // Retry the failed request with the new token
      originalRequest.headers.Authorization = `Bearer ${tokenResponse.accessToken}`;

      // Acquire token silent success
      let accessToken = tokenResponse.accessToken;
      const decoded = jwtDecode(accessToken);

      store.dispatch(setToken(tokenResponse.accessToken));
      store.dispatch(setUser(tokenResponse.account));
      store.dispatch(setUserRoles(decoded?.roles || []));

      return request(originalRequest);
    } catch (refreshError) {
      // Handle token refresh error
      console.error("Token refresh error:", refreshError);
      return Promise.reject(refreshError);
    }
  }

  console.log(error);

  return Promise.reject(error.response);
};

request.interceptors?.request.use(
  (config) => {
    const token = store.getState()?.auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.headers["Content-Type"] !== "multipart/form-data")
      config.headers.set("Content-Type", "application/json");
    // config.headers.set("ApiKey", COPILOT_API_KEY);

    return config;
  },

  (error) => errorHandler(error)
);

request.interceptors?.response.use((response) => {
  store.dispatch(setAuthorized(false));

  return response.data;
}, errorHandler);
