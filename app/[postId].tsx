import CustomText from "@/components/UI/CustomText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider, Text, TextInput, useTheme } from "react-native-paper";
import { formatEventDateTime } from "./../assets/functions/formatIsoToString";
import { useEventsStore } from "./../store/useEventStore"; // 👈 Store de Eventos (nuevo nombre)

// --- Necesitas importar useQuery y client para esta estrategia ---
import Header from "@/components/UI/Header";
import { EventDetail } from "@/types/Event"; // Usamos EventDetail y EventSummary
import { useQuery } from "@tanstack/react-query";
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
const [newComment, setNewComment] = useState('');

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
    if (newComment.trim() === '') {
        return; // No enviar comentarios vacíos
    }
    
    // Aquí iría tu lógica de mutación de React Query para llamar a la API
    console.log("Enviando comentario:", newComment);
    
    // 1. (Optimista) Actualizar el Store para que el comentario aparezca instantáneamente.
    // addComment(postId, newComment); 

    // 2. Limpiar el campo.
    setNewComment('');
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
      {/* ... */}
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {title}
        </Text>

        {/* 2. Metadatos */}
        <View style={metadataStyles.metadataContainer}>
          <MetaItem icon="map-marker" text={fullEvent?.address || ""} />
          <MetaItem
            icon="account-multiple"
            text={`${attendanceCount} personas van`}
          />
        </View>
        <View style={metadataStyles.metadataContainer}>
          <MetaItem
            icon="calendar"
            text={formatEventDateTime(startDate)} // Usa el campo correcto
          />
          <MetaItem
            icon="clock-time-four-outline"
            text={new Date(startDate).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        </View>

        <CustomText variant="titleMedium" style={styles.sectionHeader}>
          Descripción del evento
        </CustomText>
        <Text variant="bodyMedium" style={styles.description}>
          {/* ✅ CORRECCIÓN: Si fullEvent existe, usa 'captions', sino usa 'description' */}
          {fullEvent?.captions ||
            description ||
            "No hay descripción disponible."}
        </Text>

        <Divider style={{ marginVertical: 20 }} />

        {/* 3. Botón de Acción Principal (Marcar Asistencia) */}
        <View style={styles.actionRow}>
          <Button
            mode="contained"
            // onPress={handleRSVP}
            icon={isAttending ? "check-circle" : "account-check-outline"}
            // Deshabilitado mientras cargan los datos por seguridad
            disabled={isLoading}
            buttonColor={isAttending ? "green" : theme.colors.primary}
            contentStyle={styles.buttonContent}
            style={styles.actionButton}
          >
            {isAttending ? "Asistencia Marcada" : "Marcar asistencia"}
          </Button>
          <MaterialCommunityIcons /* ... */ />
        </View>



          {/* ✅ CORRECCIÓN: Renderizar lista de comentarios SOLO si el array existe */}
          {fullEvent?.comments?.map((comment, index) => (
            <View key={comment.id || index} style={styles.commentItem}>
              {/* ... Renderizar comentarios ... */}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ... Estilos ...

const styles = StyleSheet.create({
  container: { flex: 1 },
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
