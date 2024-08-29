import { memo, useState } from "react";
import { Image, Text, View } from "react-native";
import { Skeleton } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";

type FeedCardProps = {
  beforeImg: string;
  afterImg: string;
  location: {
    city: string;
    state: string;
  };
  name: string;
};

const FeedCard = ({ beforeImg, afterImg, location, name }: FeedCardProps) => {
  const [beforeImgLoading, setBeforeImgLoading] = useState(true);
  const [afterImgLoading, setAfterImgLoading] = useState(true);

  return (
    <View className="border-b border-b-slate-300">
      <View className="relative h-44 border-b border-b-white">
        <Image
          source={{ uri: beforeImg }}
          className="h-full w-full"
          onLoadStart={() => setBeforeImgLoading(true)}
          onLoadEnd={() => setBeforeImgLoading(false)}
        />
        {beforeImgLoading && (
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            style={{
              position: "absolute",
              height: "100%",
            }}
          />
        )}
      </View>

      <View className="relative h-44">
        <Image
          source={{ uri: afterImg }}
          className="h-full w-full"
          onLoadStart={() => setAfterImgLoading(true)}
          onLoadEnd={() => setAfterImgLoading(false)}
        />
        {afterImgLoading && (
          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            style={{
              position: "absolute",
              height: "100%",
            }}
          />
        )}
      </View>
  
      <View className="my-1">
        <Text className="text-center">
          {location.city + ", " + location.state}
        </Text>
        <Text className="text-center">
          Report Submitted by: <Text className="font-semibold">{name}</Text>
        </Text>
      </View>
    </View>
  );
};

export const ItemSeparatorComponent = () => (
  <View className="mb-8 border-b border-b-slate-300" />
);

export default memo(FeedCard);
