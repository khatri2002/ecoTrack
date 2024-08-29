import { router, Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { FAB } from "react-native-paper";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{ tabBarActiveTintColor: "green", headerShown: false }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Entypo name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: "Reports",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="book-settings"
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
      <FAB
        icon="book-plus"
        color="#60B45A"
        accessibilityLabel="Create a new report"
        className="absolute bottom-24 right-4"
        onPress={() => router.navigate("report-cleanup-info")}
      />
    </>
  );
}
