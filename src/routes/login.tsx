import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ChefHat, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Cook Keeper" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: authError } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });

    setSubmitting(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    toast.success(mode === "signin" ? "Signed in" : "Account created");
    navigate({ to: "/admin" });
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <header className="px-4 sm:px-8 pt-10 pb-6 text-center">
        <Link to="/" className="inline-flex items-center gap-3 mb-3">
          <ChefHat className="w-8 h-8 text-primary text-glow" />
          <h1 className="text-2xl sm:text-3xl text-primary text-glow">Cook Keeper</h1>
        </Link>
      </header>

      <main className="px-4 sm:px-8 pb-16 max-w-md w-full mx-auto flex-1">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to app
        </Link>

        <div className="panel p-6">
          <h2 className="font-display text-base text-primary mb-1">
            {mode === "signin" ? "Admin Sign In" : "Create Admin Account"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Restricted area. Submitted feedback and changelog management.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting
                ? "Working..."
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode("signup");
                }}
                className="underline hover:text-foreground"
              >
                Need an account? Sign up
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode("signin");
                }}
                className="underline hover:text-foreground"
              >
                Already have an account? Sign in
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
