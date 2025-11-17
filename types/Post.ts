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
  id: string;
  type: MediaType;
  url: string;
}

// Interfaz para las estadísticas del post
export interface PostStats {
  likeCount: number;
  commentCount: number;
}

// Interfaz para el estado de interacción del usuario actual
export interface UserInteraction {
  isLiked: boolean;
  isBookmarked: boolean;
}

// Interfaz para el usuario de un comentario (simplificado)
export interface CommentUser {
  username: string;
}

// Interfaz para la vista previa de comentarios
export interface CommentPreview {
  id: string;
  user: CommentUser;
  text: string;
}

// --- La Interfaz Principal del Post ---
export interface Post {
  id: string;
  title: string;
  eventDate: string;
  user: PostUser;
  media: PostMedia[]; // Un array de objetos PostMedia
  caption: string;
  location?: string; // Hecho opcional, ya que no todos los posts lo tienen
  stats: PostStats;
  userInteraction: UserInteraction;
  commentPreview: CommentPreview[]; // Un array de vistas previas
  createdAt: string; // (string para la fecha en formato ISO)
}
