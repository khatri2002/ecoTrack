import { Modal, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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

        <View className="py-3 px-5 flex-row mt-3">
            <View className="bg-primary p-7 rounded-lg">
                <MaterialCommunityIcons name="camera-plus" size={28} color="white" />
            </View>
        </View>
        <Text className="text-center text-slate-600 text-base">Capture upto 8 photos</Text>

      </Modal>
    </>
  );
};

export default PhotosModal;
