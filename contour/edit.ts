import { deploy } from "./deployer/deploy";
import SimpleStorage from "./templates/SimpleStorage";

async function main() {
  const storage = new SimpleStorage([
    {
      name: "test1",
      type: "uint8",
    },
    {
      name: "test2",
      type: "uint256",
    },
  ]);
  console.log(await deploy(storage));
}

main();
