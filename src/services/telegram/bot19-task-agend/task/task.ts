import type { ConversationFlavor } from "@grammyjs/conversations";
import { conversations, createConversation } from "@grammyjs/conversations";
import type { Bot, Context, SessionFlavor } from "grammy";
import { session } from "grammy";
import {
  createTask,
  deleteTaskById,
  findAllTasks,
  findTaskById,
  updateTaskById,
} from "@/services/db/task/task.service";
import { invalidateTaskCache } from "@/services/db/task/task-cached.service";
import {
  addObsConversation,
  exibirTarefa,
  filterCompleted,
  filterPendingByDate,
  filterPendingWithoutDate,
  setDataConversation,
  taskListKeyboard,
} from "./services";
import { addDays, endOfToday } from "./utils";

type BotContext = Context &
  SessionFlavor<Record<string, unknown>> &
  ConversationFlavor<Context>;

export async function setupTaskHandler(bot: Bot<BotContext>): Promise<void> {
  bot.use(session({ initial: () => ({}) }));
  bot.use(conversations());
  bot.use(createConversation(setDataConversation));
  bot.use(createConversation(addObsConversation));

  bot.command("start", async (ctx) => {
    const nome = ctx.from?.first_name ?? "usuário";
    await ctx.reply(`Seja bem vindo, ${nome}!`);
  });

  bot.command("dia", async (ctx) => {
    const tarefas = await findAllTasks();
    const filtered = filterPendingByDate(tarefas, endOfToday());
    await ctx.reply("Aqui está a sua agenda do dia", {
      reply_markup: taskListKeyboard(filtered),
    });
  });

  bot.command("amanha", async (ctx) => {
    const tarefas = await findAllTasks();
    const filtered = filterPendingByDate(tarefas, addDays(new Date(), 1));
    await ctx.reply("Aqui está a sua agenda até amanhã", {
      reply_markup: taskListKeyboard(filtered),
    });
  });

  bot.command("semana", async (ctx) => {
    const tarefas = await findAllTasks();
    const filtered = filterPendingByDate(tarefas, addDays(new Date(), 7));
    await ctx.reply("Aqui está a sua agenda da semana", {
      reply_markup: taskListKeyboard(filtered),
    });
  });

  bot.command("concluidas", async (ctx) => {
    const tarefas = await findAllTasks();
    const filtered = filterCompleted(tarefas);
    await ctx.reply("Estas são as tarefas que você já concluiu", {
      reply_markup: taskListKeyboard(filtered),
    });
  });

  bot.command("tarefas", async (ctx) => {
    const tarefas = await findAllTasks();
    const filtered = filterPendingWithoutDate(tarefas);
    await ctx.reply("Estas são as tarefas sem data definida", {
      reply_markup: taskListKeyboard(filtered),
    });
  });

  bot.callbackQuery(/mostrar (.+)/, async (ctx) => {
    const id = Number(ctx.match?.[1]);
    await exibirTarefa(ctx, id);
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery(/concluir (.+)/, async (ctx) => {
    const id = Number(ctx.match?.[1]);
    const tarefa = await findTaskById(id);
    if (tarefa) {
      await updateTaskById(id, {
        descricao: tarefa.descricao,
        observacao: tarefa.observacao,
        status: tarefa.status,
        dt_conclusao: new Date(),
        dt_previsao: tarefa.dt_previsao,
      });
      invalidateTaskCache(id);
    }
    await exibirTarefa(ctx, id);
    await ctx.reply("Tarefa Concluída");
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery(/excluir (.+)/, async (ctx) => {
    const id = Number(ctx.match?.[1]);
    await deleteTaskById(id);
    invalidateTaskCache(id);
    try {
      await ctx.editMessageText("Tarefa Excluída");
    } catch {
      await ctx.reply("Tarefa Excluída");
    }
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery(/setData (.+)/, async (ctx) => {
    await ctx.conversation.enter("setDataConversation");
  });

  bot.callbackQuery(/addNota (.+)/, async (ctx) => {
    await ctx.conversation.enter("addObsConversation");
  });

  bot.on("message:text", async (ctx) => {
    const id = await createTask({ descricao: ctx.message.text });
    if (id) {
      invalidateTaskCache(id);
      await exibirTarefa(ctx, id, true);
    }
  });
}
