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
      <Card>
        <CardHeader>
          <p className="text-sm text-muted-foreground">
            {data.vacancy_title} · {new Date(data.created_at).toLocaleString("ru-RU")}
          </p>
          <CardTitle className="text-5xl text-primary">{data.score}%</CardTitle>
          <p className="text-muted-foreground">соответствие резюме вакансии</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-semibold">👍 Что хорошо</h3>
            <ul className="list-disc space-y-1 pl-5">
              {data.strengths.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">⚠️ Чего не хватает</h3>
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
