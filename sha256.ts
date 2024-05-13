const A = Uint32Array.from({ length: 64 }, (_, A) => parseInt("428a2f9871374491b5c0fbcfe9b5dba53956c25b59f111f1923f82a4ab1c5ed5d807aa9812835b01243185be550c7dc372be5d7480deb1fe9bdc06a7c19bf174e49b69c1efbe47860fc19dc6240ca1cc2de92c6f4a7484aa5cb0a9dc76f988da983e5152a831c66db00327c8bf597fc7c6e00bf3d5a7914706ca63511429296727b70a852e1b21384d2c6dfc53380d13650a7354766a0abb81c2c92e92722c85a2bfe8a1a81a664bc24b8b70c76c51a3d192e819d6990624f40e3585106aa07019a4c1161e376c082748774c34b0bcb5391c0cb34ed8aa4a5b9cca4f682e6ff3748f82ee78a5636f84c878148cc7020890befffaa4506cebbef9a3f7c67178f2".slice(A *= 8, A + 8), 16)),
  B = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]),
  C = new Uint32Array(80);
const r = (value: number, by: number) => value >>> by | value << 32 - by;
const block = (to: Uint32Array, data: Uint8Array, at: number) => {
  let z = 0, a, b = to[0], c = to[1], d = to[2], e = to[3], f = to[4];
  do C[z] = data[at++] << 24 | data[at++] << 16 |
    data[at++] << 8 | data[at++]; while (++z < 16);
  do C[z] = (r(a = C[z - 2], 17) ^ r(a, 19) ^ a >>> 10) +
    (r(a = C[z - 15], 7) ^ r(a, 18) ^ a >>> 3) +
    C[z - 7] + C[z - 16]; while (++z < 64);
  let g = to[5], h = to[6], i = to[7], j;
  z = 0;
  do a = i + (r(f, 6) ^ r(f, 11) ^ r(f, 25)) + (f & g ^ ~f & h) + A[z] + C[z],
    j = (r(b, 2) ^ r(b, 13) ^ r(b, 22)) + (b & c ^ b & d ^ c & d), i = h, h = g,
    g = f, f = e + a, e = d, d = c, c = b, b = a + j; while (++z < 64);
  to[0] += b, to[1] += c, to[2] += d, to[3] += e;
  to[4] += f, to[5] += g, to[6] += h, to[7] += i;
};
export const sha256 = (data: Uint8Array) => {
  const a = new Uint32Array(B), b = new Uint8Array(64), Z = data.length;
  let z = 0, y = 0, c;
  while (z < Z) {
    if ((c = Math.min(64 - y, Z - z)) - 64) {
      b.set(data.subarray(z, z += c)), y += c;
    } else while (Z - z >= 64) block(a, data, z), z += 64;
  }
  b[y++] = 128, y > 56 && block(a, b, y = 0);
  const d = new DataView(b.fill(z = 0, y).buffer);
  d.setBigUint64(56, BigInt(Z * 8)), block(a, b, y = 0);
  do d.setUint32(z, a[y]); while (z += 4, ++y < 8);
  return b.slice(0, 32);
};

