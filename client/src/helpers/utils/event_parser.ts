export interface ParsedEventItem {
  name: string;
  value: any;
}

export default function parseEvents(
  event: any,
  abiEvents: any
): { [name: string]: any } {
  //@ts-ignore
  const kontour = window.kontour;
  const nameToResult: { [name: string]: ParsedEventItem[] } = {};

  const abi = abiEvents.find((a: any) => a.name === event.event);
  if (abi) {
    const { data, topics } = event.raw;
    const decoded = kontour.web3.eth.abi.decodeLog(
      abi.inputs,
      data,
      abi.anonymous ? topics : topics.slice(1)
    );
    nameToResult[abi.name] = [];
    abi.inputs.forEach((input: any) => {
      if (decoded[input.name]) {
        nameToResult[abi.name].push({
          name: input.name,
          value: decoded[input.name],
        });
      }
    });
  }
  return nameToResult;
}

// only parse the values that are valuable in the abi
export function parseEventReturnValues(
  event: any,
  abiEvents: any
): { [name: string]: any } {
  //@ts-ignore
  const kontour = window.kontour;
  const nameToReturnValue: { [name: string]: ParsedEventItem[] } = {};

  const abi = abiEvents.find((a: any) => a.name === event.event);
  if (abi) {
    const { data, topics } = event.raw;
    const decoded = kontour.web3.eth.abi.decodeLog(
      abi.inputs,
      data,
      abi.anonymous ? topics : topics.slice(1)
    );

    abi.inputs.forEach((input: any) => {
      nameToReturnValue[input.name] = decoded[input.name];
    });
  }
  return nameToReturnValue;
}
