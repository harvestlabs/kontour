import {
  ASTNodeFactory,
  Block,
  DataLocation,
  Expression,
  FunctionKind,
  FunctionStateMutability,
  FunctionVisibility,
  LiteralKind,
  ModifierInvocation,
  Mutability,
  OverrideSpecifier,
  ParameterList,
  StateVariableVisibility,
  TypeName,
} from "solc-typed-ast";
import {
  _ID,
  _NAME_LOCATION,
  _SRC,
  _SCOPE,
  _DOCUMENTATION,
} from "../globals/constants";
import { Serializable } from "../globals/serializable";

export interface FunctionOptions {
  name: string;
  kind: FunctionKind;
  virtual?: boolean;
  visibility: FunctionVisibility;
  mutability: FunctionStateMutability;
  isConstructor?: boolean;
  functionParams: ParameterList;
  returnParams: ParameterList;
  modifiers: ModifierInvocation[];
  body?: Block;
  overrideSpecifier?: OverrideSpecifier;
}

export default class Function extends Serializable {
  options: FunctionOptions;

  constructor(_options: FunctionOptions) {
    super();
    this.options = _options;
  }

  toNode(factory: ASTNodeFactory) {
    return factory.makeFunctionDefinition(
      _SCOPE,
      this.options.kind,
      this.options.name,
      this.options.virtual,
      this.options.visibility,
      this.options.mutability,
      this.options.isConstructor,
      this.options.functionParams,
      this.options.returnParams,
      this.options.modifiers,
      this.options.overrideSpecifier,
      this.options.body
    );
  }
}
