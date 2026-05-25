import { TelegramChannelMessageForm } from "@/components/telegram-channel-message-form";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-xl">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Canal Telegram
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-foreground">
            Publicador de mensagens
          </h1>
        </div>

        <TelegramChannelMessageForm />
      </section>
    </main>
  );
}
