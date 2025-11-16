import { useRouter } from "expo-router";
import { useState } from "react";
// Importa FlatList y Text para renderizar los posts
import { FlatList, StyleSheet, Text, View } from "react-native";
import { AnimatedFAB, Portal } from "react-native-paper";

// --- Datos de ejemplo para que el FlatList sea "scrolleable" ---
const DUMMY_DATA = [...new Array(50).keys()].map((i) => ({
  id: i.toString(),
  text: `Post #${i + 1}`,
}));

export default function Home() {
  const router = useRouter();
  // Este estado que ya tenías es la clave de todo
  const [isExtended, setIsExtended] = useState(true);

  const onCrearEvento = () => {
    // Te corrijo la ruta, asumamos que vas a 'profile' dentro del stack (app)
    router.push("/(app)/profile");
  };

  // --- 1. Lógica del Scroll ---
  // Esta es la misma lógica de tu componente de ejemplo 'MyComponent'.
  // Se ejecutará cada vez que el usuario mueva el FlatList.
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    // Si la posición es 0 (arriba del todo), extiende el botón.
    // Si se ha scrolleado (aunque sea 1px), lo encoge.
    setIsExtended(currentScrollPosition <= 0);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={DUMMY_DATA}
        renderItem={({ item }) => (
          <Text style={styles.postItem}>{item.text}</Text>
        )}
        keyExtractor={(item) => item.id}
        onScroll={onScroll} // <-- ¡AQUÍ ESTÁ LA MAGIA!
        contentContainerStyle={styles.listContent}
      />

      <Portal>
        <AnimatedFAB
          icon={"plus"}
          label={"Crear Evento"}
          extended={isExtended}
          onPress={onCrearEvento}
          visible={true}
          animateFrom={"right"}
          iconMode={"static"}
          style={styles.fabStyle}
        />
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // 'position: "relative"' es el valor por defecto, no es necesario ponerlo
  },
  listContent: {
    // Es mejor poner el padding aquí que en el 'container'
    padding: 16,
  },
  postItem: {
    // Estilos de ejemplo para tus posts
    fontSize: 18,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  fabStyle: {
    position: "absolute",
    margin: 32,
    right: 0,
    bottom: 50, // Lo dejas "alto" para que no tape el BottomNav, está bien
  },
});
