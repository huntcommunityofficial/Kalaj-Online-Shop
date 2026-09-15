'use client';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;
    setVisible(true);

    function onMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setHover(!!target.closest('a, button, [role="button"]'));
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[200] rounded-full border-2 border-[var(--color-brand)] hidden md:block"
      style={{
        left: pos.x,
        top: pos.y,
        width: hover ? 44 : 20,
        height: hover ? 44 : 20,
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.2s var(--ease-spring), height 0.2s var(--ease-spring), background-color 0.2s ease',
        backgroundColor: hover ? 'rgba(79, 47, 214, 0.08)' : 'transparent',
      }}
    />
  );
}
