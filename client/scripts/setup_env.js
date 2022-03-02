const fs = require("fs");

const currDir = process.cwd();
// This file assumes that it will be run automatically with npm install.
// Do *not* run it in any other directory

const env = {
  NEXT_PUBLIC_REACT_APP_SERV_PROTOCOL: 'http://',
  NEXT_PUBLIC_REACT_APP_WS_PROTOCOL: 'ws://',
  NEXT_PUBLIC_REACT_APP_SERV_HOSTNAME: 'localhost:8080',
  NEXT_PUBLIC_REACT_APP_JWT_KEY: 'nftoolboxjwt'
};

const envFilePath = currDir + "/.env.local";
try {
  const stats = fs.statSync(envFilePath);
  if (stats && stats.isFile) {
    console.log("Not writing .env.local because it exists already");
    process.exit(0);
  }
} catch (e) {}

const outputEnvString = Object.keys(env).reduce((memo, key) => {
  return memo + key + "=" + env[key] + "\n";
}, "");

fs.writeFile(envFilePath, outputEnvString, "utf8", (err) => {
  if (err) {
    console.error(
      "[ERROR] There was an error generating your client .env.local file. Please double check your client .env.local file before running the client server."
    );
  } else {
    console.log("\x1b[32m", "Successfully generated env file: " + envFilePath);
  }
});
