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
import { Serializable } from "../globals/serializable";
import { CTVariable } from "../templates/types";
import { serializeVariable } from "../templates/base";

export default class Constructor extends Serializable {
  params: CTVariable[];

  constructor(_params: CTVariable[]) {
    super();
    this.params = _params;
  }

  render(factory: ASTNodeFactory) {
    return new Function({
      name: "constructor",
      kind: FunctionKind.Constructor,
      isConstructor: true,
      visibility: FunctionVisibility.Public,
      mutability: FunctionStateMutability.NonPayable,
      functionParams: factory.makeParameterList(
        this.params.map((p) => serializeVariable(p, factory))
      ),
      returnParams: factory.makeParameterList([]),
      modifiers: [],
      body: new FunctionBody({
        statements: this.params.map((p) => {
          const paramName = `_${p.name}`;
          return factory.makeExpressionStatement(
            factory.makeAssignment(
              "",
              "=",
              factory.makeIdentifier("", p.name, 0),
              factory.makeIdentifier("", paramName, 0)
            )
          );
        }),
      }).toNode(factory),
    }).toNode(factory);
  }
}
