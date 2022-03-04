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

export interface ConstructorParameter {
  name: string;
  type: string;
}

export default class Constructor extends Serializable {
  params: ConstructorParameter[];

  constructor(_params: ConstructorParameter[]) {
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
        this.params.map((p) => {
          return new Variable({
            name: p.name,
            typeName: factory.makeElementaryTypeName(p.type, p.type),
            storageLocation: DataLocation.Default,
            visibility: StateVariableVisibility.Default,
          }).toNode(factory);
        })
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
