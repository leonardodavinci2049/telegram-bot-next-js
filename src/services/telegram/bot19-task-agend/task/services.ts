import type { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import type { Context } from "grammy";
import { findTaskById, updateTaskById } from "@/services/db/task/task.service";
import { invalidateTaskCache } from "@/services/db/task/task-cached.service";
import type { TaskRow } from "@/services/db/task/types/task-find.type";
import { formatDate, parseDateInput } from "./utils";

type BotContext = Context & ConversationFlavor<Context>;

export function taskDetailMessage(tarefa: TaskRow): string {
  const conclusao = tarefa.dt_conclusao
    ? `\n<b>Concluída em:</b> ${formatDate(tarefa.dt_conclusao)}`
    : "";

  return `<b>${tarefa.descricao}</b>\n<b>Previsão:</b> ${formatDate(tarefa.dt_previsao)}${conclusao}\n<b>Observações:</b>\n${tarefa.observacao || ""}`;
}

export function taskDetailKeyboard(id: number) {
  return {
    inline_keyboard: [
      [
        { text: "✔️", callback_data: `concluir ${id}` },
        { text: "📅", callback_data: `setData ${id}` },
        { text: "💬", callback_data: `addNota ${id}` },
        { text: "✖️", callback_data: `excluir ${id}` },
      ],
    ],
  };
}

export function taskListKeyboard(tarefas: TaskRow[]) {
  return {
    inline_keyboard: tarefas.map((item) => {
      const prefix = item.dt_previsao
        ? `${formatDate(item.dt_previsao)} - `
        : "";
      return [
        {
          text: `${prefix}${item.descricao}`,
          callback_data: `mostrar ${item.id}`,
        },
      ];
    }),
  };
}

export async function exibirTarefa(
  ctx: Context,
  taskId: number,
  novaMsg = false,
) {
  const tarefa = await findTaskById(taskId);
  if (!tarefa) {
    await ctx.reply("Tarefa não encontrada");
    return;
  }

  const msg = taskDetailMessage(tarefa);
  const replyMarkup = taskDetailKeyboard(taskId);

  if (novaMsg) {
    await ctx.reply(msg, { parse_mode: "HTML", reply_markup: replyMarkup });
  } else {
    try {
      await ctx.editMessageText(msg, {
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      });
    } catch {
      await ctx.reply(msg, { parse_mode: "HTML", reply_markup: replyMarkup });
    }
  }
}

export function filterPendingByDate(
  tarefas: TaskRow[],
  limite: Date,
): TaskRow[] {
  return tarefas
    .filter(
      (t) =>
        t.dt_conclusao === null &&
        t.dt_previsao !== null &&
        new Date(t.dt_previsao) <= limite,
    )
    .sort((a, b) => {
      const dateA = a.dt_previsao ? new Date(a.dt_previsao).getTime() : 0;
      const dateB = b.dt_previsao ? new Date(b.dt_previsao).getTime() : 0;
      return (
        dateA - dateB || (a.descricao ?? "").localeCompare(b.descricao ?? "")
      );
    });
}

export function filterPendingWithoutDate(tarefas: TaskRow[]): TaskRow[] {
  return tarefas
    .filter((t) => t.dt_previsao === null && t.dt_conclusao === null)
    .sort((a, b) => (a.descricao ?? "").localeCompare(b.descricao ?? ""));
}

export function filterCompleted(tarefas: TaskRow[]): TaskRow[] {
  return tarefas
    .filter((t) => t.dt_conclusao !== null)
    .sort((a, b) => {
      const dateA = a.dt_previsao ? new Date(a.dt_previsao).getTime() : 0;
      const dateB = b.dt_previsao ? new Date(b.dt_previsao).getTime() : 0;
      return (
        dateA - dateB || (a.descricao ?? "").localeCompare(b.descricao ?? "")
      );
    });
}

export async function setDataConversation(
  conversation: Conversation<Context, BotContext>,
  ctx: BotContext,
) {
  const taskId = Number(ctx.callbackQuery?.data?.split(" ")[1]);
  if (!taskId) return;

  await ctx.reply("Gostaria de definir alguma data?", {
    reply_markup: {
      keyboard: [
        ["Hoje", "Amanhã"],
        ["1 Semana", "1 Mês"],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });

  const response = await conversation.wait();
  const text = response.message?.text;
  if (!text) {
    await ctx.reply("Operação cancelada.", {
      reply_markup: { remove_keyboard: true },
    });
    return;
  }

  const data = parseDateInput(text);
  if (!data) {
    await ctx.reply(
      "Padrões aceitos:\ndd/MM/YYYY\nX dias\nX semanas\nX meses",
      { reply_markup: { remove_keyboard: true } },
    );
    return;
  }

  const tarefa = await findTaskById(taskId);
  if (!tarefa) return;

  await updateTaskById(taskId, {
    descricao: tarefa.descricao,
    observacao: tarefa.observacao,
    status: tarefa.status,
    dt_conclusao: tarefa.dt_conclusao,
    dt_previsao: data,
  });
  invalidateTaskCache(taskId);

  await ctx.reply("Data atualizada!", {
    reply_markup: { remove_keyboard: true },
  });
  await exibirTarefa(ctx, taskId, true);
}

export async function addObsConversation(
  conversation: Conversation<Context, BotContext>,
  ctx: BotContext,
) {
  const taskId = Number(ctx.callbackQuery?.data?.split(" ")[1]);
  if (!taskId) return;

  await ctx.reply("Já pode adicionar suas anotações...");

  const response = await conversation.wait();
  const text = response.message?.text;
  if (!text) {
    await ctx.reply("Apenas observações em texto são aceitas");
    return;
  }

  const tarefa = await findTaskById(taskId);
  if (!tarefa) return;

  const obs = tarefa.observacao ? `${tarefa.observacao}\n---\n${text}` : text;

  await updateTaskById(taskId, {
    descricao: tarefa.descricao,
    observacao: obs,
    status: tarefa.status,
    dt_conclusao: tarefa.dt_conclusao,
    dt_previsao: tarefa.dt_previsao,
  });
  invalidateTaskCache(taskId);

  await ctx.reply("Observação adicionada!");
  await exibirTarefa(ctx, taskId, true);
}
