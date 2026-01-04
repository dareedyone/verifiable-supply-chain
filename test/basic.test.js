const test = require("node:test");
const assert = require("node:assert/strict");
const { buildInfo } = require("../index");

test("buildInfo returns expected shape", () => {
  const info = buildInfo();
  assert.equal(info.ok, true);
  assert.equal(typeof info.fingerprint, "string");
});