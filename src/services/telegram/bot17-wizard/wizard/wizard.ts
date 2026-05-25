import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import type { Bot, Context } from "grammy";
import { InlineKeyboard } from "grammy";
import { createLogger } from "@/core/logger";

const logger = createLogger("WizardCompra");

type BotConfig = { TELEGRAM_BOT_CHATID: string | null };
type WizardContext = Context & ConversationFlavor<Context>;
type WizardBot = Bot<WizardContext>;

async function compra(
  conversation: Conversation<WizardContext, WizardContext>,
  ctx: WizardContext,
) {
  await ctx.reply("O que você comprou?");
  const stepDescricao = await conversation.waitFor("message:text");
  const descricao = stepDescricao.message.text;

  await ctx.reply("Quanto foi?");
  const stepPreco = await conversation.waitFor("message:text");
  const precoMatch = stepPreco.message.text.match(/^(\d+(?:[.,]\d+)?)$/);
  if (!precoMatch) {
    await ctx.reply("Apenas números são aceitos...");
    return;
  }
  const preco = precoMatch[1].replace(",", ".");

  await ctx.reply("É para pagar que dia?");
  const stepData = await conversation.waitFor("message:text");
  const dataMatch = stepData.message.text.match(/^(\d{2}\/\d{2}\/\d{4})$/);
  if (!dataMatch) {
    await ctx.reply("Entre com uma data no formato dd/MM/YYYY");
    return;
  }
  const data = dataMatch[1];

  const resumo =
    `Aqui está um resumo da sua compra:\n` +
    `Descrição: ${descricao}\n` +
    `Preço: ${preco}\n` +
    `Data: ${data}\n` +
    `Confirma?`;

  const teclado = new InlineKeyboard()
    .text("Sim", "wizard_comprar:sim")
    .text("Não", "wizard_comprar:nao");

  await ctx.reply(resumo, { reply_markup: teclado });

  const callback = await conversation.waitForCallbackQuery(
    /^wizard_comprar:(sim|nao)$/,
  );
  const resposta = callback.callbackQuery.data.split(":")[1];

  if (resposta === "sim") {
    await callback.answerCallbackQuery();
    await callback.reply("Compra confirmada!");
  } else {
    await callback.answerCallbackQuery();
    await callback.reply("Compra excluída!");
  }
}

export async function setupWizardHandler(
  bot: WizardBot,
  botConfig: BotConfig,
): Promise<void> {
  bot.use(conversations());
  bot.use(createConversation(compra, "compra"));

  bot.command("start", async (ctx) => {
    const configuredChatId = botConfig.TELEGRAM_BOT_CHATID;
    const currentChatId = String(ctx.chat?.id ?? "");

    if (!configuredChatId || currentChatId !== configuredChatId) {
      await ctx.reply("Sinto muito, mas eu so falo com o meu mestre");
      return;
    }

    await ctx.conversation.enter("compra");
  });

  bot.on("message", async (ctx, next) => {
    if (!ctx.message.text) {
      await next();
      return;
    }

    const configuredChatId = botConfig.TELEGRAM_BOT_CHATID;
    const currentChatId = String(ctx.chat?.id ?? "");
    const userFirstName = ctx.from?.first_name ?? "usuario";
    const userId = ctx.from?.id ?? "unknown";

    logger.info(
      `Received message from ${userFirstName} (ID: ${userId}): ${ctx.message.text}`,
    );

    if (!configuredChatId || currentChatId !== configuredChatId) {
      await ctx.reply("Sinto muito, mas eu so falo com o meu mestre");
      return;
    }

    await ctx.conversation.enter("compra");
    await next();
  });

  logger.info("Wizard handler registrado com sucesso");
}
