import type { RowDataPacket } from "mysql2/promise";

export type TaskRow = RowDataPacket & {
  id: number;
  descricao: string | null;
  observacao: string | null;
  status: string | null;
  dt_conclusao: Date | null;
  dt_previsao: Date | null;
  createdAt: Date | null;
};
