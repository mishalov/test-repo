import type { Ping, PingRequest, PingResponse } from "@/types/ping";

export async function fetchPings(): Promise<Ping[]> {
  try {
    const response = await fetch("/api/ping", {
      headers: { Accept: "application/json" },
    });
    const data = await response.json();

    if (response.ok && Array.isArray(data)) {
      return data as Ping[];
    }
  } catch {
    // fall through to generic error
  }

  throw new Error("Something went wrong.");
}

export async function postPing(payload: PingRequest): Promise<PingResponse> {
  try {
    const response = await fetch("/api/ping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (response.ok && data?.status === "ok") {
      return { ok: true };
    }
  } catch {
    // fall through to generic error
  }

  return { ok: false, message: "Something went wrong." };
}
