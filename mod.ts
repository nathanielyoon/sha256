const IV = /* @__PURE__ */ Uint32Array.from(
  /* @__PURE__ */ "428a2f9871374491b5c0fbcfe9b5dba53956c25b59f111f1923f82a4ab1c5ed5d807aa9812835b01243185be550c7dc372be5d7480deb1fe9bdc06a7c19bf174e49b69c1efbe47860fc19dc6240ca1cc2de92c6f4a7484aa5cb0a9dc76f988da983e5152a831c66db00327c8bf597fc7c6e00bf3d5a7914706ca63511429296727b70a852e1b21384d2c6dfc53380d13650a7354766a0abb81c2c92e92722c85a2bfe8a1a81a664bc24b8b70c76c51a3d192e819d6990624f40e3585106aa07019a4c1161e376c082748774c34b0bcb5391c0cb34ed8aa4a5b9cca4f682e6ff3748f82ee78a5636f84c878148cc7020890befffaa4506cebbef9a3f7c67178f26a09e667bb67ae853c6ef372a54ff53a510e527f9b05688c1f83d9ab5be0cd19"
    .match(/.{8}/g)!,
  (Z) => parseInt(Z, 16),
);
/** SHA-256 block function. */
const mix = (use: Uint32Array, from: DataView, at: number, to: Uint32Array) => {
  let a = to[1], b = to[2], c = to[3], d = to[4], e = to[5], f, g, z = 0;
  do use[z] = from.getUint32(at), at += 4; while (++z < 16);
  do f = use[z - 2],
    g = use[z - 15],
    use[z] = ((g >>> 7 | g << 25) ^ (g >>> 18 | g << 14) ^ g >>> 3) +
      ((f >>> 17 | f << 15) ^ (f >>> 19 | f << 13) ^ f >>> 10) +
      use[z - 7] + use[z - 16]; while (++z < 64);
  let h = to[z = 0], i = to[6], j = to[7];
  do f = ((d >>> 6 | d << 26) ^ (d >>> 11 | d << 21) ^ (d >>> 25 | d << 7)) +
    (d & e ^ ~d & i) + j + IV[z] + use[z],
    g = ((h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10)) +
      (a & b ^ h & a ^ h & b),
    j = i,
    i = e,
    e = d,
    d = c + f | 0,
    c = b,
    b = a,
    a = h,
    h = f + g | 0; while (++z < 64);
  to[0] += h, to[1] += a, to[2] += b, to[3] += c;
  to[4] += d, to[5] += e, to[6] += i, to[7] += j;
};
/** Hashes with {@link https://w.wiki/KgC | SHA-256}. */
export const sha256 = (message: Uint8Array) => {
  const a = new Uint32Array(IV.subarray(64)), d = new Uint32Array(80);
  const e = new Uint8Array(64), f = message.length;
  let g = new DataView(message.buffer, message.byteOffset), z = 0, y = 0;
  while (z < f) {
    const j = Math.min(64 - y, f - z);
    if (j !== 64) e.set(message.subarray(z, z += j)), y += j;
    else do mix(d, g, z, a), z += 64; while (f - z >= 64);
  }
  g = new DataView(e.buffer), e[y] = 128, 64 - ++y < 8 && mix(d, g, y = 0, a);
  e.fill(0, y), g.setBigUint64(56, BigInt(f) << 3n), mix(d, g, y = 0, a);
  do g.setUint32(y << 2, a[y]); while (++y < 8);
  return new Uint8Array(e.subarray(0, 32));
};
