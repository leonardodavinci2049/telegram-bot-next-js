import { type Bot, InlineKeyboard } from "grammy";

let contagem = 0;

const botoes = new InlineKeyboard()
  .text("+1", "add 1")
  .text("+10", "add 10")
  .text("+100", "add 100")
  .row()
  .text("-1", "sub 1")
  .text("-10", "sub 10")
  .text("-100", "sub 100")
  .row()
  .text("🔃 Zerar", "reset")
  .text("Resultado", "result");

export async function setupInlineButtonsHandler(bot: Bot): Promise<void> {
  bot.command("start", async (ctx) => {
    const nome = ctx.from?.first_name || "Usuário";
    await ctx.reply(`Seja bem vindo, ${nome}!`);
    await ctx.reply(`A contagem atual está em ${contagem}`, {
      reply_markup: botoes,
    });
  });

  bot.callbackQuery(/add (\d+)/, async (ctx) => {
    const match = ctx.match;
    if (match && typeof match !== "string") {
      contagem += parseInt(match[1] || "0", 10);
    }
    // No exemplo original ele envia uma nova mensagem, para seguir o comportamento:
    await ctx.reply(`A contagem atual está em ${contagem}`, {
      reply_markup: botoes,
    });
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery(/sub (\d+)/, async (ctx) => {
    const match = ctx.match;
    if (match && typeof match !== "string") {
      contagem -= parseInt(match[1] || "0", 10);
    }
    await ctx.reply(`A contagem atual está em ${contagem}`, {
      reply_markup: botoes,
    });
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery("reset", async (ctx) => {
    contagem = 0;
    await ctx.reply(`A contagem atual está em ${contagem}`, {
      reply_markup: botoes,
    });
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery("result", async (ctx) => {
    await ctx.answerCallbackQuery({
      text: `A contagem atual está em ${contagem}`,
      show_alert: true,
    });
  });
}
