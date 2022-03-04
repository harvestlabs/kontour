import { ASTNodeFactory, ContractKind } from "solc-typed-ast";
import { _SCOPE } from "../globals/constants";
import { Serializable } from "../globals/serializable";

export interface ContractOptions {
  constant?: boolean;
  indexed?: boolean;
  name: string;
  kind: ContractKind;
  stateVariable?: boolean;
  abstract?: boolean;
  fullyImplemented?: boolean;
}

export default class Contract extends Serializable {
  options: ContractOptions;

  constructor(_options: ContractOptions) {
    super();
    this.options = _options;
  }

  toNode(factory: ASTNodeFactory) {
    return factory.makeContractDefinition(
      this.options.name,
      _SCOPE,
      this.options.kind,
      this.options.abstract,
      this.options.fullyImplemented,
      [],
      []
    );
  }
}
