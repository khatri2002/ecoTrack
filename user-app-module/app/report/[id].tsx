import { RefreshControl, ScrollView, Text, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import LoadingDialog from "../components/LoadingDialog";
import { useReportDataContext } from "../context/ReportDataProvider";
import { getReports } from "../lib/api";

type Report = {
  title: string;
  id: number;
  created_at: string;
  status: {
    index: number;
    status: string;
    description: string;
  };
};

const ReportStatus = () => {
  const { id } = useLocalSearchParams();
  const { reports, statuses, handleSetReports, handleSetStatuses } =
    useReportDataContext();

  const report = reports.find((report) => report.id === Number(id));
  if (!report) return null;
  const {
    title,
    created_at,
    status: { index: statusIndex, description: statusDescription },
  } = report;

  const [reportTitle, setReportTitle] = useState<string>(title);
  const [reportCreatedAt, setReportCreatedAt] = useState<string>(created_at);
  const [reportStatusIndex, setReportStatusIndex] =
    useState<number>(statusIndex);
  const [reportStatusDescription, setReportStatusDescription] =
    useState<string>(statusDescription);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getReports()
      .then((data) => {
        if (data.status) {
          handleSetReports(data.reports);
          handleSetStatuses(data.statuses);

          // update report status
          const report = data.reports.find((report: Report) => report.id === Number(id));
          if (report) {
            setReportTitle(report.title);
            setReportCreatedAt(report.created_at);
            setReportStatusIndex(report.status.index);
            setReportStatusDescription(report.status.description);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, []);

  return (
    <>
      <View className="flex-1 bg-white">
        <Appbar.Header className="bg-white" statusBarHeight={0} elevated={true}>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Report Status" />
        </Appbar.Header>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="mt-3 px-4" onStartShouldSetResponder={() => true}>
            <View className="rounded-lg bg-slate-100 p-2">
              <View className="space-y-1 rounded-lg bg-white p-2">
                <Text className="text-base font-semibold">{reportTitle}</Text>
                <Text>Report ID: {id}</Text>
                <Text>Submitted on: {reportCreatedAt}</Text>
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
                              reportStatusIndex >= status.index
                                ? "#60B45A"
                                : "#94a3b8"
                            }
                          />
                          <Text
                            className={`text-base font-semibold ${reportStatusIndex >= status.index ? "text-primary" : "text-slate-400"}`}
                          >
                            {status.status}
                          </Text>
                        </View>
                      ),
                  )}
                </View>
                <View className="my-7 border-b border-b-slate-200" />
                <Text className="text-center">{reportStatusDescription}</Text>
              </View>
              <View className="mt-7 bg-white p-3">
                <View className="flex-row items-center justify-center">
                  <Button onPress={() => {}}>Click Here</Button>
                  <Text>to view submission details</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default ReportStatus;
