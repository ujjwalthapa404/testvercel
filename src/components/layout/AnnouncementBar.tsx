import React, { useState, useEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { NoticeItem } from '../../types/notice';

interface AnnouncementBarProps {
  notice?: NoticeItem;
  onNavigateToNotices: (noticeSlug?: string) => void;
}

const DISMISS_STORAGE_KEY = 'chc_dismissed_announcement_id';

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  notice,
  onNavigateToNotices,
}) => {
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DISMISS_STORAGE_KEY);
      if (saved) {
        setDismissedId(saved);
      }
    } catch {
      // Ignore storage access errors in restricted browsing contexts
    }
  }, []);

  if (!notice || dismissedId === notice.id) {
    return null;
  }

  const handleDismiss = () => {
    setDismissedId(notice.id);
    try {
      sessionStorage.setItem(DISMISS_STORAGE_KEY, notice.id);
    } catch {
      // Ignore storage access errors
    }
  };

  return (
    <div
      role="region"
      aria-label="Urgent college announcement"
      className="w-full bg-[var(--color-canvas)] text-[var(--color-primary-ink)] border-b border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="font-semibold tracking-wide uppercase text-[11px] whitespace-nowrap shrink-0 text-[var(--color-brand)]">
            {notice.priority === 'HIGH' ? 'Urgent Notice' : notice.category}
          </span>
          <span aria-hidden="true" className="shrink-0 text-neutral-400">
            ·
          </span>
          <button
            type="button"
            onClick={() => onNavigateToNotices(notice.slug)}
            className="font-medium text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] hover:underline underline-offset-4 truncate text-left transition-colors cursor-pointer"
          >
            {notice.title}
          </button>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateToNotices()}
            className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>View Notices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss announcement bar"
            className="p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-primary-ink)] hover:bg-neutral-200/75 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
