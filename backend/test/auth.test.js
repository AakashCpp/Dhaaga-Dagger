import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { app } from "../src/app.js";
import { createAdminToken } from "../src/services/admin-token.service.js";
import { createOrderVerificationToken, verifyOrderVerificationToken } from "../src/services/order-verification-token.service.js";
import { requireOrderVerification } from "../src/middleware/auth.js";

let server;
let origin;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      origin = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("health endpoint responds", async () => {
  const response = await fetch(`${origin}/api/v1/health`);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.status, "ok");
});

test("admin session rejects missing token", async () => {
  const response = await fetch(`${origin}/api/v1/auth/admin/session`);
  assert.equal(response.status, 401);
});

test("admin code request does not reveal whether an email is allowlisted", async () => {
  const response = await fetch(`${origin}/api/v1/auth/admin/request-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "not-admin@example.com" }),
  });
  const payload = await response.json();
  assert.equal(response.status, 202);
  assert.match(payload.message, /verification code has been sent/i);
  assert.equal("devCode" in payload, false);
});

test("admin session accepts a valid signed token", async () => {
  const token = createAdminToken("admin@example.com");
  const response = await fetch(`${origin}/api/v1/auth/admin/session`, { headers: { Authorization: `Bearer ${token}` } });
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.data.role, "admin");
});

test("order creation rejects unauthenticated customers", async () => {
  const response = await fetch(`${origin}/api/v1/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  assert.equal(response.status, 401);
});

test("order verification token is bound to the Firebase customer", () => {
  const token = createOrderVerificationToken("firebase-user-1", "customer@example.com");
  const verification = verifyOrderVerificationToken(token);
  assert.equal(verification.sub, "firebase-user-1");
  assert.equal(verification.email, "customer@example.com");

  let status;
  let message;
  const request = {
    get: () => token,
    customer: { firebase: { uid: "another-user", email: "customer@example.com" } },
  };
  const response = {
    status(code) { status = code; return this; },
    json(payload) { message = payload.error.message; return this; },
  };
  requireOrderVerification(request, response, () => assert.fail("mismatched customer must not pass"));
  assert.equal(status, 403);
  assert.match(message, /expired/i);
});
