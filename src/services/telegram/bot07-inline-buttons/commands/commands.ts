import type { Bot } from "grammy";

export async function setupCommandsHandler(bot: Bot): Promise<void> {
  bot.command("start", async (ctx) => {
    const nome = ctx.from?.first_name || "Usuário";
    await ctx.reply(`Seja bem vindo, ${nome}!\nAvise se precisar de /ajuda`);
  });

  bot.command("ajuda", async (ctx) => {
    await ctx.reply(
      "/ajuda: vou mostrar as opções\n" +
        "/ajuda2: para testar via hears\n" +
        "/op2: Opção genérica\n" +
        "/op3: Outra opção genérica qualquer",
    );
  });

  bot.hears("/ajuda2", async (ctx) => {
    await ctx.reply(
      "Eu também consigo capturar comandos, mas utilize a /ajuda mesmo",
    );
  });

  bot.hears(/\/op(2|3)/i, async (ctx) => {
    await ctx.reply("Resposta padrão para comandos genéricos");
  });
}
