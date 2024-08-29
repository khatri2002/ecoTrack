import { Text, View } from "react-native";
import { Snackbar } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

type CustomSnackbarProps = {
  visible: boolean;
  onDismiss: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
  varient?: "error";
  position?: "top";
  text: string;
};

const CustomSnackbar = ({
  visible,
  onDismiss,
  action,
  varient,
  position,
  text,
}: CustomSnackbarProps) => {
  return (
      <Snackbar
        wrapperStyle={position === "top" ? { top: 53 } : {}}
        visible={visible}
        onDismiss={onDismiss}
        action={action}
        duration={3000}
        className={varient === "error" ? "bg-red-600" : ""}
      >
        {varient === "error" ? (
          <View className="flex-row items-center gap-x-2">
            <Ionicons name="alert-circle" size={24} color="white" />
            <Text className="font-semibold text-white">{text}</Text>
          </View>
        ) : (
          <Text className="font-semibold text-white">{text}</Text>
        )}
      </Snackbar>
  );
};

export default CustomSnackbar;
