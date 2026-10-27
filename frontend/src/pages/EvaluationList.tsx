import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { api } from "@/api";
import { Card } from "@/components/ui/card";

export default function EvaluationList() {
  const { data, isPending, error } = useQuery({ queryKey: ["evaluations"], queryFn: api.listEvaluations });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">История оценок</h1>
      {isPending && <p>Загрузка…</p>}
      {error && <p className="rounded-md bg-red-50 p-3 text-red-700">{error.message}</p>}
      {data?.length === 0 && (
        <Card className="p-6 text-center text-muted-foreground">Пока нет оценок. Нажмите «Новая оценка», чтобы сделать первую.</Card>
      )}
      {data?.map((item) => (
        <Link key={item.id} to="/evaluations/$id" params={{ id: String(item.id) }}>
          <Card className="mb-3 flex items-center justify-between gap-4 rounded-xl p-4 transition-shadow hover:shadow-md">
            <div className="min-w-0">
              <p className="truncate font-medium">{item.vacancy_title}</p>
              <p className="text-sm text-muted-foreground">{new Date(item.created_at).toLocaleString("ru-RU")}</p>
            </div>
            <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-lg font-semibold text-primary">{item.score}%</span>
          </Card>
        </Link>
      ))}
    </div>
  );
}
