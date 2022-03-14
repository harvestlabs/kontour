type ContractSourceFunction = {
  inputs: ContractSourceValue[];
  name: string;
  outputs: ContractSourceValue[];
  stateMutability: "pure" | "view" | "nonpayable" | "payable";
  type: "function";
};

type ContractSourceValue = {
  indexed: bool;
  internalType: string;
  name: string;
  type: string;
};

type ContractSourceEvent = {
  anonymous: boolean;
  inputs: ContractSourceValue[];
  name: string;
  type: "event";
};

type ContractSourceConstructor = {
  inputs: ContractSourceValue[];
  stateMutability: string;
  type: "constructor";
} | null;
