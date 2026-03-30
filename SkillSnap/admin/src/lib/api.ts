const TOKEN_KEY = "skillsnap_token";

export function getApiBase(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const trimmed =
    raw?.replace(/\/+$/, "") || "https://skillsnap-ushm.onrender.com/api";
  if (trimmed.endsWith("/api")) return trimmed;
  if (/^https?:\/\/[^/]+$/i.test(trimmed)) {
    return `${trimmed}/api`;
  }
  return trimmed;
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export type ApiFetchOptions = RequestInit & { skipAuth?: boolean };

export async function apiFetch<T>(path: string, init?: ApiFetchOptions): Promise<T> {
  const base = getApiBase();
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  const { skipAuth, ...rest } = init || {};
  const headers = new Headers(rest.headers);
  if (rest.body && typeof rest.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, { ...rest, headers });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const err = (await res.json()) as { message?: string; error?: string };
      message = err.message || err.error || message;
    } catch {
      /* ignore */
    }
    const e = new Error(message);
    (e as Error & { status?: number }).status = res.status;
    throw e;
  }

  if (res.status === 204) return undefined as T;
  const ct = res.headers.get("content-type");
  if (!ct?.includes("application/json")) return undefined as T;
  return res.json() as Promise<T>;
}
