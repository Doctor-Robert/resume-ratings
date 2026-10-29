import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { api } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EvaluationDetails() {
  const { id } = useParams({ from: "/protected/evaluations/$id" });
  const { data, isPending, error } = useQuery({
    queryKey: ["evaluations", id],
    queryFn: () => api.getEvaluation(Number(id)),
  });

  if (isPending) return <p>Загрузка…</p>;
  if (error) return <p role="alert" className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">{error.message}</p>;

  return (
    <div className="space-y-4">
      <Link to="/evaluations" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        <span aria-hidden="true">←</span> История оценок
      </Link>
      <Card className="overflow-hidden rounded-xl border-border shadow-sm">
        <CardHeader className="items-center border-b border-border bg-muted/60 px-5 py-8 text-center sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Результат оценки</p>
          <p className="text-sm text-muted-foreground">{new Date(data.created_at).toLocaleString("ru-RU")}</p>
          <CardTitle className="max-w-2xl text-2xl leading-tight">{data.vacancy_title}</CardTitle>
          <div
            className="mt-4 flex h-36 w-36 items-center justify-center rounded-full shadow-sm"
            style={{ background: `conic-gradient(hsl(var(--primary)) ${data.score * 3.6}deg, hsl(var(--muted)) 0deg)` }}
          >
            <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-background">
              <span className="text-4xl font-bold text-primary">{data.score}%</span>
              <span className="mt-1 text-xs text-muted-foreground">совпадение</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-5 sm:p-8">
          <section className="rounded-lg border border-primary/20 bg-primary/5 p-4 sm:p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm text-white">+</span>
              Сильные стороны
            </h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6">
              {data.strengths.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-lg border border-border bg-muted/60 p-4 sm:p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-sm text-white">−</span>
              Что стоит усилить
            </h3>
            {data.gaps.length === 0 && <p className="text-sm leading-6 text-muted-foreground">Существенных пробелов не найдено.</p>}
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6">
              {data.gaps.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-lg border border-border p-4 sm:p-5">
            <h3 className="mb-2 text-sm font-semibold">Описание вакансии</h3>
            <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{data.vacancy_text}</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
