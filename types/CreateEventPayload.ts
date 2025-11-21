// types/CreateEventPayload.ts (or similar)

export interface CreateEventPayload {
  title: string;
  description: string;
  captions: string;
  startDate: string; // ISO string
  address: string;
  // Note: The API payload didn't include the image,
  // so we assume it's uploaded separately or not part of this POST call.
}
