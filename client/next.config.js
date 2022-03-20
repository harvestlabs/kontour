/** @type {import('next').NextConfig} */

const fs = require("fs");

const nextConfig = {
  reactStrictMode: true,

  // see https://github.com/near/near-explorer/pull/873, there's an issue
  // with circular imports, happens when using apollo
  experimental: {
    esmExternals: false,
  },

  webpack: (config, { buildId, dev }) => {
    config.resolve.symlinks = false;
    config.experiments.topLevelAwait = true;
    return config;
  },

  env: {
    templateJS: fs.readFileSync("./public/template.js").toString(),
  },
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
