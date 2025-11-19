// app/(app)/[postId].tsx
import CustomText from "@/components/UI/CustomText";
import Header from "@/components/UI/Header";
import { usePostsStore } from "@/store/usePostsStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Divider,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { formatEventDateTime } from "./../assets/functions/formatIsoToString";
// Importa el icono de la cámara si es necesario (o usa el de RNP)

// --- 1. Componente Auxiliar para los Metadatos ---
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
  const toggleAttendance = usePostsStore((state) => state.toggleAttendance);
  const post = usePostsStore((state) =>
    state.posts.find((p) => p.id === postId)
  );

  if (!post) {
    return (
      <Text style={{ padding: 20, textAlign: "center" }}>
        Publicación no encontrada.
      </Text>
    );
  }

  const { user, title, location, eventDate, details, stats, userInteraction } =
    post;
  const isAttending = userInteraction.isAttending;
  const attendanceCount = stats.attendanceCount;

  // Función de asistencia
  const handleRSVP = () => {
    toggleAttendance(post.id);
  };

  return (
    <ScrollView style={styles.container}>
      <Header />
      {/* 1. Imagen de Cabecera (Simulación) */}
      <View style={{ height: 200, backgroundColor: "lightgray" }}>
        <Image
          source={{ uri: post.media.url || undefined }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>

      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {title}
        </Text>

        {/* 2. Metadatos (Ubicación, Asistencia, Fecha, Hora) */}
        <View style={metadataStyles.metadataContainer}>
          <MetaItem
            icon="map-marker"
            text={location || "Ubicación no disponible"}
          />
          <MetaItem
            icon="account-multiple"
            text={`${attendanceCount} personas van`}
          />
        </View>
        <View style={metadataStyles.metadataContainer}>
          <MetaItem
            icon="calendar"
            text={new Date(eventDate).toLocaleDateString("es-ES")}
          />
          <MetaItem
            icon="clock-time-four-outline"
            text={
              new Date(eventDate).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              }) + " - 20:00"
            }
          />
        </View>

        <CustomText variant="titleMedium" style={styles.sectionHeader}>
          Descripción del evento
        </CustomText>
        <Text variant="bodyMedium" style={styles.description}>
          {details || "No hay descripción disponible para este evento."}
        </Text>

        <Divider style={{ marginVertical: 20 }} />

        {/* 3. Botón de Acción Principal (Marcar Asistencia) */}
        <View style={styles.actionRow}>
          <Button
            mode="contained"
            onPress={handleRSVP}
            icon={isAttending ? "check-circle" : "account-check-outline"}
            buttonColor={isAttending ? "green" : theme.colors.primary}
            contentStyle={styles.buttonContent}
            style={styles.actionButton}
          >
            {isAttending ? "Asistencia Marcada" : "Marcar asistencia"}
          </Button>
          {/* Icono de check (Persona) */}
          <MaterialCommunityIcons
            name="account-check-outline"
            size={30}
            color={isAttending ? "green" : "gray"}
            style={{ marginLeft: 15 }}
          />
        </View>

        {/* 4. Sección de Comentarios */}
        <View style={styles.commentSection}>
          <TextInput
            placeholder="Agregar comentario..."
            mode="outlined"
            style={styles.commentInput}
            right={
              <TextInput.Icon
                icon="send"
                onPress={() => console.log("Enviar")}
              />
            }
          />

          <View style={styles.commentHeader}>
            <Text variant="titleMedium">Comentarios</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="heart"
                size={18}
                color="red"
                style={{ marginRight: 4 }}
              />
              <Text variant="bodyLarge">45</Text>
            </View>
          </View>

          {post.comments?.map((comment, index) => (
            <View key={comment.id || index} style={styles.commentItem}>
              <Avatar.Image
                size={30}
                // icon="account"
                source={{ uri: comment.profilePictureUrl }}
                style={{ backgroundColor: "transparent" }}
              />
              <View style={{ marginLeft: 10 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    variant="bodyMedium"
                    style={{ fontWeight: "bold", color: "#000" }}
                  >
                    {comment.username}
                    {" - "}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ fontWeight: "bold", color: "#000" }}
                  >
                    {formatEventDateTime(comment.timestap)}
                  </Text>
                </View>

                <Text variant="bodyMedium" style={{ color: "#000" }}>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 10 },
  title: { fontWeight: "bold", marginBottom: 10 },
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
    borderRadius: 8,
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
    color: "#000",
  },
  // --- ESTILOS CLAVE ---
  commentAvatar: {
    // Espacio a la derecha para separar la imagen del texto
    marginRight: 10,
    // Asegura que sea un círculo si usas <Avatar.Image /> (si size es 30, radius es 15)
    borderRadius: 15,
    width: 30,
    height: 30,
  },
  commentTextContainer: {
    // Permite que el texto se ajuste al ancho restante
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
