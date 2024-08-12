import { Appbar, Button, TextInput } from "react-native-paper";
// import * as Location from "expo-location";
import { ScrollView, Text, View } from "react-native";
import PhotosModal from "./components/PhotosModal";
import { useState } from "react";

const ReportIssue = () => {

    const [isPhotosModalVisible, setPhotosModalVisible] = useState(false);

  return (
    <>
      <View className="flex-1 bg-white">
        <Appbar.Header className="bg-white" statusBarHeight={0} elevated={true}>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Report Cleanup" />
        </Appbar.Header>

        <ScrollView className="flex-1 px-3">
          <View className="mt-12">
            <View className="p-3 flex-col gap-y-6 bg-slate-200 rounded-lg">
              <View className="bg-white px-3 pb-5 pt-5 rounded-lg relative flex-col gap-y-2">
                <View className="absolute left-5 -top-4 bg-primary-800 rounded-lg">
                  <Text className="font-semibold text-base text-white px-3">
                    Contact Details
                  </Text>
                </View>
                <TextInput mode="outlined" label="Name" />
                <TextInput mode="outlined" label="Email" />
                <TextInput mode="outlined" label="Phone" />
              </View>

              <View className="bg-white px-3 pb-5 pt-5 rounded-lg relative flex-col gap-y-2">
                <View className="absolute left-5 -top-4 bg-primary-800 rounded-lg">
                  <Text className="font-semibold text-base text-white px-3">
                    Spot Details
                  </Text>
                </View>
                <TextInput mode="outlined" label="Title" />
                <TextInput
                  mode="outlined"
                  label="Description"
                  multiline={true}
                />
              </View>

              <View className="bg-white px-3 pb-5 pt-5 rounded-lg relative flex-col gap-y-2">
                <View className="absolute left-5 -top-4 bg-primary-800 rounded-lg">
                  <Text className="font-semibold text-base text-white px-3">
                    Location Details
                  </Text>
                </View>
                <TextInput mode="outlined" label="City" />
                <TextInput mode="outlined" label="Address" />
              </View>

              <View className="bg-white px-3 pb-5 pt-5 rounded-lg relative flex-col gap-y-2">
                <View className="absolute left-5 -top-4 bg-primary-800 rounded-lg">
                  <Text className="font-semibold text-base text-white px-3">
                    Media Details
                  </Text>
                </View>
                <Button 
                    mode="contained"
                    onPress={() => setPhotosModalVisible(true)}
                >
                    Capture Photos
                </Button>
                <Button mode="contained">
                    Capture Video
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <PhotosModal 
        visible={isPhotosModalVisible}
        handleClose={() => setPhotosModalVisible(false)}
      />
    </>
  );
};

export default ReportIssue;
