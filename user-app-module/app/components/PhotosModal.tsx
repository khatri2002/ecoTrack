import { Image, Modal, Text, TouchableHighlight, View } from "react-native";
import { Appbar } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import PhotoView from "./PhotoView";
import Entypo from "@expo/vector-icons/Entypo";
import CustomSnackbar from "./CustomSnackbar";

type PhotosModalProps = {
  visible: boolean;
  handleClose: () => void;
  photos: string[];
  handleSetPhotos: (newPhotos: string[]) => void;
};

type PhotoViewType = {
  index: number | null;
  visible: boolean;
  photo: string;
};

type LastRemovedPhotoType = {
  index: number | null;
  photo: string;
};

const PhotosModal = ({ visible, handleClose, photos, handleSetPhotos }: PhotosModalProps) => {
  const [photoView, setPhotoView] = useState<PhotoViewType>({
    index: null,
    visible: false,
    photo: "",
  });

  const [lastRemovedPhoto, setLastRemovedPhoto] =
    useState<LastRemovedPhotoType>({
      index: null,
      photo: "",
    });

  const [limitReachedMsg, setLimitReachedMsg] = useState<boolean>(false);
  const [removedMsg, setRemovedMsg] = useState<boolean>(false);

  const handlePhotoViewClose = () => {
    setPhotoView({ ...photoView, index: null, visible: false });
  };

  const handleCapture = async () => {
    // check if 8 photos are already captured
    if (photos.length >= 8) {
      setLimitReachedMsg(true);
      return;
    }

    let result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      handleSetPhotos([...photos, result.assets[0].uri]);
    }
  };

  const handleViewImage = (index: number) => {
    setPhotoView({
      index,
      visible: true,
      photo: photos[index],
    });
  };

  const handleRetake = async (index: number | null) => {
    if (index === null) {
      return false;
    }
    let result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      let newPhotos = [...photos];
      newPhotos[index] = result.assets[0].uri;
      handleSetPhotos(newPhotos);
      handlePhotoViewClose();
    }
    return true;
  };

  const handleRemovePhoto = (index: number) => {
    setLastRemovedPhoto({ index, photo: photos[index] });
    let newPhotos = [...photos];
    newPhotos.splice(index, 1);
    handleSetPhotos(newPhotos);
    setRemovedMsg(true);
  };

  const handleUndoImage = () => {
    if (lastRemovedPhoto.index === null) {
      return;
    }
    let newPhotos = [...photos];
    newPhotos.splice(lastRemovedPhoto.index, 0, lastRemovedPhoto.photo);
    handleSetPhotos(newPhotos);
    setLastRemovedPhoto({ index: null, photo: "" });
    setRemovedMsg(false);
  };

  return (
    <>
      <Modal animationType="slide" visible={visible}>
        <Appbar.Header className="bg-white" elevated={true}>
          <Appbar.Content title="Capture Photos" />
          <Appbar.Action icon="close" onPress={handleClose} />
        </Appbar.Header>

        <View className="flex-row flex-wrap justify-center gap-3 px-3 py-5">
          {photos.map((photo, index) => (
            <View key={index} className="relative">
              <TouchableHighlight
                className="absolute -right-1 -top-2 z-10 rounded-full bg-red-500"
                onPress={() => handleRemovePhoto(index)}
              >
                <Entypo name="cross" size={20} color="white" />
              </TouchableHighlight>
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
                onPress={() => handleViewImage(index)}
                className="relative"
              >
                <Image
                  source={{ uri: photo }}
                  className="h-24 w-24 rounded-lg"
                />
              </TouchableHighlight>
            </View>
          ))}
          <TouchableHighlight
            className="rounded-lg"
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={handleCapture}
          >
            <View className="h-24 w-24 rounded-lg bg-primary">
              <MaterialCommunityIcons
                name="camera-plus"
                size={28}
                color="white"
                style={{ margin: "auto" }}
              />
            </View>
          </TouchableHighlight>
        </View>
        <Text className="mt-3 text-center text-base text-slate-600">
          Capture upto 8 photos
        </Text>

        <PhotoView
          visible={photoView.visible}
          index={photoView.index}
          photo={photoView.photo}
          handleClose={handlePhotoViewClose}
          handleRetake={handleRetake}
          mode="edit"
        />

        <CustomSnackbar
          visible={limitReachedMsg}
          onDismiss={() => setLimitReachedMsg(false)}
          varient="error"
          text="Photos Limit Reached!"
          action={{
            label: "OK",
            onPress: () => setLimitReachedMsg(false),
          }}
        />

        <CustomSnackbar
          visible={removedMsg}
          onDismiss={() => setRemovedMsg(false)}
          text="Photo Removed"
          action={{
            label: "Undo",
            onPress: handleUndoImage,
          }}
        />
      </Modal>
    </>
  );
};

export default PhotosModal;
