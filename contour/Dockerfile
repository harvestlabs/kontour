FROM trufflesuite/ganache:latest

ARG GANACHE_PK
ARG GANACHE_PORT
ARG GANACHE_CHAIN_ID

ENTRYPOINT node /app/dist/node/cli.js --wallet.accounts=$GANACHE_PK,0x33B2E3C9FD0803CE8000000 --chain.chainId=$GANACHE_CHAIN_ID --port=$GANACHE_PORT --logging.verbose=true --chain.hardfork=london --db