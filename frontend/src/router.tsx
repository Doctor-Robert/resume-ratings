import { QueryClient } from "@tanstack/react-query";
import { Link, Outlet, createRootRoute, createRoute, createRouter, redirect, useNavigate } from "@tanstack/react-router";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import EvaluationDetails from "@/pages/EvaluationDetails";
import EvaluationList from "@/pages/EvaluationList";
import Login from "@/pages/Login";
import NewEvaluation from "@/pages/NewEvaluation";

export const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

// Верхняя панель + место для страницы
function Layout() {
  const navigate = useNavigate();
  async function logout() {
    await api.logout();
    queryClient.clear();
    navigate({ to: "/login" });
  }
  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-foreground text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <span className="font-bold text-primary">Оценка резюме</span>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/">Новая оценка</Link>
            <Link to="/evaluations">История</Link>
            <Button variant="ghost" size="sm" className="hover:bg-white/10" onClick={logout}>
              Выйти
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

const rootRoute = createRootRoute({ component: Outlet });

const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: "/login", component: Login });

// Все страницы внутри этой «обёртки» закрыты входом: если не вошли — отправляем на /login
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: Layout,
  beforeLoad: async () => {
    try {
      await queryClient.fetchQuery({ queryKey: ["me"], queryFn: api.me, staleTime: 0 });
    } catch {
      throw redirect({ to: "/login" });
    }
  },
});

const newRoute = createRoute({ getParentRoute: () => protectedRoute, path: "/", component: NewEvaluation });
const listRoute = createRoute({ getParentRoute: () => protectedRoute, path: "/evaluations", component: EvaluationList });
const detailsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/evaluations/$id",
  component: EvaluationDetails,
});

const routeTree = rootRoute.addChildren([loginRoute, protectedRoute.addChildren([newRoute, listRoute, detailsRoute])]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
