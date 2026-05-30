export const TASK_CREATE_SQL = `
  INSERT INTO tbl_task (descricao, observacao, status, dt_conclusao, dt_previsao)
  VALUES (?, ?, ?, ?, ?)
`;
