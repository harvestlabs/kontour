import { ASTNodeFactory, Statement } from "solc-typed-ast";
import {
  _ID,
  _NAME_LOCATION,
  _SRC,
  _SCOPE,
  _DOCUMENTATION,
} from "../globals/constants";
import { Serializable } from "../globals/serializable";

export interface FunctionBodyOptions {
  statements: Statement[];
}

export default class FunctionBody extends Serializable {
  options: FunctionBodyOptions;

  constructor(_options: FunctionBodyOptions) {
    super();
    this.options = _options;
  }

  toNode(factory: ASTNodeFactory) {
    return factory.makeBlock(this.options.statements);
  }
}
