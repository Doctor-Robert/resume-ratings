// Все запросы к серверу (FastAPI) собраны здесь

export type Evaluation = {
  id: number;
  vacancy_text: string;
  resume_text: string;
  score: number;
  strengths: string[];
  gaps: string[];
  created_at: string;
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(typeof data?.detail === "string" ? data.detail : "Что-то пошло не так");
  }
  return response.json();
}

export const api = {
  me: () => request<{ username: string }>("/api/me"),
  login: (username: string, password: string) =>
    request<{ username: string }>("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }),
  logout: () => request("/api/logout", { method: "POST" }),
  listEvaluations: () => request<Evaluation[]>("/api/evaluations"),
  getEvaluation: (id: number) => request<Evaluation>(`/api/evaluations/${id}`),
  createEvaluation: (form: FormData) => request<Evaluation>("/api/evaluations", { method: "POST", body: form }),
};
