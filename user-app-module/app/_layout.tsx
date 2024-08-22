import { Stack } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthProvider from "./context/AuthProvider";

const RootLayout = () => {
  const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#60B45A", //TODO: avoid hardcoding
      surfaceVariant: "#fff",
    },
  };

  return (
    <>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <SafeAreaView className="flex-1">
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />

                  <Stack.Screen name="(auth)/signIn" />
                  <Stack.Screen name="(auth)/signUp" />
                  <Stack.Screen name="(auth)/otp_SignIn" />
                  <Stack.Screen name="(auth)/verify-otp/[type]" />

                  <Stack.Screen name="home" />
                  <Stack.Screen name="report-cleanup-info" />
                  <Stack.Screen name="report-cleanup-form" />
                  <Stack.Screen name="report-cleanup-success" />
                  <Stack.Screen name="profile" />
                  <Stack.Screen name="reports" />
                  <Stack.Screen name="report/[id]" />
                </Stack>
              </SafeAreaView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </PaperProvider>
      </AuthProvider>
    </>
  );
};

export default RootLayout;
