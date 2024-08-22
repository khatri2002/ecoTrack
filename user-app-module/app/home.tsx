import { useEffect, useState } from "react";
import { Text } from "react-native";
import { useAuthContext } from "./context/AuthProvider";
import { Button } from "react-native-paper";
import { router } from "expo-router";

const Home = () => {
  const { user, userOut} = useAuthContext();

  return (
    <>
      <Text>welcome to home screen</Text>
      <Text>Email: {user!.email}</Text>
      <Text>Name: {user!.name}</Text>
      <Text>Phone: {user!.phone}</Text>
      <Button mode="contained" onPress={() => {
        userOut();
        router.replace("signIn");
      }}>
        sign out
      </Button>
      <Button mode="contained" className="mt-6" onPress={() => router.navigate("report-cleanup-info")}>
        Report Cleanup
      </Button>
      <Button mode="contained" className="mt-6" onPress={() => router.navigate("report-cleanup-success")}>
        Report Cleanup Success Screen
      </Button>
      <Button mode="contained" className="mt-6" onPress={() => router.navigate("profile")}>
        Profile
      </Button>
      <Button mode="contained" className="mt-6" onPress={() => router.navigate("reports")}>
        Reports
      </Button>
    </>
  );
};

export default Home;
