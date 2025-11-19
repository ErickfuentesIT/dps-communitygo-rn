import Header from "@/components/UI/Header";
import { usePostsStore } from "@/store/usePostsStore";
import { useUIStore } from "@/store/useUIStore";
import { theme } from "@/styles/theme";
import { Post } from "@/types/Post";
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

// 1. IMPORTAR LIBRERÍA DE FECHAS
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";
// IMPORTANTE: Registra el locale si lo necesitas en español (en _layout.tsx idealmente)
// import { es } from 'react-native-paper-dates';
// registerTranslation('es', es);

export default function CreateEventScreen() {
  const theme = useTheme();
  const router = useRouter();
  const setIsCreatingEvent = useUIStore((state) => state.setIsCreatingEvent);
  const addPost = usePostsStore((state) => state.addPost);

  // Estados
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // --- ESTADOS DE FECHA Y HORA ---
  const [inputDate, setInputDate] = useState<Date | undefined>(new Date());
  const [visibleTime, setVisibleTime] = useState(false);
  const [time, setTime] = useState<{ hours: number; minutes: number }>({
    hours: 12,
    minutes: 0,
  });

  // --- MANEJO DE HORA ---
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

  // --- MANEJO DE SUBMIT Y CANCEL ---
  const handleSubmit = () => {
    // Combinar fecha y hora
    const finalDate = inputDate || new Date();
    finalDate.setHours(time.hours);
    finalDate.setMinutes(time.minutes);

    const newPost: Post = {
      id: crypto.randomUUID.toString(),
      title: title,
      eventDate: finalDate.toISOString(),
      location: location,
      caption: description,
      details: details,
      user: {
        id: "1",
        username: "user1",
        profilePictureUrl:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      },
      media: {
        id: `media_${Date.now()}`,
        type: "image",
        url: image,
      },
      stats: {
        likeCount: 0,
        commentCount: 0,
        attendanceCount: 0,
      },
      userInteraction: {
        isLiked: false,
        isBookmarked: false,
        isAttending: false,
      },
      comments: [],
      createdAt: new Date().toISOString(),
    };

    console.log("Enviando Post:", newPost);
    addPost(newPost);
    setIsCreatingEvent(false);
    router.back();
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
      {/* --- TITULO --- */}

      <TextInput
        label="Título del evento"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        textColor={theme.colors.onTertiary}
      />

      {/* --- DESCRIPCION --- */}
      <TextInput
        label="Descripción"
        value={description}
        textColor={theme.colors.onTertiary}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={2}
        style={styles.input}
      />

      {/* --- DETALLES EVENTO --- */}
      <TextInput
        label="Detalles evento"
        value={details}
        textColor={theme.colors.onTertiary}
        onChangeText={setDetails}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      {/* --- LOCALIZACION --- */}
      <TextInput
        label="Ubicación"
        value={location}
        onChangeText={setLocation}
        mode="outlined"
        style={styles.input}
        textColor={theme.colors.onTertiary}
        right={<TextInput.Icon icon="map-marker" />}
      />

      {/* --- FECHA Y HORA --- */}
      <View style={styles.row}>
        {/* INPUT DE FECHA  */}
        <View style={styles.halfInput}>
          <DatePickerInput
            locale="es"
            label="Fecha"
            value={inputDate}
            onChange={(d) => setInputDate(d)}
            inputMode="start"
            mode="outlined"
            textColor={theme.colors.onTertiary}
            style={{ backgroundColor: theme.colors.onBackground }} // Tu estilo de fondo
          />
        </View>

        <View style={{ width: 10 }} />

        {/*INPUT DE HORA */}
        <View style={styles.halfInput}>
          <TextInput
            label="Hora"
            value={`${time.hours.toString().padStart(2, "0")}:${time.minutes
              .toString()
              .padStart(2, "0")}`}
            mode="outlined"
            textColor={theme.colors.onTertiary}
            right={
              <TextInput.Icon
                icon="clock-outline"
                onPress={() => setVisibleTime(true)}
              />
            }
            editable={false} // No escribir, solo tocar
            onPressIn={() => setVisibleTime(true)}
            style={{ backgroundColor: theme.colors.onBackground }}
          />
          {/* MODAL HORA */}
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

      {/* --- SELECTOR DE IMAGEN --- */}
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: theme.colors.surfaceVariant },
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
      >
        Publicar Evento
      </Button>
      <Button
        mode="outlined"
        onPress={handleCancel}
        style={styles.submitButton}
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
  halfInput: { flex: 1 }, // Importante para que DatePickerInput ocupe el espacio
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
