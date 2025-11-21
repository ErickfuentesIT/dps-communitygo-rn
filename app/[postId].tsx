import CustomText from "@/components/UI/CustomText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Avatar,
  Button,
  Divider,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import { formatEventDateTime } from "./../assets/functions/formatIsoToString";
import { useEventsStore } from "./../store/useEventStore"; // 👈 Store de Eventos (nuevo nombre)

// --- Necesitas importar useQuery y client para esta estrategia ---
import Header from "@/components/UI/Header";
import { EventDetail } from "@/types/Event"; // Usamos EventDetail y EventSummary
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import client from "./../utils/client";

// --- Componente Auxiliar (MetaItem) (Mantenido) ---
const MetaItem = ({ icon, text }: { icon: string; text: string }) => (
  <View style={metadataStyles.metaItem}>
    <MaterialCommunityIcons name={icon as any} size={20} color="gray" />
    <Text variant="bodyMedium" style={{ marginLeft: 8, color: "black" }}>
      {text}
    </Text>
  </View>
);

export default function PostDetailScreen() {
  const { postId } = useLocalSearchParams();
  const theme = useTheme();
  // ... otros estados y hooks ...
  const [newComment, setNewComment] = useState("");

  // Acciones del Store (Añadir comentario) - Tendrías que definirla en tu store.
  // const addComment = useEventsStore((state) => state.addComment);
  // ...
  // Aseguramos que postId sea un string
  const eventId = Array.isArray(postId) ? postId[0] : postId;

  // 1. OBTENER RESUMEN (Desde Zustand)
  // const toggleAttendance = useEventsStore((state) => state.toggleAttendance);
  const summaryEvent = useEventsStore((state) =>
    state.events.find((e) => e.id === eventId)
  );

  // 2. OBTENER DETALLES COMPLETOS (Desde API - React Query)
  const {
    data: fullEvent,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["eventDetail", eventId],
    queryFn: async () => {
      const resp = await client.get<EventDetail>(`/events/${eventId}`);
      return resp.data;
    },
    // Solo se ejecuta si hay un ID y el Store no tiene el evento aún
    enabled: !!eventId,
    // Usamos el resumen como placeholder mientras carga el detalle
    initialData: summaryEvent as EventDetail | undefined,
  });

  // 3. FUENTE DE VERDAD: Usamos los detalles si están cargados, sino el resumen
  const eventToShow = fullEvent || summaryEvent;

  // --- MANEJO DE ESTADOS DE CARGA/ERROR ---
  if (isLoading && !eventToShow) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  if (!eventToShow) {
    // Si el fetch falló Y no había data en el store
    return (
      <Text style={{ padding: 20, textAlign: "center", color: "black" }}>
        Publicación no encontrada. ID: {eventId}
      </Text>
    );
  }

  // 4. DESTRUCTURING FINAL (Basado en la estructura fusionada)
  const {
    id,
    title,
    description,
    creator, // Nuevo campo
    startDate, // Nuevo campo
    comments, // Nuevo campo (solo disponible en fullEvent)
    imageUrl,
    likesCount, // Ahora se lee directamente
    isLikedByCurrentUser, // Ahora se lee directamente
    // Los campos 'address' y 'captions' solo están disponibles en 'fullEvent'
  } = eventToShow;
  // Dentro de PostDetailScreen
  const handleSendComment = () => {
    if (newComment.trim() === "") {
      return; // No enviar comentarios vacíos
    }

    // Aquí iría tu lógica de mutación de React Query para llamar a la API
    console.log("Enviando comentario:", newComment);

    // 1. (Optimista) Actualizar el Store para que el comentario aparezca instantáneamente.
    // addComment(postId, newComment);

    // 2. Limpiar el campo.
    setNewComment("");
  };
  // Los campos de interacción
  const isAttending = false; // Asume false hasta que la API lo diga
  const attendanceCount = 0; // Asume 0 hasta que la API lo diga

  // const handleRSVP = () => {
  //   toggleAttendance(id);
  //   // Aquí también llamarías a la API con una mutación
  // };

  return (
    <ScrollView style={styles.container}>
      <Header />

      <View style={styles.content}>
        {/* Título del evento */}
        <Image source={imageUrl} style={{ width: 200, height: 150 }} />
        <Text variant="headlineMedium" style={styles.title}>
          {title}
        </Text>
        {/* Subtítulo "Ubicación y fecha" */}
        <CustomText variant="titleMedium" style={styles.sectionHeader}>
          Ubicación y fecha
        </CustomText>
        {/* Fila: ubicación + personas van */}
        <View style={metadataStyles.metadataContainer}>
          <MetaItem
            icon="map-marker"
            text={fullEvent?.address || "Ubicación por definir"}
          />
          <MetaItem
            icon="account-multiple"
            text={`${attendanceCount} personas van`}
          />
        </View>
        {/* Fila: fecha + hora */}
        <View style={metadataStyles.metadataContainer}>
          <MetaItem icon="calendar" text={formatEventDateTime(startDate)} />
          <MetaItem
            icon="clock-time-four-outline"
            text={new Date(startDate).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        </View>
        {/* Descripción */}
        <CustomText variant="titleMedium" style={styles.sectionHeader}>
          Descripción del evento
        </CustomText>
        <Text variant="bodyMedium" style={styles.description}>
          {fullEvent?.captions ||
            description ||
            "No hay descripción disponible."}
        </Text>
        <Divider style={{ marginVertical: 20 }} />
        {/* Botón principal: Marcar asistencia */}
        <View style={styles.actionRow}>
          <Button
            mode="contained"
            icon={isAttending ? "check-circle" : "account-check-outline"}
            disabled={isLoading}
            buttonColor={isAttending ? "green" : theme.colors.primary}
            contentStyle={styles.buttonContent}
            style={styles.actionButton}
            // onPress={handleRSVP}
          >
            {isAttending ? "Asistencia marcada" : "Marcar asistencia"}
          </Button>

          {/* Icono de persona (como en el mock) */}
          <MaterialCommunityIcons
            name="account-multiple-plus"
            size={28}
            style={{ marginLeft: 12 }}
            color="black"
          />
        </View>
        {/* === SECCIÓN DE COMENTARIOS === */}
        <View style={styles.commentSection}>
          {/* Encabezado: "Comentarios" + corazón + contador */}
          <View style={styles.commentHeader}>
            <CustomText variant="titleMedium" style={{ color: "black" }}>
              Comentarios
            </CustomText>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name={isLikedByCurrentUser ? "heart" : "heart-outline"}
                size={22}
                color={isLikedByCurrentUser ? "red" : "#999"}
              />
              <Text style={{ marginLeft: 4, color: "#666" }}>
                {likesCount ?? 0}
              </Text>
            </View>
          </View>

          {/* Input para agregar comentario */}
          <TextInput
            mode="outlined"
            placeholder="Agregar comentario..."
            value={newComment}
            onChangeText={setNewComment}
            style={styles.commentInput}
            right={<TextInput.Icon icon="send" onPress={handleSendComment} />}
          />

          {/* Lista de comentarios */}
          {fullEvent?.comments?.map((comment, index) => (
            <View key={comment.id || index} style={styles.commentItem}>
              {/* Avatar circular */}
              <Avatar.Icon
                size={30}
                icon="account"
                style={styles.commentAvatar}
              />

              {/* Texto del comentario */}
              <View style={styles.commentTextContainer}>
                <Text
                  variant="labelMedium"
                  style={{ fontWeight: "600", color: "#000" }}
                >
                  {comment.userName || "Usuario"}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: "#333", marginTop: 2 }}
                >
                  {comment.text}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ... Estilos ...

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingTop: 10 },
  title: { fontWeight: "bold", marginBottom: 10, color: "black" },
  sectionHeader: { fontWeight: "bold", marginVertical: 10, color: "black" },
  description: { lineHeight: 22, color: "#333" },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    borderRadius: 25,
  },
  buttonContent: {
    height: 50,
  },

  commentSection: {
    marginTop: 10,
  },
  commentInput: {
    marginBottom: 20,
    height: 50,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  commentAvatar: {
    marginRight: 10,
    borderRadius: 15,
    width: 30,
    height: 30,
  },
  commentTextContainer: {
    flexShrink: 1,
  },
});

const metadataStyles = StyleSheet.create({
  metadataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    paddingVertical: 4,
  },
});
