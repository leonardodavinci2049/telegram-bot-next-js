export const TASK_UPDATE_BY_ID_SQL = `
  UPDATE tbl_task
  SET title = ?, notes = ?, status = ?, updatedAt = NOW()
  WHERE id = ?
`;
