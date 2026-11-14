/**
 * Reverse-engineered smooth scroll and navigation indicator engine inspired by zaro.ai.
 * Provides micro-calibrated scroll settling (Ae/Te algorithm), scroll-spy intersection tracking,
 * and hardware-accelerated sliding indicator positioning.
 */

const SETTLE_TIMEOUT_MS = 2000;
const SETTLE_FRAMES = 3;
const TOLERANCE_PX = 2;

/**
 * Calculates effective scroll offset taking scroll-padding-top and scroll-margin-top into account.
 */
export function getScrollOffset(element) {
  if (typeof window === 'undefined' || !element) return 0;
  const scrollingEl = document.scrollingElement || document.documentElement;
  const scrollPadding = parseFloat(window.getComputedStyle(scrollingEl).scrollPaddingTop) || 0;
  const scrollMargin = parseFloat(window.getComputedStyle(element).scrollMarginTop) || 0;
  return scrollPadding + scrollMargin;
}

/**
 * Monitors smooth scroll velocity until settling, then fine-adjusts
 * to eliminate sticky header collision with 2px accuracy.
 * Cancels immediately if user interacts (wheel, touch, key).
 */
export function settleScroll(targetElement) {
  if (typeof window === 'undefined' || !targetElement) return;

  const deadline = performance.now() + SETTLE_TIMEOUT_MS;
  let lastY = window.scrollY;
  let settledFrameCount = 0;
  let cancelListeners = [];

  const cleanup = () => {
    cancelListeners.forEach((remove) => remove());
    cancelListeners = [];
  };

  ['wheel', 'touchstart', 'keydown'].forEach((event) => {
    const onUserInterrupt = () => cleanup();
    window.addEventListener(event, onUserInterrupt, { passive: true });
    cancelListeners.push(() => window.removeEventListener(event, onUserInterrupt));
  });

  const checkVelocity = () => {
    if (cancelListeners.length === 0) return;

    if (performance.now() > deadline) {
      cleanup();
      return;
    }

    const currentY = window.scrollY;
    if (Math.abs(currentY - lastY) > 0.5) {
      lastY = currentY;
      settledFrameCount = 0;
      requestAnimationFrame(checkVelocity);
      return;
    }

    // Scroll has settled for consecutive frames
    if (++settledFrameCount < SETTLE_FRAMES) {
      requestAnimationFrame(checkVelocity);
      return;
    }

    // Calculate final delta against dynamic scroll padding & margins
    const delta = targetElement.getBoundingClientRect().top - getScrollOffset(targetElement);
    if (Math.abs(delta) > TOLERANCE_PX) {
      window.scrollBy({ top: delta, behavior: 'auto' });
      lastY = window.scrollY;
      settledFrameCount = 0;
    }

    requestAnimationFrame(checkVelocity);
  };

  requestAnimationFrame(checkVelocity);
}

/**
 * Smoothly scrolls to target ID, updates URL hash cleanly, and settles with micro-precision.
 */
export function smoothScrollTo(targetId, options = {}) {
  if (typeof window === 'undefined' || !targetId) return;

  const id = targetId.startsWith('#') ? targetId.slice(1) : targetId;
  if (!id) return;

  const {
    behavior = 'smooth',
    maxAttempts = 40,
    intervalMs = 30,
    updateHash = true
  } = options;

  let attempts = 0;

  const attemptScroll = () => {
    const el = document.getElementById(id);
    if (el) {
      if (updateHash) {
        const hash = `#${id}`;
        if (window.location.hash !== hash) {
          window.history.replaceState(window.history.state, '', hash);
        }
      }
      el.scrollIntoView({ behavior });
      settleScroll(el);
      return;
    }

    if (++attempts < maxAttempts) {
      setTimeout(attemptScroll, intervalMs);
    }
  };

  attemptScroll();
}
