import axios from "axios";
import { store } from "../redux/store";
import { setToken, setUser } from "../redux/auth/authSlice";

export const snowflakeAPI = axios.create({
  baseURL: "https://snowflakeintegrationdatox.azurewebsites.net/"
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

snowflakeAPI.defaults.headers.post["Content-Type"] =
  "application/json;charset=utf-8";
snowflakeAPI.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

snowflakeAPI.interceptors?.request.use(
  (config) => {
    const token = store.getState()?.auth?.token;

    return config;
  },

  (error) => errorHandler(error)
);

snowflakeAPI.interceptors?.response.use((response) => {
  return response.data;
}, errorHandler);
