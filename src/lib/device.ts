'use client';
export type QualityTier = 'high' | 'low' | 'off';
export function getQualityTier(): QualityTier {
  if (typeof window === 'undefined') return 'low';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off';
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (cores <= 2 || memory <= 2) return 'off';
  if (coarsePointer || cores <= 4 || memory <= 4) return 'low';
  return 'high';
}
export function isTouchDevice(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
}
