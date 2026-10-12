export type FieldDataType = '二进制' | '小端整型' | '大端整型' | '字符串';

export type FieldNumberType = 
  | '普通号' 
  | '功能号' 
  | '追踪号' 
  | '渠道号' 
  | '子渠道号' 
  | '子功能号' 
  | '统计号1' 
  | '统计号2' 
  | '统计号3' 
  | '返回码';

export interface BusinessField {
  id: string;
  name: string;
  offset: string;
  length: string;
  dataType: FieldDataType;
  numberType: FieldNumberType;
}

export interface MessagePair {
  id: string;
  requestName: string;
  responseName: string;
  requestRelOffset: string;
  relLength: string;
  requestContent: string;
  responseContent: string;
  responseRelOffset: string;
  errorCodeOffset: string;
  requestFields: BusinessField[];
  responseFields: BusinessField[];
  collapsed?: boolean;
}

export interface ErrCodeItem {
  id: string;
  name: string;
  code: string;
}

export interface TcpFixedLengthModel {
  id: string;
  name: string;
  requestOffset: string;
  requestLength: string;
  responseOffset: string;
  responseLength: string;
  errorCodeOffsetLength: string;
  useRelField: boolean;
  errCodes: ErrCodeItem[];
  messagePairs: MessagePair[];
  createdAt: string;
  enabled: boolean;
}

export interface HttpModelItem {
  id: string;
  modelId: string;
  name: string;
  method: string;
  pathRule: string;
  reqBodyParam: string;
  resBodyParam: string;
  createdAt: string;
  funcCodeCount: number;
}
