FROM trufflesuite/ganache:latest

ARG GANACHE_PK
ARG GANACHE_PORT
ARG GANACHE_CHAIN_ID

ENTRYPOINT node /app/dist/node/cli.js --wallet.accounts=$GANACHE_PK,0x3635C9ADC5DEA00000 --chain.chainId=$GANACHE_CHAIN_ID --port=$GANACHE_PORT --logging.verbose=true --chain.hardfork=london