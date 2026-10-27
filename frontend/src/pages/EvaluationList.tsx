import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { api } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EvaluationList() {
  const { data, isPending, error } = useQuery({ queryKey: ["evaluations"], queryFn: api.listEvaluations });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Прошлые оценки</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending && <p>Загрузка...</p>}
        {error && <p className="text-red-600">{error.message}</p>}
        {data?.length === 0 && <p className="text-muted-foreground">Пока нет оценок</p>}
        <ul className="divide-y">
          {data?.map((item) => (
            <li key={item.id}>
              <Link
                to="/evaluations/$id"
                params={{ id: String(item.id) }}
                className="flex items-center justify-between gap-4 py-3 hover:text-primary"
              >
                <span className="truncate text-sm">{item.vacancy_text.slice(0, 80)}</span>
                <span className="shrink-0 font-semibold text-primary">{item.score}%</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
