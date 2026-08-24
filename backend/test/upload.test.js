import assert from "node:assert/strict";
import test from "node:test";
import { productImageDigest } from "../src/services/upload.service.js";

test("product image names use a deterministic SHA-256 digest", () => {
  assert.equal(
    productImageDigest(Buffer.from("hello")),
    "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
  );
});
