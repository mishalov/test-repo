import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchPings, postPing } from "@/api/ping";
import type { Ping } from "@/types/ping";

const makePing = (overrides?: Partial<Ping>): Ping => ({
  id: 1,
  uuid: "test-uuid",
  battery_percent: 80,
  created_at: "2024-01-01T00:00:00Z",
  ...overrides,
});

function mockFetch(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchPings", () => {
  it("returns array on success", async () => {
    const pings = [makePing({ id: 1 }), makePing({ id: 2 })];
    vi.stubGlobal("fetch", mockFetch(pings));

    const result = await fetchPings();
    expect(result).toEqual(pings);
    expect(fetch).toHaveBeenCalledWith(
      "/api/ping",
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: "application/json" }),
      }),
    );
  });

  it("throws on non-ok response", async () => {
    vi.stubGlobal("fetch", mockFetch({ message: "Server Error" }, 500));

    await expect(fetchPings()).rejects.toThrow("Something went wrong.");
  });

  it("throws on non-array response body", async () => {
    vi.stubGlobal("fetch", mockFetch({ unexpected: "object" }));

    await expect(fetchPings()).rejects.toThrow("Something went wrong.");
  });

  it("throws on network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));
    await expect(fetchPings()).rejects.toThrow("Something went wrong.");
  });
});

describe("postPing", () => {
  it("returns ok response on success", async () => {
    vi.stubGlobal("fetch", mockFetch({ status: "ok" }, 200));

    const result = await postPing({ uuid: "test-uuid", battery_percent: 80 });
    expect(result).toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledWith(
      "/api/ping",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ uuid: "test-uuid", battery_percent: 80 }),
      }),
    );
  });

  it("returns error message on failure response", async () => {
    vi.stubGlobal("fetch", mockFetch({ message: "Validation failed." }, 422));

    const result = await postPing({ uuid: "bad-uuid", battery_percent: -1 });
    expect(result).toEqual({ ok: false, message: "Something went wrong." });
  });

  it("returns error when response is ok but status is not 'ok'", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(null),
      }),
    );

    const result = await postPing({ uuid: "test-uuid", battery_percent: 50 });
    expect(result).toEqual({
      ok: false,
      message: "Something went wrong.",
    });
  });

  it("returns error on network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error")),
    );

    const result = await postPing({ uuid: "test-uuid", battery_percent: 50 });
    expect(result).toEqual({ ok: false, message: "Something went wrong." });
  });

  it("returns fallback message when error response has no message field", async () => {
    vi.stubGlobal("fetch", mockFetch({ error: "some other format" }, 422));

    const result = await postPing({ uuid: "test-uuid", battery_percent: 50 });
    expect(result).toEqual({ ok: false, message: "Something went wrong." });
  });
});
