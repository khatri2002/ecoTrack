export type SignUpRequestOTP = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
};

export type SignUpVerifyOTP = SignUpRequestOTP & {
  otp: string;
};

export type SignInRequestOTP = {
  email: string;
};

export type SignInPassword = SignInRequestOTP & {
  password: string;
}
