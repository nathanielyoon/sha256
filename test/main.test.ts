import { test } from "vitest";
import { sha256 } from "../src/main.ts";
import short from "./nist_short.json" with { type: "json" };
import long from "./nist_long.json" with { type: "json" };

test("nist", ({ expect }) => {
  const h_u = (hex: string) =>
    Uint8Array.from(hex.match(/../g) ?? [], (B) => parseInt(B, 16));
  for (const a of (short + long).matchAll(/Msg = (\S+)\r\nMD = (\S{64})/g)) {
    expect(sha256(h_u(a[1]))).toStrictEqual(h_u(a[2]));
  }
});

test("webcrypto", async ({ expect }) => {
  const a = new Uint8Array(0x1000);
  for (let z = 0, b; z < a.length; ++z) {
    expect(sha256(b = crypto.getRandomValues(a.subarray(0, z)))).toStrictEqual(
      new Uint8Array(await crypto.subtle.digest("SHA-256", b)),
    );
  }
});
