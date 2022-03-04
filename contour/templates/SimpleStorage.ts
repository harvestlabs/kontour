import {
  DataLocation,
  StateVariableVisibility,
  ASTWriter,
  PrettyFormatter,
  DefaultASTWriterMapping,
  ASTNodeFactory,
  ASTReader,
  SourceUnit,
  ASTNode,
} from "solc-typed-ast";
import Variable from "../base/variable";
import Constructor from "../blocks/constructor";
import SimpleWrite from "../blocks/simpleWrite";
import { isConstructor, isContract } from "../utils/parsers";
import { ContractType } from "./types";
import SimpleStorageJSON from "./compiled/SimpleStorage.sol.json";

interface SimpleStorageVariable {
  name: string;
  type: string;
}
export default class SimpleStorage implements ContractType {
  name: string = "SimpleStorage";
  variables: SimpleStorageVariable[];
  sourceUnits: SourceUnit[];
  contractUnit: any;
  factory: ASTNodeFactory;
  version: string = "0.8.11";

  constructor(variables: SimpleStorageVariable[]) {
    this.variables = variables;
    this.setup();
  }

  setup() {
    const reader = new ASTReader();
    this.sourceUnits = reader.read(SimpleStorageJSON);
    this.contractUnit = this.sourceUnits[0].children.filter((n) =>
      isContract(n)
    )[0];
    this.factory = new ASTNodeFactory(this.sourceUnits[0].context);
  }

  getNewContract(): SourceUnit {
    const contractVars = this.variables.map((v) => {
      const variable = new Variable({
        name: v.name,
        storageLocation: DataLocation.Default,
        visibility: StateVariableVisibility.Default,
        typeName: this.factory.makeElementaryTypeName(v.type, v.type),
      });
      return variable.toNode(this.factory);
    });

    const contractConstructor = new Constructor(
      this.variables.map((v) => {
        return {
          type: v.type,
          name: `${v.name}`,
        };
      })
    );

    const contractWriteFuncs = this.variables.map((v) => {
      return new SimpleWrite({
        name: v.name,
        type: v.type,
      });
    });

    const existingConstructor = this.contractUnit.children.findIndex((c) =>
      isConstructor(c)
    );
    this.contractUnit[existingConstructor] = contractConstructor.render(
      this.factory
    );

    contractVars.forEach((v) => this.contractUnit.appendChild(v));
    contractWriteFuncs.forEach((v) =>
      this.contractUnit.appendChild(v.render(this.factory))
    );
    return this.sourceUnits[0];
  }

  write(): string {
    const formatter = new PrettyFormatter(4, 0);
    const writer = new ASTWriter(
      DefaultASTWriterMapping,
      formatter,
      this.version
    );
    return writer.write(this.getNewContract());
  }
}
