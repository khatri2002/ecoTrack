import axios, { AxiosError } from "axios";

import { SignInInputs } from "./types";

export const instance = axios.create({
  baseURL: "http://192.168.29.84:8000",
});

export const signIn = async (data: SignInInputs) => {
  try {
    const response = await instance.post("/admin/login", data);
    return response.data;
  } catch (error) {
    // handle known error
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.status === 400
    ) {
      // invalid username or password
      return error.response.data;
    } else {
      // unknown or internal server error
      throw error;
    }
  }
};

export const getUser = async () => {
  const response = await instance.get("/admin/getUser");
  return response.data;
};
