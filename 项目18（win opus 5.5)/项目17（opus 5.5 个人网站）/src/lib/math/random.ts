export function mulberry32(a: number) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRandom(seed: number) {
  const rng = mulberry32(seed);
  return {
    value: rng,
    range: (min: number, max: number) => min + rng() * (max - min),
    int: (min: number, max: number) =>
      Math.floor(min + rng() * (max - min + 1)),
    choose: <T>(arr: T[]) => arr[Math.floor(rng() * arr.length)],
  };
}
