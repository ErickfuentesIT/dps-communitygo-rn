import { EventSummary } from "@/types/Event";
import { useQuery } from "@tanstack/react-query";
import client from "./../utils/client";

export const useGetEvents = () => {
  return useQuery({
    queryKey: ["events"], // Clave para el caché
    queryFn: async () => {
      // Hacemos el GET al endpoint que devuelve el array
      const { data } = await client.get<EventSummary[]>("/events");
      return data;
    },
    // Opcional: Refrescar automáticamente cada vez que la pantalla gana foco
    // refetchOnFocus: true,
  });
};
