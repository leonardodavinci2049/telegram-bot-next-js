import { Bot, Context, InlineKeyboard } from "grammy";

// Armazenamento em memória: chatId -> lista de itens
// Cada chat (grupo ou conversa) tem sua própria lista independente
const listasporChat = new Map<number, string[]>();

function getListaDoChat(chatId: number): string[] {
  if (!listasporChat.has(chatId)) {
    listasporChat.set(chatId, []);
  }
  return listasporChat.get(chatId) as string[];
}

function gerarBotoes(lista: string[]): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  lista.forEach((item, index) => {
    keyboard.text(item, `grp_delete ${item}`);
    // Pula para a próxima linha a cada 3 itens
    if ((index + 1) % 3 === 0) {
      keyboard.row();
    }
  });
  return keyboard;
}

export async function setupGroupShoppingListHandler(bot: Bot<Context>) {
  bot.command("start", async (ctx) => {
    const name = ctx.from?.first_name || "Usuário";
    const chatId = ctx.chat?.id;

    // Reseta a lista do chat ao iniciar
    if (chatId !== undefined) {
      listasporChat.set(chatId, []);
    }

    await ctx.reply(`Seja bem vindo, ${name}!`);
    await ctx.reply("Escreva os itens que você deseja adicionar...");
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;
    const chatId = ctx.chat.id;

    // Evita processar comandos como texto comum da lista
    if (text.startsWith("/")) return;

    // O callback_data do Telegram tem limite de 64 bytes.
    // O prefixo "grp_delete " ocupa 11 bytes, restando 53 para o texto do item.
    const MAX_ITEM_BYTES = 53;
    if (Buffer.byteLength(text, "utf8") > MAX_ITEM_BYTES) {
      await ctx.reply(
        "⚠️ Ops, o texto enviado não é válido para uma lista de compras. Tente um texto mais curto.",
      );
      return;
    }

    const lista = getListaDoChat(chatId);
    lista.push(text);

    await ctx.reply(`${text} adicionado!`, {
      reply_markup: gerarBotoes(lista),
    });
  });

  bot.callbackQuery(/grp_delete (.+)/, async (ctx) => {
    if (!ctx.match) return;

    const chatId = ctx.chat?.id;
    if (chatId === undefined) return;

    const itemToDelete = ctx.match[1];
    const lista = getListaDoChat(chatId);
    const indice = lista.indexOf(itemToDelete);

    if (indice >= 0) {
      lista.splice(indice, 1);
    }

    await ctx.reply(`${itemToDelete} deletado!`, {
      reply_markup: gerarBotoes(lista),
    });
    await ctx.answerCallbackQuery();
  });
}
