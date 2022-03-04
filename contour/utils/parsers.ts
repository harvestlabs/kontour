export function getNodeType(n) {
  return n.constructor.name;
}

export function isFunction(n) {
  return getNodeType(n) === "FunctionDefinition";
}

export function isConstructor(n) {
  return isFunction(n) && n.kind === "constructor";
}

export function isContract(n) {
  return getNodeType(n) === "ContractDefinition";
}
