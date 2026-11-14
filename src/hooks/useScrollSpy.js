import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * High-performance scroll spy hook.
 * Uses requestAnimationFrame-throttled scroll tracking with boundary detection
 * (top/bottom of page) and supports programmatic click locking to prevent indicator jitter.
 */
export function useScrollSpy(sectionIds, defaultId = '', options = {}) {
  const [activeId, setActiveId] = useState(defaultId || (sectionIds && sectionIds[0]) || '');
  const isLockedRef = useRef(false);
  const lockTimerRef = useRef(null);

  const lockSpy = useCallback((targetId, duration = 850) => {
    isLockedRef.current = true;
    if (targetId) {
      setActiveId(targetId);
    }
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => {
      isLockedRef.current = false;
    }, duration);
  }, []);

  const sectionIdsKey = Array.isArray(sectionIds) ? sectionIds.join(',') : '';

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionIdsKey) return;
    const ids = sectionIdsKey.split(',').filter(Boolean);
    if (ids.length === 0) return;

    let rafId = null;

    const updateActiveSection = () => {
      if (isLockedRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // 1. Bottom of the page: activate the last section (e.g. Privacy/Integrity)
      if (scrollY + windowHeight >= docHeight - 45) {
        setActiveId(ids[ids.length - 1]);
        return;
      }

      // 2. Near top of page: activate first section
      if (scrollY < 180) {
        setActiveId(ids[0]);
        return;
      }

      // 3. Check intermediate sections
      const navbarOffset = options.offset || 100;
      let currentActive = null;

      for (let i = ids.length - 1; i >= 0; i--) {
        const id = ids[i];
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= navbarOffset + 40) {
          currentActive = id;
          break;
        }
      }

      if (currentActive) {
        setActiveId(currentActive);
      }
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateActiveSection();
      });
    };

    // Unlock early if user manually scrolls with wheel or touch
    const onUserManualScroll = () => {
      if (isLockedRef.current) {
        if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
        isLockedRef.current = false;
        onScroll();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onUserManualScroll, { passive: true });
    window.addEventListener('touchmove', onUserManualScroll, { passive: true });

    // Initial calculation
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onUserManualScroll);
      window.removeEventListener('touchmove', onUserManualScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [sectionIdsKey, options.offset]);

  return { activeSection: activeId, setActiveSection: setActiveId, lockSpy };
}

