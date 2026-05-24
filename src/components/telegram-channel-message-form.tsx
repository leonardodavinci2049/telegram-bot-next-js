"use client";

import { Send } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  type SendTelegramMessageState,
  sendTelegramMessageAction,
} from "@/app/send-telegram-message.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const initialSendTelegramMessageState: SendTelegramMessageState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending} size="lg" type="submit">
      <Send aria-hidden="true" />
      {pending ? "Enviando..." : "Enviar para o Telegram"}
    </Button>
  );
}

export function TelegramChannelMessageForm() {
  const [state, formAction] = useActionState(
    sendTelegramMessageAction,
    initialSendTelegramMessageState,
  );

  return (
    <Card className="w-full max-w-xl rounded-lg border border-border/70 shadow-xl">
      <CardHeader className="gap-2 px-6 pt-6">
        <CardTitle className="text-2xl font-semibold">
          Enviar mensagem
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="telegram-message">Texto da mensagem</Label>
            <textarea
              className={cn(
                "min-h-44 w-full resize-y rounded-lg border border-input bg-background px-4 py-3 text-sm shadow-xs transition-colors",
                "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
              )}
              id="telegram-message"
              maxLength={4096}
              name="message"
              placeholder="Digite aqui o texto que será enviado ao canal..."
              required
            />
          </div>

          <SubmitButton />

          {state.message ? (
            <p
              className={cn(
                "rounded-md border px-3 py-2 text-sm",
                state.status === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-destructive/30 bg-destructive/10 text-destructive",
              )}
            >
              {state.message}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
