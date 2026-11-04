import {
  FALLBACK_BENCHMARK_CENTERS,
  FALLBACK_DIGITAL_SCORES,
  FALLBACK_FACILITIES,
} from "./fallback-data";
import type {
  BenchmarkCenter,
  CreateReservationInput,
  DigitalScore,
  Facility,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export function getFacilities(): Promise<Facility[]> {
  return getJson("/facilities", FALLBACK_FACILITIES);
}

export function getBenchmarkCenters(): Promise<BenchmarkCenter[]> {
  return getJson("/benchmark/centers", FALLBACK_BENCHMARK_CENTERS);
}

export function getDigitalScores(): Promise<DigitalScore[]> {
  return getJson("/benchmark/digital-scores", FALLBACK_DIGITAL_SCORES);
}

export interface CreateReservationResult {
  success: boolean;
  error?: string;
}

export async function createReservation(
  input: CreateReservationInput,
): Promise<CreateReservationResult> {
  try {
    const res = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const message = Array.isArray(body?.message)
        ? body.message.join(", ")
        : (body?.message ?? "Talep gönderilemedi.");
      return { success: false, error: message };
    }
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Sunucuya ulaşılamadı. Lütfen daha sonra tekrar deneyin.",
    };
  }
}
