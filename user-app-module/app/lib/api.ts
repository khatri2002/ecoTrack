import axios from "axios";
import { SignUpRequestOTP, SignUpVerifyOTP } from "./api_types";

const instance = axios.create({
  baseURL: "http://192.168.0.143:8000",
  timeout: 1000
});

export const signUpRequestOTP = async (data: SignUpRequestOTP) => {
  try {
    const response = await instance.post("/user/signUp/requestOTP", data);
    return response.data;
  }
  catch (error) {
    throw error;
  }
};

export const signUpVerifyOTP = async (data: SignUpVerifyOTP) => {
  try {
    const response = await instance.post("/user/signUp/verifyOTP", data);
    return response.data;
  }
  catch (error) {
    throw error;
  }
};

