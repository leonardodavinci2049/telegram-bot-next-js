import "server-only";

import { createLogger } from "@/core/logger";
import { findAllTasks, findTaskById, findTasksByStatus } from "./task.service";
import type { TaskRow } from "./types/task-find.type";

const logger = createLogger("TaskCachedService");

const CACHE_TTL_MS = 60_000;

type CacheEntry<T> = {
  data: T;
  cachedAt: number;
};

const taskByIdCache = new Map<number, CacheEntry<TaskRow | null>>();
const taskByStatusCache = new Map<string, CacheEntry<TaskRow[]>>();
const allTasksCache: { entry: CacheEntry<TaskRow[]> | null } = { entry: null };

function isExpired(cachedAt: number): boolean {
  return Date.now() - cachedAt > CACHE_TTL_MS;
}

export async function getCachedTaskById(id: number): Promise<TaskRow | null> {
  const cached = taskByIdCache.get(id);
  if (cached && !isExpired(cached.cachedAt)) {
    return cached.data;
  }

  const data = await findTaskById(id);
  taskByIdCache.set(id, { data, cachedAt: Date.now() });

  return data;
}

export async function getCachedTasksByStatus(
  status: string,
): Promise<TaskRow[]> {
  const cached = taskByStatusCache.get(status);
  if (cached && !isExpired(cached.cachedAt)) {
    return cached.data;
  }

  const data = await findTasksByStatus(status);
  taskByStatusCache.set(status, { data, cachedAt: Date.now() });

  return data;
}

export async function getCachedAllTasks(): Promise<TaskRow[]> {
  if (allTasksCache.entry && !isExpired(allTasksCache.entry.cachedAt)) {
    return allTasksCache.entry.data;
  }

  const data = await findAllTasks();
  allTasksCache.entry = { data, cachedAt: Date.now() };

  return data;
}

export function invalidateTaskCache(id?: number, status?: string): void {
  if (id !== undefined) {
    taskByIdCache.delete(id);
  }
  if (status !== undefined) {
    taskByStatusCache.delete(status);
  }
  allTasksCache.entry = null;

  logger.debug("Cache de tarefas invalidado", { id, status });
}
