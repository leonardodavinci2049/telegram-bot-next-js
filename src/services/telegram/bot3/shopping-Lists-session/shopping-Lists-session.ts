import { Bot, Context, session, SessionFlavor, InlineKeyboard } from "grammy";

// 1. Definindo a interface com os dados que queremos armazenar na sessão
interface SessionData {
  lista: string[];
}

// 2. Criando um tipo de contexto customizado que inclui a nossa sessão
export type MyContext = Context & SessionFlavor<SessionData>;

function botoes(lista: string[]) {
  const keyboard = new InlineKeyboard();
  lista.forEach((item, index) => {
    keyboard.text(item, `delete ${item}`);
    // Pula para a próxima linha a cada 3 itens
    if ((index + 1) % 3 === 0) {
      keyboard.row();
    }
  });
  return keyboard;
}

export async function setupShoppingListsSessionHandler(bot: Bot<MyContext>) {
  // 3. Registrando o middleware de sessão com valor inicial
  bot.use(
    session({
      initial: (): SessionData => ({ lista: [] }),
    }),
  );

  bot.command("start", async (ctx) => {
    const name = ctx.from?.first_name || "Usuário";
    await ctx.reply(`Seja bem vindo, ${name}!`);
    await ctx.reply("Escreva os itens que você deseja adicionar...");

    // Reseta a lista ao iniciar o bot
    ctx.session.lista = [];
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;

    // Evita processar comandos como texto comum da lista
    if (text.startsWith("/")) return;

    // O callback_data do Telegram tem limite de 64 bytes.
    // O prefixo "delete " ocupa 7 bytes, restando 57 para o texto do item.
    const MAX_ITEM_BYTES = 57;
    if (Buffer.byteLength(text, "utf8") > MAX_ITEM_BYTES) {
      await ctx.reply(
        "⚠️ Ops, o texto enviado não é válido para uma lista de compras. Tente um texto mais curto.",
      );
      return;
    }

    ctx.session.lista.push(text);
    await ctx.reply(`${text} adicionado!`, {
      reply_markup: botoes(ctx.session.lista),
    });
  });

  bot.callbackQuery(/delete (.+)/, async (ctx) => {
    if (!ctx.match) return;

    const itemToDelete = ctx.match[1];
    ctx.session.lista = ctx.session.lista.filter(
      (item) => item !== itemToDelete,
    );

    await ctx.reply(`${itemToDelete} deletado!`, {
      reply_markup: botoes(ctx.session.lista),
    });
    await ctx.answerCallbackQuery();
  });
}
