"use server";

import { sendTextToConfiguredChannel } from "@/services/telegram/bot25-automation1/bot-telegram";

export type SendTelegramMessageState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function sendTelegramMessageAction(
  _previousState: SendTelegramMessageState,
  formData: FormData,
): Promise<SendTelegramMessageState> {
  const text = String(formData.get("message") ?? "").trim();

  if (!text) {
    return {
      status: "error",
      message: "Digite uma mensagem antes de enviar.",
    };
  }

  try {
    await sendTextToConfiguredChannel(text);

    return {
      status: "success",
      message: "Mensagem enviada para o Telegram.",
    };
  } catch (error) {
    console.error("[send-telegram-message] Failed to send message:", error);

    return {
      status: "error",
      message: "Não foi possível enviar a mensagem.",
    };
  }
}
