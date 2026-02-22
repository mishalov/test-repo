export interface PingRequest {
  uuid: string
  battery_percent: number
}

export interface Ping {
  id: number
  uuid: string
  battery_percent: number
  created_at: string
}

export type PingResponse =
  | { ok: true }
  | { ok: false; message: string }

