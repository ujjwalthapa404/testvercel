import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  ADDITIONAL_DIRECTORS_MESSAGES,
  CEO_DIRECTOR_MESSAGE,
  LeadershipMessageEntry,
  PRINCIPAL_MESSAGE,
} from '../data/leadershipMessages';
import {
  PRINCIPAL_PORTRAIT_4X5_IMG_CLASS,
  PRINCIPAL_PORTRAIT_BG_CLASS,
} from '../utils/portraitFraming';

interface LeadershipMessagesSectionProps {
  onNavigateLeadership?: () => void;
}

interface PortraitFrameProps {
  entry: LeadershipMessageEntry;
}

const PortraitFrame: React.FC<PortraitFrameProps> = ({ entry }) => {
  const [imgFailed, setImgFailed] = useState(false);

  const initials = entry.leaderName
    .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Er\.)\s+/i, '')
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="bg-white border border-[var(--color-hairline)] rounded-xl overflow-hidden">
      <div
        className={`relative w-full aspect-[4/5] overflow-hidden ${
          entry.isCutoutPortrait ? PRINCIPAL_PORTRAIT_BG_CLASS : 'bg-white'
        }`}
      >
        {!imgFailed ? (
          <img
            src={entry.portraitSrc}
            alt={entry.portraitAlt}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
            className={
              entry.isCutoutPortrait
                ? PRINCIPAL_PORTRAIT_4X5_IMG_CLASS
                : 'w-full h-full object-cover object-top select-none'
            }
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--color-primary-ink)] text-white p-8">
            <span className="font-display text-4xl font-semibold tracking-wider text-white/90">
              {initials}
            </span>
            <span className="mt-3 text-xs uppercase tracking-[0.16em] text-white/65">
              {entry.institution}
            </span>
          </div>
        )}
      </div>

      {/* Formal Institutional Nameplate */}
      <div className="p-5 sm:p-6 border-t border-[var(--color-hairline)] bg-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-brand)]">
          {entry.designation}
        </p>
        <h3 className="mt-1 font-display text-xl sm:text-2xl font-semibold tracking-tight text-[var(--color-primary-ink)]">
          {entry.leaderName}
        </h3>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          {entry.campusLocationLine}
        </p>

        {entry.institutionalHighlights && entry.institutionalHighlights.length > 0 && (
          <ul className="mt-4 pt-4 border-t border-[var(--color-hairline)] space-y-2 text-xs text-[var(--color-ink)] leading-relaxed">
            {entry.institutionalHighlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] shrink-0"
                />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

interface MessageProseProps {
  entry: LeadershipMessageEntry;
}

const MessageProse: React.FC<MessageProseProps> = ({ entry }) => {
  return (
    <div className="max-w-[68ch]">
      <p className="font-display text-lg sm:text-xl font-medium text-[var(--color-primary-ink)]">
        {entry.salutation}
      </p>

      <div className="mt-5 space-y-4 text-[15px] sm:text-base text-[var(--color-ink)] leading-[1.8]">
        {entry.openingParagraphs.map((paragraph, idx) => (
          <p key={`${entry.id}-open-${idx}`}>{paragraph}</p>
        ))}
      </div>

      {entry.subsections &&
        entry.subsections.map((sub) => (
          <div key={sub.subheading} className="mt-8 pt-6 border-t border-[var(--color-hairline)]">
            <h4 className="font-display text-xl sm:text-[1.35rem] font-semibold tracking-tight text-[var(--color-primary-ink)]">
              {sub.subheading}
            </h4>
            <div className="mt-3.5 space-y-4 text-[15px] sm:text-base text-[var(--color-ink)] leading-[1.8]">
              {sub.paragraphs.map((paragraph, pIdx) => (
                <p key={`${sub.subheading}-${pIdx}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}

      {/* Formal Sign-Off */}
      <div className="mt-8 pt-6 border-t border-[var(--color-hairline)]">
        <p className="text-sm text-[var(--color-muted)]">{entry.closingPhrase}</p>
        <p className="mt-2 font-display text-lg font-semibold text-[var(--color-primary-ink)]">
          {entry.leaderName}
        </p>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
          {entry.designation}, {entry.institution}
        </p>
      </div>
    </div>
  );
};

export const LeadershipMessagesSection: React.FC<LeadershipMessagesSectionProps> = ({
  onNavigateLeadership,
}) => {
  return (
    <>
      {/* 1. Dedicated Message from the Principal Section */}
      <section
        id="principal-message"
        aria-labelledby="principal-message-heading"
        className="py-20 lg:py-24 bg-white border-b border-[var(--color-hairline)]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Portrait Column — Clean Transparent Cutout on Subtle Neutral Backdrop */}
            <div className="lg:col-span-4 max-w-sm lg:max-w-none w-full mx-auto">
              <PortraitFrame entry={PRINCIPAL_MESSAGE} />
            </div>

            {/* Right Editorial Letter Column */}
            <div className="lg:col-span-8">
              <div className="pb-6 mb-7 border-b border-[var(--color-hairline)]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                  {PRINCIPAL_MESSAGE.sectionKicker}
                </p>
                <h2
                  id="principal-message-heading"
                  className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-primary-ink)]"
                >
                  {PRINCIPAL_MESSAGE.sectionHeading}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {PRINCIPAL_MESSAGE.campusLocationLine}
                </p>
              </div>

              <MessageProse entry={PRINCIPAL_MESSAGE} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dedicated Message from the CEO & Directors Section */}
      <section
        id="ceo-directors-message"
        aria-labelledby="ceo-directors-message-heading"
        className="py-20 lg:py-24 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[var(--color-hairline)]">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                Message from the CEO &amp; Directors
              </p>
              <h2
                id="ceo-directors-message-heading"
                className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-primary-ink)]"
              >
                {CEO_DIRECTOR_MESSAGE.sectionHeading}
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                Executive vision, institutional heritage since 2005 AD, and our commitment to
                academic rigor and student mentorship at Capitol Hill College.
              </p>
            </div>

            {onNavigateLeadership && (
              <button
                type="button"
                onClick={onNavigateLeadership}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start md:self-auto"
              >
                <span>Board &amp; Governance Directory</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Primary CEO & Director Editorial Sheet */}
          <div className="mt-10 bg-white border border-[var(--color-hairline)] rounded-xl p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Portrait Column (Ordered right on desktop to create visual cadence opposite the Principal section) */}
              <div className="lg:col-span-4 lg:order-2 max-w-sm lg:max-w-none w-full mx-auto lg:sticky lg:top-24">
                <PortraitFrame entry={CEO_DIRECTOR_MESSAGE} />
              </div>

              {/* Verbatim Official Letter Column */}
              <div className="lg:col-span-8 lg:order-1">
                <MessageProse entry={CEO_DIRECTOR_MESSAGE} />
              </div>
            </div>
          </div>

          {/* Additional Board Directors' Messages (Automatically renders when entries are added) */}
          {ADDITIONAL_DIRECTORS_MESSAGES.length > 0 && (
            <div className="mt-10 space-y-10">
              {ADDITIONAL_DIRECTORS_MESSAGES.map((directorEntry) => (
                <div
                  key={directorEntry.id}
                  className="bg-white border border-[var(--color-hairline)] rounded-xl p-6 sm:p-10 lg:p-12"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                    <div className="lg:col-span-4 max-w-sm lg:max-w-none w-full mx-auto">
                      <PortraitFrame entry={directorEntry} />
                    </div>
                    <div className="lg:col-span-8">
                      <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-primary-ink)] pb-5 mb-6 border-b border-[var(--color-hairline)]">
                        {directorEntry.sectionHeading}
                      </h3>
                      <MessageProse entry={directorEntry} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
