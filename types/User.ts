// types/User.ts
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  profilePictureUrl: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
// types/Auth.ts (o similar)
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // Nota: La API no pide confirmPassword, esto es solo validación del frontend
}
