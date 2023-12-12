import axios from "axios";
import { store } from "../redux/store";
import { setToken, setUser } from "../redux/auth/authSlice";

export const request = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

const errorHandler = (error) => {
  const status = error.response?.status;
  if (status === 401) {
    store.dispatch(setToken(null));
    store.dispatch(setUser(null));

    window.location.reload();
  }

  return Promise.reject(error.response);
};

request.interceptors?.request.use(
  (config) => {
    const token = store.getState()?.auth?.token;

    if (token) {
      config.headers["x-access-token"] = token;
    }

    if (config.url === "upload")
      config.headers.set("Content-Type", "multipart/form-data");
    else config.headers.set("Content-Type", "application/json");

    return config;
  },

  (error) => errorHandler(error)
);

request.interceptors?.response.use((response) => {
  return response.data;
}, errorHandler);
