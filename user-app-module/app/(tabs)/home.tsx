import {
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeedCard, { ItemSeparatorComponent } from "../components/FeedCard";
import { useEffect, useState } from "react";
import { getFeed } from "../lib/api";
import { ActivityIndicator } from "react-native-paper";

type Report = {
  location: {
    city: string;
    state: string;
  };
  admin: {
    feed: {
      before_img: string;
      after_img: string;
    };
    cleanup_completion_date: string;
  };
  user: {
    name: string;
    id: number;
  };
};

const Home = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchFeedData = () => {
    if (!hasMore || loading) return;
    setLoading(true);
    getFeed(page)
      .then((res) => {
        if (res.status) {
          if (res.reports.length > 0) {
            setReports([...reports, ...res.reports]);
            setPage(page + 1);
          } else {
            setHasMore(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFeedData();
    return () => {};
  }, []);

  const handleOnRefresh = () => {
    setPage(1);
    setReports([]);
  }

  return (
    <>
      <SafeAreaView edges={['top']} className="flex-1 bg-white">
        <FlatList
          data={reports}
          renderItem={({ item }) => (
            <FeedCard
              beforeImg={item.admin.feed.before_img}
              afterImg={item.admin.feed.after_img}
              location={item.location}
              name={item.user.name}
            />
          )}
          ItemSeparatorComponent={ItemSeparatorComponent}
          onEndReached={fetchFeedData}
          ListFooterComponent={() => (
            <ActivityIndicator className="mt-5" animating={loading} />
          )}
          onRefresh={handleOnRefresh}
          refreshing={false}
        />
      </SafeAreaView>
    </>
  );
};

export default Home;
