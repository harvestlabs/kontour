FROM trufflesuite/ganache:latest

ARG GANACHE_PK
ARG GANACHE_PORT
ARG GANACHE_CHAIN_ID
# Sets the root account's balance to 1 Billion Eth
ENTRYPOINT node /app/dist/node/cli.js --database.dbPath=/var/data --wallet.accounts=$GANACHE_PK,0x33B2E3C9FD0803CE8000000 --chain.chainId=$GANACHE_CHAIN_ID --port=$GANACHE_PORT --logging.verbose=true --chain.hardfork=london --miner.callGasLimit=0x77359400 --miner.priceBump=0