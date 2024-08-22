import { Text, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
import { getAllStatuses } from "../lib/api";
import { useLocalSearchParams } from "expo-router";
import LoadingDialog from "../components/LoadingDialog";

type StatusType = {
  index: number;
  status: string;
  description: string;
};

const ReportStatus = () => {
  const { id, title, created_at, status } = useLocalSearchParams();
  if (typeof status !== "string") {
    throw new Error("Invalid status");
  }
  const {
    index: statusIndex,
    status: statusTitle,
    description: statusDescription,
  } = JSON.parse(status);

  const [statuses, setStatuses] = useState<StatusType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getAllStatuses()
      .then((data) => {
        if (!ignore && data.status) {
          setStatuses(data.statuses);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <View className="flex-1 bg-white">
        <Appbar.Header className="bg-white" statusBarHeight={0} elevated={true}>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Report Status" />
        </Appbar.Header>

        <View className="mt-3 px-4">
          <View className="rounded-lg bg-slate-100 p-2">
            <View className="space-y-1 rounded-lg bg-white p-2">
              <Text className="text-base font-semibold">{title}</Text>
              <Text>Report ID: {id}</Text>
              <Text>Submitted on: {created_at}</Text>
            </View>
            <View className="mt-7 rounded-lg bg-white px-3 py-5">
              <View className="mx-auto space-y-3">
                {statuses.map(
                  (status, index) =>
                    // -1 index states that report has been rejected
                    status.index != -1 && (
                      <View
                        key={index}
                        className="flex-row items-center gap-x-3"
                      >
                        <AntDesign
                          name="checkcircle"
                          size={28}
                          color={
                            statusIndex >= status.index ? "#60B45A" : "#94a3b8"
                          }
                        />
                        <Text
                          className={`text-base font-semibold ${statusIndex >= status.index ? "text-primary" : "text-slate-400"}`}
                        >
                          {status.status}
                        </Text>
                      </View>
                    ),
                )}
              </View>
              <View className="my-7 border-b border-b-slate-200" />
              <Text className="text-center">{statusDescription}</Text>
            </View>
            <View className="mt-7 bg-white p-3">
              <View className="flex-row items-center justify-center">
                <Button onPress={() => {}}>Click Here</Button>
                <Text>to view submission details</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <LoadingDialog visible={loading} text="Getting Report Status..." />
    </>
  );
};

export default ReportStatus;
