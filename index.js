const crypto = require("crypto");

function buildInfo() {
  return {
    ok: true,
    msg: "Hello from a verifiable supply chain demo 👋",
    commit: process.env.GITHUB_SHA || "local",
    buildTime: new Date().toISOString(),
    fingerprint: crypto.createHash("sha256").update("demo").digest("hex").slice(0, 16)
  };
}

if (require.main === module) {
  console.log(JSON.stringify(buildInfo(), null, 2));
}

module.exports = { buildInfo };