// api/client.ts
import axios from "axios";
import { tokenStorage } from "./tokenStorage";

// 1. Crear instancia base
const client = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Interceptor de REQUEST (Inyectar Token)
client.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Interceptor de RESPONSE (Manejar Refresh Token)
client.interceptors.response.use(
  (response) => response, // Si todo sale bien, devolver respuesta
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y NO hemos reintentado aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marcar para evitar bucles infinitos

      try {
        // A. Obtener el refresh token guardado
        const refreshToken = await tokenStorage.getRefreshToken();

        if (!refreshToken) throw new Error("No refresh token");

        // B. Llamar al endpoint de refresco (AJUSTA ESTA RUTA SEGÚN TU BACKEND)
        // Nota: Usamos axios puro aquí para evitar loops con los interceptores de 'client'
        const response = await axios.post(
          "http://localhost:3000/api/v1/auth/refresh",
          {
            refreshToken: refreshToken,
          }
        );

        // C. Tu backend te devuelve la misma estructura JSON
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // D. Guardar los nuevos tokens
        await tokenStorage.setTokens(accessToken, newRefreshToken);

        // E. Actualizar la cabecera de la petición original fallida
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // F. Reintentar la petición original con el nuevo token
        return client(originalRequest);
      } catch (refreshError) {
        // G. Si el refresh falla (token expirado o inválido), cerrar sesión
        await tokenStorage.clearTokens();

        // Aquí podrías redirigir al Login usando router.replace o actualizando Zustand
        // Ejemplo: useAuthStore.getState().logout();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
