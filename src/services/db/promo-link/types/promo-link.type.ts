import type { RowDataPacket } from "mysql2";

export interface SpDefaultFeedback extends RowDataPacket {
  sp_return_id: string;
  sp_message: string;
  sp_error_id: number;
}

export interface SpOperationResult {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}

export interface TblPromoLinkRecord extends RowDataPacket {
  ID: number;
  LINK_NAME1?: string | null;
  LINK_NAME2?: string | null;
  LINK_NAME3?: string | null;
  LINK1?: string | null;
  LINK2?: string | null;
  LINK3?: string | null;
  NOTES?: string | null;
  CREATEDAT?: Date | null;
  UPDATEDAT?: Date | null;
}

export interface TblPromoLinkLatestTypeRecord extends RowDataPacket {
  LINK_ID_TYPE1: number;
  LINK1_TYPE1?: string | null;
  LINK2_TYPE1?: string | null;
  LINK3_TYPE1?: string | null;
  LINK_ID_TYPE2: number;
  LINK1_TYPE2?: string | null;
  LINK2_TYPE2?: string | null;
  LINK3_TYPE2?: string | null;
}

export type SpResultRecordCreateType = [SpDefaultFeedback[], SpOperationResult];
export type SpResultRecordPromoLinkFindAllType = [
  TblPromoLinkRecord[],
  SpDefaultFeedback[],
  SpOperationResult,
];
export type SpResultRecordPromoLinkFindLatestIdType = [
  TblPromoLinkRecord[],
  SpDefaultFeedback[],
  SpOperationResult,
];
export type SpResultRecordPromoLinkFindLatestTypeType = [
  TblPromoLinkLatestTypeRecord[],
  SpDefaultFeedback[],
  SpOperationResult,
];
