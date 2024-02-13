import axios from "axios";
import { store } from "../redux/store";
import {
  setSnowflakeRefreshToken,
  setSnowflakeToken
} from "../redux/auth/authSlice";
import toast from "react-hot-toast";

export const snowflakeAPI = axios.create({
  baseURL: "https://newcopilotwebapi.azurewebsites.net/"
});

const refreshToken = async () =>
  new Promise(async (resolve, reject) => {
    const token = store.getState()?.auth?.snowflakeToken?.refresh;
    console.log(store.getState()?.auth?.snowflakeToken);
    if (token)
      snowflakeAPI
        .post("api/snowflake_integration/refresh_token", {
          refresh_token: token
        })
        .then((res) => resolve(res))
        .catch((err) => {
          store.dispatch(setSnowflakeToken(null));
          store.dispatch(setSnowflakeRefreshToken(null));
          reject(null);
        });
    else {
      // toast.error(
      //   "Token has been expired, please follow up to settings/snowflake page to get authorized"
      // );
      store.dispatch(setSnowflakeToken(null));
      store.dispatch(setSnowflakeRefreshToken(null));
    }
  });

const errorHandler = async (error) => {
  const status = error.response?.status;
  const originalRequest = error.config;

  if (status === 401 && !error?.config?.url?.includes("refresh_token")) {
    const res = await refreshToken();

    store.dispatch(setSnowflakeToken(res.access_token));
    store.dispatch(setSnowflakeRefreshToken(res.refresh_token));
    if (!!res) return originalRequest;
  }

  return Promise.reject(error.response);
};

snowflakeAPI.defaults.headers.post["Content-Type"] =
  "application/json;charset=utf-8";
snowflakeAPI.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

snowflakeAPI.interceptors?.request.use(
  (config) => {
    const token = store.getState()?.auth?.snowflakeToken?.access;
    const apiToken = store.getState()?.auth?.token;

    if (token) {
      config.headers["Token"] = `Bearer ${token}`;
    }

    if (apiToken) {
      config.headers["Authorization"] = `Bearer ${apiToken}`;
    }

    return config;
  },

  (error) => errorHandler(error)
);

snowflakeAPI.interceptors?.response.use((response) => {
  return response.data;
}, errorHandler);
