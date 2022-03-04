import Function from "../base/function";
import {
  ASTNodeFactory,
  DataLocation,
  FunctionKind,
  FunctionStateMutability,
  FunctionVisibility,
  StateVariableVisibility,
} from "solc-typed-ast";
import FunctionBody from "../base/functionBody";
import Variable from "../base/variable";
import { Serializable } from "../globals/serializable";

export interface WriteParameter {
  name: string;
  type: string;
}

export default class SimpleWrite extends Serializable {
  params: WriteParameter;

  constructor(_params: WriteParameter) {
    super();
    this.params = _params;
  }

  render(factory: ASTNodeFactory) {
    const funcName = `write${
      this.params.name[0].toUpperCase() + this.params.name.substring(1)
    }`;
    const paramName = `_${this.params.name}`;

    return new Function({
      name: funcName,
      kind: FunctionKind.Function,
      isConstructor: false,
      visibility: FunctionVisibility.Public,
      mutability: FunctionStateMutability.NonPayable,
      functionParams: factory.makeParameterList([
        new Variable({
          name: paramName,
          typeName: factory.makeElementaryTypeName(
            this.params.type,
            this.params.type
          ),
          storageLocation: DataLocation.Default,
          visibility: StateVariableVisibility.Default,
        }).toNode(factory),
      ]),
      returnParams: factory.makeParameterList([]),
      modifiers: [],
      body: new FunctionBody({
        statements: [
          factory.makeExpressionStatement(
            factory.makeAssignment(
              "",
              "=",
              factory.makeIdentifier("", this.params.name, 0),
              factory.makeIdentifier("", paramName, 0)
            )
          ),
        ],
      }).toNode(factory),
    }).toNode(factory);
  }
}
