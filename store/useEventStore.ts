import { EventSummary } from "@/types/Event";
import { create } from "zustand";
import client from "./../utils/client";

// --- Definición del Estado ---
interface EventsState {
  events: EventSummary[];

  setEvents: (events: EventSummary[]) => void;
  addEvent: (event: EventSummary) => void;
  toggleLike: (eventId: string) => void;
  toggleBookmark: (eventId: string) => void;

  fetchEvents: () => Promise<void>;
}

// --- Creación del Store ---
export const useEventsStore = create<EventsState>((set) => ({
  // Estado Inicial
  events: [],

  // Remplazar listado de eventos
  setEvents: (newEvents) => set({ events: newEvents }),

  // Agregar evento al inicio
  addEvent: (newEvent) =>
    set((state) => ({
      events: [newEvent, ...state.events],
    })),

  // Like
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

  // Bookmark
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

  fetchEvents: async () => {
    try {
      const { data } = await client.get<EventSummary[]>("/events");

      // Evitar crasheo si el backend devuelve algo inesperado
      if (Array.isArray(data)) {
        set({ events: data });
      } else {
        console.warn("La API devolvió un formato inesperado:", data);
        set({ events: [] });
      }
    } catch (err) {
      console.error("Error al obtener eventos:", err);
      set({ events: [] });
    }
  },
}));
