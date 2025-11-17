// Importa FlatList y Text para renderizar los posts
import { FlatList, View } from "react-native";

import useHomeStyles from "./../../styles/home.styles";

import PostCard from "@/components/UI/PostCard";

import Header from "@/components/UI/Header";
import { usePostsStore } from "@/store/usePostsStore";

import { useUIStore } from "@/store/useUIStore";

export default function Home() {
  const styles = useHomeStyles();
  const allPosts = usePostsStore((state) => state.posts);
  const setFabExtended = useUIStore((state) => state.setFabExtended);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    // Si la posición es 0 (arriba del todo), extiende el botón.
    // Si se ha scrolleado (aunque sea 1px), lo encoge.
    setFabExtended(currentScrollPosition <= 0);
  };

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={allPosts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(post) => post.id}
        onScroll={onScroll} // <-- ¡AQUÍ ESTÁ LA MAGIA!
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
