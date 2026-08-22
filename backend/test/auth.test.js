import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { app } from "../src/app.js";
import { createAdminToken } from "../src/services/admin-token.service.js";

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
