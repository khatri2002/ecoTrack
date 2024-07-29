import { Stack } from "expo-router";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const RootLayout = () => {

    const theme = {
        ...MD3LightTheme,
        colors: {
            ...MD3LightTheme.colors,
            primary: "#60B45A", //TODO: avoid hardcoding
        }
    }

    return (
        <>
            <PaperProvider theme={theme}>
                <SafeAreaView className="flex-1">
                    <Stack screenOptions={{headerShown: false}}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="signIn" />
                        <Stack.Screen name="signUp" />
                    </Stack>
                </SafeAreaView>
            </PaperProvider>
        </>
    );
}

export default RootLayout;