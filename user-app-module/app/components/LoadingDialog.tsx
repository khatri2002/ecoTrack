import { Text } from "react-native";
import { ActivityIndicator, Dialog, Portal } from "react-native-paper";

type LoadingDialogProps = {
  visible: boolean;
  text: string;
};

const LoadingDialog = ({ visible, text }: LoadingDialogProps) => {
  return (
    <>
      <Portal>
        <Dialog
          visible={visible}
          dismissable={false}
          style={{
            backgroundColor: "white",
          }}
        >
          <Dialog.Content>
            <ActivityIndicator />
            <Text className="mt-5 text-center font-medium">{text}</Text>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
};

export default LoadingDialog;
