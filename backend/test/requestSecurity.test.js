import test from "node:test";
import assert from "node:assert/strict";
import {
  boundedPositiveInt,
  createSameOriginGuard,
  escapeRegex,
  hasDangerousKey,
  rejectMongoOperators,
} from "../middleware/requestSecurity.js";

test("rejects MongoDB operators and dotted paths at every nesting level", () => {
  assert.equal(hasDangerousKey({ phone: { $ne: "" } }), true);
  assert.equal(hasDangerousKey({ profile: { "role.admin": true } }), true);
  assert.equal(hasDangerousKey({ phone: "+212600000000" }), false);
});

test("rejects MongoDB operators before controller queries run", () => {
  let statusCode;
  let passed = false;
  const req = { body: { phone: { $ne: "" } }, query: {}, params: {} };
  const res = {
    status: (code) => { statusCode = code; return res; },
    json: () => res,
  };

  rejectMongoOperators(req, res, () => { passed = true; });

  assert.equal(statusCode, 400);
  assert.equal(passed, false);
});

test("treats search input as literal text and bounds pagination", () => {
  assert.equal(escapeRegex(".*(admin)"), "\\.\\*\\(admin\\)");
  assert.equal(boundedPositiveInt("9999", 10, 100), 100);
  assert.equal(boundedPositiveInt("-1", 10, 100), 10);
});

test("allows unsafe cookie requests from configured origins", () => {
  const guard = createSameOriginGuard(["https://wedding.example/"]);
  let passed = false;
  const req = {
    method: "POST",
    cookies: { token: "signed-session" },
    get: (name) => (name === "origin" ? "https://wedding.example" : undefined),
  };
  const res = { status: () => res, json: () => res };

  guard(req, res, () => { passed = true; });

  assert.equal(passed, true);
});

test("blocks unsafe cookie requests from untrusted or missing origins", () => {
  const guard = createSameOriginGuard("https://wedding.example");
  const cases = [
    { origin: "https://attacker.example", cookies: { token: "signed-session" } },
    { origin: undefined, cookies: { resetToken: "signed-session" } },
  ];

  for (const { origin, cookies } of cases) {
    let statusCode;
    let passed = false;
    const req = { method: "PATCH", cookies, get: () => origin };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: () => res,
    };

    guard(req, res, () => { passed = true; });

    assert.equal(statusCode, 403);
    assert.equal(passed, false);
  }
});

test("keeps read-only and non-cookie API requests without an origin available", () => {
  const guard = createSameOriginGuard("https://wedding.example");
  const cases = [
    { method: "GET", cookies: { token: "signed-session" }, origin: "https://attacker.example" },
    { method: "POST", cookies: {}, origin: undefined },
  ];

  for (const { method, cookies, origin } of cases) {
    let passed = false;
    const req = { method, cookies, get: () => origin };
    const res = { status: () => res, json: () => res };

    guard(req, res, () => { passed = true; });

    assert.equal(passed, true);
  }
});
