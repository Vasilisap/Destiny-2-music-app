import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A deterministic accent color per expansion, used as a small identifying
 * swatch on track cards since there's no real album art. Same expansion
 * name always produces the same hue, so every Red War track reads as one
 * family of color and every Forsaken track as another, no data needed
 * beyond the expansion name already on the track.
 */
export function expansionAccent(expansion: string): string {
  let hash = 0;
  for (let i = 0; i < expansion.length; i++) {
    hash = (hash * 31 + expansion.charCodeAt(i)) >>> 0;
  }
  const hue = hash % 360;
  return `oklch(0.7 0.14 ${hue})`;
}
