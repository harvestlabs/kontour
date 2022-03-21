import fetch from "node-fetch";
import config from "../../config";

export async function fetchEvents(
  chainId: number,
  address: string
): Promise<any[]> {
  const covalentUrl = `https://api.covalenthq.com/v1/${chainId}/events/address/${address}?starting-block=12115107&ending-block=latest&key=${config.covalent.API_KEY}`;
  const res = await fetch(covalentUrl);
  const { data } = await res.json();
  return data.items;
}
