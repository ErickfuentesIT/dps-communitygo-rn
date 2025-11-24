import { useAuthStore } from "@/store/useAuthStore";
import { theme } from "@/styles/theme";
import React from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Avatar, Button, Divider, Text, useTheme } from "react-native-paper";

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
        <Button mode="text" compact disabled>
          Cambiar
        </Button>
      )}
    </View>
  </View>
);

export default function ProfileScreen() {
  const paperTheme = useTheme();
  const { user, logout } = useAuthStore(
    (state) => ({
      user: state.user,
      logout: state.logout,
    }),
    shallow
  );
  console.log(user);
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error: No se pudieron cargar los datos del usuario.</Text>
      </SafeAreaView>
    );
  }
  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.userName || "Usuario";
  const profileDetails = {
    name: displayName,
    joinDate: user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("es-ES")
      : "N/A",
    email: user.email,
    password: "••••••",
  };
  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text
            variant="titleLarge"
            style={{ color: paperTheme.colors.primary, fontWeight: "bold" }}
          >
            ComunityGo
          </Text>
        </View>
        <View className="profileHeader" style={styles.profileHeader}>
          <Avatar.Icon
            size={120}
            icon="account"
            style={{ backgroundColor: paperTheme.colors.primary }}
          />
          <Text variant="headlineMedium" style={styles.nameText}>
            {profileDetails.name}
          </Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.infoSection}>
          <InfoItem label="Fecha de registro" value={profileDetails.joinDate} />
          <InfoItem label="Correo electrónico" value={profileDetails.email} />
          <InfoItem
            label="Contraseña"
            value={profileDetails.password}
            isPassword
          />
        </View>
        <Divider style={styles.divider} />
        <Button
          mode="outlined"
          textColor={paperTheme.colors.error}
          style={styles.logoutButton}
          onPress={handleLogout}
          icon="logout"
        >
          Cerrar Sesión
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
  // return <Text>Perfil mínimo</Text>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 40 },
  header: {
    padding: 20,
    alignItems: "flex-start",
  },
  profileHeader: {
    alignItems: "center",
    marginVertical: 20,
  },
  nameText: {
    marginTop: 16,
    fontWeight: "bold",
  },
  infoSection: {
    padding: 20,
    gap: 20,
  },
  infoItem: {
    marginBottom: 5,
  },
  divider: {
    marginHorizontal: 20,
  },
  logoutButton: {
    margin: 20,
    borderColor: theme.colors.error,
  },
});
