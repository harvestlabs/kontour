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

export default class SimpleWrite extends Serializable {
  variable: CTVariable;

  constructor(_variable: CTVariable) {
    super();
    this.variable = _variable;
  }

  render(factory: ASTNodeFactory) {
    let funcName, paramName, variable, paramsList, statements;
    switch (this.variable.type) {
      case ContractVariableType.PRIMITIVE:
        funcName = `write${
          this.variable.name[0].toUpperCase() + this.variable.name.substring(1)
        }`;
        paramName = `_${this.variable.name}`;
        variable = {
          type: ContractVariableType.PRIMITIVE,
          name: paramName,
          data: {
            valueType: this.variable.data.valueType,
          },
        };
        paramsList = [serializeVariable(variable, factory)];
        statements = [
          factory.makeExpressionStatement(
            factory.makeAssignment(
              "",
              "=",
              factory.makeIdentifier("", this.variable.name, 0),
              factory.makeIdentifier("", paramName, 0)
            )
          ),
        ];
        break;
      case ContractVariableType.ARRAY:
        funcName = `appendTo${
          this.variable.name[0].toUpperCase() + this.variable.name.substring(1)
        }`;
        paramName = `_element`;
        variable = {
          type: ContractVariableType.PRIMITIVE,
          name: paramName,
          data: {
            valueType: this.variable.data.valueType,
          },
        };
        paramsList = [serializeVariable(variable, factory)];
        statements = [
          factory.makeExpressionStatement(
            factory.makeFunctionCall(
              "",
              FunctionCallKind.FunctionCall,
              factory.makeMemberAccess(
                "",
                factory.makeIdentifier("", this.variable.name, 0),
                "push",
                0
              ),
              [factory.makeIdentifier("", paramName, 0)]
            )
          ),
        ];
        break;
      case ContractVariableType.MAPPING:
        const data = this.variable.data as CTMapping;
        funcName = `set${
          this.variable.name[0].toUpperCase() + this.variable.name.substring(1)
        }`;
        const keyParamName = `_key`;
        const valParamName = `_val`;
        const keyVariable = {
          type: ContractVariableType.PRIMITIVE,
          name: keyParamName,
          data: {
            valueType: data.keyType,
          },
        };
        const valueVariable = {
          type: ContractVariableType.PRIMITIVE,
          name: valParamName,
          data: {
            valueType: data.valueType,
          },
        };
        paramsList = [
          serializeVariable(keyVariable, factory),
          serializeVariable(valueVariable, factory),
        ];
        statements = [
          factory.makeExpressionStatement(
            factory.makeAssignment(
              "",
              "=",
              factory.makeIndexAccess(
                "",
                factory.makeIdentifier("", this.variable.name, 0),
                factory.makeIdentifier("", keyParamName, 0),
                0
              ),
              factory.makeIdentifier("", valParamName, 0)
            )
          ),
        ];
        break;
    }

    return new Function({
      name: funcName,
      kind: FunctionKind.Function,
      isConstructor: false,
      visibility: FunctionVisibility.Public,
      mutability: FunctionStateMutability.NonPayable,
      functionParams: factory.makeParameterList(paramsList),
      returnParams: factory.makeParameterList([]),
      modifiers: [],
      body: new FunctionBody({
        statements: statements,
      }).toNode(factory),
    }).toNode(factory);
  }
}
