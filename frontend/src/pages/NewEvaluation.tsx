import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewEvaluation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
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
    form.append("vacancy_title", title);
    if (file) form.append("resume_file", file);
    else form.append("resume_text", resumeText);
    create.mutate(form);
  }

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Новая оценка</CardTitle>
        <p className="text-muted-foreground">Укажите вакансию и резюме — покажем, насколько они подходят друг другу.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-8">
          <div className="space-y-3">
            <Step number={1} title="Название вакансии" />
            <Input
              id="title"
              className="h-12 text-base"
              placeholder="Например: Python-разработчик"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <Step number={2} title="Резюме кандидата" />
            <label
              htmlFor="file"
              className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-8 text-center transition-colors hover:bg-primary/10"
            >
              <span className="text-3xl">📄</span>
              <span className="font-medium">{file ? file.name : "Нажмите, чтобы загрузить файл"}</span>
              <span className="text-sm text-muted-foreground">{file ? "Нажмите, чтобы выбрать другой" : "PDF или DOCX"}</span>
              <input id="file" type="file" accept=".pdf,.docx" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
            {file && (
              <button type="button" className="text-sm text-primary" onClick={() => setFile(null)}>
                Убрать файл и вставить текст
              </button>
            )}
            {!file && (
              <>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="h-px flex-1 bg-border" />или вставьте текст<div className="h-px flex-1 bg-border" />
                </div>
                <Textarea
                  id="resume"
                  className="min-h-[160px] text-base"
                  placeholder="Вставьте сюда текст резюме"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  required
                />
              </>
            )}
          </div>

          {create.isError && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{create.error.message}</p>}
          <Button type="submit" className="h-12 w-full text-base" disabled={create.isPending}>
            {create.isPending ? "Оцениваем… это может занять до минуты" : "Оценить"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Номер шага + заголовок
function Step({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">{number}</span>
      <Label className="text-base">{title}</Label>
    </div>
  );
}
