import { Button, Dialog, Portal } from "react-native-paper";
import { Text } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { View } from "react-native";
import { Linking } from "react-native";

type PermissionsReqDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  description: string;
};

const PermissionsReqDialog = ({ visible, onDismiss, title, description }: PermissionsReqDialogProps) => {
  return (
    <>
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={onDismiss}
          style={{
            backgroundColor: "white",
            width: "75%",
            marginHorizontal: "auto",
          }}
        >
          <Dialog.Content>
            <View className="bg-primary-400 mx-auto p-3 rounded-full border-8 border-slate-100">
              <Entypo name="location" size={24} color="white" />
            </View>
            <Text className="text-center mt-4 font-semibold text-base">
              {title}
            </Text>
            <Text className="mt-3">
              {description}
            </Text>
          </Dialog.Content>
          <Dialog.Actions className="justify-center">
            <Button
              mode="contained"
              className="px-3 bg-slate-400"
              onPress={onDismiss}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              className="px-3"
              onPress={() => Linking.openSettings()}
            >
              Go to settings
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default PermissionsReqDialog;
