module.exports = {
  apps: [
    {
      name: "server",
      script: "./build/app.js",
    },
    {
      name: "worker",
      script: "./worker/build/worker/main.js",
    },
  ],
};
