import { type Bot, InlineKeyboard } from "grammy";

let level = 3;

const getLevel = (): string => {
  let label = "";
  for (let i = 1; i <= 5; i++) {
    label += level === i ? "||" : "=";
  }
  return label;
};

const botoes = (): InlineKeyboard =>
  new InlineKeyboard()
    .text("<<", "<")
    .row()
    .text(getLevel(), "result")
    .row()
    .text(">>", ">");

export async function setupEditMessageTextHandler(bot: Bot): Promise<void> {
  bot.command("start", async (ctx) => {
    const name = ctx.from?.first_name || "Usuário";
    await ctx.reply(`Seja bem vindo, ${name}!`);
    await ctx.reply(`Nível: ${level}`, {
      reply_markup: botoes(),
    });
  });

  bot.callbackQuery("<", async (ctx) => {
    if (level === 1) {
      await ctx.answerCallbackQuery({ text: "Chegou no limite" });
    } else {
      level--;
      await ctx.editMessageText(`Nível: ${level}`, {
        reply_markup: botoes(),
      });
      await ctx.answerCallbackQuery();
    }
  });

  bot.callbackQuery(">", async (ctx) => {
    if (level === 5) {
      await ctx.answerCallbackQuery({ text: "Chegou no limite" });
    } else {
      level++;
      await ctx.editMessageText(`Nível: ${level}`, {
        reply_markup: botoes(),
      });
      await ctx.answerCallbackQuery();
    }
  });

  bot.callbackQuery("result", async (ctx) => {
    await ctx.answerCallbackQuery({
      text: `O nível atual está em: ${level}`,
    });
  });
}
