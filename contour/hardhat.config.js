module.exports = {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
      chainId: 1338,
      blockGasLimit: 2000000000,
      gas: 2100000,
      gasPrice: 8000000000,
      accounts: [
        {
          privateKey:
            "0x9ccaae79e780c5ea1d0271fe6d84568406123c5c804ee6ae5152b0f0e5cbbdce",
          balance: "1000000000000000000000000000",
        },
      ],
      hardfork: "london",
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
    },
  },
};
