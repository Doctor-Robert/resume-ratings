import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewEvaluation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [vacancyTitle, setVacancyTitle] = useState("");
  const [vacancyText, setVacancyText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const create = useMutation({
    mutationFn: (form: FormData) => api.createEvaluation(form),
    onSuccess: (evaluation) => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      navigate({ to: "/evaluations/$id", params: { id: String(evaluation.id) } });
    },
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    const form = new FormData();
    form.append("vacancy_title", vacancyTitle);
    form.append("vacancy_text", vacancyText);
    if (file) form.append("resume_file", file);
    else form.append("resume_text", resumeText);
    create.mutate(form);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Проверка соответствия</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Новая оценка</h1>
      </div>

      <Card className="rounded-xl border-border shadow-sm">
        <CardContent className="p-5 sm:p-7">
          <form onSubmit={submit} className="space-y-7">
            <div className="space-y-3">
              <Step number={1} title="Название вакансии" htmlFor="vacancy-title" />
              <Input
                id="vacancy-title"
                className="text-base"
                maxLength={200}
                placeholder="Например: Python-разработчик"
                value={vacancyTitle}
                onChange={(e) => setVacancyTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Step number={2} title="Описание вакансии" />
              <Textarea
                id="vacancy"
                className="min-h-[190px] resize-y text-base leading-6"
                placeholder="Вставьте описание вакансии: задачи, требования и условия"
                value={vacancyText}
                onChange={(e) => setVacancyText(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Чем полнее описание, тем точнее сравнение.</p>
            </div>

            <div className="space-y-3">
              <Step number={3} title="Резюме кандидата" />
              <label
                htmlFor="file"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-7 text-center transition-colors hover:bg-primary/10"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-lg font-semibold text-primary">↑</span>
                <span className="font-medium">{file ? file.name : "Загрузить резюме"}</span>
                <span className="text-sm text-muted-foreground">{file ? "Нажмите, чтобы выбрать другой файл" : "PDF или DOCX"}</span>
                <input id="file" type="file" accept=".pdf,.docx" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </label>
              {file && (
                <button type="button" className="text-sm font-medium text-primary hover:underline" onClick={() => setFile(null)}>
                  Убрать файл и вставить текст
                </button>
              )}
              {!file && (
                <>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="h-px flex-1 bg-border" />ИЛИ ВСТАВЬТЕ ТЕКСТ<div className="h-px flex-1 bg-border" />
                  </div>
                  <Textarea
                    id="resume"
                    className="min-h-[160px] text-base leading-6"
                    placeholder="Вставьте сюда текст резюме"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    required
                  />
                </>
              )}
            </div>

            {create.isError && <p role="alert" className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">{create.error.message}</p>}
            <Button type="submit" className="h-12 w-full text-base" disabled={create.isPending}>
              {create.isPending ? "Оцениваем… это может занять до минуты" : "Оценить"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Номер шага + заголовок
function Step({ number, title, htmlFor }: { number: number; title: string; htmlFor?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">{number}</span>
      <Label htmlFor={htmlFor} className="text-base font-semibold">{title}</Label>
    </div>
  );
}
