import { Appbar, Button, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

import { ScrollView, Text, TouchableHighlight, View } from "react-native";
import PhotosModal from "./components/PhotosModal";
import { useRef, useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import CustomSnackbar from "./components/CustomSnackbar";

const ReportCleanupForm = () => {
  const [isPhotosModalVisible, setPhotosModalVisible] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const [video, setVideo] = useState<string | null>(null);
  const [removedVideo, setRemovedVideo] = useState<string | null>(null);
  const [removedVideoMsg, setRemovedMsg] = useState<boolean>(false);

  const ref = useRef(null);
  const player = useVideoPlayer(video, (player) => {
    if (video) {
      player.loop = true;
      player.play();
    }
  });

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
  };

  const renderVideCapturedMsg = () => {
    return video ? "Video captured" : "No video captured";
  };

  const handleCaptureVideo = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });
    if (!result.canceled) {
      setVideo(result.assets[0].uri);
    }
  };

  const handleRemoveVideo = () => {
    setRemovedVideo(video);
    setVideo(null);
    setRemovedMsg(true);
  };

  const handleUndoRemovedVideo = () => {
    if (removedVideo) {
      setVideo(removedVideo);
      setRemovedVideo(null);
      setRemovedMsg(false);
    }
  };

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

              <View className="relative flex-col gap-y-2 rounded-lg bg-white px-3 pb-5 pt-5">
                <View className="absolute -top-4 left-5 rounded-lg bg-primary-800">
                  <Text className="px-3 text-sm font-semibold text-white">
                    Photos
                  </Text>
                </View>
                <Button
                  mode="contained"
                  onPress={() => setPhotosModalVisible(true)}
                >
                  Capture Photos
                </Button>
                <Text className="text-center text-slate-500">
                  {renderCapturedPhotosMsg()}
                </Text>
              </View>

              <View className="relative flex-col gap-y-2 rounded-lg bg-white px-3 pb-5 pt-5">
                <View className="absolute -top-4 left-5 rounded-lg bg-primary-800">
                  <Text className="px-3 text-sm font-semibold text-white">
                    Video
                  </Text>
                </View>
                {!video ? (
                  <Button mode="contained" onPress={handleCaptureVideo}>
                    Capture Video
                  </Button>
                ) : (
                  <VideoView
                    ref={ref}
                    className="w-100 mt-2 h-48 rounded-lg"
                    player={player}
                    allowsFullscreen
                    allowsPictureInPicture
                  />
                )}
                <Text className="mt-2 text-center text-slate-500">
                  {renderVideCapturedMsg()}
                </Text>
                {video && (
                  <View className="flex-row justify-center">
                    <Button onPress={handleCaptureVideo}>Retake</Button>
                    <Button onPress={handleRemoveVideo}>
                      <Text className="text-red-600">Remove</Text>
                    </Button>
                  </View>
                )}
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

      <CustomSnackbar
        visible={removedVideoMsg}
        onDismiss={() => setRemovedMsg(false)}
        action={{
          label: "Undo",
          onPress: handleUndoRemovedVideo,
        }}
        position="top"
        text="Video Removed"
      />
    </>
  );
};

export default ReportCleanupForm;
