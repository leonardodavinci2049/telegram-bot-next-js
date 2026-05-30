import "server-only";

import dbService from "@/database/dbConnection";
import { TASK_CREATE_SQL } from "./query/task-create";
import { TASK_DELETE_BY_ID_SQL } from "./query/task-delete_by_id";
import { TASK_FIND_ALL_SQL } from "./query/task-find_all";
import { TASK_FIND_BY_ID_SQL } from "./query/task-find_by_id";
import { TASK_FIND_BY_STATUS_SQL } from "./query/task-find_by_status";
import { TASK_UPDATE_BY_ID_SQL } from "./query/task-update_by_id";
import type { TaskRow } from "./types/task-find.type";

type TaskCreateInput = {
  descricao?: string | null;
  observacao?: string | null;
  status?: string | null;
  dt_conclusao?: Date | null;
  dt_previsao?: Date | null;
};

type TaskUpdateInput = {
  descricao?: string | null;
  observacao?: string | null;
  status?: string | null;
  dt_conclusao?: Date | null;
  dt_previsao?: Date | null;
};

export async function createTask(
  input: TaskCreateInput,
): Promise<number | null> {
  const result = await dbService.modifyExecute(TASK_CREATE_SQL, [
    input.descricao ?? null,
    input.observacao ?? null,
    input.status ?? null,
    input.dt_conclusao ?? null,
    input.dt_previsao ?? null,
  ]);

  return result.insertId > 0 ? result.insertId : null;
}

export async function findTaskById(id: number): Promise<TaskRow | null> {
  const rows = await dbService.selectExecute<TaskRow>(TASK_FIND_BY_ID_SQL, [
    id,
  ]);

  return rows[0] ?? null;
}

export async function findTasksByStatus(status: string): Promise<TaskRow[]> {
  return dbService.selectExecute<TaskRow>(TASK_FIND_BY_STATUS_SQL, [status]);
}

export async function findAllTasks(): Promise<TaskRow[]> {
  return dbService.selectExecute<TaskRow>(TASK_FIND_ALL_SQL);
}

export async function updateTaskById(
  id: number,
  input: TaskUpdateInput,
): Promise<boolean> {
  const result = await dbService.modifyExecute(TASK_UPDATE_BY_ID_SQL, [
    input.descricao ?? null,
    input.observacao ?? null,
    input.status ?? null,
    input.dt_conclusao ?? null,
    input.dt_previsao ?? null,
    id,
  ]);

  return result.affectedRows > 0;
}

export async function deleteTaskById(id: number): Promise<boolean> {
  const result = await dbService.modifyExecute(TASK_DELETE_BY_ID_SQL, [id]);

  return result.affectedRows > 0;
}
