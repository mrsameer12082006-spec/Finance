/**
 * Smooth scroll engine for Nectar landing navigation.
 * Calculates target coordinates accounting for floating navbar height and executes
 * buttery-smooth, hardware-accelerated scrolling with zero jitter or snapping.
 */

const DEFAULT_NAVBAR_OFFSET = 84;

/**
 * Calculates effective scroll offset for target element.
 */
export function getScrollOffset() {
  return DEFAULT_NAVBAR_OFFSET;
}

/**
 * Smoothly scrolls to target ID, updates URL hash cleanly, and perfectly frames the section.
 */
export function smoothScrollTo(targetId, options = {}) {
  if (typeof window === 'undefined' || !targetId) return;

  const id = targetId.startsWith('#') ? targetId.slice(1) : targetId;
  if (!id) return;

  const {
    offset = DEFAULT_NAVBAR_OFFSET,
    behavior = 'smooth',
    maxAttempts = 30,
    intervalMs = 25,
    updateHash = true,
  } = options;

  let attempts = 0;

  const attemptScroll = () => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('is-revealed');

      if (updateHash) {
        const hash = `#${id}`;
        if (window.location.hash !== hash) {
          window.history.replaceState(window.history.state, '', hash);
        }
      }

      const rect = el.getBoundingClientRect();
      const targetY = Math.max(0, rect.top + window.scrollY - offset);

      window.scrollTo({
        top: targetY,
        behavior,
      });
      return;
    }

    if (++attempts < maxAttempts) {
      setTimeout(attemptScroll, intervalMs);
    }
  };

  attemptScroll();
}

