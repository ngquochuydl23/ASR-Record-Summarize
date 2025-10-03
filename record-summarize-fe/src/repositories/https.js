import axios from "axios";
import _ from "lodash";
import Cookies from "js-cookie";
export const http = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

http.interceptors.request.use(
  function (config) {
    config.headers["Authorization"] = `Bearer ${Cookies.get("access_token")}`;
    config.headers["Content-Type"] = `application/json`;
    config.headers["appName"] = process.env.REACT_APP_NAME;
    config.headers["appVersion"] = process.env.REACT_APP_VERSION;
    config.headers["platform"] = process.env.REACT_APP_PLATFORM;
    config.headers["accept"] = `*/*`;
    config.headers["X-Requested-With"] = `XMLHttpRequest`;
    return config;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (_.has(error, "response.data")) {
      if (_.get(error, "response.status") === 401) {
        Cookies.remove("access_token");
        window.location.href = "/home";
        return Promise.reject(error);
      }
      const responseErr = _.get(error, "response.data");
      return Promise.reject(responseErr);
    }
    return Promise.reject(error);
  }
);
