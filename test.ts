import { assertEquals } from "@std/assert";
import { sha256 } from "./mod.ts";

Deno.test(async function nist_sha256() {
  const nist = await Deno.readTextFile("./nist.txt");
  for (const step of nist.matchAll(/Len = (\d+)\s+Msg = (\S+)\s+MD = (\S+)/g)) {
    const [step1, step2] = [step[2].slice(0, +step[1] << 1), step[3]].map((Z) =>
      Uint8Array.from(Z.match(/[\da-f]{2}/g) ?? [], (Z) => parseInt(Z, 16))
    );
    assertEquals(sha256(step1), step2);
  }
});
