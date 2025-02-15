"use client";

import { usePlayer } from "@/context/PlayerContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
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

            if (!response.ok || !Array.isArray(data) || data.length === 0) {
                throw new Error("User creation failed or invalid response format");
            }

            const user = data[0]; // Extrahiere das erste Element aus dem Array
            console.log("User created:", user);

            toast.success("User successfully created!");
            setPlayerId(user.player_id);
            router.push("/semantix");
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : "User creation failed. Check your inputs.";
            setError(errMsg);
            toast.error("User creation failed. Check your inputs.");
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden">
                <CardContent className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <h1 className="text-2xl font-bold text-center">Create an Account</h1>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your name"
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
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Sign Up
                        </Button>
                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <a href="/auth/login" className="underline underline-offset-4">
                                Login
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
