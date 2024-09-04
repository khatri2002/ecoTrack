import { LoginData } from "@/types/api";
import axios from "axios";

export const instance = axios.create({
  baseURL: "http://192.168.0.143:8000/admin",
  timeout: 1000,
});

export const login = async (data: LoginData) => {
  try {
    const response = await instance.post("/login", data);

    return response.data;
  } catch (error) {
    if (error.response.data) return error.response.data;
    else throw error;
  }
};

export const getUser = async () => {
  try {
    const response = await instance.get("/getUser");

    return response.data;
  } catch (error) {
    return error;
  }
};
