'use client';
import { useRef, useState } from 'react';

export default function Tilt({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - py) * 10;
    const rotateY = (px - 0.5) * 10;
    setStyle({
      transform: `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    });
  }

  function onMouseLeave() {
    setStyle({ transform: 'perspective(700px) rotateX(0) rotateY(0) scale3d(1,1,1)' });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{ ...style, transition: 'transform 0.35s var(--ease-smooth)', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}
