import { Image, Modal, Text, View } from "react-native";
import { Appbar, Button } from "react-native-paper";

type PhotoViewProps = {
  visible: boolean;
  index: number | null;
  photo: string;
  handleClose: () => void;
  handleRetake: (index: number | null) => Promise<boolean>;
};

const PhotoView = ({
  visible,
  index,
  photo,
  handleClose,
  handleRetake,
}: PhotoViewProps) => {
  return (
    <Modal animationType="slide" visible={visible}>
      <Appbar.Header className="bg-white" elevated={true}>
        <Appbar.Content title="Photo" />
        <Appbar.Action icon="close" onPress={handleClose} />
      </Appbar.Header>
      <Image source={{ uri: photo }} className="flex-1" />
      <View className="flex-row justify-between px-4 pb-8 pt-3">
        <Button onPress={() => handleRetake(index)}>
          <Text className="text-lg">Retake</Text>
        </Button>
        <Button onPress={handleClose}>
          <Text className="text-lg">Use Photo</Text>
        </Button>
      </View>
    </Modal>
  );
};

export default PhotoView;
