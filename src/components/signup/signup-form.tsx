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

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { setPlayerId } = usePlayer();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch("/api/data/user/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (!response.ok || !Array.isArray(data) || data.length === 0) {
                throw new Error("User creation failed or invalid response format");
            }

            const user = data[0];

            if (!user?.player_id) {
                throw new Error("No player_id found in response");
            }

            console.log("User created:", user);
            console.log("Extracted Player ID:", user.player_id);

            toast.success("User successfully created!");
            setPlayerId(user.player_id);
            router.push("/semantix");
        } catch (error) {
            const errMsg =
                error instanceof Error
                    ? error.message
                    : "User creation failed. Check your inputs.";
            setError(errMsg);
            toast.error("User creation failed. Check your inputs.");
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Account erstellen</h1>
                                <p className="text-balance text-muted-foreground">
                                    Erstelle dir einen Account bei Semantix
                                </p>
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Passwort</Label>
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
                                Registrieren
                            </Button>
                            <div className="text-center text-sm">
                                Du hast schon einen Account?{" "}
                                <a href="/login" className="underline underline-offset-4">
                                    Login
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
