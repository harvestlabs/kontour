import {
  DataLocation,
  StateVariableVisibility,
  ASTWriter,
  PrettyFormatter,
  DefaultASTWriterMapping,
  LatestCompilerVersion,
  ASTNodeFactory,
  Mutability,
  LiteralKind,
  ContractKind,
  FunctionKind,
  FunctionVisibility,
  FunctionStateMutability,
  ParameterList,
} from "solc-typed-ast";
import Conditional from "./base/conditional";
import Contract from "./base/contract";
import Function from "./base/function";
import FunctionBody from "./base/functionBody";
import Variable from "./base/variable";
import Constructor from "./blocks/constructor";

const factory = new ASTNodeFactory();

const v = new Variable({
  name: "asdf",
  storageLocation: DataLocation.Default,
  visibility: StateVariableVisibility.Default,
  expression: factory.makeLiteral("uint256", LiteralKind.Number, "0x1", "1"),
  typeName: factory.makeElementaryTypeName("uint256", "uint256"),
});
const f = new Function({
  name: "test",
  kind: FunctionKind.Function,
  visibility: FunctionVisibility.Public,
  mutability: FunctionStateMutability.NonPayable,
  functionParams: factory.makeParameterList([]),
  returnParams: factory.makeParameterList([]),
  modifiers: [],
  body: new FunctionBody({
    statements: [
      new Conditional({
        condition: factory.makeBinaryOperation(
          "<",
          "<",
          factory.makeLiteral("uint8", LiteralKind.Number, "0x1", "1"),
          factory.makeLiteral("uint8", LiteralKind.Number, "0x1", "2")
        ),
        trueEval: new FunctionBody({
          statements: [v.toNode(factory)],
        }).toNode(factory),
      }).toNode(factory),
    ],
  }).toNode(factory),
});
const c = new Constructor([
  {
    name: "_expirationTime",
    type: "uint256",
  },
  {
    name: "_something",
    type: "uint8",
  },
]);
const contract = new Contract({
  name: "Example",
  kind: ContractKind.Contract,
}).toNode(factory);

contract.appendChild(v.toNode(factory));
contract.appendChild(c.render(factory));

const formatter = new PrettyFormatter(4, 0);
const writer = new ASTWriter(
  DefaultASTWriterMapping,
  formatter,
  LatestCompilerVersion
);
console.log(writer.write(contract));
