import fetch from "node-fetch";
import config from "../../config";

export interface CovalentPrices {
  eth: number;
  matic: number;
}

export async function fetchPrices(): Promise<CovalentPrices> {
  const covalentUrl = `https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&tickers=MATIC,ETH&key=${config.covalent.API_KEY}`;
  const res = await fetch(covalentUrl);
  const { data } = await res.json();
  return {
    eth: data.items[0].quote_rate, //eth
    matic: data.items[1].quote_rate, //matic
  };
}
