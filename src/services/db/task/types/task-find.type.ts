import type { RowDataPacket } from "mysql2/promise";

export type TaskRow = RowDataPacket & {
  id: number;
  title: string | null;
  notes: string | null;
  status: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};
