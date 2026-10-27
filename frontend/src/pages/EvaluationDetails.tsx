import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { api } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EvaluationDetails() {
  const { id } = useParams({ from: "/evaluations/$id" });
  const { data, isPending, error } = useQuery({
    queryKey: ["evaluations", id],
    queryFn: () => api.getEvaluation(Number(id)),
  });

  if (isPending) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-600">{error.message}</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Соответствие: <span className="text-primary">{data.score}%</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{new Date(data.created_at).toLocaleString("ru-RU")}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-2 font-semibold">Сильные стороны</h3>
          <ul className="list-disc space-y-1 pl-5">
            {data.strengths.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Чего не хватает</h3>
          <ul className="list-disc space-y-1 pl-5">
            {data.gaps.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
