import Header from "@/components/UI/Header";
import { useUIStore } from "@/store/useUIStore";
import { theme } from "@/styles/theme";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function CreateEventScreen() {
  const theme = useTheme();
  const router = useRouter();

  // --- Estados del Formulario ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  // Para fecha/hora simplificado (idealmente usarías librerías de DatePicker)
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const setIsCreatingEvent = useUIStore((state) => state.setIsCreatingEvent);

  // --- Función para seleccionar imagen ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], // Formato apaisado tipo evento
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // --- Función de Envío ---
  const handleSubmit = () => {
    // Aquí iría tu lógica para conectar con Zustand o tu API
    console.log({ title, description, location, date, time, image });
    setIsCreatingEvent(false);
    router.back(); // Volver atrás
  };
  const handleCancel = () => {
    // Aquí iría tu lógica para conectar con Zustand o tu API
    setIsCreatingEvent(false);
    router.back(); // Volver atrás
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      // style={{ backgroundColor: theme.colors.background }}
    >
      <Header />
      <Text variant="headlineMedium" style={styles.header}>
        ¿Qué tienes en mente?
      </Text>
      <Text variant="bodyMedium" style={{ color: "gray", marginBottom: 20 }}>
        Comparte tu próximo evento con la comunidad.
      </Text>

      {/* 1. Título */}
      <TextInput
        label="Título del evento"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        textColor={theme.colors.onTertiary}
        style={styles.input}
      />

      {/* 2. Descripción (Multiline) */}
      <TextInput
        label="Descripción detallada"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        textColor={theme.colors.onTertiary}
        style={styles.input}
      />

      {/* 3. Ubicación */}
      <TextInput
        label="Ubicación"
        value={location}
        onChangeText={setLocation}
        mode="outlined"
        style={styles.input}
        textColor={theme.colors.onTertiary}
        right={<TextInput.Icon icon="map-marker" />}
      />

      {/* 4. Fila de Fecha y Hora */}
      <View style={styles.row}>
        <TextInput
          label="Fecha"
          value={date}
          onChangeText={setDate}
          placeholder="DD/MM/AAAA"
          mode="outlined"
          style={[styles.input, styles.halfInput]}
          textColor={theme.colors.onTertiary}
          right={<TextInput.Icon icon="calendar" />}
          keyboardType="numeric" // Simplificación
        />
        <View style={{ width: 10 }} /> {/* Espaciador */}
        <TextInput
          label="Hora"
          value={time}
          onChangeText={setTime}
          placeholder="00:00"
          mode="outlined"
          style={[styles.input, styles.halfInput]}
          right={<TextInput.Icon icon="clock-outline" />}
          textColor={theme.colors.onTertiary}
          keyboardType="numeric" // Simplificación
        />
      </View>

      {/* 5. Selector de Imagen (Visualmente mejorado) */}
      <Text
        variant="titleMedium"
        style={{
          marginTop: 10,
          marginBottom: 5,
          color: theme.colors.onTertiary,
        }}
      >
        Imagen del evento
      </Text>

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
      {image && (
        <Button mode="text" onPress={() => setImage(null)} compact>
          Eliminar foto
        </Button>
      )}

      {/* 6. Botón de Acción */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        contentStyle={{ height: 50 }} // Botón más alto y fácil de tocar
      >
        Publicar Evento
      </Button>
      <Button
        mode="outlined"
        onPress={handleCancel}
        style={styles.submitButton}
        contentStyle={{ height: 50 }} // Botón más alto y fácil de tocar
      >
        Cancelar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    fontWeight: "bold",
    marginBottom: 5,
    color: theme.colors.onTertiary,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.onSecondary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "dashed", // Borde punteado para indicar "zona de carga"
    marginBottom: 10,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 8,
  },
});
