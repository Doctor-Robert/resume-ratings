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
  const [vacancy, setVacancy] = useState("");
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
    form.append("vacancy", vacancy);
    if (file) form.append("resume_file", file);
    else form.append("resume_text", resumeText);
    create.mutate(form);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Новая оценка</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vacancy">Текст вакансии</Label>
            <Textarea id="vacancy" value={vacancy} onChange={(e) => setVacancy(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Резюме файлом (PDF или DOCX)</Label>
            <Input id="file" type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume">Или вставьте резюме текстом</Label>
            <Textarea
              id="resume"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              disabled={file !== null}
              required={file === null}
            />
          </div>
          {create.isError && <p className="text-sm text-red-600">{create.error.message}</p>}
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Оцениваем (до минуты)..." : "Оценить"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
