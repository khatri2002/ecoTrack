import { ScrollView, Text, View } from "react-native";
import { Appbar, Button } from "react-native-paper";

const Reports = () => {
  return (
    <>
      <View className="flex-1 bg-white">
        <Appbar.Header className="bg-white" statusBarHeight={0} elevated={true}>
          <Appbar.Content title="Your Reports" />
        </Appbar.Header>

        {/* <View className="flex-1 items-center justify-center">
          <Text className="text-3xl font-semibold text-black">
            No Reports!
          </Text>
          <Text className="text-slate-600 mt-2">
            You haven't submitted any reports yet.
          </Text>
          <Button mode="contained" className="mt-16">
            <Text className="text-base">
                Submit a Report
            </Text>
          </Button>
        </View> */}

        {/* <ScrollView className="flex-1">
          <View className="mt-3 px-3 flex-1" onStartShouldSetResponder={() => true}>
            <View className="flex-col space-y-3 rounded-lg bg-slate-100 p-2">
              <View className="rounded-lg bg-primary p-2">
                <Text className="text-base font-semibold text-white">
                  The dumpsite at the corner
                </Text>
                <Text className="mt-1 text-white">Report ID: 1</Text>
                <Text className="mt-1 text-white">
                  Submitted on: 5th Aug, 2024
                </Text>
                <Text className="mt-1 text-white">
                  Status: &#10240;
                  <Text className="underline">Report Under Verification</Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView> */}
      </View>
    </>
  );
};

export default Reports;
