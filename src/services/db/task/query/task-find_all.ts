export const TASK_FIND_ALL_SQL = `
  SELECT
    id,
    title,
    notes,
    status,
    createdAt,
    updatedAt
  FROM tbl_task
  ORDER BY id DESC
  LIMIT 100
`;
