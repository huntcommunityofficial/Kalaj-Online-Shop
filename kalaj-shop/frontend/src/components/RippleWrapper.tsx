'use client';
import { useState } from 'react';

export default function RippleWrapper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  function addRipple(e: React.MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();
    setRipples((r) => [...r, { id, x, y, size }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 600);
  }

  return (
    <div className={`ripple ${className}`} onMouseDown={addRipple}>
      {children}
      {ripples.map((r) => (
        <span key={r.id} className="ripple-circle" style={{ left: r.x, top: r.y, width: r.size, height: r.size }} />
      ))}
    </div>
  );
}
