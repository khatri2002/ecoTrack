import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signIn" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="otp_SignIn" />
      <Stack.Screen name="verify-otp/[type]" />
    </Stack>
  );
};

export default AuthLayout;
