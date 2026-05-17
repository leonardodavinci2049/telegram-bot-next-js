import { Bot } from "grammy";

export async function setupHearsHandler(bot: Bot): Promise<void> {
  // só responde no chat se o texto for exatamente "pizza"
  bot.hears("pizza", async (ctx) => {
    await ctx.reply("Quero!");
  });

  // só responde no chat se o texto for exatamente "fígado" ou "chuchu"
  bot.hears(["fígado", "chuchu"], async (ctx) => {
    await ctx.reply("Passo!");
  });

  // só responde no chat se o texto for exatamente "🐷"
  bot.hears("🐷", async (ctx) => {
    await ctx.reply("Bacon 😋");
  });

  // só responde no chat se o texto for exatamente "burguer" ou "Burguer" ou "BURGUER" etc
  bot.hears(/burguer/i, async (ctx) => {
    await ctx.reply("Quero!");
  });

  // só responde no chat se o texto for exatamente "brocolis" ou "Brocolis" ou "BROCOLIS" etc ou "salada" ou "Salada" ou "SALADA" etc
  bot.hears([/brocolis/i, /salada/i], async (ctx) => {
    await ctx.reply("Passo!");
  });

  // só responde no chat se o texto for exatamente "dd/mm/aaaa"
  bot.hears(/(\d{2}\/\d{2}\/\d{4})/, async (ctx) => {
    const match = ctx.match;
    if (!match || typeof match === "string") return;

    const dateString = match[1];
    if (!dateString) return;

    const [day, month, year] = dateString.split("/");
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    // Validar se a data é válida
    if (isNaN(date.getTime())) {
      await ctx.reply("Data inválida fornecida.");
      return;
    }
    // Formata a data para obter o dia da semana em português
    const weekday = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
    }).format(date);

    // Envia a mensagem de resposta
    await ctx.reply(`${dateString} cai em ${weekday}`);
  });
}
