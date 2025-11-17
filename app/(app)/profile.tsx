import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Avatar,
  Button,
  Divider,
  List,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();

  // Datos simulados del usuario
  const [userImage, setUserImage] = useState<string | null>(null);
  const userData = {
    name: "Juan Perez",
    joinDate: "01/02/2025",
    email: "john.doe@domain.com",
    password: "••••••",
  };

  // --- Función para subir/cambiar imagen ---
  const pickImage = async () => {
    // Pedir permisos y abrir galería
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Importante: 1:1 para que sea cuadrada perfecta para el círculo
      quality: 1,
    });

    if (!result.canceled) {
      setUserImage(result.assets[0].uri);
      // Aquí deberías llamar a tu API para subir la foto real
    }
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: () => router.replace("/(auth)/login"), // Redirige al login
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. Encabezado con Logo (Simulado con texto o icono por ahora) */}
        <View style={styles.header}>
          {/* Aquí iría tu Logo <Image source={...} /> */}
          <Text
            variant="titleLarge"
            style={{ color: theme.colors.primary, fontWeight: "bold" }}
          >
            ComunityGo
          </Text>
        </View>

        {/* 2. Sección de Avatar y Nombre */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {/* Si hay imagen, la muestra. Si no, muestra un icono por defecto */}
            {userImage ? (
              <Avatar.Image size={120} source={{ uri: userImage }} />
            ) : (
              <Avatar.Icon
                size={120}
                icon="account"
                style={{ backgroundColor: theme.colors.primary }}
              />
            )}

            {/* Icono pequeño de "editar" superpuesto */}
            <View
              style={[
                styles.editBadge,
                { backgroundColor: theme.colors.elevation.level3 },
              ]}
            >
              <Avatar.Icon
                size={30}
                icon="camera"
                style={{ backgroundColor: "transparent" }}
                color={theme.colors.onSurface}
              />
            </View>
          </TouchableOpacity>

          <Text variant="headlineMedium" style={styles.nameText}>
            {userData.name}
          </Text>
        </View>

        <Divider style={styles.divider} />

        {/* 3. Lista de Información (Datos del mock-up) */}
        <View style={styles.infoSection}>
          <InfoItem label="Creación de cuenta" value={userData.joinDate} />
          <InfoItem label="Correo electrónico" value={userData.email} />
          <InfoItem label="Contraseña" value={userData.password} isPassword />
        </View>

        <Divider style={styles.divider} />

        {/* 4. Opciones Adicionales (Sugerencias) */}
        <List.Section>
          <List.Subheader>Configuración</List.Subheader>
          <List.Item
            title="Modo Oscuro"
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => <Switch value={false} onValueChange={() => {}} />}
          />
          <List.Item
            title="Notificaciones"
            left={() => <List.Icon icon="bell-outline" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => {}}
          />
        </List.Section>

        {/* 5. Botón de Cerrar Sesión */}
        <Button
          mode="outlined"
          textColor={theme.colors.error}
          style={styles.logoutButton}
          onPress={handleLogout}
          icon="logout"
        >
          Cerrar Sesión
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

// Componente auxiliar para los items de información (DRY)
const InfoItem = ({
  label,
  value,
  isPassword,
}: {
  label: string;
  value: string;
  isPassword?: boolean;
}) => (
  <View style={styles.infoItem}>
    <Text variant="bodySmall" style={{ color: "gray" }}>
      {label}
    </Text>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text variant="bodyLarge" style={{ fontWeight: "500" }}>
        {value}
      </Text>
      {isPassword && (
        <Button mode="text" compact onPress={() => console.log("Cambiar pass")}>
          Cambiar
        </Button>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: {
    padding: 20,
    alignItems: "flex-start",
  },
  profileHeader: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarContainer: {
    position: "relative",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white", // O el color de fondo
  },
  nameText: {
    marginTop: 16,
    fontWeight: "bold",
  },
  infoSection: {
    padding: 20,
    gap: 20, // Espacio entre items
  },
  infoItem: {
    marginBottom: 5,
  },
  divider: {
    marginHorizontal: 20,
  },
  logoutButton: {
    margin: 20,
    borderColor: "red",
  },
});
