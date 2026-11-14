import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Hook for hardware-accelerated sliding navigation pill indicator.
 * Provides micro-smooth pill sliding transitions between tabs.
 */
export function useNavIndicator() {
  const containerRef = useRef(null);
  const itemRefs = useRef(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });
  const [mounted, setMounted] = useState(false);
  const currentTargetRef = useRef(null);

  const moveTo = useCallback((id) => {
    if (!id) return;
    currentTargetRef.current = id;
    const item = itemRefs.current.get(id);
    const container = containerRef.current;
    if (!item || !container) return;

    const itemRect = item.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    let left = itemRect.left - containerRect.left;
    if (Math.abs(left) < 1) left = 0;

    setIndicator((prev) => {
      if (!prev.visible) {
        setMounted(false);
        requestAnimationFrame(() => setMounted(true));
      }
      return {
        left,
        width: itemRect.width,
        visible: true,
      };
    });
  }, []);

  const hide = useCallback(() => {
    currentTargetRef.current = null;
    setIndicator((prev) => ({ ...prev, visible: false }));
  }, []);

  // Recalculate indicator position on resize or font loading
  useEffect(() => {
    let rafId = null;
    const updatePosition = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (currentTargetRef.current) {
          moveTo(currentTargetRef.current);
        }
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updatePosition);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [moveTo]);

  return {
    containerRef,
    itemRefs,
    indicator,
    mounted,
    moveTo,
    hide,
  };
}

