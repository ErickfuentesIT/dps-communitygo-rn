import { EventSummary } from "@/types/Event";
import { create } from "zustand";

// --- Definición del Estado ---
interface EventsState {
  // Datos
  events: EventSummary[];

  // Acciones
  setEvents: (events: EventSummary[]) => void;
  addEvent: (event: EventSummary) => void;
  toggleLike: (eventId: string) => void;
  toggleBookmark: (eventId: string) => void;
}

// --- Configuración del Middleware para Web/Mobile ---
// Esto evita el error de 'import.meta' en la web

// --- Creación del Store ---
export const useEventsStore = create<EventsState>((set) => ({
  // 1. Estado Inicial
  events: [],

  // 2. Cargar eventos desde la API (Sobrescribe todo)
  setEvents: (newEvents) => set({ events: newEvents }),

  // 3. Agregar un evento nuevo (Al principio de la lista)
  // Útil cuando creas un evento y quieres verlo inmediatamente sin recargar
  addEvent: (newEvent) =>
    set((state) => ({
      events: [newEvent, ...state.events],
    })),

  // 4. Dar Like (Actualización Optimista)
  // Cambia el booleano y suma/resta 1 al contador instantáneamente
  toggleLike: (eventId) =>
    set((state) => ({
      events: state.events.map((event) => {
        if (event.id === eventId) {
          const isLiked = !event.isLikedByCurrentUser;
          return {
            ...event,
            isLikedByCurrentUser: isLiked,
            likesCount: isLiked ? event.likesCount + 1 : event.likesCount - 1,
          };
        }
        return event;
      }),
    })),

  // 5. Guardar/Bookmark
  toggleBookmark: (eventId) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              isBookmarkedByCurrentUser: !event.isBookmarkedByCurrentUser,
            }
          : event
      ),
    })),
}));
