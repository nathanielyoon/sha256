import { assertEquals } from "@std/assert";
import { sha256 } from "./mod.ts";

Deno.test(async function nist_sha256() {
  const all_steps = Array.from(
    (await Deno.readTextFile("./nist.txt"))
      .matchAll(/Len = (\d+)\s+Msg = (\S+)\s+MD = (\S+)/g),
    (step) =>
      [step[2].slice(0, +step[1] << 1), step[3]].map((Z) =>
        Uint8Array.from(Z.match(/[\da-f]{2}/g) ?? [], (Z) => parseInt(Z, 16))
      ),
  );
  let z = all_steps.length;
  do assertEquals(sha256(all_steps[--z][0]), all_steps[z][1]); while (z);
});
