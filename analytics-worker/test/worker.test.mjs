import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import worker from "../src/worker.js";

if (!globalThis.crypto) globalThis.crypto = webcrypto;

const allowedOrigin = "https://tabi-shiori.github.io";
const calls = [];

function resultFor(sql, args = []) {
  return {
    bind(...nextArgs) {
      return resultFor(sql, nextArgs);
    },
    async run() {
      calls.push({ sql, args });
      return { success: true };
    },
    async all() {
      calls.push({ sql, args });
      return { results: [] };
    },
  };
}

const env = {
  ALLOWED_ORIGIN: allowedOrigin,
  DATA_RETENTION_DAYS: "30",
  IP_HASH_SECRET: "local-ip-test-secret",
  ADMIN_PASSWORD: "local-admin-test-password",
  ADMIN_SESSION_SECRET: "local-session-test-secret",
  DB: {
    prepare(sql) {
      return resultFor(sql);
    },
  },
};

const event = {
  eventId: "evt_1234567890123456",
  visitorId: "vis_1234567890123456",
  sessionId: "ses_1234567890123456",
  eventName: "section_view",
  sectionId: "hotels",
  path: "/shoryudo-japan-12days/?secret=hidden",
  referrerHost: "example.com",
  deviceType: "mobile",
  locale: "zh-CN",
  metadata: { filter: "高山" },
};

const health = await worker.fetch(new Request("https://worker.test/health"), env);
assert.equal(health.status, 200);
assert.deepEqual(await health.json(), { ok: true, service: "shoryudo-visitor-analytics" });

const rejected = await worker.fetch(
  new Request("https://worker.test/collect", {
    method: "POST",
    headers: { Origin: "https://example.com", "Content-Type": "text/plain" },
    body: JSON.stringify(event),
  }),
  env,
);
assert.equal(rejected.status, 403);

const collected = await worker.fetch(
  new Request("https://worker.test/collect", {
    method: "POST",
    headers: {
      Origin: allowedOrigin,
      "Content-Type": "text/plain",
      "CF-Connecting-IP": "203.0.113.42",
    },
    body: JSON.stringify(event),
  }),
  env,
);
assert.equal(collected.status, 204);
assert.equal(calls.length, 1);
assert.equal(calls[0].args[8], "/shoryudo-japan-12days/");
assert.equal(calls[0].args[11], "203.0.113.42");
assert.equal(calls[0].args[12], "203.0.x.x");
assert.match(calls[0].args[10], /^[a-f0-9]{64}$/);
assert.equal(JSON.stringify(calls[0].args).includes("203.0.113.42"), true);

const deleted = await worker.fetch(
  new Request("https://worker.test/delete", {
    method: "POST",
    headers: { Origin: allowedOrigin, "Content-Type": "text/plain" },
    body: JSON.stringify({ visitorId: event.visitorId }),
  }),
  env,
);
assert.equal(deleted.status, 200);
assert.match(calls[1].sql, /DELETE FROM events/);
assert.deepEqual(calls[1].args, [event.visitorId]);

const wrongLogin = await worker.fetch(
  new Request("https://worker.test/admin/login", {
    method: "POST",
    body: new URLSearchParams({ password: "wrong" }),
  }),
  env,
);
assert.equal(wrongLogin.status, 401);

const login = await worker.fetch(
  new Request("https://worker.test/admin/login", {
    method: "POST",
    body: new URLSearchParams({ password: env.ADMIN_PASSWORD }),
  }),
  env,
);
assert.equal(login.status, 302);
const cookie = login.headers.get("Set-Cookie");
assert.match(cookie, /^shoryudo_admin=v1\./);
assert.match(cookie, /HttpOnly; Secure; SameSite=Strict/);

const admin = await worker.fetch(
  new Request("https://worker.test/admin", {
    headers: { Cookie: cookie.split(";")[0] },
  }),
  env,
);
assert.equal(admin.status, 200);
assert.match(await admin.text(), /升龙道访问统计/);

console.log("Worker privacy and admin contract tests passed.");
