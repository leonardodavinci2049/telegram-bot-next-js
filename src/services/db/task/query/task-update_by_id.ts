export const TASK_UPDATE_BY_ID_SQL = `
  UPDATE tbl_task
  SET descricao = ?, observacao = ?, status = ?, dt_conclusao = ?, dt_previsao = ?
  WHERE id = ?
`;
