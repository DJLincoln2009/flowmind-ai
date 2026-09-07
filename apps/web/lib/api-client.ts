import type { AuthTokens, Workflow, WorkflowCreate } from "@flowmind/shared";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

/**
 * Client HTTP typé et minimaliste pour l'API FlowMind.
 * Les tokens sont stockés côté client (mode local-first) — un rafraîchissement
 * automatique sera branché au moment de l'appel SSE / exécution.
 */
class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  setTokens(tokens: AuthTokens) {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("flowmind_tokens", JSON.stringify(tokens));
    }
  }

  loadTokens(): AuthTokens | null {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem("flowmind_tokens");
    if (!raw) return null;
    try {
      const tokens = JSON.parse(raw) as AuthTokens;
      this.accessToken = tokens.access_token;
      this.refreshToken = tokens.refresh_token;
      return tokens;
    } catch {
      return null;
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("flowmind_tokens");
    }
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers);
    headers.set("Content-Type", "application/json");
    if (this.accessToken) headers.set("Authorization", `Bearer ${this.accessToken}`);

    const res = await fetch(`${API_URL}${path}`, { ...init, headers });
    if (!res.ok) {
      if (res.status === 401) {
        // Tente un refresh, puis une nouvelle tentative une fois.
        const refreshed = await this.tryRefresh();
        if (refreshed) return this.request<T>(path, init);
      }
      const detail = await res.text();
      throw new Error(detail || `API error ${res.status}`);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  private async tryRefresh(): Promise<boolean> {
    if (!this.refreshToken) return false;
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: this.refreshToken }),
    });
    if (!res.ok) {
      this.clearTokens();
      return false;
    }
    const tokens = (await res.json()) as AuthTokens;
    this.setTokens(tokens);
    return true;
  }

  // ---- Auth ----

  async register(email: string, password: string, name?: string) {
    const tokens = await this.request<AuthTokens>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
    this.setTokens(tokens);
    return tokens;
  }

  async login(email: string, password: string) {
    const tokens = await this.request<AuthTokens>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setTokens(tokens);
    return tokens;
  }

  async logout() {
    this.clearTokens();
  }

  // ---- Workflows ----

  listWorkflows(): Promise<Workflow[]> {
    return this.request<Workflow[]>("/workflows");
  }

  getWorkflow(id: number): Promise<Workflow> {
    return this.request<Workflow>(`/workflows/${id}`);
  }

  createWorkflow(payload: WorkflowCreate): Promise<Workflow> {
    return this.request<Workflow>("/workflows", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  updateWorkflow(id: number, payload: Partial<WorkflowCreate>): Promise<Workflow> {
    return this.request<Workflow>(`/workflows/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  deleteWorkflow(id: number): Promise<void> {
    return this.request<void>(`/workflows/${id}`, { method: "DELETE" });
  }
}

export const api = new ApiClient();