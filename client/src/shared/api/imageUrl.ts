import { API_BASE_URL } from "./client";

export function imageUrl(path: string): string {
  return path.startsWith("/uploads/") ? `${API_BASE_URL}${path}` : path;
}
