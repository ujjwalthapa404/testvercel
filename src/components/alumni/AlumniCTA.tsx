import React from 'react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { AlumniCtaContent } from '../../types/alumni';

interface AlumniCTAProps {
  content: AlumniCtaContent;
  onOpenEnquiry: () => void;
}

export const AlumniCTA: React.FC<AlumniCTAProps> = ({ content, onOpenEnquiry }) => {
  const emailHref = `mailto:${content.officialEmail}?subject=${encodeURIComponent(
    'Alumni Reconnection & Achievement Update — Capitol Hill College'
  )}`;

  return (
    <section
      id="alumni-connect"
      aria-labelledby="alumni-cta-heading"
      className="py-16 sm:py-20 bg-[var(--color-primary-ink)] text-white border-t-4 border-t-[var(--color-brand)] scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Message & Actions */}
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-on-dark)]">
              {content.eyebrow}
            </p>

            <h2
              id="alumni-cta-heading"
              className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-white"
            >
              {content.heading}
            </h2>

            <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
              {content.description}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={onOpenEnquiry}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-white"
              >
                <span>{content.primaryActionLabel}</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>

              <a
                href={emailHref}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold text-white border border-white/30 hover:border-white hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-white"
              >
                <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{content.secondaryEmailLabel}</span>
              </a>
            </div>

            <p className="mt-5 text-xs text-neutral-400 leading-relaxed">
              {content.administrationNote}
            </p>
          </div>

          {/* Right Direct Campus Contact Panel */}
          <div className="lg:col-span-4 lg:border-l lg:border-white/15 lg:pl-8 pt-6 lg:pt-1 border-t border-white/15 lg:border-t-0">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Direct Administration Desk
            </h3>

            <ul className="mt-4 space-y-3.5 text-sm text-neutral-200">
              <li className="flex items-start gap-2.5">
                <MapPin
                  className="w-4 h-4 text-[var(--color-brand-on-dark)] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{content.campusLocation}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone
                  className="w-4 h-4 text-[var(--color-brand-on-dark)] shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={content.officialPhoneHref}
                  className="hover:text-white hover:underline underline-offset-4 tabular-nums focus-visible:outline-white"
                >
                  {content.officialPhone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail
                  className="w-4 h-4 text-[var(--color-brand-on-dark)] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <a
                  href={emailHref}
                  className="hover:text-white hover:underline underline-offset-4 break-all focus-visible:outline-white"
                >
                  {content.officialEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
