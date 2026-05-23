import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import type { Bot, Context } from "grammy";

type BotContext = ConversationFlavor<Context>;

async function echo(conversation: Conversation<BotContext>, ctx: Context) {
  await ctx.reply("Entrando em Echo Scene");

  while (true) {
    ctx = await conversation.wait();

    if (ctx.message?.text?.startsWith("/sair")) {
      await ctx.reply("Saindo de Echo Scene");
      return;
    }

    if (ctx.message?.text) {
      await ctx.reply(ctx.message.text);
    } else {
      await ctx.reply("Apenas mensagens de texto, por favor");
    }
  }
}

async function sum(conversation: Conversation<BotContext>, ctx: Context) {
  await ctx.reply("Entrando em Sum Scene");

  let total = 0;

  while (true) {
    await ctx.reply(
      "Você está em Soma Scene, escreva números para somar\nOutros comandos: /zerar /sair",
    );
    ctx = await conversation.wait();

    const text = ctx.message?.text;

    if (text?.startsWith("/sair")) {
      await ctx.reply("Saindo de Sum Scene");
      return;
    }

    if (text?.startsWith("/zerar")) {
      total = 0;
      await ctx.reply(`Valor: ${total}`);
      continue;
    }

    if (text) {
      const match = text.match(/(\d+)/);
      if (match) {
        total += Number.parseInt(match[1], 10);
        await ctx.reply(`Valor: ${total}`);
      } else {
        await ctx.reply("Apenas números, por favor");
      }
    } else {
      await ctx.reply("Apenas números, por favor");
    }
  }
}

export async function setupSceneHandler(bot: Bot<BotContext>) {
  bot.use(conversations());

  bot.use(createConversation(echo));
  bot.use(createConversation(sum));

  bot.command("start", async (ctx) => {
    const name = ctx.from?.first_name ?? "Usuário";
    await ctx.reply(`Seja bem vindo, ${name}!`);
    await ctx.reply("Entre com /echo ou /soma para iniciar...");
  });

  bot.command("echo", async (ctx) => {
    await ctx.conversation.enter("echo");
  });

  bot.command("soma", async (ctx) => {
    await ctx.conversation.enter("sum");
  });

  bot.on("message", async (ctx) => {
    await ctx.reply("Entre com /echo ou /soma para iniciar...");
  });
}
