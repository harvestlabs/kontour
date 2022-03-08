FROM trufflesuite/ganache:latest

ARG GANACHE_PK

ENTRYPOINT node /app/dist/node/cli.js --wallet.accounts=$GANACHE_PK,0x3635C9ADC5DEA00000 --port=8545 --logging.verbose=true --chain.hardfork=london