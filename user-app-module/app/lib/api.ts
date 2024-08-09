import axios from "axios";
import { SignInPassword, SignInRequestOTP, SignUpRequestOTP, SignUpVerifyOTP } from "./api_types";

export const instance = axios.create({
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

export const getUser = async () => {
  try {
    const response = await instance.get("/user/getUser");
    return response.data;
  }
  catch (error) {
    throw error;
  }
}

export const signInPassword = async (data: SignInPassword) => {
  try {
    const response = await instance.post("/user/signIn/password", data);
    return response.data;
  }
  catch (error) {
    throw error;
  }
}

export const signInRequestOtp = async (data: SignInRequestOTP) => {
  try {
    const response = await instance.post("/user/signIn/requestOTP", data);
    return response.data;
  }
  catch (error) {
    throw error;
  }
}