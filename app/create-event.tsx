import Header from "@/components/UI/Header";
import { useUIStore } from "@/store/useUIStore";
import { theme } from "@/styles/theme";
import { CreateEventPayload, EventSummary } from "@/types/Event";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useEventsStore } from "./../store/useEventStore";

// FECHA Y HORA
import client from "@/utils/client";
import { useMutation } from "@tanstack/react-query";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";

export default function CreateEventScreen() {
  const paperTheme = useTheme();
  const router = useRouter();
  const setIsCreatingEvent = useUIStore((state) => state.setIsCreatingEvent);
  const addEvent = useEventsStore((state) => state.addEvent);

  // Estados formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState(""); // lo usaremos como captions
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Estados de fecha y hora
  const [inputDate, setInputDate] = useState<Date | undefined>(new Date());
  const [visibleTime, setVisibleTime] = useState(false);

  const fetchEvents = useEventsStore((state) => state.fetchEvents);

  const [time, setTime] = useState<{ hours: number; minutes: number }>({
    hours: 12,
    minutes: 0,
  });

  const onDismissTime = useCallback(() => {
    setVisibleTime(false);
  }, []);

  const onConfirmTime = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setVisibleTime(false);
      setTime({ hours, minutes });
    },
    []
  );

  // 🔹 MUTATION PARA CREAR EVENTO
  const createEventMutation = useMutation({
    mutationFn: async (payload: CreateEventPayload) => {
      const { data } = await client.post<EventSummary>("/events", payload);
      return data;
    },
    onSuccess: async (newEventFromApi) => {
      // Guardar en el store de eventos
      addEvent(newEventFromApi);
      console.log("Evento creado exitosamente:", newEventFromApi.title);
      await fetchEvents();
      setIsCreatingEvent(false);
      router.back();
    },
    onError: (error) => {
      console.error("Error al crear el evento:", error);
      // Aquí puedes mostrar un toast/snackbar
    },
  });

  // --- SUBMIT ---
  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !location.trim()) {
      console.log("Faltan campos obligatorios");
      return;
    }

    const baseDate = inputDate || new Date();
    // Crear un nuevo Date para no mutar el state original
    const finalDate = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      time.hours,
      time.minutes,
      0,
      0
    );

    const payload: CreateEventPayload = {
      title: title.trim(),
      description: description.trim(),
      captions: (details || description).trim(), // si no llenan detalles, usamos descripción
      startDate: finalDate.toISOString(),
      address: location.trim(),
      // si el backend luego admite imagen, podrías agregar imageUrl aquí
      // imageUrl: image ?? undefined,
    };

    console.log("Payload a enviar:", payload);
    createEventMutation.mutate(payload);
  };

  const handleCancel = () => {
    setIsCreatingEvent(false);
    router.back();
  };

  // --- IMAGEN ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Header />
      <Text variant="headlineMedium" style={styles.header}>
        ¿Qué tienes en mente?
      </Text>
      <Text variant="labelLarge" style={styles.labelHeader}>
        Comparte tu evento con la comunidad
      </Text>

      {/* TÍTULO */}
      <TextInput
        label="Título del evento"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        textColor={paperTheme.colors.onTertiary}
      />

      {/* DESCRIPCIÓN */}
      <TextInput
        label="Descripción"
        value={description}
        textColor={paperTheme.colors.onTertiary}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={2}
        style={styles.input}
      />

      {/* DETALLES (lo mapeamos a captions) */}
      <TextInput
        label="Detalles evento (se mostrará como texto corto)"
        value={details}
        textColor={paperTheme.colors.onTertiary}
        onChangeText={setDetails}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      {/* UBICACIÓN -> address */}
      <TextInput
        label="Ubicación"
        value={location}
        onChangeText={setLocation}
        mode="outlined"
        style={styles.input}
        textColor={paperTheme.colors.onTertiary}
        right={<TextInput.Icon icon="map-marker" />}
      />

      {/* FECHA Y HORA */}
      <View style={styles.row}>
        <View className="halfInput">
          <DatePickerInput
            locale="es"
            label="Fecha"
            value={inputDate}
            onChange={(d) => setInputDate(d)}
            inputMode="start"
            mode="outlined"
            textColor={paperTheme.colors.onTertiary}
            style={{ backgroundColor: paperTheme.colors.onBackground }}
          />
        </View>

        <View style={{ width: 10 }} />

        <View style={styles.halfInput}>
          <TextInput
            label="Hora"
            value={`${time.hours.toString().padStart(2, "0")}:${time.minutes
              .toString()
              .padStart(2, "0")}`}
            mode="outlined"
            textColor={paperTheme.colors.onTertiary}
            right={
              <TextInput.Icon
                icon="clock-outline"
                onPress={() => setVisibleTime(true)}
              />
            }
            editable={false}
            onPressIn={() => setVisibleTime(true)}
            style={{ backgroundColor: paperTheme.colors.onBackground }}
          />
          <TimePickerModal
            visible={visibleTime}
            onDismiss={onDismissTime}
            onConfirm={onConfirmTime}
            hours={time.hours}
            minutes={time.minutes}
            label="Seleccionar hora"
            cancelLabel="Cancelar"
            confirmLabel="Ok"
          />
        </View>
      </View>

      {/* IMAGEN */}
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: paperTheme.colors.surfaceVariant },
            ]}
          >
            <Button icon="camera" mode="text">
              Subir Foto
            </Button>
          </View>
        )}
      </TouchableOpacity>

      {/* BOTONES */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        loading={createEventMutation.isPending}
        disabled={createEventMutation.isPending}
      >
        Publicar Evento
      </Button>
      <Button
        mode="outlined"
        onPress={handleCancel}
        style={styles.submitButton}
        disabled={createEventMutation.isPending}
      >
        Cancelar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 50 },
  header: {
    fontWeight: "bold",
    marginBottom: 5,
    color: theme.colors.onTertiary,
  },
  labelHeader: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 5,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.onBackground,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  halfInput: { flex: 1 },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderStyle: "dashed",
    marginBottom: 10,
    borderColor: "#ccc",
  },
  imagePlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  imagePreview: { width: "100%", height: "100%", resizeMode: "cover" },
  submitButton: { marginTop: 10, borderRadius: 8 },
});
