// Importa FlatList y Text para renderizar los posts
import Header from "@/components/UI/Header";
import PostCard from "@/components/UI/PostCard";
import { usePostsStore } from "@/store/usePostsStore";
import { useUIStore } from "@/store/useUIStore";
import { ActivityIndicator, FlatList, View } from "react-native";
import useHomeStyles from "./../../styles/home.styles";

import CustomText from "@/components/UI/CustomText";
import { useGetEvents } from "@/hooks/useGetEvents";
import { useEventsStore } from "@/store/useEventStore";
import { useEffect } from "react";

export default function Home() {
  const styles = useHomeStyles();
  const allPosts = usePostsStore((state) => state.posts);
  const setFabExtended = useUIStore((state) => state.setFabExtended);
  const events = useEventsStore((state) => state.events);
  const setEvent = useEventsStore((state) => state.setEvents);
  const { data: apiData, isLoading, error, refetch } = useGetEvents();

  useEffect(() => {
    if (apiData) {
      setEvent(apiData);
    }
  }, [apiData, setEvent]);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    // Si la posición es 0 (arriba del todo), extiende el botón.
    // Si se ha scrolleado (aunque sea 1px), lo encoge.
    setFabExtended(currentScrollPosition <= 0);
  };

  // D. Manejo de estados de carga y error
  if (isLoading && events.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <CustomText>Error al cargar eventos</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={events}
        renderItem={({ item }) => <PostCard event={item} />}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
