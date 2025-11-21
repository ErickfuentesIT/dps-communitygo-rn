import { useToggleLike } from "@/hooks/useSocial"; // 👈 Importa tu nuevo hook

import { Link } from "expo-router";

import React from "react";

import { StyleSheet, View } from "react-native";

import { Avatar, Card, Text } from "react-native-paper";

// Tus componentes personalizados

import CustomIconButtom from "@/components/UI/CustomIconButtom";

import CustomText from "./CustomText";

// Imports actualizados a la nueva estructura

import { theme } from "@/styles/theme";

import { EventSummary } from "@/types/Event"; // Usamos el nuevo tipo

import { useEventsStore } from "./../../store/useEventStore"; // Usamos el nuevo store

interface PostCardProps {
  event: EventSummary; // 👈 Recibimos 'event', no 'post'
}

function PostCard({ event }: PostCardProps) {
  // Acciones del Store

  const toggleBookmark = useEventsStore((state) => state.toggleBookmark);

  const { mutate: toggleLikeApi } = useToggleLike();

  // Desestructuración de los datos NUEVOS de la API

  const {
    id,

    title,

    description,

    creator, // Ahora es 'creator', no 'user'

    imageUrl,

    likesCount,

    commentsCount,

    isLikedByCurrentUser,

    isBookmarkedByCurrentUser,
  } = event;

  // Generamos iniciales para el Avatar (ej. "EF" para Erick Fuentes)

  const avatarLabel = `${creator.firstName[0]}${creator.lastName[0]}`;

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
        title={`${creator.firstName} ${creator.lastName}`}
        subtitle={`@${creator.userName}`}
        titleStyle={styles.content}
        left={(props) => (
          // Usamos Avatar.Text por si no hay foto de perfil

          <Avatar.Text
            {...props}
            size={40}
            label={avatarLabel}
            style={{ backgroundColor: theme.colors.primary }}
            color="white"
          />
        )}
      />

      {/* 2. Imagen del Evento (Solo si existe) */}
      <Link
        href={{
          pathname: "/[postId]",

          params: { postId: id },
        }}
        asChild
      >
        {imageUrl && (
          <Card.Cover source={{ uri: imageUrl }} style={styles.cover} />
        )}

        {/* 3. Contenido (Título y Descripción) */}

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

          <CustomText style={styles.Counter}>{likesCount}</CustomText>

          <CustomIconButtom icon="message-outline" onPress={() => {}} />

          <CustomText style={styles.Counter}>{commentsCount}</CustomText>
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

    marginBottom: 10, // Un poco de espacio entre tarjetas
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

    marginRight: 10, // Espacio entre contador y siguiente icono

    color: theme.colors.onTertiary,
  },
});
