// Define el tipo específico para la media,
// así solo aceptas 'image' o 'video'
type MediaType = "image" | "video";

// Interfaz para el usuario que publica
export interface PostUser {
  id: string;
  username: string;
  profilePictureUrl: string;
}

// Interfaz para cada item en el carrusel de media
export interface PostMedia {
  id?: string;
  type?: MediaType;
  url?: string | null;
}

// Interfaz para las estadísticas del post
export interface PostStats {
  likeCount: number;
  commentCount: number;
  attendanceCount: number;
}

// Interfaz para el estado de interacción del usuario actual
export interface UserInteraction {
  isLiked: boolean;
  isBookmarked: boolean;
  isAttending: boolean;
}

export interface PostComments {
  id: string;
  profilePictureUrl?: string;
  userId: string;
  username: string;
  text: string;
  timestap: string;
}

// --- La Interfaz Principal del Post ---
export interface Post {
  id: string;
  title: string;
  eventDate: string;
  location?: string; // Hecho opcional, ya que no todos los posts lo tienen
  caption: string;
  details: string;
  user: PostUser;
  media: PostMedia; // Un array de objetos PostMedia

  stats: PostStats;
  userInteraction: UserInteraction;
  createdAt: string; // (string para la fecha en formato ISO)
  comments: PostComments[];
}
