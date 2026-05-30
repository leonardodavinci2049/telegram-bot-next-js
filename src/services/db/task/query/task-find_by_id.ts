export const TASK_FIND_BY_ID_SQL = `
  SELECT
    id,
    descricao,
    observacao,
    status,
    dt_conclusao,
    dt_previsao,
    createdAt
  FROM tbl_task
  WHERE id = ?
  LIMIT 1
`;
