import { useToggleLike } from "@/hooks/useSocial";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";

import CustomIconButtom from "@/components/UI/CustomIconButtom";
import { theme } from "@/styles/theme";
import { EventSummary } from "@/types/Event";
import { useEventsStore } from "./../../store/useEventStore";
import CustomText from "./CustomText";

interface PostCardProps {
  event: EventSummary;
}

function PostCard({ event }: PostCardProps) {
  const toggleBookmark = useEventsStore((state) => state.toggleBookmark);
  const { mutate: toggleLikeApi } = useToggleLike();

  const {
    id,
    title,
    description,
    creator,
    imageUrl,
    likesCount,
    commentsCount,
    isLikedByCurrentUser,
    isBookmarkedByCurrentUser,
  } = event;

  // 👇 Iniciales seguras para el avatar
  const firstInitial = creator?.firstName?.[0] ?? "";
  const lastInitial = creator?.lastName?.[0] ?? "";
  const avatarLabel = (firstInitial + lastInitial || "EV").toUpperCase(); // "EV" de "Evento"

  // 👇 Nombre visible del creador (con fallback)
  const creatorName =
    creator && (creator.firstName || creator.lastName)
      ? `${creator.firstName ?? ""} ${creator.lastName ?? ""}`.trim()
      : "Organizado por la comunidad";

  // 👇 Username visible (opcional)
  const creatorUsername = creator?.userName ? `@${creator.userName}` : "";

  const onLikePress = () => {
    toggleLikeApi(id);
  };

  const onBookmarkPress = () => {
    toggleBookmark(id);
  };

  return (
    <Card style={styles.card}>
      {/* 1. Header con datos del Creador */}
      <Card.Title
        title={creatorName}
        subtitle={creatorUsername}
        titleStyle={styles.content}
        left={(props) => (
          <Avatar.Text
            {...props}
            size={40}
            label={avatarLabel}
            style={{ backgroundColor: theme.colors.primary }}
            color="white"
          />
        )}
      />

      {/* 2. Imagen + contenido clickeable */}
      <Link
        href={{
          pathname: "/[postId]",
          params: { postId: id },
        }}
        asChild
      >
        <View>
          {imageUrl && (
            <Card.Cover source={{ uri: imageUrl }} style={styles.cover} />
          )}

          <Card.Content>
            <Text
              variant="titleMedium"
              style={{
                fontWeight: "bold",
                marginTop: 10,
                color: theme.colors.onTertiary,
              }}
            >
              {title}
            </Text>

            <Text variant="bodyMedium" style={styles.content} numberOfLines={3}>
              {description}
            </Text>
          </Card.Content>
        </View>
      </Link>

      {/* 4. Botones de Acción */}
      <Card.Actions>
        <View style={styles.actionGroup}>
          <CustomIconButtom
            icon={isLikedByCurrentUser ? "heart" : "heart-outline"}
            iconColor={isLikedByCurrentUser ? "red" : undefined}
            onPress={onLikePress}
            animated={true}
          />

          <CustomText style={styles.Counter}>{likesCount ?? 0}</CustomText>

          <CustomIconButtom icon="message-outline" onPress={() => {}} />

          <CustomText style={styles.Counter}>{commentsCount ?? 0}</CustomText>
        </View>

        <View style={styles.spacer} />

        <CustomIconButtom
          icon="share-variant-outline"
          onPress={() => console.log("Compartir")}
          containerColor="none"
        />

        <CustomIconButtom
          icon={isBookmarkedByCurrentUser ? "bookmark" : "bookmark-outline"}
          containerColor="none"
          onPress={onBookmarkPress}
        />
      </Card.Actions>
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
    marginBottom: 10,
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
    flexDirection: "row",
    alignItems: "center",
  },
  Counter: {
    fontSize: 14,
    marginLeft: -4,
    marginRight: 10,
    color: theme.colors.onTertiary,
  },
});
