import { Text } from "react-native";
import { useAuthContext } from "../context/AuthProvider";
import { Button } from "react-native-paper";
import { router } from "expo-router";

const Home = () => {
  const { user, userOut} = useAuthContext();

  return (
    <>
      <Button mode="contained" className="mt-6" onPress={() => router.navigate("report-cleanup-info")}>
        Report Cleanup
      </Button>
    </>
  );
};

export default Home;
