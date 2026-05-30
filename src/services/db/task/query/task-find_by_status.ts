export const TASK_FIND_BY_STATUS_SQL = `
  SELECT
    id,
    title,
    notes,
    status,
    createdAt,
    updatedAt
  FROM tbl_task
  WHERE status = ?
  ORDER BY id DESC
  LIMIT 100
`;
