const { redisClient, pubsub } = require("./redis");

const FROM_ADDR_PATTERN = /From:\ +([0-9a-zA-z]+)$/;
const TO_ADDR_PATTERN = /To:\ +([0-9a-zA-z]+)$/;
const TX_PATTERN = /Transaction:\ +([0-9a-zA-z]+)$/;
const CONSOLE_PATTERN = /console.log:$/;
const BLOCK_PATTERN = /Block #([0-9]+):$/;

const GLOBALS = {
  isConsole: false,
  lastFrom: null,
  lastTo: null,
  blockNum: null,
  currMessages: [],
};

function resetGlobals() {
  GLOBALS.isConsole = false;
  GLOBALS.lastFrom = null;
  GLOBALS.lastTo = null;
  GLOBALS.txId = null;
  GLOBALS.currMessages = [];
  GLOBALS.blockNum = null;
}

process.stdin.on("readable", () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    const lines = chunk.toString().split("\n");
    console.log(lines);
    lines.forEach((line) => {
      if (GLOBALS.isConsole) {
        // We're in a console log, do stuff until end
        if (line.length === 0) {
          // an empty line when we are in a console log means we end
          pubsub.publish("hardhat", {
            message: GLOBALS.currMessages.join("\n"),
            from: GLOBALS.lastFrom,
            to: GLOBALS.lastTo,
            txId: GLOBALS.txId,
            blockNum: GLOBALS.blockNum,
          });
          resetGlobals();
        } else {
          // otherwise it's part of the current log
          GLOBALS.currMessages.push(line);
        }
      } else {
        const isFrom = line.match(FROM_ADDR_PATTERN);
        const isTo = line.match(TO_ADDR_PATTERN);
        const isConsole = line.match(CONSOLE_PATTERN);
        const isTx = line.match(TX_PATTERN);
        const isBlock = line.match(BLOCK_PATTERN);
        if (isFrom) {
          // set the from address for now
          GLOBALS.lastFrom = isFrom[1];
        }
        if (isTo) {
          // set the to address
          GLOBALS.lastTo = isTo[1];
        }
        if (isBlock) {
          GLOBALS.blockNum = isBlock[1];
        }
        if (isConsole) {
          // beginning of a console log
          GLOBALS.isConsole = true;
        }
        if (isTx) {
          GLOBALS.txId = isTx[1];
        }
      }
    });
  }
});

// [
//     '  Contract address:    0xd50af68d286d523800f0b933b91c1a4ace30ac4c',
//     '  Transaction:         0xf96ac19d74f56406e1dd8034b1f88f451c29701357cde60207e78ee072b928b9',
//     '  From:                0xfa439fe07b407e34435787f2a185ceea0bf5e41b',
//     '  Value:               0 ETH',
//     '  Gas used:            220766 of 275958',
//     '  Block #2:            0x452832206f24ed27a88aa61ca13d4cae7568d681d33ce0fe0ad50c9decd2d20a',
//   ]

// [
//     '  From:                0xfa439fe07b407e34435787f2a185ceea0bf5e41b',
//     '  To:                  0xd91da8848dbb5827a54d280e84209f8cf7523c33',
//     '  Value:               0 ETH',
//     '  Gas used:            48012 of 72018',
//     '  Block #7:            0xa42d961a0a6fa66e44c52b57e903ebb680ebb9689192f179bf28ad1d9fe53fde',
//     '',
//     '  console.log:',
//     '    asdf',
//     '    asdf2',
//     '',
//     ''
//   ]
