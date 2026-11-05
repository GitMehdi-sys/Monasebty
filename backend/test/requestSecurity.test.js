import test from "node:test";
import assert from "node:assert/strict";
import { boundedPositiveInt, escapeRegex, hasDangerousKey } from "../middleware/requestSecurity.js";

test("rejects MongoDB operators and dotted paths at every nesting level", () => {
  assert.equal(hasDangerousKey({ phone: { $ne: "" } }), true);
  assert.equal(hasDangerousKey({ profile: { "role.admin": true } }), true);
  assert.equal(hasDangerousKey({ phone: "+212600000000" }), false);
});

test("treats search input as literal text and bounds pagination", () => {
  assert.equal(escapeRegex(".*(admin)"), "\\.\\*\\(admin\\)");
  assert.equal(boundedPositiveInt("9999", 10, 100), 100);
  assert.equal(boundedPositiveInt("-1", 10, 100), 10);
});
