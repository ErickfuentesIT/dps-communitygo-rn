import PostCard from "@/components/UI/PostCard";
import { usePostsStore } from "@/store/usePostsStore"; // <--- IMPORTAR STORE
import { useUIStore } from "@/store/useUIStore";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
export default function MyEventsScreen() {
  const [value, setValue] = useState("favorites");
  const setFabExtended = useUIStore((state) => state.setFabExtended);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    // Si la posición es 0 (arriba del todo), extiende el botón.
    // Si se ha scrolleado (aunque sea 1px), lo encoge.
    setFabExtended(currentScrollPosition <= 0);
  };
  const allPosts = usePostsStore((state) => state.posts);

  const filteredPosts = allPosts.filter((post) => {
    if (value === "favorites") {
      return post.userInteraction.isBookmarked;
    }
    // lógica para "Mis Eventos" (filtrar por user.id)
    return true;
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: "favorites",
              label: "Favoritos",
              icon: "calendar-star",
              checkedColor: "white", // Activo
              uncheckedColor: "#007BFF", // Inactivo
            },
            {
              value: "myevents",
              label: "Mis Eventos",
              icon: "calendar-text",
              checkedColor: "white", // Activo
              uncheckedColor: "#007BFF", // Inactivo
            },
          ]}
          theme={{ colors: { secondaryContainer: "#1E2A38" } }}
        />
      </View>

      <View style={styles.listContainer}>
        {value === "favorites" ? (
          <FlatList
            data={filteredPosts}
            renderItem={({ item }) => <PostCard post={item} />}
            keyExtractor={(post) => post.id}
            onScroll={onScroll}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <FlatList
            data={filteredPosts}
            renderItem={({ item }) => <PostCard post={item} />}
            keyExtractor={(post) => post.id}
            onScroll={onScroll}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  listContainer: {
    marginTop: 24,
    flex: 1,
  },
  listContent: {
    padding: 0,
    gap: 10,
  },
});
