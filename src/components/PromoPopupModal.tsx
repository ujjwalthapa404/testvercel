import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Download, Maximize2, Minimize2, X } from 'lucide-react';

export const PROMO_POPUP_IMAGE_SRC =
  '/assets/brochures/admissions-2026-brochure.jpeg';

const BROCHURE_DOWNLOAD_FILENAME = 'Capitol-Hill-College-Admissions-2026-Brochure.jpeg';
const SESSION_DISMISSED_KEY = 'chc_brochure_popup_dismissed_v1';
const MOBILE_SCROLL_THRESHOLD_PX = 160;
const DESKTOP_SCROLL_THRESHOLD_PX = 260;
const REVEAL_DELAY_MS = 300;
const CLOSE_ANIMATION_MS = 220;

interface PromoPopupModalProps {
  /** Notifies parent so sibling announcement popups do not overlap while brochure modal is open */
  onVisibilityChange?: (isVisible: boolean) => void;
  /** Optional callback to open the Admission Enquiry page cleanly from the brochure modal */
  onOpenEnquiry?: () => void;
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

function getIntendedScrollThreshold(): number {
  if (typeof window === 'undefined') return DESKTOP_SCROLL_THRESHOLD_PX;
  const maxScrollable = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const baseThreshold =
    window.innerWidth < 768 ? MOBILE_SCROLL_THRESHOLD_PX : DESKTOP_SCROLL_THRESHOLD_PX;
  if (maxScrollable > 0 && maxScrollable < baseThreshold * 1.4) {
    return Math.max(80, Math.round(maxScrollable * 0.2));
  }
  return baseThreshold;
}

function isDismissedInSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(SESSION_DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

function markDismissedInSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(SESSION_DISMISSED_KEY, '1');
  } catch {
    // Ignore storage errors in restricted browsing contexts
  }
}

/**
 * Scroll-triggered Admissions Brochure Popup Modal.
 * - Triggers reliably on desktop, tablet, and mobile once the visitor scrolls past the hero.
 * - Appears at most once per browsing session so returning visitors are not interrupted repeatedly.
 * - Provides working Brochure Download, Full-View inspection toggle, and Admission Enquiry actions.
 * - Dismisses cleanly via the top-right × button, backdrop click, or Escape key.
 */
export const PromoPopupModal: React.FC<PromoPopupModalProps> = ({
  onVisibilityChange,
  onOpenEnquiry,
}) => {
  const [dismissedForSession, setDismissedForSession] = useState<boolean>(() =>
    isDismissedInSession()
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const hasTriggeredRef = useRef(false);
  const revealTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const enterTimerRef = useRef<number | null>(null);
  const enterRafRef = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    onVisibilityChange?.(isOpen);
  }, [isOpen, onVisibilityChange]);

  const clearTimers = useCallback(() => {
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
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

  /* Scroll-position trigger across desktop mouse/trackpad and mobile touch scrolling */
  useEffect(() => {
    if (dismissedForSession || hasTriggeredRef.current || imageFailed || typeof window === 'undefined') {
      return undefined;
    }

    const cleanupListeners = () => {
      window.removeEventListener('scroll', checkScrollPosition);
      document.removeEventListener('scroll', checkScrollPosition, { capture: true });
      window.removeEventListener('touchmove', checkScrollPosition);
      window.removeEventListener('touchend', checkScrollPosition);
      window.visualViewport?.removeEventListener('scroll', checkScrollPosition);
    };

    const scheduleReveal = () => {
      if (hasTriggeredRef.current || revealTimerRef.current !== null) return;

      revealTimerRef.current = window.setTimeout(() => {
        revealTimerRef.current = null;
        if (hasTriggeredRef.current) return;

        // Avoid stacking on top of another active blocking modal (e.g., profile modal or lightbox)
        const existingDialog = document.querySelector(
          '[role="dialog"][aria-modal="true"]:not([data-brochure-popup="true"])'
        );
        if (existingDialog) return;

        hasTriggeredRef.current = true;
        cleanupListeners();
        setIsClosing(false);
        setIsEntered(false);
        setIsExpandedView(false);
        setIsOpen(true);
      }, REVEAL_DELAY_MS);
    };

    function checkScrollPosition(event?: Event) {
      if (hasTriggeredRef.current) return;
      const target = event?.target;
      if (
        target &&
        target !== window &&
        target !== document &&
        target !== document.documentElement &&
        target !== document.body &&
        target !== window.visualViewport
      ) {
        return;
      }

      if (getCurrentScrollY() >= getIntendedScrollThreshold()) {
        scheduleReveal();
      }
    }

    if (getCurrentScrollY() >= getIntendedScrollThreshold()) {
      scheduleReveal();
    }

    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    document.addEventListener('scroll', checkScrollPosition, { passive: true, capture: true });
    window.addEventListener('touchmove', checkScrollPosition, { passive: true });
    window.addEventListener('touchend', checkScrollPosition, { passive: true });
    window.visualViewport?.addEventListener('scroll', checkScrollPosition, { passive: true });

    return () => {
      cleanupListeners();
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    };
  }, [dismissedForSession, imageFailed]);

  const handleClose = useCallback(() => {
    if (!isOpen || isClosing) return;

    setIsClosing(true);
    setIsEntered(false);
    markDismissedInSession();

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    closeTimerRef.current = window.setTimeout(
      () => {
        closeTimerRef.current = null;
        setIsOpen(false);
        setIsClosing(false);
        setIsExpandedView(false);
        setDismissedForSession(true);
      },
      reducedMotion ? 10 : CLOSE_ANIMATION_MS
    );
  }, [isOpen, isClosing]);

  const handleApplyEnquiry = useCallback(() => {
    handleClose();
    onOpenEnquiry?.();
  }, [handleClose, onOpenEnquiry]);

  /* Smooth entrance animation, Escape key handling, and accessible focus */
  useEffect(() => {
    if (!isOpen) return undefined;

    const triggerEnter = () => {
      setIsEntered(true);
      closeButtonRef.current?.focus({ preventScroll: true });
    };

    enterRafRef.current = window.requestAnimationFrame(() => {
      enterRafRef.current = window.requestAnimationFrame(triggerEnter);
    });
    enterTimerRef.current = window.setTimeout(triggerEnter, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      if (enterRafRef.current !== null) {
        window.cancelAnimationFrame(enterRafRef.current);
        enterRafRef.current = null;
      }
      if (enterTimerRef.current !== null) {
        window.clearTimeout(enterTimerRef.current);
        enterTimerRef.current = null;
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  useEffect(() => clearTimers, [clearTimers]);

  if (!isOpen || imageFailed || typeof document === 'undefined') {
    return null;
  }

  const visibleState = isEntered && !isClosing;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      data-brochure-popup="true"
      aria-label="CAPITOL HILL COLLEGE Admissions 2026 Brochure"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-[2px] transition-opacity duration-250 ease-out ${
        visibleState ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
          isExpandedView
            ? 'max-w-[calc(100vw-2rem)] sm:max-w-[680px]'
            : 'max-w-[340px] sm:max-w-[440px] md:max-w-[470px]'
        } ${
          visibleState
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-2'
        }`}
      >
        {/* Top-Right Close (×) Control */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={handleClose}
          aria-label="Close brochure popup"
          title="Close"
          className="absolute -top-3 -right-3 sm:-top-3.5 sm:-right-3.5 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-[var(--color-primary-ink)] border border-[var(--color-hairline)] shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:bg-[var(--color-brand)] hover:text-white hover:border-[var(--color-brand)] active:scale-95 transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
        >
          <X className="w-5 h-5" strokeWidth={2.25} aria-hidden="true" />
        </button>

        {/* Framed Brochure Card with Action Bar */}
        <div className="rounded-2xl bg-white border border-white/90 shadow-[0_28px_72px_-14px_rgba(0,0,0,0.52)] overflow-hidden flex flex-col max-h-[90dvh]">
          {/* Scrollable Brochure Visual Viewport */}
          <div
            className={`bg-neutral-50 p-1.5 sm:p-2 ${
              isExpandedView ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden'
            }`}
          >
            <div className="rounded-xl overflow-hidden bg-white">
              <img
                src={PROMO_POPUP_IMAGE_SRC}
                alt="CAPITOL HILL COLLEGE Admissions Open 2026 Brochure — +2 Science, Management, Law, Humanities, BBS & MBS at CHC Campus, Teku, Kathmandu"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => {
                  setImageFailed(true);
                  setIsOpen(false);
                }}
                className={`block mx-auto select-none ${
                  isExpandedView
                    ? 'w-full h-auto'
                    : 'w-auto max-w-full h-auto max-h-[62dvh] sm:max-h-[68dvh]'
                }`}
              />
            </div>
          </div>

          {/* Brochure Download, View Toggle & Admission Enquiry Action Bar */}
          <div className="px-3.5 sm:px-4 py-3 bg-white border-t border-[var(--color-hairline)] flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <a
                href={PROMO_POPUP_IMAGE_SRC}
                download={BROCHURE_DOWNLOAD_FILENAME}
                onClick={() => markDismissedInSession()}
                className="inline-flex items-center justify-center gap-1.5 min-h-10 px-3.5 py-2 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Download Brochure</span>
              </a>

              <button
                type="button"
                onClick={() => setIsExpandedView((prev) => !prev)}
                aria-label={isExpandedView ? 'Fit brochure to screen' : 'View brochure full size'}
                className="inline-flex items-center justify-center gap-1.5 min-h-10 px-3 py-2 text-xs font-medium text-[var(--color-primary-ink)] bg-[var(--color-canvas)] hover:bg-neutral-200/75 border border-[var(--color-hairline)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isExpandedView ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Fit View</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>View Full</span>
                  </>
                )}
              </button>
            </div>

            {onOpenEnquiry && (
              <button
                type="button"
                onClick={handleApplyEnquiry}
                className="inline-flex items-center justify-center gap-1.5 min-h-10 px-3 py-2 text-xs font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Admission Enquiry</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
