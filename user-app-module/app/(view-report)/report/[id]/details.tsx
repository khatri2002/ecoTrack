import { useLocalSearchParams } from "expo-router";
import {
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { Appbar } from "react-native-paper";
import { useAuthContext } from "../../../context/AuthProvider";
import { useEffect, useRef, useState } from "react";
import { getReport } from "../../../lib/api";
import LoadingDialog from "../../../components/LoadingDialog";
import PhotoView from "../../../components/PhotoView";
import { useVideoPlayer, VideoView } from "expo-video";

type Report = {
  title: string;
  description: string;
  location: {
    city: string;
    state: string;
    address: string;
    postal_code: string;
    additional_address: string;
  };
  photos: string[];
  video: string;
};

const ReportStatus = () => {
  const { id } = useLocalSearchParams();
  const { user } = useAuthContext();
  if (!user) return null;

  const [report, setReport] = useState<Report | null>(null);
  const [video, setVideo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [photoView, setPhotoView] = useState({
    visible: false,
    photo: "",
  });

  const ref = useRef(null);
  const player = useVideoPlayer(video, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getReport(Number(id))
      .then((data) => {
        if (!ignore && data.status) {
          setReport(data.report);
          setVideo(data.report.video);
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
        {report && (
          <>
            <Appbar.Header
              className="bg-white"
              statusBarHeight={0}
              elevated={true}
            >
              <Appbar.BackAction onPress={() => {}} />
              <Appbar.Content title={report.title} />
            </Appbar.Header>
            <ScrollView>
              <View
                className="mt-3 px-4"
                onStartShouldSetResponder={() => true}
              >
                <View className="rounded-lg bg-slate-100 p-2">
                  <View className="space-y-2 rounded-lg bg-white p-2">
                    <Text className="mb-1 text-center text-base font-medium underline">
                      Contact Details
                    </Text>
                    <Text className="font-medium">
                      <Text className="text-slate-600">Name</Text>: &#10240;
                      {user.name}
                    </Text>
                    <Text className="font-medium">
                      <Text className="text-slate-600">Email</Text>: &#10240;
                      {user.email}
                    </Text>
                    <Text className="font-medium">
                      <Text className="text-slate-600">Phone</Text>: &#10240;
                      {user.phone}
                    </Text>
                  </View>
                </View>
                <View className="rounded-lg bg-slate-100 p-2">
                  <View className="space-y-2 rounded-lg bg-white p-2">
                    <Text className="mb-1 text-center text-base font-medium underline">
                      Spot Details
                    </Text>
                    <Text className="font-medium">
                      <Text className="text-slate-600">Title</Text>: &#10240;
                      {report.title}
                    </Text>
                    <Text className="font-medium">
                      <Text className="text-slate-600">Description</Text>:
                      &#10240;
                      {report.description}
                    </Text>
                  </View>
                </View>
                <View className="rounded-lg bg-slate-100 p-2">
                  <View className="space-y-2 rounded-lg bg-white p-2">
                    <Text className="mb-1 text-center text-base font-medium underline">
                      Location Details
                    </Text>
                    <Text className="font-medium">
                      <Text className="text-slate-600">City</Text>: &#10240;
                      {report.location.city}
                    </Text>
                    <Text className="font-medium">
                      <Text className="text-slate-600">State</Text>: &#10240;
                      {report.location.state}
                    </Text>
                    <Text className="font-medium">
                      <Text className="text-slate-600">Address</Text>: &#10240;
                      {report.location.address}
                    </Text>
                    <Text className="font-medium">
                      <Text className="text-slate-600">Postal Code</Text>:
                      &#10240;
                      {report.location.postal_code}
                    </Text>
                    <Text className="font-medium">
                      <Text className="text-slate-600">
                        Additional Address Details
                      </Text>
                      : &#10240;
                      {report.location.additional_address || "-"}
                    </Text>
                  </View>
                </View>
                <View className="rounded-lg bg-slate-100 p-2">
                  <View className="space-y-2 rounded-lg bg-white p-2">
                    <Text className="mb-1 text-center text-base font-medium underline">
                      Photos
                    </Text>
                    <View className="flex-row flex-wrap justify-center gap-3">
                      {report.photos.map((photo, index) => (
                        <TouchableHighlight
                          key={index}
                          activeOpacity={0.6}
                          underlayColor="#DDDDDD"
                          onPress={() => setPhotoView({ visible: true, photo })}
                        >
                          <Image
                            source={{ uri: photo }}
                            className="h-32 w-32 rounded-lg"
                          />
                        </TouchableHighlight>
                      ))}
                    </View>
                  </View>
                </View>
                <View className="rounded-lg bg-slate-100 p-2">
                  <View className="space-y-2 rounded-lg bg-white p-2">
                    <Text className="mb-1 text-center text-base font-medium underline">
                      Video
                    </Text>
                    <VideoView
                      ref={ref}
                      className="w-100 mt-2 h-48 rounded-lg"
                      player={player}
                      allowsFullscreen
                      allowsPictureInPicture
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </>
        )}
      </View>

      <LoadingDialog visible={loading} text="Getting Report Details..." />
      <PhotoView
        visible={photoView.visible}
        handleClose={() => setPhotoView({ ...photoView, visible: false })}
        photo={photoView.photo}
        mode="view"
      />
    </>
  );
};

export default ReportStatus;
