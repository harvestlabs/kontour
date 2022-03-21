(function () {
  let web3, eth, abi, address;

  let account;

  const chainMetadata = {
    id: "0x53A",
    name: "Kontour Test Chain <blackjack>",
    symbol: "ETH",
    decimals: 18,
    rpcUrls: ["https://kontour-node-1.onrender.com"],
    blockExplorerUrls: [],
  };

  const onWeb3Loaded = () => {
    web3 = new window.Web3(window.Web3.givenProvider);
    window.kontour.web3 = web3;

    window.kontour.contracts = {
      Machine: (function () {
        const abi = [
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "configAddress",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "Create",
            type: "event",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_reservePrice",
                type: "uint256",
              },
              {
                internalType: "uint8",
                name: "_pctCreatorInitialDisbursement",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "_pctCreatorFinalDisbursement",
                type: "uint8",
              },
              {
                internalType: "uint64",
                name: "_mustBeClaimedTime",
                type: "uint64",
              },
            ],
            name: "create",
            outputs: [
              {
                internalType: "address",
                name: "configAddress",
                type: "address",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
        ];
        const contractAddress = "0xF2fCb546793b327c836A0D892A3c98CfF797012a";
        const name = "Machine";
        const contract = new web3.eth.Contract(abi, contractAddress);

        return {
          abi: abi,
          address: contractAddress,
          web3Object: contract,
          /* generated functions*/
          constructor: function () {},
          executeCreate: async function executeCreate(
            accountAddress,
            _reservePrice,
            _reservePrice,
            _pctCreatorInitialDisbursement,
            _reservePrice,
            _reservePrice,
            _pctCreatorInitialDisbursement,
            _pctCreatorFinalDisbursement,
            _reservePrice,
            _reservePrice,
            _pctCreatorInitialDisbursement,
            _reservePrice,
            _reservePrice,
            _pctCreatorInitialDisbursement,
            _pctCreatorFinalDisbursement,
            _mustBeClaimedTime
          ) {
            return send(
              contract,
              accountAddress,
              "create",
              _reservePrice,
              _reservePrice,
              _pctCreatorInitialDisbursement,
              _reservePrice,
              _reservePrice,
              _pctCreatorInitialDisbursement,
              _pctCreatorFinalDisbursement,
              _reservePrice,
              _reservePrice,
              _pctCreatorInitialDisbursement,
              _reservePrice,
              _reservePrice,
              _pctCreatorInitialDisbursement,
              _pctCreatorFinalDisbursement,
              _mustBeClaimedTime
            );
          },
        };
      })(),
      MachineCopy: (function () {
        const abi = [
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "configAddress",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "Create",
            type: "event",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_reservePrice",
                type: "uint256",
              },
              {
                internalType: "uint8",
                name: "_pctCreatorInitialDisbursement",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "_pctCreatorFinalDisbursement",
                type: "uint8",
              },
              {
                internalType: "uint64",
                name: "_mustBeClaimedTime",
                type: "uint64",
              },
            ],
            name: "create",
            outputs: [
              {
                internalType: "address",
                name: "configAddress",
                type: "address",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
        ];
        const contractAddress = "0x7EbE2661BbDd6389113c18bE7BA280d65C6AeFeB";
        const name = "MachineCopy";
        const contract = new web3.eth.Contract(abi, contractAddress);

        return {
          abi: abi,
          address: contractAddress,
          web3Object: contract,
          /* generated functions*/
          constructor: function () {},
          executeCreate: async function executeCreate(
            accountAddress,
            _reservePrice,
            _reservePrice,
            _pctCreatorInitialDisbursement,
            _reservePrice,
            _reservePrice,
            _pctCreatorInitialDisbursement,
            _pctCreatorFinalDisbursement,
            _reservePrice,
            _reservePrice,
            _pctCreatorInitialDisbursement,
            _reservePrice,
            _reservePrice,
            _pctCreatorInitialDisbursement,
            _pctCreatorFinalDisbursement,
            _mustBeClaimedTime
          ) {
            return send(
              contract,
              accountAddress,
              "create",
              _reservePrice,
              _reservePrice,
              _pctCreatorInitialDisbursement,
              _reservePrice,
              _reservePrice,
              _pctCreatorInitialDisbursement,
              _pctCreatorFinalDisbursement,
              _reservePrice,
              _reservePrice,
              _pctCreatorInitialDisbursement,
              _reservePrice,
              _reservePrice,
              _pctCreatorInitialDisbursement,
              _pctCreatorFinalDisbursement,
              _mustBeClaimedTime
            );
          },
        };
      })(),
      Bounty: (function () {
        const abi = [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_reservePrice",
                type: "uint256",
              },
              {
                internalType: "uint8",
                name: "_pctInitialDisbursement",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "_pctFinalDisbursement",
                type: "uint8",
              },
              {
                internalType: "uint64",
                name: "_mustBeClaimedTime",
                type: "uint64",
              },
              {
                internalType: "address payable",
                name: "_owner",
                type: "address",
              },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          { inputs: [], name: "AlreadyPaid", type: "error" },
          { inputs: [], name: "IncorrectPercentages", type: "error" },
          { inputs: [], name: "NoEquity", type: "error" },
          { inputs: [], name: "TooLate", type: "error" },
          { inputs: [], name: "Unauthorized", type: "error" },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "string",
                name: "msg",
                type: "string",
              },
            ],
            name: "Debug",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "_to",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
              },
            ],
            name: "Withdraw",
            type: "event",
          },
          {
            inputs: [
              { internalType: "address", name: "_owner", type: "address" },
            ],
            name: "balanceOf",
            outputs: [
              { internalType: "uint256", name: "balance", type: "uint256" },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "address", name: "_owner", type: "address" },
            ],
            name: "equityOf",
            outputs: [
              { internalType: "uint256", name: "balance", type: "uint256" },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "exit",
            outputs: [{ internalType: "bool", name: "success", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "getCollaboratorsList",
            outputs: [
              {
                internalType: "address payable[]",
                name: "_collaborators",
                type: "address[]",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "getEquityList",
            outputs: [
              {
                internalType: "uint256[]",
                name: "_pctEquity",
                type: "uint256[]",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "getTreasuryStatus",
            outputs: [
              {
                internalType: "uint256[3]",
                name: "_stats",
                type: "uint256[3]",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "owner",
            outputs: [
              { internalType: "address payable", name: "", type: "address" },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [{ internalType: "bool", name: "onOff", type: "bool" }],
            name: "precipitatingEvent",
            outputs: [{ internalType: "bool", name: "success", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "uniqueCollaborators",
            outputs: [{ internalType: "uint8", name: "num", type: "uint8" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "getBountyStatus",
            outputs: [
              {
                internalType: "uint256[5]",
                name: "_stats",
                type: "uint256[5]",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "join",
            outputs: [{ internalType: "bool", name: "success", type: "bool" }],
            stateMutability: "payable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_reservePrice",
                type: "uint256",
              },
              { internalType: "uint64", name: "_endTime", type: "uint64" },
              {
                internalType: "address payable",
                name: "_creatorWallet",
                type: "address",
              },
            ],
            name: "negotiate",
            outputs: [{ internalType: "bool", name: "success", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address payable",
                name: "_creatorWallet",
                type: "address",
              },
              { internalType: "uint64", name: "_endTime", type: "uint64" },
            ],
            name: "claim",
            outputs: [{ internalType: "bool", name: "success", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "waitingForSignature",
            outputs: [{ internalType: "bool", name: "success", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "complete",
            outputs: [{ internalType: "bool", name: "success", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "reject",
            outputs: [{ internalType: "bool", name: "success", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ];
        const contractAddress = "0x1D96fF464DF775C58D31a2C1f1688bB5B2E56356";
        const name = "Bounty";
        const contract = new web3.eth.Contract(abi, contractAddress);

        return {
          abi: abi,
          address: contractAddress,
          web3Object: contract,
          /* generated functions*/
          constructor: function () {},
          viewBalanceOf: async function viewBalanceOf(_owner) {
            return call(contract, "balanceOf", _owner);
          },
          viewEquityOf: async function viewEquityOf(_owner) {
            return call(contract, "equityOf", _owner);
          },
          executeExit: async function executeExit(accountAddress) {
            return send(contract, accountAddress, "exit");
          },
          viewGetCollaboratorsList: async function viewGetCollaboratorsList() {
            return call(contract, "getCollaboratorsList");
          },
          viewGetEquityList: async function viewGetEquityList() {
            return call(contract, "getEquityList");
          },
          viewGetTreasuryStatus: async function viewGetTreasuryStatus() {
            return call(contract, "getTreasuryStatus");
          },
          viewOwner: async function viewOwner() {
            return call(contract, "owner");
          },
          executePrecipitatingEvent: async function executePrecipitatingEvent(
            accountAddress,
            onOff
          ) {
            return send(contract, accountAddress, "precipitatingEvent", onOff);
          },
          viewUniqueCollaborators: async function viewUniqueCollaborators() {
            return call(contract, "uniqueCollaborators");
          },
          viewGetBountyStatus: async function viewGetBountyStatus() {
            return call(contract, "getBountyStatus");
          },
          executeJoinPayable: async function executeJoinPayable(
            accountAddress,
            value
          ) {
            return sendPayable(contract, accountAddress, "join", value);
          },
          executeNegotiate: async function executeNegotiate(
            accountAddress,
            _reservePrice,
            _reservePrice,
            _endTime,
            _reservePrice,
            _reservePrice,
            _endTime,
            _creatorWallet
          ) {
            return send(
              contract,
              accountAddress,
              "negotiate",
              _reservePrice,
              _reservePrice,
              _endTime,
              _reservePrice,
              _reservePrice,
              _endTime,
              _creatorWallet
            );
          },
          executeClaim: async function executeClaim(
            accountAddress,
            _creatorWallet,
            _creatorWallet,
            _endTime
          ) {
            return send(
              contract,
              accountAddress,
              "claim",
              _creatorWallet,
              _creatorWallet,
              _endTime
            );
          },
          executeWaitingForSignature: async function executeWaitingForSignature(
            accountAddress
          ) {
            return send(contract, accountAddress, "waitingForSignature");
          },
          executeComplete: async function executeComplete(accountAddress) {
            return send(contract, accountAddress, "complete");
          },
          executeReject: async function executeReject(accountAddress) {
            return send(contract, accountAddress, "reject");
          },
        };
      })(),
    };
  };

  const onMetamaskLoaded = async () => {
    eth = await detectEthereumProvider();
    window.kontour.eth = eth;
    window.kontour.web3 = web3;
  };

  const init = () => {
    var web3jsScriptEl = document.createElement("script");

    web3jsScriptEl.onload = onWeb3Loaded;
    web3jsScriptEl.src =
      "https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js";

    var metamaskDetectScriptEl = document.createElement("script");

    metamaskDetectScriptEl.onload = onMetamaskLoaded;
    metamaskDetectScriptEl.src =
      "https://unpkg.com/@metamask/detect-provider/dist/detect-provider.min.js";

    document.head.append(metamaskDetectScriptEl, web3jsScriptEl);
  };

  const getAccount = () => {
    return account;
  };

  const setAccount = (newAccount) => {
    account = newAccount;
  };

  const switchToProperNode = async () => {
    try {
      const r = await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainMetadata.id }],
      });
    } catch (error) {
      if (!(error instanceof Error)) {
        throw `Something went wrong detecting switch errors: ${error}`;
      }
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        try {
          await eth.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainMetadata.id,
                chainName: chainMetadata.name,
                nativeCurrency: {
                  symbol: chainMetadata.id,
                  decimals: chainMetadata.name,
                },
                rpcUrls: chainMetadata.rpcUrls,
                blockExplorerUrls: chainMetadata.blockExplorerUrls,
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
          alert(
            `${error.code}. Something went wrong while trying to add network: ${
              error && error.message
            }`
          );
        }
      } else {
        alert(
          `Error ${
            error.code
          }. Something went wrong while trying to switch networks: ${
            error && error.message
          }`
        );
      }
    }
  };

  // are they connected to metamask?
  const fetchMetamaskAccount = async () => {
    if (eth == null) {
      return null;
    }
    const a = await web3.eth.getChainId();
    const accounts = await eth.request({ method: "eth_accounts" });
    if (!(accounts && accounts.length)) {
      // User is not connected to metamask
      return null;
    }
    account = accounts[0];
    return account;
  };

  const isMetamaskAvailable = () => eth != null;

  // request metamask accounts. returns true if success, false if not connected
  const requestMetamaskAccounts = async () => {
    // first switch to the proper chain before even connecting
    await switchToProperNode();
    if (eth == null) {
      return null;
    }
    const accounts = await eth.request({
      method: "eth_requestAccounts",
    });

    // User is not connected to metmask
    if (!(accounts && accounts.length)) {
      return null;
    }
    // otherwise we found the current address, let's store it
    account = accounts[0];
    return account;
  };

  const send = async (contract, accountAddress, methodName, ...args) => {
    if (accountAddress == null) {
      throw new Error("User has not connected Metamask");
    }

    const transaction = contract.methods[methodName](...args);

    const g = await transaction.estimateGas({ from: accountAddress });
    const result = await transaction
      .send({
        from: accountAddress,
        gas: Math.round(g * 1.25),
      })
      .on("error", function (error, receipt) {
        console.error("error", error);
        throw error;
      });

    return result;
  };

  const sendPayable = async (
    contract,
    accountAddress,
    methodName,
    value,
    ...args
  ) => {
    if (accountAddress == null) {
      throw new Error("User has not connected Metamask");
    }

    const transaction = contract.methods[methodName](...args);

    const data = {
      from: accountAddress,
      value: value,
    };
    const g = await transaction.estimateGas(data);
    const result = await transaction
      .send({
        gas: g,
        ...data,
      })
      .on("error", function (error, receipt) {
        throw error;
      });
    return result;
  };

  const call = async (contract, methodName, ...args) => {
    let val = null;

    try {
      val = await contract.methods[methodName](...args).call();
    } catch (e) {
      console.error("error", e);
      throw e;
    }

    return val;
  };

  const onEvent = async (
    eventName,
    { onEventConnected, onEventReceived, onEventRemoved, onError },
    options
  ) => {
    await contract.events[eventName](options)
      .on("connected", (subscriptionId) => {})
      .on("changed", (event) => {
        onEventRemoved(event);
      })
      .on("data", (event) => {
        onEventReceived(event);
      })
      .on("error", (error, receipt) => {
        onError(error, receipt);
      });
  };

  const onEventOnce = async (
    eventName,
    { onEventReceived, onError },
    options
  ) => {
    await contract.once(eventName, options, function (error, event) {
      if (error) {
        onError(error);
      } else {
        onEventReceived(event);
      }
    });
  };

  /* generated */

  /* exports */
  window.kontour = {
    init,
    fetchMetamaskAccount,
    requestMetamaskAccounts,
    send,
    sendPayable,
    call,
    getAccount,
    isMetamaskAvailable,

    // // returns: new Promise
    // function sendMETHOD(ARGS) {
    // }

    /* escape hatches */
    web3,
    eth,

    /* generated contracts are created after web3 is loaded*/
    contracts: {},
  };

  init();
})();
