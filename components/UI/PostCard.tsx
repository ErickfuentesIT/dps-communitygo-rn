import CustomIconButtom from "@/components/UI/CustomIconButtom";
import { theme } from "@/styles/theme";
import { Image } from "expo-image";
import * as React from "react";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import CustomText from "./CustomText";

import { usePostsStore } from "@/store/usePostsStore";
import { Post } from "@/types/Post";

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  const [isMessagesShow, setIsMessagesShow] = useState(false);

  const toggleLike = usePostsStore((state) => state.toggleLike);
  const toggleBookmark = usePostsStore((state) => state.toggleBookmark);
  const user = post.user;
  const isLiked = post.userInteraction.isLiked;
  const isBookmarked = post.userInteraction.isBookmarked;
  const likeCount = post.stats.likeCount;
  const messagesCount = post.stats.commentCount;

  const onLikePress = () => {
    toggleLike(post.id);

    //  API para guardar el like
  };

  const onBookmarkPress = () => {
    toggleBookmark(post.id); // ... API para bookmark
  };

  const onShowMessages = () => {
    setIsMessagesShow(!isMessagesShow);
    // ... aquí llamarías a tu API
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title={user.username}
        titleStyle={styles.content}
        left={(props) => (
          <Image
            source={user.profilePictureUrl}
            style={styles.profilePicture}
            contentFit="contain"
          />
        )}
      />

      <Card.Cover
        source={{ uri: "https://picsum.photos/700" }}
        style={styles.cover}
      />
      <Card.Actions>
        <View style={styles.actionGroup}>
          <CustomIconButtom
            icon={isLiked ? "heart" : "heart-outline"}
            iconColor={isLiked ? "red" : undefined}
            onPress={onLikePress}
            animated={true}
          />
          <CustomText style={styles.Counter}>{likeCount}</CustomText>
          <CustomIconButtom icon="message-outline" onPress={onShowMessages} />
          <CustomText style={styles.Counter}>{messagesCount}</CustomText>
        </View>

        <View style={styles.spacer} />
        <CustomIconButtom
          icon="share-variant-outline"
          onPress={() => console.log("Compartir")}
          containerColor="none"
        />
        <CustomIconButtom
          icon={isBookmarked ? "bookmark" : "bookmark-outline"}
          containerColor="none"
          onPress={onBookmarkPress}
        />
      </Card.Actions>
      <Card.Content>
        <Text variant="bodyMedium" style={styles.content}>
          {post.caption}
        </Text>
      </Card.Content>
    </Card>
  );
}

export default PostCard;

const styles = StyleSheet.create({
  card: {
    margin: 0,
    padding: 0,
    borderRadius: 0,
    width: "100%",
    backgroundColor: theme.colors.onBackground,
  },
  profilePicture: {
    aspectRatio: 16 / 9,
    height: "auto",
    width: 32,
    minHeight: 32,
  },
  cover: {
    borderRadius: 0,
  },
  content: {
    color: theme.colors.onTertiary,
  },
  spacer: {
    flex: 1,
  },
  actionGroup: {
    flexDirection: "row", // Pone los elementos en fila
    alignItems: "center", // Centra el texto verticalmente con el icono
  },
  Counter: {
    fontSize: 14,
    marginLeft: -4, // Pega el número al icono
    color: theme.colors.onTertiary, // Asegúrate de que tenga el color correcto
  },
});
