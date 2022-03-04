import {
  ASTNodeFactory,
  DataLocation,
  Expression,
  LiteralKind,
  Mutability,
  OverrideSpecifier,
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

export interface VariableOptions {
  name: string;
  storageLocation: DataLocation;
  visibility: StateVariableVisibility;
  constant?: boolean;
  indexed?: boolean;
  stateVariable?: boolean;
  mutability?: Mutability;
  typeName?: TypeName;
  expression?: Expression;
  overrideSpecifier?: OverrideSpecifier;
}

export default class Variable extends Serializable {
  options: VariableOptions;

  constructor(_options: VariableOptions) {
    super();
    this.options = _options;
  }

  toNode(factory: ASTNodeFactory, withType: boolean = true) {
    return factory.makeVariableDeclaration(
      this.options.constant,
      this.options.indexed,
      this.options.name,
      undefined,
      this.options.stateVariable,
      this.options.storageLocation,
      this.options.visibility,
      this.options.mutability,
      withType ? this.options.typeName?.typeString : "",
      undefined,
      withType ? this.options.typeName : undefined,
      this.options.overrideSpecifier,
      this.options.expression,
      undefined
    );
  }
}
