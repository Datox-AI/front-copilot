import axios from "axios";
import { store } from "../redux/store";
import { setSnowflakeToken } from "../redux/auth/authSlice";

export const snowflakeAPI = axios.create({
  baseURL: "https://snowflakedatox.azurewebsites.net/"
});

const errorHandler = (error) => {
  // const status = error.response?.status;

  store.dispatch(setSnowflakeToken(null));

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
