import { Stack } from "expo-router";

const ViewReportLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="report/[id]/index" />
            <Stack.Screen name="report/[id]/details" />
        </Stack>
    );
}

export default ViewReportLayout;