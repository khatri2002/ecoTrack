import { useState } from "react";
import { Text, View } from "react-native";
import { Appbar, Button, Checkbox } from "react-native-paper";

const ReportCleanUpInfo = () => {
  const [checked, setChecked] = useState(false);
  const [error, showError] = useState(false);

  const handleProceed = () => {
    if(!checked) {
      showError(true);
      return;
    }
    showError(false);

    // check for permissions here
    // location, camera, audio etc
  };

  return (
    <>
      <Appbar.Header className="bg-white" elevated={true} statusBarHeight={0}>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="Report Cleanup" />
      </Appbar.Header>

      <View className="bg-slate-200 m-3 p-3 rounded-lg">
        <Text className="text-base text-center font-semibold mb-8">
          Important Information Before Submitting a Cleanup Report
        </Text>
        <View className="bg-white p-3 rounded-lg flex-col gap-y-3">
          <View className="flex-row gap-x-2 items-start">
            <Text className="text-base font-semibold">{`\u2192`}</Text>
            <Text className="flex-1">
              You must be physically present at the location you wish to report.
            </Text>
          </View>
          <View className="flex-row gap-x-2 items-start">
            <Text className="text-base font-semibold">{`\u2192`}</Text>
            <Text className="flex-1">
              Photos and videos required for the report must be captured
              directly through the app.
            </Text>
          </View>
          <View className="flex-row gap-x-2 items-start">
            <Text className="text-base font-semibold">{`\u2192`}</Text>
            <Text className="flex-1">
              ecoTrack may connect with you for further information or
              clarification.
            </Text>
          </View>
          <View className="flex-row gap-x-2 items-start">
            <Text className="text-base font-semibold">{`\u2192`}</Text>
            <Text className="flex-1">
              All submitted reports will be reviewed for authenticity and
              relevance. If the information provided is deemed insufficient,
              inaccurate, or non-genuine, the report proposal may be rejected.
            </Text>
          </View>
        </View>
        <View className="bg-white p-3 rounded-lg mt-5">
          <View className="flex-row justify-center gap-x-3">
            <View className="border rounded-full">
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                onPress={() => {
                  setChecked(!checked);
                }}
              />
            </View>
            <Text className="font-semibold">
              I have read and understood the above requirements
            </Text>
          </View>
          {error && (
            <Text className="mt-3 text-center text-red-600">
              Please check the consent box to continue.
            </Text>
          )}
          <Button
            mode="contained"
            className="mt-6"
            icon="arrow-right"
            onPress={handleProceed}
          >
            <Text className="font-bold">
              Proceed
            </Text>
          </Button>
        </View>
      </View>
    </>
  );
};

export default ReportCleanUpInfo;
