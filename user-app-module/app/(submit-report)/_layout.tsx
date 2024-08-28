import { Stack } from "expo-router";

const SubmitReportLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="report-cleanup-info" />
      <Stack.Screen name="report-cleanup-form" />
      <Stack.Screen name="report-cleanup-success" />
    </Stack>
  );
};

export default SubmitReportLayout;
