import axios from "axios";
import { type Bot, Keyboard } from "grammy";

export async function setupAssincronoHandler(
  bot: Bot,
  botConfig: { TELEGRAM_BOT_TOKEN: string; TELEGRAM_BOT_CHATID: string | null },
): Promise<void> {
  const chatId = botConfig.TELEGRAM_BOT_CHATID;
  if (!chatId) {
    console.warn(
      "[telegram] No TELEGRAM_BOT_CHATID configured, skipping sending async messages",
    );
    return;
  }

  const token = botConfig.TELEGRAM_BOT_TOKEN;
  const apiUrl = `https://api.telegram.org/bot${token}`;

  const enviarMensagem = (msg: string) => {
    axios
      .get(
        `${apiUrl}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(msg)}`,
      )
      .catch((e) =>
        console.error("[telegram:axios] Failed to send message:", e),
      );
  };

  // Envia a mensagem de forma assíncrona usando Axios
  enviarMensagem("Enviando a mensagem de forma assíncrona");

  // Cria o teclado personalizado usando a API do Grammy
  const teclado = new Keyboard()
    .text("Ok")
    .text("Cancelar")
    .resized()
    .oneTime();

  // Envia a mensagem com o teclado usando a API do Grammy
  bot.api
    .sendMessage(chatId, "Essa é uma mensagem com teclado", {
      reply_markup: teclado,
    })
    .catch((e) =>
      console.error("[telegram:api] Failed to send message with keyboard:", e),
    );
}
