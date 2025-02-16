"use client";
import { usePlayer } from "@/context/PlayerContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Cookies from "js-cookie";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { setPlayerId } = usePlayer();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/data/user/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Anmelden nicht erfolgreich. Überprüfe deine Eingaben.");
      }

      // Set cookies with player_id and playerName
      Cookies.set("player_id", data.player_id, { expires: 7 });
      Cookies.set("playerName", data.playerName, { expires: 7 });
      setPlayerId(data.player_id)

      toast.success("Login erfolgreich!");
      window.location.href = "/semantix";
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Anmelden nicht erfolgreich. Überprüfe deine Eingaben.";
      setError(errMsg);
      toast.error("Anmelden nicht erfolgreich. Überprüfe deine Eingaben.");
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Willkommen zurück</h1>
                <p className="text-balance text-muted-foreground">
                  Log dich ein in deinen Semantix Account
                </p>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="grid gap-2">
                <Label htmlFor="username">Benutzername</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Passwort</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="text-center text-sm">
                Noch keinen Account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Registrieren
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/images/login_image.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
