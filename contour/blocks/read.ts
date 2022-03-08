import Function from "../base/function";
import {
  ASTNodeFactory,
  DataLocation,
  FunctionCallKind,
  FunctionKind,
  FunctionStateMutability,
  FunctionVisibility,
  StateVariableVisibility,
} from "solc-typed-ast";
import FunctionBody from "../base/functionBody";
import Variable from "../base/variable";
import { Serializable } from "../globals/serializable";
import {
  ContractVariableType,
  CTMapping,
  CTVariable,
} from "../templates/types";
import { serializeVariable } from "../templates/base";

export default class ReadFunction extends Serializable {
  variable: CTVariable;

  constructor(_variable: CTVariable) {
    super();
    this.variable = _variable;
  }

  render(factory: ASTNodeFactory) {
    let funcName, paramName, variable, returnList, paramsList, statements;
    switch (this.variable.type) {
      case ContractVariableType.PRIMITIVE:
        funcName = `get${
          this.variable.name[0].toUpperCase() + this.variable.name.substring(1)
        }`;
        paramsList = [];
        variable = {
          type: ContractVariableType.PRIMITIVE,
          name: "",
          data: {
            valueType: this.variable.data.valueType,
          },
        };
        returnList = [serializeVariable(variable, factory)];
        statements = [
          factory.makeReturn(
            0,
            factory.makeIdentifier("", this.variable.name, 0)
          ),
        ];
        break;
    }

    return new Function({
      name: funcName,
      kind: FunctionKind.Function,
      isConstructor: false,
      visibility: FunctionVisibility.Public,
      mutability: FunctionStateMutability.View,
      functionParams: factory.makeParameterList(paramsList),
      returnParams: factory.makeParameterList(returnList),
      modifiers: [],
      body: new FunctionBody({
        statements: statements,
      }).toNode(factory),
    }).toNode(factory);
  }
}
