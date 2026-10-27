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
  const [description, setDescription] = useState("");
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
    form.append("vacancy_text", description);
    if (file) form.append("resume_file", file);
    else form.append("resume_text", resumeText);
    create.mutate(form);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Новая оценка</CardTitle>
        <p className="text-muted-foreground">Укажите вакансию и резюме — мы покажем, насколько они подходят друг другу.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">1. Название вакансии</Label>
            <Input
              id="title"
              placeholder="Например: Python-разработчик"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание вакансии (по желанию)</Label>
            <Textarea
              id="description"
              placeholder="Требования, обязанности, стек — чем подробнее, тем точнее оценка"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">2. Резюме — загрузите файл (PDF или DOCX)</Label>
            <Input id="file" type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume">…или вставьте текст резюме</Label>
            <Textarea
              id="resume"
              placeholder={file ? "Файл выбран, текст не нужен" : "Вставьте сюда текст резюме"}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              disabled={file !== null}
              required={file === null}
            />
          </div>
          {create.isError && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{create.error.message}</p>
          )}
          <Button type="submit" className="w-full" disabled={create.isPending}>
            {create.isPending ? "Оцениваем… это может занять до минуты" : "Оценить"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
