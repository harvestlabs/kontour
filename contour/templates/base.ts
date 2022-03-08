import {
  ASTNodeFactory,
  DataLocation,
  StateVariableVisibility,
} from "solc-typed-ast";
import Variable from "../base/variable";
import { ContractVariableType, CTArray, CTMapping, CTVariable } from "./types";

export function serializeVariable(v: CTVariable, factory: ASTNodeFactory) {
  let variable, data;
  switch (v.type) {
    case ContractVariableType.PRIMITIVE:
      variable = new Variable({
        name: v.name,
        storageLocation: DataLocation.Default,
        visibility: StateVariableVisibility.Default,
        typeName: factory.makeElementaryTypeName(
          v.data.valueType,
          v.data.valueType
        ),
      });
      break;
    case ContractVariableType.MAPPING:
      data = v.data as CTMapping;
      variable = new Variable({
        name: v.name,
        storageLocation: DataLocation.Default,
        visibility: StateVariableVisibility.Default,
        typeName: factory.makeMapping(
          "mapping",
          factory.makeElementaryTypeName(data.keyType, data.keyType),
          factory.makeElementaryTypeName(data.valueType, data.valueType)
        ),
      });
      break;
    case ContractVariableType.ARRAY:
      data = v.data as CTArray;
      variable = new Variable({
        name: v.name,
        storageLocation: DataLocation.Default,
        visibility: StateVariableVisibility.Default,
        typeName: factory.makeArrayTypeName(
          "",
          factory.makeElementaryTypeName(data.valueType, data.valueType)
        ),
      });
      break;
  }
  return variable.toNode(factory);
}
