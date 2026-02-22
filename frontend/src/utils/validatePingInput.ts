import type { PingRequest } from "@/types/ping";

export type ValidationResult =
  | { valid: true; data: PingRequest }
  | { valid: false; message: string };

const error = (message: string) => ({
  valid: false as const,
  message,
});

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// No zod or similar libraries to keep dependencies minimal and validation logic straightforward for this simple case.
export function validatePingInput(
  rawUuid: string,
  rawBattery: string | number,
): ValidationResult {
  const trimmedUuid = rawUuid.trim();
  if (trimmedUuid === "") {
    return error("UUID is required.");
  }

  if (!UUID_RE.test(trimmedUuid)) {
    return error("UUID must be a valid UUID format.");
  }

  if (rawBattery === "") {
    return error("Battery percent is required.");
  }

  const battery = Number(rawBattery);
  if (Number.isNaN(battery)) {
    return error("Battery percent must be a valid number.");
  }

  if (!Number.isInteger(battery)) {
    return error("Battery percent must be a whole number.");
  }

  if (battery < 0 || battery > 100) {
    return error("Battery percent must be between 0 and 100.");
  }

  return {
    valid: true,
    data: { uuid: trimmedUuid, battery_percent: battery },
  };
}
