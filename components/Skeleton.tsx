import { CSSProperties } from 'react';

export function Skeleton({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return <div aria-hidden className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`} style={style} />;
}

