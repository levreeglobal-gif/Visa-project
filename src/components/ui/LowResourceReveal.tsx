'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { getQualityTier, type QualityTier } from '@/lib/device';
import { useInViewport } from '@/lib/hooks/use-in-viewport';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { useMediaQuery } from '@/lib/hooks/use-media-query';

/** AETHER-derived low-resource reveal: CSS transition + IntersectionObserver, no animation library. */
export default function LowResourceReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref);
  const [motionReady, setMotionReady] = useState(false);
  const [quality, setQuality] = useState<QualityTier>('low');
  useEffect(() => { setMotionReady(true); setQuality(getQualityTier()); }, []);
  const reducedMotion = useReducedMotion();
  const coarsePointer = useMediaQuery('(pointer: coarse)');
  const simpleMode = reducedMotion || coarsePointer || quality !== 'high';
  return <div ref={ref} className={`rv-reveal ${className}`} data-in-view={simpleMode || inView ? 'true' : 'false'} data-motion={motionReady && !simpleMode ? 'ready' : 'off'}>{children}</div>;
}
