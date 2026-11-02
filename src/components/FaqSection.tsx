import React, { useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, Search, Settings, X } from 'lucide-react';
import { FaqCategory, FaqEntry } from '../types/notice';

interface FaqSectionProps {
  faqs: FaqEntry[];
  isAdmin?: boolean;
  onOpenEnquiry: () => void;
  onManageFaqs?: () => void;
}

const FAQ_FILTER_TABS: Array<{ value: 'All' | FaqCategory; label: string }> = [
  { value: 'All', label: 'All' },
  { value: FaqCategory.ADMISSIONS, label: 'Admissions' },
  { value: FaqCategory.ACADEMICS, label: 'Academics' },
  { value: FaqCategory.EXAMINATIONS, label: 'Examinations' },
  { value: FaqCategory.CAMPUS, label: 'Campus & Facilities' },
  { value: FaqCategory.GENERAL, label: 'General' },
];

export const FaqSection: React.FC<FaqSectionProps> = ({
  faqs,
  isAdmin = false,
  onOpenEnquiry,
  onManageFaqs,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | FaqCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(() =>
    faqs.length > 0 ? [faqs[0].id] : []
  );

  const queryMatchedFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.category.toLowerCase().includes(q)
    );
  }, [faqs, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: queryMatchedFaqs.length };
    for (const cat of Object.values(FaqCategory)) {
      counts[cat] = 0;
    }
    for (const faq of queryMatchedFaqs) {
      counts[faq.category] = (counts[faq.category] ?? 0) + 1;
    }
    return counts;
  }, [queryMatchedFaqs]);

  const filteredFaqs = useMemo(() => {
    if (selectedCategory === 'All') {
      return queryMatchedFaqs;
    }
    return queryMatchedFaqs.filter((item) => item.category === selectedCategory);
  }, [queryMatchedFaqs, selectedCategory]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allVisibleExpanded =
    filteredFaqs.length > 0 && filteredFaqs.every((item) => openIds.includes(item.id));

  const handleToggleAllVisible = () => {
    if (allVisibleExpanded) {
      const visibleSet = new Set(filteredFaqs.map((f) => f.id));
      setOpenIds((prev) => prev.filter((id) => !visibleSet.has(id)));
    } else {
      const merged = new Set([...openIds, ...filteredFaqs.map((f) => f.id)]);
      setOpenIds(Array.from(merged));
    }
  };

  return (
    <section id="faq" className="py-20 bg-white border-b border-[var(--color-hairline)]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[var(--color-hairline)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
              Student &amp; Guardian Guidance
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary-ink)]">
              Frequently Asked Questions
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[var(--color-muted)] max-w-2xl">
              Clear answers to common questions regarding academic programs, admission requirements,
              examinations, and campus visits at Capitol Hill College.
            </p>
          </div>

          {isAdmin && onManageFaqs && (
            <button
              type="button"
              onClick={onManageFaqs}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[var(--color-primary-ink)] bg-[var(--color-canvas)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              Manage FAQs
            </button>
          )}
        </div>

        {/* Category Filter Tabs + Search + Expand/Collapse Control */}
        <div className="mt-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div
            role="group"
            aria-label="Filter FAQs by topic"
            className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 max-w-full"
          >
            {FAQ_FILTER_TABS.map(({ value, label }) => {
              const isSelected = selectedCategory === value;
              const count = categoryCounts[value] ?? 0;

              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCategory(value)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]'
                      : 'bg-[var(--color-canvas)] text-[var(--color-muted)] border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-primary-ink)]'
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

          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search frequently asked questions"
                placeholder="Search questions..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[var(--color-canvas)] focus:bg-white border border-[var(--color-hairline)] rounded-lg focus:border-[var(--color-brand)] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear FAQ search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[var(--color-muted)] hover:text-[var(--color-primary-ink)] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {filteredFaqs.length > 1 && (
              <button
                type="button"
                onClick={handleToggleAllVisible}
                className="text-xs font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {allVisibleExpanded ? 'Collapse all' : 'Expand all'}
              </button>
            )}
          </div>
        </div>

        {/* Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="mt-8 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl p-10 text-center">
            <h3 className="text-lg font-semibold text-[var(--color-primary-ink)]">
              No matching questions found
            </h3>
            <p className="mt-2 text-sm text-[var(--color-muted)] max-w-md mx-auto">
              Try clearing your search or topic filter, or reach out directly to our admissions desk.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] transition-colors rounded-lg cursor-pointer"
            >
              Reset FAQ Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 bg-white border border-[var(--color-hairline)] rounded-xl divide-y divide-[var(--color-hairline)]">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIds.includes(faq.id);
              const buttonId = `faq-trigger-${faq.id}`;
              const panelId = `faq-panel-${faq.id}`;
              const displayIndex = String(index + 1).padStart(2, '0');

              return (
                <div key={faq.id} className="p-5 sm:p-6">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(faq.id)}
                      className="w-full flex items-start justify-between gap-4 text-left group cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-1.5">
                          <span className="tabular-nums font-mono text-[11px] text-neutral-500">
                            {displayIndex}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-[var(--color-brand)]">
                            {faq.category}
                          </span>
                        </div>
                        <span className="block font-display text-lg sm:text-xl font-semibold text-[var(--color-primary-ink)] group-hover:text-[var(--color-brand)] transition-colors">
                          {faq.question}
                        </span>
                      </div>

                      <span
                        aria-hidden="true"
                        className={`mt-1 inline-flex items-center justify-center w-8 h-8 rounded-lg border shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-[var(--color-brand)] border-[var(--color-brand)] text-white'
                            : 'border-[var(--color-hairline)] text-[var(--color-primary-ink)] group-hover:border-[var(--color-brand)] group-hover:text-[var(--color-brand)]'
                        }`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-150 ${
                            isOpen ? 'rotate-180' : 'rotate-0'
                          }`}
                        />
                      </span>
                    </button>
                  </h3>

                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="mt-4 pt-4 border-t border-[var(--color-hairline)] text-sm sm:text-base text-[var(--color-muted)] leading-relaxed max-w-prose"
                    >
                      <p className="whitespace-pre-line">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Direct Enquiry Follow-Up Bar */}
        <div className="mt-8 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-primary-ink)]">
              Still have a question for our admissions team?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[var(--color-muted)]">
              Submit an enquiry online or call our Teku campus office at{' '}
              <span className="tabular-nums font-semibold text-[var(--color-primary-ink)]">
                01-5312399
              </span>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenEnquiry}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Ask Admissions
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
