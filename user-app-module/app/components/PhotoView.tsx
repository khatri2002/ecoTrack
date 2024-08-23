import { useState } from "react";
import { Image, Modal, Text, View } from "react-native";
import { ActivityIndicator, Appbar, Button } from "react-native-paper";

type EditModeProps = {
  visible: boolean;
  index: number | null;
  photo: string;
  handleClose: () => void;
  handleRetake: (index: number | null) => Promise<boolean>;
  mode: "edit";
};

type ViewModeProps = {
  visible: boolean;
  photo: string;
  handleClose: () => void;
  mode: "view";
};

type PhotoViewProps = EditModeProps | ViewModeProps;

const PhotoView = (props: PhotoViewProps) => {
  const { visible, photo, handleClose, mode } = props;

  let index = null,
    handleRetake = null;

  if (mode === "edit") {
    index = props.index;
    handleRetake = props.handleRetake;
  }

  const [loading, setLoading] = useState(false);

  return (
    <Modal animationType="slide" visible={visible}>
      <Appbar.Header className="bg-white" elevated={true}>
        <Appbar.Content title="Photo" />
        <Appbar.Action icon="close" onPress={handleClose} />
      </Appbar.Header>
      {photo && (
        <Image
          className="flex-1"
          source={{ uri: photo }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      )}
      <ActivityIndicator
        animating={loading}
        className="absolute inset-x-1/2 inset-y-1/2"
        size={30}
      />
      {mode === "edit" && (
        <View className="flex-row justify-between px-4 pb-8 pt-3">
          <Button onPress={() => handleRetake!(index)}>
            <Text className="text-lg">Retake</Text>
          </Button>
          <Button onPress={handleClose}>
            <Text className="text-lg">Use Photo</Text>
          </Button>
        </View>
      )}
    </Modal>
  );
};

export default PhotoView;
