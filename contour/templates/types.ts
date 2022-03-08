export enum ContractVariableType {
  PRIMITIVE = "PRIMITIVE",
  MAPPING = "MAPPING",
  ARRAY = "ARRAY",
}

export interface CTMapping {
  keyType: string;
  valueType: string;
}

export interface CTArray {
  valueType: string;
}

export interface CTPrimitive {
  valueType: string;
}

export interface CTVariable {
  type: ContractVariableType;
  name: string;
  data: CTMapping | CTArray | CTPrimitive;
}

export interface ContractType {
  name: string;
  write: () => string;
}
