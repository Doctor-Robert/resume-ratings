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
  if (error) return <p className="rounded-md bg-red-50 p-3 text-red-700">{error.message}</p>;

  return (
    <div className="space-y-4">
      <Link to="/evaluations" className="text-sm text-primary">
        ← Назад к списку
      </Link>
      <Card className="rounded-2xl shadow-md">
        <CardHeader className="items-center text-center">
          <p className="text-sm text-muted-foreground">{new Date(data.created_at).toLocaleString("ru-RU")}</p>
          <CardTitle className="text-2xl">{data.vacancy_title}</CardTitle>
          <div
            className="mt-4 flex h-36 w-36 items-center justify-center rounded-full"
            style={{ background: `conic-gradient(hsl(var(--primary)) ${data.score * 3.6}deg, hsl(var(--muted)) 0deg)` }}
          >
            <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-background">
              <span className="text-4xl font-bold text-primary">{data.score}%</span>
            </div>
          </div>
          <p className="text-muted-foreground">соответствие резюме вакансии</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-green-50 p-4">
            <h3 className="mb-2 font-semibold text-green-800">👍 Что хорошо</h3>
            <ul className="list-disc space-y-1 pl-5">
              {data.strengths.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-amber-50 p-4">
            <h3 className="mb-2 font-semibold text-amber-800">⚠️ Чего не хватает</h3>
            {data.gaps.length === 0 && <p>Ничего критичного не найдено</p>}
            <ul className="list-disc space-y-1 pl-5">
              {data.gaps.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
