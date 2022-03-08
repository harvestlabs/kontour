const ast = require("solc-typed-ast");
const fs = require("fs");

const filename = process.argv[2];

async function main() {
  const r = await ast.compileSol(
    `${__dirname}/../contracts/${filename}`,
    "auto",
    []
  );
  fs.writeFileSync(
    `${__dirname}/../compiled/${filename}.json`,
    JSON.stringify(r.data)
  );
  process.exit(0);
}

main();
