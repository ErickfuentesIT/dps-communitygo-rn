// utils/storage.ts
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

// Función auxiliar para saber si es web
const isWeb = Platform.OS === "web";

export const tokenStorage = {
  setTokens: async (access: string, refresh: string) => {
    if (isWeb) {
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    } else {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh);
    }
  },

  getAccessToken: async () => {
    if (isWeb) {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } else {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    }
  },

  getRefreshToken: async () => {
    if (isWeb) {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } else {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    }
  },

  clearTokens: async () => {
    if (isWeb) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }
  },
};
