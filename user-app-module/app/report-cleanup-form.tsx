import { Appbar, Button, TextInput } from "react-native-paper";
// import * as Location from "expo-location";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import PhotosModal from "./components/PhotosModal";
import { useState } from "react";

const ReportCleanupForm = () => {
  const [isPhotosModalVisible, setPhotosModalVisible] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const handleSetPhotos = (newPhotos: string[]) => {
    setPhotos(newPhotos);
  };

  const renderCapturedPhotosMsg = () => {
    switch (photos.length) {
      case 0:
        return "No photos captured";
      case 1:
        return "1 photo captured";
      default:
        return `${photos.length} photos captured`;
    }
  }

  return (
    <>
      <View className="flex-1 bg-white">
        <Appbar.Header className="bg-white" statusBarHeight={0} elevated={true}>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Report Cleanup" />
        </Appbar.Header>

        <ScrollView className="px-3">
          <View className="mt-12 flex-1">
            <View className="flex-col gap-y-6 rounded-lg bg-slate-200 p-3">
              <View className="relative flex-col gap-y-2 rounded-lg bg-white px-3 pb-5 pt-5">
                <View className="absolute -top-4 left-5 rounded-lg bg-primary-800">
                  <Text className="px-3 text-sm font-semibold text-white">
                    Contact Details
                  </Text>
                </View>
                <TextInput mode="flat" label="Name" />
                <TextInput mode="flat" label="Email" />
                <TextInput mode="flat" label="Phone" />
              </View>

              <View className="relative flex-col gap-y-2 rounded-lg bg-white px-3 pb-5 pt-5">
                <View className="absolute -top-4 left-5 rounded-lg bg-primary-800">
                  <Text className="px-3 text-sm font-semibold text-white">
                    Spot Details
                  </Text>
                </View>
                <TextInput mode="flat" label="Title" />
                <TextInput mode="flat" label="Description" multiline={true} />
              </View>

              <View className="relative flex-col gap-y-2 rounded-lg bg-white px-3 pb-5 pt-5">
                <View className="absolute -top-4 left-5 rounded-lg bg-primary-800">
                  <Text className="px-3 text-sm font-semibold text-white">
                    Location Details
                  </Text>
                </View>
                <TextInput mode="flat" label="City" />
                <TextInput mode="flat" label="Address" />
              </View>

              <View className="relative rounded-lg bg-white px-3 pb-5 pt-5">
                <View className="absolute -top-4 left-5 rounded-lg bg-primary-800">
                  <Text className="px-3 text-sm font-semibold text-white">
                    Media Details
                  </Text>
                </View>
                <Button
                  mode="contained"
                  onPress={() => setPhotosModalVisible(true)}
                >
                  Capture Photos
                </Button>
                <Text className="text-center text-slate-500 mt-1">
                  {renderCapturedPhotosMsg()}
                </Text>
                <Button className="mt-4" mode="contained">Capture Video</Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <PhotosModal
        visible={isPhotosModalVisible}
        handleClose={() => setPhotosModalVisible(false)}
        photos={photos}
        handleSetPhotos={handleSetPhotos}
      />
    </>
  );
};

export default ReportCleanupForm;
