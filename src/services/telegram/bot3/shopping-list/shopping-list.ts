import { Bot, InlineKeyboard } from "grammy";

let lista: string[] = [];

function gerarBotoes() {
  const keyboard = new InlineKeyboard();
  lista.forEach((item, index) => {
    keyboard.text(item, `delete ${item}`);
    // O exemplo original usava { columns: 3 }
    // No grammy podemos pular para a próxima linha a cada 3 itens
    if ((index + 1) % 3 === 0) {
      keyboard.row();
    }
  });
  return keyboard;
}

export async function setupShoppingListHandler(bot: Bot) {
  bot.command("start", async (ctx) => {
    const name = ctx.from?.first_name || "Usuário";
    await ctx.reply(`Seja bem vindo, ${name}!`);
    await ctx.reply("Escreva os itens que você deseja adicionar...");
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;

    // Evita processar comandos como texto comum da lista
    if (text.startsWith("/")) return;

    lista.push(text);
    await ctx.reply(`${text} adicionado!`, { reply_markup: gerarBotoes() });
  });

  bot.callbackQuery(/delete (.+)/, async (ctx) => {
    if (!ctx.match) return;

    const itemToDelete = ctx.match[1];
    lista = lista.filter((item) => item !== itemToDelete);

    await ctx.reply(`${itemToDelete} deletado!`, {
      reply_markup: gerarBotoes(),
    });
    await ctx.answerCallbackQuery();
  });
}
