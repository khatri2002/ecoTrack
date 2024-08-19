import { useState } from "react";
import { Text, View } from "react-native";
import { Appbar, Button, Checkbox } from "react-native-paper";
import * as Location from 'expo-location';
import PermissionsReqDialog from "./components/PermissionsReqDialog";
import { set } from "react-hook-form";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const ReportCleanUpInfo = () => {
  const [checked, setChecked] = useState(false);
  const [consentError, showConsentError] = useState(false);
  const [permissionsReqDialog, setPermissionsReqDialog] = useState({
    visible: false,
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCheckboxPress = () => {
    if (!checked && consentError) {
      showConsentError(false);
    }
    setChecked(!checked);
  }

  const handleProceed = async () => {
    setLoading(true);

    // check if consent is checked
    if (!checked) {
      showConsentError(true);
      setLoading(false);
      return;
    }
    showConsentError(false);

    // check if location permissions are granted
    let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    if (locationStatus !== 'granted') {
      setPermissionsReqDialog({
        visible: true,
        title: "Locations aren't allowed",
        description: "To enable location services, go to Settings and turn on location services for this app"
      });
      setLoading(false);
      return;
    }

    // check if camera permissions are granted
    let {status: cameraStatus} = await ImagePicker.requestCameraPermissionsAsync();
    if(cameraStatus !== "granted") {
      setPermissionsReqDialog({
        visible: true,
        title: "Camera access isn't allowed",
        description: "To enable camera access, go to Settings and turn on camera access for this app"
      });
      setLoading(false);
      return;
    }

    setLoading(false);

    // redirect to report cleanup form
    router.navigate("report-cleanup-form");

  };

  return (
    <>
      <View className="flex-1 bg-white">
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
                You must be physically present at the location you wish to
                report.
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
                  onPress={handleCheckboxPress}
                />
              </View>
              <Text className="font-semibold">
                I have read and understood the above requirements
              </Text>
            </View>
            {consentError && (
              <Text className="mt-3 text-center text-red-600">
                Please check the consent box to continue.
              </Text>
            )}
            <Button
              mode="contained"
              className="mt-6"
              icon="arrow-right"
              onPress={handleProceed}
              disabled={loading}
              loading={loading}
            >
              <Text className="font-bold">Proceed</Text>
            </Button>
          </View>
        </View>
      </View>

      <PermissionsReqDialog 
        visible={permissionsReqDialog.visible} 
        onDismiss={() => setPermissionsReqDialog({ visible: false, title: "", description: "" })} 
        title={permissionsReqDialog.title}
        description={permissionsReqDialog.description}
      />
    </>
  );
};

export default ReportCleanUpInfo;
