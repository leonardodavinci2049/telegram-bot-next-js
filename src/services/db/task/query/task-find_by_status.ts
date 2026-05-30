export const TASK_FIND_BY_STATUS_SQL = `
  SELECT
    id,
    descricao,
    observacao,
    status,
    dt_conclusao,
    dt_previsao,
    createdAt
  FROM tbl_task
  WHERE status = ?
  ORDER BY id DESC
  LIMIT 100
`;
