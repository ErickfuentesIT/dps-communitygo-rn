// 1. El Creador (Común en todos)
export interface Creator {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
}

// 2. El Evento Resumido (Lo que recibes en el FEED / GetAll)
export interface EventSummary {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  startDate: string;
  isActive: boolean;
  createdAt: string;

  // Stats y User State
  commentsCount: number;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  isBookmarkedByCurrentUser: boolean;

  creator: Creator;
}

// 3. El Evento Detallado (Lo que recibes en GetById)
// "extends" significa que tiene todo lo anterior MÁS lo nuevo
export interface EventDetail extends EventSummary {
  address: string;
  captions: string;
  updatedAt: string;
  comments: any[]; // Define tu interfaz de Comment aquí si la tienes
}

// 4. El Payload de Creación (Lo que envías en el POST)
// Usamos 'Pick' para seleccionar campos base y añadimos los faltantes manuales si difieren
export interface CreateEventPayload {
  title: string;
  description: string;
  captions: string;
  startDate: string; // ISO String
  address: string;
  // image?: string; // Si la subes aparte o en el mismo payload
}
