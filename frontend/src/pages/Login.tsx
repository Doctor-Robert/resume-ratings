import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { api } from "@/api";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = useMutation({
    mutationFn: () => api.login(username, password),
    onSuccess: () => navigate({ to: "/" }),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    login.mutate();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-4 py-10">
      <div className="mb-7"><Logo /></div>
      <Card className="w-full max-w-sm rounded-xl border-border shadow-sm">
        <CardHeader className="space-y-2 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Рабочий кабинет</p>
          <CardTitle className="text-2xl tracking-tight">Вход</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Логин</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {login.isError && <p role="alert" className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">{login.error.message}</p>}
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Входим..." : "Войти"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
