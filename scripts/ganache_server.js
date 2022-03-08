require("dotenv").config();

const ganache = require("ganache-core");
const web3 = require("web3");

const options = {
  accounts: [
    {
      secretKey:
        "0x9ccaae79e780c5ea1d0271fe6d84568406123c5c804ee6ae5152b0f0e5cbbdce",
      balance: "3635C9ADC5DEA00000",
    },
  ],
};

const server = ganache.server(options);

server.listen(8545, async (err) => {
  if (err) throw err;

  console.log(`ganache listening on port...`);
  const provider = server.provider;
  const p = new web3(provider);
  const accounts = await p.eth.getAccounts();
  console.log("accounts", accounts);
});
