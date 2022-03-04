import { ASTNodeFactory, Expression, Statement } from "solc-typed-ast";
import {
  _ID,
  _NAME_LOCATION,
  _SRC,
  _SCOPE,
  _DOCUMENTATION,
} from "../globals/constants";
import { Serializable } from "../globals/serializable";

export interface ConditionalOptions {
  condition: Expression;
  trueEval: Statement;
  falseEval?: Statement;
}

export default class Conditional extends Serializable {
  options: ConditionalOptions;

  constructor(_options: ConditionalOptions) {
    super();
    this.options = _options;
  }

  toNode(factory: ASTNodeFactory) {
    return factory.makeIfStatement(
      this.options.condition,
      this.options.trueEval,
      this.options.falseEval
    );
  }
}
