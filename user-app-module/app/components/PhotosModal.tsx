import { Modal, Text, TouchableHighlight, View } from "react-native";
import { Appbar } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type PhotosModalProps = {
  visible: boolean;
  handleClose: () => void;
};

const PhotosModal = ({ visible, handleClose }: PhotosModalProps) => {
  return (
    <>
      <Modal animationType="slide" visible={visible}>
        <Appbar.Header className="bg-white" elevated={true}>
          <Appbar.Content title="Capture Photos" />
          <Appbar.Action icon="close" onPress={handleClose} />
        </Appbar.Header>

        <View className="mx-auto flex-row flex-wrap justify-center gap-3 px-3 py-5">
          <TouchableHighlight className="rounded-lg" activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {}}>
            <View className="rounded-lg bg-primary p-7">
              <MaterialCommunityIcons
                name="camera-plus"
                size={28}
                color="white"
              />
            </View>
          </TouchableHighlight>
        </View>
        <Text className="mt-3 text-center text-base text-slate-600">
          Capture upto 8 photos
        </Text>
      </Modal>
    </>
  );
};

export default PhotosModal;
