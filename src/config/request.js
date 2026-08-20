import axios from "axios";
import { store } from "../redux/store";
import { setAuthorized } from "../redux/auth/authSlice";

export const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
export const COPILOT_API_KEY = process.env.REACT_APP_COPILOT_API_KEY;

export const request = axios.create({
  baseURL: BASE_API_URL
});

const errorHandler = (error) => {
  const status = error.response.status;
  if (status === 401) {
    store.dispatch(setAuthorized(true));
    // window.location.reload();
  }

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
