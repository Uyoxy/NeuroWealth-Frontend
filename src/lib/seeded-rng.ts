/**
 * Seeded Random Number Generator
 * 
 * Provides deterministic random numbers for demos and testing.
 * Controlled by NEXT_PUBLIC_DEMO_SEED environment variable.
 * When not set, falls back to Math.random() for normal operation.
 */

let rng: (() => number) | null = null;

// Simple seeded RNG using the Mulberry32 algorithm
function mulberry32(a: number): () => number {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Initialize RNG from environment variable if set
function initializeRNG(): void {
  const seed = process.env.NEXT_PUBLIC_DEMO_SEED;
  if (seed) {
    // Convert string seed to numeric hash
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    rng = mulberry32(Math.abs(hash));
  } else {
    rng = null; // Use Math.random()
  }
}

// Get a random number between 0 and 1
export function random(): number {
  if (rng === null) {
    return Math.random();
  }
  return rng();
}

// Get a random integer between min (inclusive) and max (exclusive)
export function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min)) + min;
}

// Get a random item from an array
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(random() * array.length)];
}

// Initialize on module load
initializeRNG();
