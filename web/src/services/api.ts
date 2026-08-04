import type { ApiError } from "@/types/auth";


export class ApiRequestError extends Error implements ApiError {
  status: number;
  kind: ApiError["kind"];

  constructor(status: number, kind: ApiError["kind"], message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.kind = kind;
  }
}

function apiBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!configuredUrl) {
    throw new ApiRequestError(
      0,
      "configuration",
      "The marketplace API is not configured.",
    );
  }
  return configuredUrl.replace(/\/$/, "");
}

async function parseJsonSafely(response: Response): Promise<unknown> {
  const body = await response.text();
  if (!body) return null;

  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new ApiRequestError(
      response.status,
      "response",
      "The server returned an invalid response.",
    );
  }
}

function responseDetail(payload: unknown): string | null {
  if (!payload || typeof payload !== "object" || !("detail" in payload)) {
    return null;
  }
  const detail = payload.detail;
  if (typeof detail === "string") return detail;
  if (!Array.isArray(detail)) return null;

  const fieldLabels: Record<string, string> = {
    full_name: "full name",
    email: "email address",
    phone: "phone number",
    password: "password",
    confirm_password: "password confirmation",
    store_name: "store name",
    store_description: "store description",
    region: "region",
    city: "city or town",
    address: "store address",
  };
  const fields = new Set<string>();

  detail.forEach((issue) => {
    if (!issue || typeof issue !== "object" || !("loc" in issue)) return;
    const location = issue.loc;
    if (!Array.isArray(location)) return;
    const field = location.at(-1);
    if (typeof field === "string" && fieldLabels[field]) {
      fields.add(fieldLabels[field]);
    }
  });

  return fields.size > 0
    ? `Please check the following fields: ${Array.from(fields).join(", ")}.`
    : null;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof ApiRequestError) throw error;
    throw new ApiRequestError(
      0,
      "network",
      "Unable to connect to the server. Please ensure the backend is running.",
    );
  }

  const payload = await parseJsonSafely(response);
  if (!response.ok) {
    throw new ApiRequestError(
      response.status,
      "server",
      responseDetail(payload) ?? "The server could not complete the request.",
    );
  }
  return payload as T;
}
