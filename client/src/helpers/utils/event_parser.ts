export interface ParsedEventItem {
  name: string;
  value: any;
}

export default function parseEvents(
  events: any,
  abiEvents: any
): { [name: string]: any } {
  //@ts-ignore
  const kontour = window.kontour;
  const nameToResult: { [name: string]: ParsedEventItem[] } = {};
  Object.keys(events).forEach((event) => {
    const abi = abiEvents.find((a: any) => a.name === event);
    if (abi) {
      const { data, topics } = events[event].raw;
      const decoded = kontour.web3.eth.abi.decodeLog(
        abi.inputs,
        data,
        abi.anonymous ? topics : topics.slice(1)
      );
      nameToResult[event] = [];
      abi.inputs.forEach((input: any) => {
        if (decoded[input.name]) {
          nameToResult[event].push({
            name: input.name,
            value: decoded[input.name],
          });
        }
      });
    }
  });
  return nameToResult;
}
