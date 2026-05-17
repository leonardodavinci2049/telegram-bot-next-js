import { Bot, Keyboard } from "grammy";

const tecladoCarne = new Keyboard()
  .text("🐷 Porco")
  .text("🐮 Vaca")
  .text("🐑 Carneiro")
  .row()
  .text("🐔 Galinha")
  .text("🐣 Eu como é ovo")
  .row()
  .text("🐟 Peixe")
  .text("🐙 Frutos do mar")
  .row()
  .text("🍄 Eu sou vegetariano")
  .resized();

export async function setupCustomKeyboardHandler(bot: Bot): Promise<void> {
  bot.command("start", async (ctx) => {
    const firstName = ctx.from?.first_name || "Usuário";
    await ctx.reply(`Seja bem vindo, ${firstName}!`);

    const tecladoBebida = new Keyboard()
      .text("Coca")
      .text("Pepsi")
      .resized()
      .oneTime();

    await ctx.reply("Qual bebida você prefere?", {
      reply_markup: tecladoBebida,
    });
  });

  bot.hears(["Coca", "Pepsi"], async (ctx) => {
    const match = ctx.match;
    // O ctx.match no grammy pode ser array de RegexMatch ou a própria string no caso de array de strings
    // De qualquer forma, o texto da mensagem garante o que foi digitado
    const bebidaDigitada = ctx.message?.text || match;

    await ctx.reply(`Nossa! Eu também gosto de ${bebidaDigitada}`);
    await ctx.reply("Qual a sua carne predileta?", {
      reply_markup: tecladoCarne,
    });
  });

  bot.hears("🐮 Vaca", async (ctx) => {
    await ctx.reply("A minha predileta também");
  });

  bot.hears("🍄 Eu sou vegetariano", async (ctx) => {
    await ctx.reply("Parabéns, mas eu ainda gosto de carne!");
  });

  bot.on("message:text", async (ctx) => {
    await ctx.reply("Legal!");
  });
}
