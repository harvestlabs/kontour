ast = require("solc-typed-ast");
let r;
let reader;
let sourceUnits;
let formatter;
let writer;

async function main() {
  r = await ast.compileSol("./templates/SimpleStorage.sol", "auto", []);
  reader = new ast.ASTReader();
  sourceUnits = reader.read(r.data);
  formatter = new ast.PrettyFormatter(4, 0);
  writer = new ast.ASTWriter(
    ast.DefaultASTWriterMapping,
    formatter,
    r.compilerVersion
  );
}

function getNodeType(n) {
  console.log(n.constructor.name);
}

function printNode(n) {
  console.log({
    name: n.name,
    children: n.children,
  });
}

function write(sourceUnits) {
  for (const sourceUnit of sourceUnits) {
    console.log("// " + sourceUnit.absolutePath);
    console.log(writer.write(sourceUnit));
  }
}

main();
