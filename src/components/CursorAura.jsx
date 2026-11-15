import React, { useEffect, useRef } from 'react';

// Soft green aura that smoothly follows the mouse cursor (same look as the login page).
// It moves by updating the element style directly, so the page is not re-rendered on every frame.
export default function CursorAura({ size = 440 }) {
  const auraRef = useRef(null);

  useEffect(() => {
    // Skip on touch-only devices (no real mouse cursor)
    if (window.matchMedia && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return undefined;
    }

    const el = auraRef.current;
    if (!el) return undefined;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let hasMoved = false;
    let rafId = null;

    const render = () => {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;

      // Keep animating until the aura has caught up with the cursor, then idle
      if (Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    };

    const handleMouseMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        current.x = target.x;
        current.y = target.y;
        el.style.opacity = '0.85';
      }
      if (rafId === null) rafId = requestAnimationFrame(render);
    };

    const handleLeaveWindow = () => { el.style.opacity = '0'; };
    const handleEnterWindow = () => { if (hasMoved) el.style.opacity = '0.85'; };

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleLeaveWindow);
    document.documentElement.addEventListener('mouseenter', handleEnterWindow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleLeaveWindow);
      document.documentElement.removeEventListener('mouseenter', handleEnterWindow);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={auraRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 -z-10 rounded-full blur-3xl will-change-transform"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        opacity: 0,
        transition: 'opacity 0.35s ease',
        background: 'radial-gradient(circle, rgba(97, 188, 118, 0.50) 0%, rgba(209, 250, 223, 0.40) 35%, rgba(11, 116, 67, 0.18) 65%, transparent 85%)',
      }}
    />
  );
}