(function () {
  let web3,
    eth,
    abi,
    address = "0xFdaEae2089b4AeBf89838954c598cfB99E3F11AA";

  // most recently used account
  let account = "0xDE45fE1Eb48a0dd6d501e395437AEC12667e76cb";

  let contract;

  const chainMetadata = {
    id: "0x539",
    name: "Kontour Test Chain: <PROJECT_NAME>",
    symbol: "ETH",
    decimals: 18,
    rpcUrls: ["http://localhost:8545"],
    blockExplorerUrls: [],
  };

  const onWeb3Loaded = () => {
    web3 = new window.Web3("ws://localhost:8545");
  };

  const onMetamaskLoaded = async () => {
    eth = await detectEthereumProvider();
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
            `${error.code}. Something went wrong while trying to add network: ${error?.message}`
          );
        }
      } else {
        alert(
          `Error ${error.code}. Something went wrong while trying to switch networks: ${error?.message}`
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
    if (!accounts?.length) {
      // User is not connected to metamask
      return null;
    }
    account = accounts[0];
    return account;
  };

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
    if (!accounts?.length) {
      return null;
    }
    // otherwise we found the current address, let's store it
    account = accounts[0];
    return account;
  };

  const setupContract = (abi) => {
    abi = abi;

    console.log("address contract", address);
    contract = new web3.eth.Contract(abi, address);
  };

  const send = async (methodName, ...args) => {
    // const newAccount = await web3.eth.personal.newAccount("test");
    // console.log("newAccount", newAccount);
    // await web3.eth.personal.unlockAccount(newAccount, "test", 10000);
    // const acc = web3.eth.accounts.create();
    // console.log("agcc", acc);
    // web3.eth.personal.importRawKey(acc.privateKey, "password");

    console.log("account pss", account);
    web3.eth.personal.unlockAccount(account, "password", 10000);

    if (account == null) {
      throw new Error("User has not connected Metamask");
    }
    console.log("arguments", args[0]);
    console.log("accounts", contract);

    const transactionParameters = {
      to: address,
      from: account,
      data: contract.methods[methodName](...args).encodeABI(),
    };

    const result = await contract.methods[methodName](...args)
      .send({
        from: account,
        gas: await web3.eth.estimateGas(transactionParameters),
        gasPrice: await web3.eth.getGasPrice(),
      })
      .on("error", function (error, receipt) {
        console.error("error", error);
        throw error;
      });

    // const receipt = await contract.methods[methodName](...args)
    //   .send({
    //     // from: newAccount,
    //     from: account,
    //   })
    //   .on("error", function (error, receipt) {
    //     throw error;
    //   });
    return result;
  };

  // const sendPayable = async (methodName, value, ...args) => {
  //   // const newAccount = await web3.eth.personal.newAccount("test");
  //   // console.log("newAccount", newAccount);
  //   // await web3.eth.personal.unlockAccount(newAccount, "test", 10000);
  //   // if (account == null) {
  //   //   throw new Error("User has not connected Metamask");
  //   // }
  //   console.log("arguments", args[0]);
  //   console.log("accounts", contract);
  //   const receipt = await contract.methods[methodName](...args)
  //     .send({
  //       // from: newAccount,
  //       from: account,
  //       value: value,
  //     })
  //     .on("error", function (error, receipt) {
  //       throw error;
  //     });
  //   return receipt;
  // };

  const call = async (methodName, ...args) => {
    let val = null;
    // const acc = web3.eth.accounts.create();
    // console.log("agcc", acc);

    try {
      console.log("trying", account, methodName);
      val = await contract.methods[methodName](...args).call();
      console.log("trying val", val);
    } catch (e) {
      console.error("error", e);
      throw e;
    }

    return val;
  };

  /*
   *
   * options: {
   *   filter - (optional) Filter events by indexed parameters : {
   *    _param1:
   *    _param2
   *   }
   *   fromBlock - Number|String|BN|BigNumber (optional): The block number (greater than or equal to) from which to get events on. Pre-defined block numbers as "earliest", "latest" and "pending" can also be used. For specific range use getPastEvents.
   *   topics[] - Array (optional) This allows to manually set the topics for the event filter. If given the filter property and event signature, (topic[0]) will not be set automatically. PROB NOT NEEDED
   * }
   * callback: Function()
   * events: "data", "changed", "error", "connected"
   *
   * The structure of the returned event Object looks as follows:

   * event - String: The event name.
   * signature - String|Null: The event signature, null if it’s an anonymous event.
   * address - String: Address this event originated from.
   * returnValues - Object: The return values coming from the event, e.g. {myVar: 1, myVar2: '0x234...'}.
   * logIndex - Number: Integer of the event index position in the block.
   * transactionIndex - Number: Integer of the transaction’s index position the event was created in.
   * transactionHash 32 Bytes - String: Hash of the transaction this event was created in.
   * blockHash 32 Bytes - String: Hash of the block this event was created in. null when it’s still pending.
   * blockNumber - Number: The block number this log was created in. null when still pending.
   * raw.data - String: The data containing non-indexed log parameter.
   * raw.topics - Array: An array with max 4 32 Byte topics, topic 1-3 contains indexed parameters of the event.
   *
   *
   */

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

  const set = async function set(value) {
    return await send("set", value);
  };

  const get = async function get() {
    return await call("get");
  };

  /* exports */
  window.kontour = {
    init,
    fetchMetamaskAccount,
    requestMetamaskAccounts,
    setupContract,
    send,
    call,
    getAccount,

    // // returns: new Promise
    // function sendMETHOD(ARGS) {
    // }

    /* escape hatches */
    web3,
    eth,

    /* generated code */
    set,
    get,
  };

  init();
})();
