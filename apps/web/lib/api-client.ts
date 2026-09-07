import type {
  AuthTokens,
  DashboardStats,
  ExecutionHistoryItem,
  Workflow,
  WorkflowCreate,
} from "@flowmind/shared";

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
    if (!this.accessToken && !this.refreshToken) this.loadTokens();

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

  // ---- Exécutions ----

  runWorkflow(id: number): Promise<{ execution_id: number }> {
    return this.request<{ execution_id: number }>(`/workflows/${id}/run`, {
      method: "POST",
    });
  }

  listExecutions(id: number) {
    return this.request<unknown[]>(`/workflows/${id}/executions`);
  }

  listAllExecutions(): Promise<ExecutionHistoryItem[]> {
    return this.request<ExecutionHistoryItem[]>("/executions");
  }

  getStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>("/stats");
  }

  /**
   * Flux SSE des événements d'exécution. Optionnel pour nettoyage à la fermeture.
   * Les tokens sont injectés dans l'URL (EventSource ne permet pas d'headers).
   */
  streamExecution(
    executionId: number,
    handlers: {
      onNode?: (data: {
        node_id: string;
        node_type: string;
        status: string;
        output: unknown;
        error?: string | null;
      }) => void;
      onStart?: (data: { execution_id: number; levels: number }) => void;
      onEnd?: (data: { execution_id: number; status: string }) => void;
      onError?: (data: { message: string }) => void;
    }
  ): EventSource {
    const token = this.loadTokens()?.access_token ?? "";
    const es = new EventSource(
      `${API_URL}/executions/${executionId}/stream?token=${encodeURIComponent(token)}`
    );

    es.addEventListener("start", (e) => handlers.onStart?.(JSON.parse((e as MessageEvent).data)));
    es.addEventListener("node", (e) => handlers.onNode?.(JSON.parse((e as MessageEvent).data)));
    es.addEventListener("end", (e) => handlers.onEnd?.(JSON.parse((e as MessageEvent).data)));
    es.addEventListener("error", () => handlers.onError?.({ message: "Erreur SSE" }));
    return es;
  }
}

export const api = new ApiClient();