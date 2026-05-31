import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const feedbackSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, "Please share at least 10 characters.")
    .max(1000, "Please keep it under 1000 characters."),
});

const COOLDOWN_MS = 5000;
const COOLDOWN_KEY = "feedback:lastSubmittedAt";

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = 1000 - message.length;

  async function handleSubmit() {
    setError(null);

    const parsed = feedbackSchema.safeParse({ message });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    if (typeof window !== "undefined") {
      const last = Number(window.localStorage.getItem(COOLDOWN_KEY) ?? 0);
      if (Date.now() - last < COOLDOWN_MS) {
        setError("Please wait a few seconds before sending again.");
        return;
      }
    }

    setSubmitting(true);
    const { error: insertError } = await supabase.from("feedback").insert({
      message: parsed.data.message,
      user_agent:
        typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
    });
    setSubmitting(false);

    if (insertError) {
      console.error("Feedback submission failed", insertError);
      setError("Couldn't send feedback. Please try again.");
      toast.error("Couldn't send feedback. Please try again.");
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    }
    toast.success("Thanks for the feedback!");
    setMessage("");
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(null);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="font-pixel text-lg gap-2 border-2 hover:border-primary hover:text-primary"
        >
          <MessageSquarePlus className="h-4 w-4" />
          Send Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-base text-primary">
            Got a suggestion?
          </DialogTitle>
          <DialogDescription className="font-pixel text-base">
            Anonymous — please don't include personal info like your name, email, or
            account details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What could be better? Bugs, ideas, recipe requests..."
            rows={6}
            maxLength={1000}
            className="font-pixel text-base resize-none"
            aria-invalid={error ? true : undefined}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground font-pixel">
            <span className={error ? "text-destructive" : ""}>{error ?? " "}</span>
            <span>{remaining} left</span>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Sending..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
