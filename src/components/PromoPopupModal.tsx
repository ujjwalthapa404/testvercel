import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const PROMO_POPUP_IMAGE_SRC =
  '/assets/aistudio/college_landing_page_image_de70291b.jpeg';

const DIRECTION_THRESHOLD_PX = 14;
const MIN_TOP_OFFSET_PX = 20;
const TOGGLE_COOLDOWN_MS = 240;
const MANUAL_CLOSE_COOLDOWN_MS = 550;
const CLOSE_ANIMATION_MS = 220;

interface PromoPopupModalProps {
  /** Called whenever the popup visibility changes so sibling announcement popups do not overlap */
  onVisibilityChange?: (isVisible: boolean) => void;
}

function getCurrentScrollY(): number {
  if (typeof window === 'undefined') return 0;
  return Math.max(
    0,
    window.scrollY || 0,
    window.pageYOffset || 0,
    document.documentElement?.scrollTop || 0,
    document.body?.scrollTop || 0
  );
}

/**
 * Scroll-Direction-Driven Floating Promotional Popup (Bernhardt-inspired overlay).
 * - Scrolling DOWNWARDS triggers and keeps the promotional popup visible.
 * - Scrolling UPWARDS smoothly hides the popup.
 * - Reversing back DOWNWARDS reveals the popup again continuously across all pages.
 * - Non-blocking viewport backdrop (`pointer-events-none` + `touch-pan-y` card) ensures
 *   visitors can freely continue scrolling down or scroll up on both desktop and mobile touch.
 */
export const PromoPopupModal: React.FC<PromoPopupModalProps> = ({
  onVisibilityChange,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const isVisibleRef = useRef(false);
  const lastScrollYRef = useRef<number>(0);
  const accumulatedDeltaRef = useRef<number>(0);
  const lastToggleAtRef = useRef<number>(0);
  const manualCooldownUntilRef = useRef<number>(0);
  const unmountTimerRef = useRef<number | null>(null);
  const enterTimerRef = useRef<number | null>(null);
  const enterRafRef = useRef<number | null>(null);

  useEffect(() => {
    onVisibilityChange?.(isMounted && isEntered);
  }, [isMounted, isEntered, onVisibilityChange]);

  const clearAnimationTimers = useCallback(() => {
    if (unmountTimerRef.current !== null) {
      window.clearTimeout(unmountTimerRef.current);
      unmountTimerRef.current = null;
    }
    if (enterTimerRef.current !== null) {
      window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }
    if (enterRafRef.current !== null) {
      window.cancelAnimationFrame(enterRafRef.current);
      enterRafRef.current = null;
    }
  }, []);

  const showPopup = useCallback(() => {
    if (imageFailed || isVisibleRef.current) return;

    // Avoid overlapping if another blocking modal (e.g., profile dossier / lightbox) is open
    const blockingDialog = document.querySelector(
      '[role="dialog"][aria-modal="true"]:not([data-promo-popup="true"])'
    );
    if (blockingDialog) return;

    clearAnimationTimers();
    isVisibleRef.current = true;
    lastToggleAtRef.current = performance.now();

    setIsEntered(false);
    setIsMounted(true);

    const triggerEnter = () => {
      setIsEntered(true);
    };

    enterRafRef.current = window.requestAnimationFrame(() => {
      enterRafRef.current = window.requestAnimationFrame(triggerEnter);
    });
    enterTimerRef.current = window.setTimeout(triggerEnter, 40);
  }, [clearAnimationTimers, imageFailed]);

  const hidePopup = useCallback(
    (isManualClose = false) => {
      if (!isVisibleRef.current && !isMounted) return;

      clearAnimationTimers();
      isVisibleRef.current = false;
      const now = performance.now();
      lastToggleAtRef.current = now;
      if (isManualClose) {
        manualCooldownUntilRef.current = now + MANUAL_CLOSE_COOLDOWN_MS;
      }

      setIsEntered(false);

      const reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      unmountTimerRef.current = window.setTimeout(
        () => {
          unmountTimerRef.current = null;
          if (!isVisibleRef.current) {
            setIsMounted(false);
          }
        },
        reducedMotion ? 10 : CLOSE_ANIMATION_MS
      );
    },
    [clearAnimationTimers, isMounted]
  );

  /* Continuous bidirectional scroll-direction detection across desktop & mobile touch */
  useEffect(() => {
    if (typeof window === 'undefined' || imageFailed) {
      return undefined;
    }

    lastScrollYRef.current = getCurrentScrollY();
    accumulatedDeltaRef.current = 0;

    const handlePageScroll = (event?: Event) => {
      // Only respond to primary document/window scrolling, not nested inner scrollboxes
      const target = event?.target;
      if (
        target &&
        target !== window &&
        target !== document &&
        target !== document.documentElement &&
        target !== document.body
      ) {
        return;
      }

      const currentY = getCurrentScrollY();
      const prevY = lastScrollYRef.current;
      const delta = currentY - prevY;
      lastScrollYRef.current = currentY;

      // Ignore 0px noise
      if (delta === 0) return;

      const now = performance.now();

      // Always hide cleanly when visitor reaches the very top of the page
      if (currentY <= MIN_TOP_OFFSET_PX) {
        accumulatedDeltaRef.current = 0;
        if (isVisibleRef.current) {
          hidePopup(false);
        }
        return;
      }

      // Accumulate directional distance; reset accumulator cleanly on direction reversal
      if (
        (delta > 0 && accumulatedDeltaRef.current < 0) ||
        (delta < 0 && accumulatedDeltaRef.current > 0)
      ) {
        accumulatedDeltaRef.current = delta;
      } else {
        accumulatedDeltaRef.current += delta;
      }

      // Scrolling DOWNWARDS -> Reveal popup (respecting cooldown & minimum top offset)
      if (accumulatedDeltaRef.current >= DIRECTION_THRESHOLD_PX) {
        accumulatedDeltaRef.current = 0;
        if (
          !isVisibleRef.current &&
          now >= manualCooldownUntilRef.current &&
          now - lastToggleAtRef.current >= TOGGLE_COOLDOWN_MS
        ) {
          showPopup();
        }
        return;
      }

      // Scrolling UPWARDS -> Smoothly hide popup
      if (accumulatedDeltaRef.current <= -DIRECTION_THRESHOLD_PX) {
        accumulatedDeltaRef.current = 0;
        if (
          isVisibleRef.current &&
          now - lastToggleAtRef.current >= TOGGLE_COOLDOWN_MS
        ) {
          hidePopup(false);
        }
      }
    };

    window.addEventListener('scroll', handlePageScroll, { passive: true });
    document.addEventListener('scroll', handlePageScroll, { passive: true, capture: true });
    window.visualViewport?.addEventListener('scroll', handlePageScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handlePageScroll);
      document.removeEventListener('scroll', handlePageScroll, { capture: true });
      window.visualViewport?.removeEventListener('scroll', handlePageScroll);
      clearAnimationTimers();
    };
  }, [clearAnimationTimers, hidePopup, imageFailed, showPopup]);

  /* Escape key support when popup is visible */
  useEffect(() => {
    if (!isMounted) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisibleRef.current) {
        event.preventDefault();
        hidePopup(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMounted, hidePopup]);

  if (!isMounted || imageFailed || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="false"
      data-promo-popup="true"
      aria-label="CAPITOL HILL COLLEGE Admissions 2026 Promotional Notice"
      className={`fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center p-5 sm:p-8 transition-opacity duration-250 ease-out ${
        isEntered ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Subtle non-blocking atmospheric dimming backdrop */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 bg-black/45 backdrop-blur-[1.5px] pointer-events-none transition-opacity duration-250 ease-out ${
          isEntered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Interactive Promotional Image Card (touch-pan-y preserves native vertical touch scrolling) */}
      <div
        className={`relative pointer-events-auto touch-pan-y w-fit max-w-[calc(100vw-2.5rem)] sm:max-w-[440px] md:max-w-[490px] transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
          isEntered
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-3'
        }`}
      >
        {/* Top-Right Close (×) Button */}
        <button
          type="button"
          onClick={() => hidePopup(true)}
          aria-label="Close promotional popup"
          title="Close"
          className="absolute -top-3 -right-3 sm:-top-3.5 sm:-right-3.5 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-[var(--color-primary-ink)] border border-[var(--color-hairline)] shadow-[0_8px_24px_rgba(0,0,0,0.32)] hover:bg-[var(--color-brand)] hover:text-white hover:border-[var(--color-brand)] active:scale-95 transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
        >
          <X className="w-5 h-5" strokeWidth={2.25} aria-hidden="true" />
        </button>

        {/* Crisp Framed Promotional Image Keeping Original Proportions */}
        <div className="rounded-2xl bg-white p-1.5 sm:p-2 border border-white/90 shadow-[0_28px_72px_-14px_rgba(0,0,0,0.52)] overflow-hidden">
          <div className="rounded-xl overflow-hidden bg-white">
            <img
              src={PROMO_POPUP_IMAGE_SRC}
              alt="CAPITOL HILL COLLEGE Admissions Open 2026 — +2 Programs, BBS & MBS at CHC Campus, Teku, Kathmandu"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => {
                setImageFailed(true);
                isVisibleRef.current = false;
                setIsMounted(false);
              }}
              className="w-auto max-w-full h-auto max-h-[72dvh] sm:max-h-[80dvh] block mx-auto select-none touch-pan-y"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
