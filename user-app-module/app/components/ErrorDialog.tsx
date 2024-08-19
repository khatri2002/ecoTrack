import { Button, Dialog, Portal, Text } from "react-native-paper";

type ErrorDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  description: string;
};

const ErrorDialog = ({
  visible,
  onDismiss,
  title,
  description,
}: ErrorDialogProps) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} >
        <Dialog.Icon icon="alert" color="#bb2124" size={26} />
        <Dialog.Title className="text-center">{title}</Dialog.Title>
        <Dialog.Content className="p-0">
          <Text variant="bodyMedium" className="text-center">
            {description}
          </Text>
        </Dialog.Content>
        <Dialog.Actions className="pb-4">
          <Button onPress={onDismiss}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ErrorDialog;
