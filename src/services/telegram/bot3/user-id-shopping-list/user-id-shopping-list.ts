import {
  Bot,
  Context,
  NextFunction,
  session,
  SessionFlavor,
  InlineKeyboard,
} from "grammy";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface SessionData {
  lista: string[];
}

export type UserIdShoppingListContext = Context & SessionFlavor<SessionData>;

export type BotConfig = {
  /** ID do chat autorizado, persistido no banco (TELEGRAM_BOT_CHATID) */
  TELEGRAM_BOT_CHATID: string | null;
};

// ---------------------------------------------------------------------------
// Helper: teclado inline com os itens da lista (grid de 3 colunas)
// ---------------------------------------------------------------------------

function gerarBotoes(lista: string[]): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  lista.forEach((item, index) => {
    keyboard.text(item, `mw_delete ${item}`);
    if ((index + 1) % 3 === 0) keyboard.row();
  });
  return keyboard;
}

// ---------------------------------------------------------------------------
// Middleware 1: verificarUsuario
// Compara o ID do remetente (mensagem ou callback) com o ID persistido no banco.
// Se não bater, rejeita a conversa imediatamente.
// ---------------------------------------------------------------------------

function criarMiddlewareVerificarUsuario(authorizedChatId: string | null) {
  return async (
    ctx: UserIdShoppingListContext,
    next: NextFunction,
  ): Promise<void> => {
    if (!authorizedChatId) {
      await ctx.reply("⚠️ Bot não configurado. Contate o administrador.");
      return;
    }

    const fromId =
      ctx.message?.from?.id ?? ctx.callbackQuery?.from?.id ?? null;

    const currentId = String(fromId ?? "");

    if (currentId !== authorizedChatId) {
      await ctx.reply(
        "Desculpe, não fui autorizado a conversar com você...",
      );
      return;
    }

    await next();
  };
}

// ---------------------------------------------------------------------------
// Middleware 2: processando
// Envia uma mensagem de feedback antes de prosseguir para o handler.
// ---------------------------------------------------------------------------

async function middlewareProcessando(
  ctx: UserIdShoppingListContext,
  next: NextFunction,
): Promise<void> {
  await ctx.reply("⏳ processando...");
  await next();
}

// ---------------------------------------------------------------------------
// Handler principal
// ---------------------------------------------------------------------------

export async function setupUserIdShoppingListHandler(
  bot: Bot<UserIdShoppingListContext>,
  botConfig: BotConfig,
): Promise<void> {
  // Sessão por usuário (chave padrão: chat.id)
  bot.use(
    session({
      initial: (): SessionData => ({ lista: [] }),
    }),
  );

  const verificarUsuario = criarMiddlewareVerificarUsuario(
    botConfig.TELEGRAM_BOT_CHATID,
  );

  // /start — reseta a lista e saúda o usuário autorizado
  bot.command("start", verificarUsuario, async (ctx) => {
    const name = ctx.from?.first_name ?? "Usuário";
    ctx.session.lista = [];
    await ctx.reply(`Seja bem vindo, ${name}!`);
    await ctx.reply("Escreva os itens que você deseja adicionar...");
  });

  // Texto livre — passa pelos dois middlewares antes de adicionar o item
  bot.on(
    "message:text",
    verificarUsuario,
    middlewareProcessando,
    async (ctx) => {
      const text = ctx.message.text;

      // Ignora comandos
      if (text.startsWith("/")) return;

      // Limite de bytes do callback_data (64 bytes total, prefixo "mw_delete " = 10 bytes)
      const MAX_ITEM_BYTES = 54;
      if (Buffer.byteLength(text, "utf8") > MAX_ITEM_BYTES) {
        await ctx.reply(
          "⚠️ Texto muito longo para a lista. Tente um texto mais curto.",
        );
        return;
      }

      ctx.session.lista.push(text);
      await ctx.reply(`✅ ${text} adicionado!`, {
        reply_markup: gerarBotoes(ctx.session.lista),
      });
    },
  );

  // Callback de remoção — apenas verifica o usuário (sem "processando...")
  bot.callbackQuery(/mw_delete (.+)/, verificarUsuario, async (ctx) => {
    if (!ctx.match) return;

    const itemToDelete = ctx.match[1];
    ctx.session.lista = ctx.session.lista.filter(
      (item) => item !== itemToDelete,
    );

    await ctx.reply(`🗑️ ${itemToDelete} deletado!`, {
      reply_markup: gerarBotoes(ctx.session.lista),
    });
    await ctx.answerCallbackQuery();
  });
}
