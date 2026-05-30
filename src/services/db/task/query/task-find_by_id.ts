export const TASK_FIND_BY_ID_SQL = `
  SELECT
    id,
    title,
    notes,
    status,
    createdAt,
    updatedAt
  FROM tbl_task
  WHERE id = ?
  LIMIT 1
`;
