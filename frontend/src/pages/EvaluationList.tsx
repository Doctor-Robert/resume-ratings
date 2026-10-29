import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { api } from "@/api";
import { Card } from "@/components/ui/card";

export default function EvaluationList() {
  const { data, isPending, error } = useQuery({ queryKey: ["evaluations"], queryFn: api.listEvaluations });

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Сохранённые результаты</p>
        <h1 className="break-words text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">История оценок</h1>
      </div>
      {isPending && <p>Загрузка…</p>}
      {error && <p role="alert" className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">{error.message}</p>}
      {data?.length === 0 && (
        <Card className="rounded-xl border-border p-8 text-center text-sm leading-6 text-muted-foreground shadow-sm">
          Пока нет оценок. Нажмите «Новая оценка», чтобы создать первую.
        </Card>
      )}
      {data?.map((item) => (
        <Link key={item.id} to="/evaluations/$id" params={{ id: String(item.id) }} className="block">
          <Card className="mb-3 flex items-center justify-between gap-4 rounded-xl border-border p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm">
            <div className="min-w-0">
              <p className="truncate font-medium leading-6">{item.vacancy_title}</p>
              <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">{item.vacancy_text}</p>
              <p className="mt-2 text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString("ru-RU")}</p>
            </div>
            <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-base font-semibold text-primary">{item.score}%</span>
          </Card>
        </Link>
      ))}
    </div>
  );
}
