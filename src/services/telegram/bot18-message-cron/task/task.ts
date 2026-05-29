import { type Bot, InlineKeyboard } from "grammy";
import schedule from "node-schedule";

let contador = 1;
let job: schedule.Job | null = null;

export async function setupAssincronoHandler(
  bot: Bot,
  botConfig: { TELEGRAM_BOT_TOKEN: string; TELEGRAM_BOT_CHATID: string | null },
): Promise<void> {
  const chatId = botConfig.TELEGRAM_BOT_CHATID;
  if (!chatId) {
    console.warn(
      "[telegram] No TELEGRAM_BOT_CHATID configured, skipping scheduling",
    );
    return;
  }

  // Cancela o agendamento anterior para evitar duplicidade no HMR (Hot Module Replacement)
  if (job) {
    job.cancel();
  }

  const botoes = () => new InlineKeyboard().text("Cancelar", "cancel");

  const notificar = () => {
    bot.api
      .sendMessage(chatId, `Essa é uma mensagem de evento [${contador++}]`, {
        reply_markup: botoes(),
      })
      .catch((e) =>
        console.error("[telegram:cron] Failed to send message:", e),
      );
  };

  // Cron agendado para executar de 1 em 1 minuto (não menos do que 1 minuto)
  // "0 */1 * * * *" executa a cada minuto, no segundo 0
  job = schedule.scheduleJob("0 */1 * * * *", notificar);

  bot.callbackQuery("cancel", async (ctx) => {
    if (job) {
      job.cancel();
      job = null;
    }
    await ctx.answerCallbackQuery();
    await ctx.reply("Ok! Parei de perturbar...");
  });
}
