import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { Appbar, Button } from "react-native-paper";
import { getReports } from "./lib/api";
import { router } from "expo-router";
import LoadingDialog from "./components/LoadingDialog";

type ReportType = {
  title: string;
  id: number;
  created_at: string;
  status: {
    index: number;
    status: string;
    description: string;
  };
};

const Reports = () => {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getReports()
      .then((data) => {
        if (!ignore && data.status) {
          setReports(data.reports);
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
          <Appbar.Content title="Your Reports" />
        </Appbar.Header>

        {reports.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-3xl font-semibold text-black">
              No Reports!
            </Text>
            <Text className="mt-2 text-slate-600">
              You haven't submitted any reports yet.
            </Text>
            <Button mode="contained" className="mt-16">
              <Text className="text-base">Submit a Report</Text>
            </Button>
          </View>
        ) : (
          <ScrollView className="flex-1">
            <View
              className="mt-3 flex-1 px-3"
              onStartShouldSetResponder={() => true}
            >
              <View className="flex-col space-y-3 rounded-lg bg-slate-100 p-2">
                {reports.map((report, index) => (
                  <TouchableHighlight
                    key={index}
                    onPress={() => {
                      router.push({ pathname: `report/${report.id}`, params: {
                        title: report.title,
                        created_at: report.created_at,
                        status: JSON.stringify(report.status),
                      } });
                    }}
                    className="rounded-lg"
                  >
                    <View className="rounded-lg bg-primary p-2">
                      <Text className="text-base font-semibold text-white">
                        {report.title}
                      </Text>
                      <Text className="mt-1 text-white">
                        Report ID: {report.id}
                      </Text>
                      <Text className="mt-1 text-white">
                        Submitted on: {report.created_at}
                      </Text>
                      <Text className="mt-1 text-white">
                        Status: &#10240;
                        <Text className="underline">
                          {report.status.status}
                        </Text>
                      </Text>
                    </View>
                  </TouchableHighlight>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      <LoadingDialog visible={loading} text="Getting Reports..." />
    </>
  );
};

export default Reports;
