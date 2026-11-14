import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Hook for hardware-accelerated sliding navigation pill indicator,
 * based on zaro.ai's desktop navigation system.
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

    setIndicator((prev) => {
      if (!prev.visible) {
        setMounted(false);
        requestAnimationFrame(() => setMounted(true));
      }
      return {
        left: itemRect.left - containerRect.left,
        width: itemRect.width,
        visible: true,
      };
    });
  }, []);

  const hide = useCallback(() => {
    currentTargetRef.current = null;
    setIndicator((prev) => ({ ...prev, visible: false }));
  }, []);

  // Recalculate indicator position on resize
  useEffect(() => {
    const handleResize = () => {
      if (currentTargetRef.current) {
        moveTo(currentTargetRef.current);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
