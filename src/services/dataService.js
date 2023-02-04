import axios from "axios";
import { Storage } from "../Storage";

const REACT_APP_API_BASEURL = process.env.REACT_APP_API_BASEURL;

const client = axios.create({
  baseURL: REACT_APP_API_BASEURL,
  withCredentials: false,
});

const header = (head) => {
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (Storage.get("user-token").authToken) {
    headers["Authorization"] = Storage.get("user-token").authToken;
  }

  if (head) {
    for (const key in head) {
      headers[key] = head[key];
    }
  }
  return headers;
};

class DataService {
  // GET --

  static get(path = "", params = false, optionalHeader) {
    if (params) {
      params = Object.keys(params)
        .map((key) => key + "=" + params[key])
        .join("&");
    }
    return client({
      method: "GET",
      url: params ? path + "?" + params : path,
      headers: header(optionalHeader),
    });
  }

  // POST--'''

  static post(path = "", data = {}, optionalHeader) {
    return client({
      method: "POST",
      url: path,
      data,
      headers: header(optionalHeader),
    });
  }
}

client.interceptors.request.use((config) => {
  const requestConfig = config;
  const { headers } = config;
  requestConfig.headers = { ...headers };

  return requestConfig;
});

client.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;
    if (response) {
      if (response.data.response_status === 401) {
        Storage.remove("auth");
      }
      return response.data;
    }
    return Promise.reject(error);
  }
);
export { DataService };
