import * as api from "../lib/api";

export const setAuthToken = (token: string) => {
  api.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  delete api.instance.defaults.headers.common["Authorization"];
};
