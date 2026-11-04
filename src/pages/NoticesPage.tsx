import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Download,
  FileText,
  Search,
  Share2,
  X,
} from 'lucide-react';
import { NoticeCategory, NoticeItem } from '../types/notice';
import { formatNoticeDate } from '../data/notices';

interface NoticesPageProps {
  notices: NoticeItem[];
  activeSlug: string | null;
  onSelectNotice: (slug: string | null) => void;
  onBackToHome: () => void;
  onOpenEnquiry: (programTitle?: string) => void;
}

type CategoryFilterValue = 'All' | NoticeCategory;

const FILTER_CATEGORIES: Array<{ value: 'All' | NoticeCategory; label: string }> = [
  { value: 'All', label: 'All' },
  { value: NoticeCategory.ADMISSIONS, label: 'Admissions' },
  { value: NoticeCategory.EXAMINATIONS, label: 'Examinations' },
  { value: NoticeCategory.EVENTS, label: 'Events' },
  { value: NoticeCategory.RESULTS, label: 'Results' },
  { value: NoticeCategory.URGENT, label: 'Urgent' },
  { value: NoticeCategory.GENERAL, label: 'General' },
];

const ITEMS_PER_PAGE = 5;

function toLocalDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateInputLabel(yyyyMmDd: string): string {
  const parsed = new Date(`${yyyyMmDd}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return yyyyMmDd;
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed);
}

export const NoticesPage: React.FC<NoticesPageProps> = ({
  notices,
  activeSlug,
  onSelectNotice,
  onBackToHome,
  onOpenEnquiry,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterValue>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedSlug, setCopiedSlug] = useState(false);

  const selectedNotice = useMemo(
    () => (activeSlug ? notices.find((item) => item.slug === activeSlug) ?? null : null),
    [activeSlug, notices]
  );

  const isDateRangeInverted = Boolean(startDate && endDate && startDate > endDate);

  /* Notices matching keyword search + publication date range so category chip counts stay accurate */
  const queryAndDateMatchedNotices = useMemo(() => {
    if (isDateRangeInverted) {
      return [];
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const startBoundMs = startDate ? new Date(`${startDate}T00:00:00`).getTime() : null;
    const endBoundMs = endDate ? new Date(`${endDate}T23:59:59.999`).getTime() : null;

    return notices.filter((notice) => {
      const matchesQuery =
        !normalizedQuery ||
        notice.title.toLowerCase().includes(normalizedQuery) ||
        notice.excerpt.toLowerCase().includes(normalizedQuery) ||
        notice.category.toLowerCase().includes(normalizedQuery);

      if (!matchesQuery) {
        return false;
      }

      if (startBoundMs !== null || endBoundMs !== null) {
        const publishedMs = new Date(notice.publishedAt).getTime();
        if (Number.isNaN(publishedMs)) {
          return false;
        }
        if (startBoundMs !== null && publishedMs < startBoundMs) {
          return false;
        }
        if (endBoundMs !== null && publishedMs > endBoundMs) {
          return false;
        }
      }

      return true;
    });
  }, [notices, searchQuery, startDate, endDate, isDateRangeInverted]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: queryAndDateMatchedNotices.length,
    };
    for (const cat of Object.values(NoticeCategory)) {
      counts[cat] = 0;
    }
    for (const notice of queryAndDateMatchedNotices) {
      counts[notice.category] = (counts[notice.category] ?? 0) + 1;
    }
    return counts;
  }, [queryAndDateMatchedNotices]);

  const filteredNotices = useMemo(() => {
    if (selectedCategory === 'All') {
      return queryAndDateMatchedNotices;
    }
    return queryAndDateMatchedNotices.filter((notice) => notice.category === selectedCategory);
  }, [queryAndDateMatchedNotices, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedNotices = filteredNotices.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (category: CategoryFilterValue) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    setCurrentPage(1);
  };

  const applyDatePreset = (daysBack: number | 'year') => {
    const today = new Date();
    const endStr = toLocalDateInputValue(today);

    if (daysBack === 'year') {
      setStartDate(`${today.getFullYear()}-01-01`);
      setEndDate(endStr);
    } else {
      const start = new Date(today);
      start.setDate(today.getDate() - daysBack);
      setStartDate(toLocalDateInputValue(start));
      setEndDate(endStr);
    }
    setCurrentPage(1);
  };

  const clearDateRange = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const handleCopyShareLink = async (slug: string) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#notices/${slug}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedSlug(true);
      setTimeout(() => setCopiedSlug(false), 2000);
    } catch {
      setCopiedSlug(false);
    }
  };

  const handleDownloadSummary = (notice: NoticeItem) => {
    const textBody = [
      'CAPITOL HILL COLLEGE — TEKU, KATHMANDU, NEPAL',
      'OFFICIAL NOTICE SUMMARY',
      '--------------------------------------------------',
      `Title: ${notice.title}`,
      `Category: ${notice.category}`,
      `Published: ${formatNoticeDate(notice.publishedAt)}`,
      `Issued By: ${notice.authorName}`,
      '',
      ...notice.content,
      '',
      'Contact: 01-5312399 | info.capitolhillcollege@gmail.com',
    ].join('\n');

    const blob = new Blob([textBody], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${notice.slug}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  /* Individual Notice Detail View */
  if (selectedNotice) {
    return (
      <div className="bg-[var(--color-canvas)] py-12 sm:py-16">
        <section className="max-w-4xl mx-auto px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-8"
          >
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-[var(--color-brand)] hover:underline underline-offset-4 cursor-pointer"
            >
              Home
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onSelectNotice(null)}
              className="hover:text-[var(--color-brand)] hover:underline underline-offset-4 cursor-pointer"
            >
              Notices &amp; Announcements
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[var(--color-primary-ink)] truncate max-w-[220px] sm:max-w-xs">
              {selectedNotice.title}
            </span>
          </nav>

          <article className="bg-white border border-[var(--color-hairline)] rounded-xl p-6 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[var(--color-muted)]">
                <span className="font-semibold text-[var(--color-brand)]">
                  {selectedNotice.category}
                </span>
                <span aria-hidden="true">·</span>
                <time dateTime={selectedNotice.publishedAt} className="tabular-nums">
                  Published {formatNoticeDate(selectedNotice.publishedAt)}
                </time>
                <span aria-hidden="true">·</span>
                <span>{selectedNotice.authorName}</span>
                {selectedNotice.isPinned && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[var(--color-brand)]">
                      Pinned Announcement
                    </span>
                  </>
                )}
              </div>
            </div>

            <h1 className="mt-4 text-2xl sm:text-4xl font-semibold text-[var(--color-primary-ink)] leading-tight">
              {selectedNotice.title}
            </h1>

            <div className="mt-6 pt-6 border-t border-[var(--color-hairline)] space-y-4 text-base text-[var(--color-ink)] leading-relaxed max-w-prose">
              {selectedNotice.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {selectedNotice.attachment && (
              <div className="mt-8 pt-6 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[var(--color-brand)] shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-ink)]">
                      {selectedNotice.attachment.fileName}
                    </p>
                    <p className="text-xs text-[var(--color-muted)] tabular-nums">
                      {selectedNotice.attachment.fileType} · {selectedNotice.attachment.fileSizeLabel}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadSummary(selectedNotice)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-[var(--color-primary-ink)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Notice Copy
                </button>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-[var(--color-hairline)] flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => onSelectNotice(null)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] hover:underline underline-offset-4 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Notices
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyShareLink(selectedNotice.slug)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] border border-[var(--color-hairline)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedSlug ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      Link Copied
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      Copy Link
                    </>
                  )}
                </button>

                {selectedNotice.category === NoticeCategory.ADMISSIONS && (
                  <button
                    type="button"
                    onClick={() => onOpenEnquiry()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Submit Admission Enquiry
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </article>
        </section>
      </div>
    );
  }

  /* Dedicated Notices & Announcements Directory View */
  const hasDateFilter = Boolean(startDate || endDate);
  const hasActiveFilters =
    selectedCategory !== 'All' || searchQuery.trim().length > 0 || hasDateFilter;

  return (
    <div className="bg-[var(--color-canvas)]">
      {/* Crisp White Subpage Header & Filter Band */}
      <section className="bg-white border-b border-[var(--color-hairline)] py-12 sm:py-14">
        <div className="max-w-7xl mx-auto px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-6"
          >
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-[var(--color-brand)] hover:underline underline-offset-4 cursor-pointer"
            >
              Home
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[var(--color-primary-ink)]">
              Notices &amp; Announcements
            </span>
          </nav>

          {/* Top Header + Search + Category Chips + Publication Date Range Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                Official Bulletin Board
              </p>
              <h1 className="text-3xl sm:text-5xl font-semibold text-[var(--color-primary-ink)]">
                Notices &amp; Announcements
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] max-w-2xl">
                Official updates on admissions, examination schedules, academic results, and campus
                events from CAPITOL HILL COLLEGE, Teku.
              </p>
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full lg:w-80 shrink-0">
              <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                aria-label="Search notices"
                placeholder="Search notices by keyword..."
                className="w-full pl-9 pr-9 py-2.5 text-sm bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-lg focus:bg-white focus:border-[var(--color-brand)] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Row of Clickable Category Chips */}
          <div className="mt-7 flex items-center justify-between gap-4">
            <div
              role="group"
              aria-label="Filter notices by category"
              className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 max-w-full"
            >
              {FILTER_CATEGORIES.map(({ value, label }) => {
                const isSelected = selectedCategory === value;
                const count = categoryCounts[value] ?? 0;

                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleCategoryChange(value)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]'
                        : 'bg-[var(--color-canvas)] text-[var(--color-muted)] border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]'
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`tabular-nums text-[11px] font-normal ${
                        isSelected ? 'text-white/85' : 'text-[var(--color-muted)]'
                      }`}
                    >
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Publication Date Range Filter Controls */}
          <div
            role="group"
            aria-label="Filter notices by publication date range"
            className="mt-5 pt-5 border-t border-[var(--color-hairline)] flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted)] whitespace-nowrap shrink-0">
                <Calendar className="w-3.5 h-3.5 text-[var(--color-brand)]" />
                Publication Date:
              </span>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="notice-date-from"
                    className="text-xs text-[var(--color-muted)] whitespace-nowrap shrink-0"
                  >
                    From
                  </label>
                  <input
                    id="notice-date-from"
                    type="date"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-lg text-[var(--color-ink)] tabular-nums focus:bg-white focus:border-[var(--color-brand)] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="notice-date-to"
                    className="text-xs text-[var(--color-muted)] whitespace-nowrap shrink-0"
                  >
                    To
                  </label>
                  <input
                    id="notice-date-to"
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-lg text-[var(--color-ink)] tabular-nums focus:bg-white focus:border-[var(--color-brand)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => applyDatePreset(7)}
                className="px-3 py-1.5 text-xs font-medium bg-[var(--color-canvas)] text-[var(--color-muted)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => applyDatePreset(30)}
                className="px-3 py-1.5 text-xs font-medium bg-[var(--color-canvas)] text-[var(--color-muted)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => applyDatePreset('year')}
                className="px-3 py-1.5 text-xs font-medium bg-[var(--color-canvas)] text-[var(--color-muted)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                This Year
              </button>

              {hasDateFilter && (
                <button
                  type="button"
                  onClick={clearDateRange}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[var(--color-brand)] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear dates
                </button>
              )}
            </div>
          </div>

          {isDateRangeInverted && (
            <p role="alert" className="mt-3 text-xs font-medium text-[var(--color-brand)]">
              The start date must be earlier than or equal to the end date.
            </p>
          )}
        </div>
      </section>

      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-6">
        {/* Active Result Summary */}
        <div className="flex items-center justify-between gap-4 text-xs text-[var(--color-muted)]">
          <p className="tabular-nums">
            Showing{' '}
            <strong className="font-semibold text-[var(--color-ink)]">{filteredNotices.length}</strong>{' '}
            {filteredNotices.length === 1 ? 'published notice' : 'published notices'}
            {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
            {searchQuery.trim() ? ` matching “${searchQuery.trim()}”` : ''}
            {startDate && endDate
              ? ` · Published ${formatDateInputLabel(startDate)} – ${formatDateInputLabel(endDate)}`
              : startDate
              ? ` · Published from ${formatDateInputLabel(startDate)}`
              : endDate
              ? ` · Published up to ${formatDateInputLabel(endDate)}`
              : ''}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="sm:hidden text-xs font-semibold text-[var(--color-brand)] underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* Notices Feed */}
        {paginatedNotices.length === 0 ? (
          <div className="mt-6 bg-white border border-[var(--color-hairline)] rounded-xl p-12 text-center">
            <h2 className="text-xl font-semibold text-[var(--color-primary-ink)]">
              No matching notices found
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)] max-w-md mx-auto">
              No active notices match your selected category, publication date range, or search keyword.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-5 px-4 py-2 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {paginatedNotices.map((notice) => (
                <article
                  key={notice.id}
                  className="bg-white border border-[var(--color-hairline)] hover:border-[var(--color-brand)] rounded-xl p-6 sm:p-7 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[var(--color-muted)]">
                      <button
                        type="button"
                        onClick={() => handleCategoryChange(notice.category)}
                        className="font-semibold text-[var(--color-brand)] hover:underline underline-offset-4 cursor-pointer"
                      >
                        {notice.category}
                      </button>
                      <span aria-hidden="true">·</span>
                      <time dateTime={notice.publishedAt} className="tabular-nums">
                        {formatNoticeDate(notice.publishedAt)}
                      </time>
                      <span aria-hidden="true">·</span>
                      <span>{notice.authorName}</span>
                      {notice.isPinned && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-[var(--color-brand)]">Pinned</span>
                        </>
                      )}
                    </div>
                  </div>

                  <h2 className="mt-2.5 text-xl sm:text-2xl font-semibold text-[var(--color-primary-ink)]">
                    <button
                      type="button"
                      onClick={() => onSelectNotice(notice.slug)}
                      className="text-left hover:text-[var(--color-brand)] hover:underline underline-offset-4 transition-colors cursor-pointer"
                    >
                      {notice.title}
                    </button>
                  </h2>

                  <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed max-w-3xl">
                    {notice.excerpt}
                  </p>

                  <div className="mt-5 pt-4 border-t border-[var(--color-hairline)] flex flex-wrap items-center justify-between gap-4">
                    <div className="text-xs text-[var(--color-muted)]">
                      {notice.attachment
                        ? `Attachment available: ${notice.attachment.fileName}`
                        : 'Official Bulletin'}
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectNotice(notice.slug)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Read Full Notice
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 pt-6 border-t border-[var(--color-hairline)] flex items-center justify-between text-xs text-[var(--color-muted)]">
            <span className="tabular-nums">
              Showing page {safePage} of {totalPages} ({filteredNotices.length} active notices)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3.5 py-1.5 font-medium border border-[var(--color-hairline)] rounded-lg bg-white text-[var(--color-ink)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3.5 py-1.5 font-medium border border-[var(--color-hairline)] rounded-lg bg-white text-[var(--color-ink)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
