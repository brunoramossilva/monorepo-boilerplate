import type { ApiResponse } from "@repo/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type ApiResult<T> = { data: T; isMocked: boolean };

export async function apiGet<T>(path: string, fallback: T): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    const json = (await response.json()) as ApiResponse<T>;
    return { data: json.data, isMocked: false };
  } catch {
    return { data: fallback, isMocked: true };
  }
}
