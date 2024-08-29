import { Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Button } from "react-native-paper";
import { useAuthContext } from "../context/AuthProvider";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { userOut } = useAuthContext();

  return (
    <>
      <SafeAreaView edges={['top']} className="flex-1 bg-white px-5">
        <View className="space-y-20 rounded-lg bg-slate-100 p-3">
          <View className="rounded-lg bg-white p-3">
            <View className="flex-row gap-x-2 items-center justify-center">
              <View className="space-y-1">
                <AntDesign name="user" size={22} color="black" />
                <Fontisto name="email" size={22} color="black" />
                <AntDesign name="phone" size={22} color="black" />
              </View>
              <View className="space-y-1">
                <Text className="text-base">Jay Khatri</Text>
                <Text className="text-base">jaykhatri@gmail.com</Text>
                <Text className="text-base">+91 70465 66942</Text>
              </View>
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
      </SafeAreaView>
    </>
  );
};

export default Profile;
