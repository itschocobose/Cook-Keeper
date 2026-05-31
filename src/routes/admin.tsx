import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChefHat, ArrowLeft, Trash2, LogOut, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CHANGELOG } from "@/lib/changelog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Cook Keeper" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type FeedbackRow = {
  id: string;
  message: string;
  user_agent: string | null;
  created_at: string;
};

type Status = "loading" | "unauthenticated" | "not-admin" | "ready";

function AdminPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const { data: userData } = await supabase.auth.getUser();
      if (cancelled) return;

      if (!userData.user) {
        setStatus("unauthenticated");
        return;
      }
      setUserEmail(userData.user.email ?? null);

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id);

      if (cancelled) return;

      if (rolesError) {
        console.error(rolesError);
        setStatus("not-admin");
        return;
      }

      const isAdmin = (roles ?? []).some((r) => r.role === "admin");
      if (!isAdmin) {
        setStatus("not-admin");
        return;
      }

      setStatus("ready");
      await loadFeedback();
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setStatus("unauthenticated");
        setFeedback([]);
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadFeedback() {
    setFeedbackError(null);
    const { data, error } = await supabase
      .from("feedback")
      .select("id, message, user_agent, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setFeedbackError(error.message);
      return;
    }
    setFeedback(data ?? []);
  }

  async function deleteFeedback(id: string) {
    if (!confirm("Delete this feedback entry?")) return;
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) {
      toast.error("Couldn't delete.");
      return;
    }
    toast.success("Deleted.");
    setFeedback((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Checking access...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="panel p-6 max-w-md text-center">
          <h2 className="font-display text-base text-primary mb-3">Sign in required</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This page is for the site admin.
          </p>
          <Button asChild>
            <Link to="/login">Go to login</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (status === "not-admin") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="panel p-6 max-w-md text-center space-y-3">
          <h2 className="font-display text-base text-primary">Not authorized</h2>
          <p className="text-sm text-muted-foreground">
            Signed in as {userEmail ?? "unknown"}. This account doesn't have admin
            access.
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={handleSignOut}>
              Sign out
            </Button>
            <Button asChild variant="ghost">
              <Link to="/">Back to app</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen">
      <header className="px-4 sm:px-8 pt-10 pb-6 text-center">
        <Link to="/" className="inline-flex items-center gap-3 mb-3">
          <ChefHat className="w-8 h-8 text-primary text-glow" />
          <h1 className="text-2xl sm:text-3xl text-primary text-glow">Admin</h1>
        </Link>
      </header>

      <main className="px-4 sm:px-8 pb-16 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Back to app
          </Link>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{userEmail}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-1" />
              Sign out
            </Button>
          </div>
        </div>

        {/* Feedback section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Inbox className="w-5 h-5 text-accent" />
              Submitted Feedback
              <Badge variant="secondary" className="ml-1">
                {feedback.length}
              </Badge>
            </h2>
            <Button variant="outline" size="sm" onClick={loadFeedback}>
              Refresh
            </Button>
          </div>

          {feedbackError && (
            <p className="text-sm text-destructive mb-3">{feedbackError}</p>
          )}

          {feedback.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No feedback submitted yet.
            </p>
          ) : (
            <ol className="space-y-3">
              {feedback.map((f) => (
                <li key={f.id} className="rounded-lg border bg-card p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-xs text-muted-foreground">
                      {new Date(f.created_at).toLocaleString()}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFeedback(f.id)}
                      aria-label="Delete feedback"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{f.message}</p>
                  {f.user_agent && (
                    <p className="text-[10px] text-muted-foreground mt-2 font-mono break-all">
                      {f.user_agent}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* Changelog section */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Changelog</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Same entries shown on the public{" "}
            <Link to="/changelog" className="underline hover:text-foreground">
              /changelog
            </Link>{" "}
            page. To edit, update <code className="text-xs">src/lib/changelog.ts</code>.
          </p>
          <ol className="space-y-4">
            {CHANGELOG.map((e) => (
              <li key={e.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-medium">{e.title}</h3>
                  {e.tag && (
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {e.tag}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{e.date}</p>
                <p className="text-sm">{e.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}
