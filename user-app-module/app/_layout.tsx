import { Stack } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import AuthProvider from "./context/AuthProvider";
import ReportDataProvider from "./context/ReportDataProvider";

const RootLayout = () => {
  const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#60B45A", //TODO: avoid hardcoding
      surfaceVariant: "#fff",
      primaryContainer: "#fff"
    },
  };

  return (
    <>
      <AuthProvider>
        <ReportDataProvider>
          <PaperProvider theme={theme}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex-1"
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(submit-report)" />
                    <Stack.Screen name="(view-report)" />        
                  </Stack>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </PaperProvider>
        </ReportDataProvider>
      </AuthProvider>
    </>
  );
};

export default RootLayout;
