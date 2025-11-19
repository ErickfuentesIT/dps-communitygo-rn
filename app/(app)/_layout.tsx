import { useUIStore } from "@/store/useUIStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs, usePathname, useRouter } from "expo-router";
import React from "react";
import { AnimatedFAB, Portal, useTheme } from "react-native-paper";
import useHomeStyles from "./../../styles/home.styles";
const queryClient = new QueryClient();

export default function AppLayout() {
  const theme = useTheme(); // 2. Obtén tu tema
  const router = useRouter();
  const pathname = usePathname();
  const isFabExtended = useUIStore((state) => state.isFabExtended);
  const setIsCreatingEvent = useUIStore((state) => state.setIsCreatingEvent);

  const isFabVisible =
    pathname.includes("events") || pathname.includes("/home");

  const styles = useHomeStyles();
  const onCrearEvento = () => {
    router.push("/create-event");
    setIsCreatingEvent(true);
  };
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.onSecondary,
            tabBarStyle: {
              backgroundColor: theme.colors.background,
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "500",
            },
          }}
        >
          <Tabs.Screen
            name="events"
            options={{
              title: "Eventos",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="calendar-heart"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="home"
            options={{
              title: "Inicio",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="home-outline"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Cuenta",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="account-circle-outline"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Tabs>
        <Portal>
          <AnimatedFAB
            icon="plus"
            label="Crear Evento"
            extended={isFabExtended}
            onPress={onCrearEvento}
            visible={isFabVisible}
            animateFrom="right"
            iconMode="static"
            style={styles.fabStyle}
          />
        </Portal>
      </QueryClientProvider>
    </>
  );
}
