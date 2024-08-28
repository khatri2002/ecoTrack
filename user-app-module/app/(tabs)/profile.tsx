import { Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Button } from "react-native-paper";
import { useAuthContext } from "../context/AuthProvider";
import { router } from "expo-router";

const Profile = () => {
  const { userOut } = useAuthContext();

  return (
    <>
      <View className="flex-1 bg-white px-5">
        <View className="flex-col gap-y-20 rounded-lg bg-slate-100 p-3">
          <View className="flex-col items-center gap-y-1 rounded-lg bg-white p-3">
            <View className="flex-row items-center gap-x-2">
              <AntDesign name="user" size={24} color="black" />
              <Text className="text-base">Jay Khatri</Text>
            </View>
            <View className="flex-row items-center gap-x-2">
              <Fontisto name="email" size={24} color="black" />
              <Text className="text-base">jaykhatri@gmail.com</Text>
            </View>
            <View className="flex-row items-center gap-x-2">
              <AntDesign name="phone" size={24} color="black" />
              <Text className="text-base">+91 70465 66942</Text>
            </View>
          </View>

          <Button
            mode="contained"
            icon="logout"
            contentStyle={{ flexDirection: "row-reverse" }}
            onPress={() => {
              userOut();
              router.replace("signIn");
            }}
          >
            Logout
          </Button>
        </View>
      </View>
    </>
  );
};

export default Profile;
