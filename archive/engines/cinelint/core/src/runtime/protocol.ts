export interface RunRequest {
  input: unknown;
}

export interface RunResponse {
  status: "OK" | "FAIL";
  result?: unknown;
  receipt?: unknown;
}

