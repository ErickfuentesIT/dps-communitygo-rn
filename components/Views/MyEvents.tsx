import PostCard from "@/components/UI/PostCard";
import { useAuthStore } from "@/store/useAuthStore";
import { useEventsStore } from "@/store/useEventStore"; // ✅ Usamos este (el correcto)
import { useUIStore } from "@/store/useUIStore";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
// ❌ Eliminamos el import de usePostsStore, ya que es redundante

export default function MyEventsScreen() {
  const [value, setValue] = useState("favorites");
  const setFabExtended = useUIStore((state) => state.setFabExtended);

  // 1. OBTENER DATOS (Usamos la Store correcta: Events)
  const allEvents = useEventsStore((state) => state.events);

  const currentUserId = useAuthStore((state) => state.userId);
  // --- LÓGICA DE SCROLL ---
  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setFabExtended(currentScrollPosition <= 0);
  };

  // 2. LÓGICA DE FILTRADO (Se ejecuta en cada render/cambio de 'value')
  const filteredEvents = allEvents.filter((event) => {
    if (value === "favorites") {
      // ✅ Criterio 1: Mostrar eventos marcados como favoritos
      return event.isBookmarkedByCurrentUser;
    }

    if (value === "myevents") {
      // ✅ Criterio 2: Mostrar eventos creados por el usuario actual
      // (Asume que el ID del creador está disponible en event.creator.id)
      console.log(event.creator.id);
      console.log(currentUserId);
      return event.creator.id === currentUserId;
    }

    // Si no hay filtro, no mostrar nada.
    return false;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: "favorites",
              label: "Favoritos",
              icon: "calendar-star",
              checkedColor: "white",
              uncheckedColor: "#007BFF",
            },
            {
              value: "myevents",
              label: "Mis Eventos",
              icon: "calendar-text",
              checkedColor: "white",
              uncheckedColor: "#007BFF",
            },
          ]}
          theme={{ colors: { secondaryContainer: "#1E2A38" } }}
        />
      </View>

      <View style={styles.listContainer}>
        {/* 3. Renderizar la lista unificada. Ya no necesitamos dos bloques condicionales */}
        <FlatList
          data={filteredEvents} // 👈 Usa el array filtrado
          renderItem={({ item }) => <PostCard event={item} />} // ✅ Pasa 'event'
          keyExtractor={(item) => item.id}
          onScroll={onScroll}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  listContainer: {
    marginTop: 24,
    flex: 1,
  },
  listContent: {
    padding: 0,
    gap: 10,
  },
});
