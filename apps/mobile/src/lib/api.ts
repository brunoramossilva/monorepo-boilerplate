import type { ApiResponse } from "@repo/types";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const json = (await response.json()) as ApiResponse<T>;
  return json.data;
}
