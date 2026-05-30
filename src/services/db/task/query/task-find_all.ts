export const TASK_FIND_ALL_SQL = `
  SELECT
    id,
    descricao,
    observacao,
    status,
    dt_conclusao,
    dt_previsao,
    createdAt
  FROM tbl_task
  ORDER BY id DESC
  LIMIT 100
`;
