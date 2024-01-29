import axios from "axios";
import { store } from "../redux/store";
import {
  setSnowflakeRefreshToken,
  setSnowflakeToken
} from "../redux/auth/authSlice";

export const snowflakeAPI = axios.create({
  baseURL: "https://snowflakedatox.azurewebsites.net/"
});

const refreshToken = async () =>
  new Promise(async (resolve, reject) => {
    const token = store.getState()?.auth?.snowflakeToken?.refresh;

    snowflakeAPI
      .post("refresh_token?refresh_token=" + token)
      .then((res) => resolve(res))
      .catch((err) => {
        store.dispatch(setSnowflakeToken(null));
        reject(err);
      });
  });

const errorHandler = async (error) => {
  const status = error.response?.status;
  const originalRequest = error.config;

  if (status === 401) {
    const res = await refreshToken();

    store.dispatch(setSnowflakeToken(res.access_token));
    store.dispatch(setSnowflakeRefreshToken(res.refresh_token));
    if (!!res) return originalRequest;
  }

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
