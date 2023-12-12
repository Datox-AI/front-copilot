import axios from "axios";
import { store } from "../redux/store";
import { setAuthorized } from "../redux/auth/authSlice";

export const request = axios.create({
  baseURL: "https://copilotwebapi.azurewebsites.net/"
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
    config.headers.set(
      "ApiKey",
      "mGXWZKWNIDa5BEm8QvpTg+36AIpAA+6HfitgGTZHYus="
    );

    return config;
  },

  (error) => errorHandler(error)
);

request.interceptors?.response.use((response) => {
  store.dispatch(setAuthorized(false));

  return response.data;
}, errorHandler);
