import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Badge } from "react-native-paper";
import useHeaderStyles from "./../../styles/header.styles";
import CustomIconButtom from "./CustomIconButtom";

export default function Header() {
  const styles = useHeaderStyles();
  const notificationCount = 3;
  function handleNotificacion() {
    console.log("Abrir notificacion");
  }
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("../../assets/images/ComunityGo.png")}
        style={styles.logo}
        contentFit="contain"
      />
      <CustomIconButtom
        icon="bell-outline"
        animated={true}
        onPress={handleNotificacion}
      />
      <Badge
        visible={notificationCount > 0} // Muéstralo solo si hay notificaciones
        style={styless.badge}
      >
        {notificationCount}
      </Badge>
    </View>
  );
}
// --- Estilos Clave ---
const styless = StyleSheet.create({
  container: {
    // Un contenedor simple para el icono
    width: 24,
    height: 24,
    margin: 16,
  },
  badge: {
    // La magia: posicionamiento absoluto
    position: "absolute",
    top: 5, // Lo sube
    right: 5, // Lo mueve a la derecha
  },
});
