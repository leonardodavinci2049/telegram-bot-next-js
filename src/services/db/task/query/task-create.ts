export const TASK_CREATE_SQL = `
  INSERT INTO tbl_task (title, notes, status)
  VALUES (?, ?, ?)
`;
