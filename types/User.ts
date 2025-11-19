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
