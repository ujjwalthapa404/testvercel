import React, { useState } from 'react';
import {
  ArrowRight,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { CollegeImage } from '../components/CollegeImage';
import { FaqSection } from '../components/FaqSection';
import { HeroOverviewVideo } from '../components/HeroOverviewVideo';
import { LeadershipMessagesSection } from '../components/LeadershipMessagesSection';
import { StudentInsightsCarousel } from '../components/studentInsights/StudentInsightsCarousel';
import {
  ACADEMIC_PROGRAMS,
  AcademicDivisionId,
  AcademicProgramSlug,
  OFFICIAL_CAMPUS_LOCATION,
} from '../data/academicPrograms';
import { FACILITIES_LIST } from '../data/facilities';
import { ALL_LEADERSHIP_PROFILES } from '../data/leadershipData';
import { formatNoticeDate } from '../data/notices';
import { FaqEntry, NoticeItem } from '../types/notice';

interface HomePageProps {
  activeNotices: NoticeItem[];
  activeFaqs: FaqEntry[];
  onNavigatePrograms: (slug?: AcademicProgramSlug) => void;
  onNavigateLeadership: () => void;
  onNavigateAdvisory: () => void;
  onNavigateFacilities: () => void;
  onNavigateTeam: () => void;
  onNavigateAlumni: () => void;
  onNavigateNotices: (slug?: string | null) => void;
  onNavigateContact: (programTitle?: string) => void;
  onOpenEnquiry: (programTitle?: string) => void;
}

const PROGRAM_FILTER_TABS = [
  { id: 'all', label: 'All Programs (6)' },
  { id: 'neb-plus-two', label: 'NEB (+2)' },
  { id: 'tribhuvan-university', label: 'Tribhuvan University' },
] as const;

export const HomePage: React.FC<HomePageProps> = ({
  activeNotices,
  activeFaqs,
  onNavigatePrograms,
  onNavigateLeadership,
  onNavigateAdvisory,
  onNavigateFacilities,
  onNavigateTeam,
  onNavigateAlumni,
  onNavigateNotices,
  onNavigateContact,
  onOpenEnquiry,
}) => {
  const [programDivisionFilter, setProgramDivisionFilter] = useState<'all' | AcademicDivisionId>(
    'all'
  );

  const filteredPrograms = ACADEMIC_PROGRAMS.filter(
    (program) =>
      programDivisionFilter === 'all' || program.divisionId === programDivisionFilter
  );

  return (
    <>
      {/* Immersive University Hero Showcase */}
      <section
        id="about"
        className="relative w-full overflow-hidden bg-[var(--color-primary-ink)] text-white border-b border-white/10 lg:min-h-[600px] xl:min-h-[670px] lg:h-[78vh] lg:max-h-[780px] lg:flex lg:flex-col lg:justify-between"
      >
        {/* Full-width 16:9 showcase at top on mobile/tablet; full-bleed cinema stage on desktop */}
        <HeroOverviewVideo />

        {/* College Branding, Introduction & Admission Actions */}
        <div className="relative z-10 flex-1 flex items-center w-full lg:pointer-events-none">
          <div className="max-w-7xl w-full mx-auto px-5 sm:px-6 lg:px-8 pt-6 pb-8 sm:pt-8 sm:pb-10 lg:py-14">
            <div className="max-w-2xl lg:max-w-[620px] pointer-events-auto">
              <p className="text-xs tracking-[0.16em] uppercase text-[var(--color-brand-on-dark)] font-semibold mb-3 sm:mb-4">
                CAPITOL HILL COLLEGE · Teku, Kathmandu · NEB &amp; TU Affiliated
              </p>
              <h1 className="text-[2rem] sm:text-4xl lg:text-5xl xl:text-[3.45rem] font-semibold tracking-tight leading-[1.08] text-white text-balance">
                Inspiring Minds. Shaping Futures.
              </h1>
              <p className="mt-3 sm:mt-3.5 font-sans text-sm sm:text-base lg:text-lg font-medium tracking-[0.02em] text-white/90">
                Quality Education • Practical Skills • Global Opportunities
              </p>
              <p className="mt-4 sm:mt-5 text-[15px] sm:text-base text-neutral-200 lg:text-neutral-100/95 leading-relaxed max-w-[54ch]">
                Founded by experienced academicians in Teku, Kathmandu, CAPITOL HILL COLLEGE offers
                Higher Secondary (+2 Management, +2 Humanities, +2 Science, and +2 Law) and
                Tribhuvan University (BBS &amp; MBS) degree programs focused on intellectual rigor,
                practical inquiry, and personal character.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => onOpenEnquiry()}
                  className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm focus-visible:outline-white"
                >
                  Request Admission Information
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={onNavigateFacilities}
                  className="inline-flex items-center justify-center min-h-11 px-6 py-3 text-sm font-medium text-white border border-white/35 bg-white/5 hover:bg-white/15 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-white"
                >
                  Explore Campus Facilities
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Institutional Operational Utility Strip */}
        <div className="relative z-10 border-t border-white/15 bg-[#171717]/88 lg:bg-[#171717]/70 lg:backdrop-blur-xs">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-neutral-200">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span>Teku, Kathmandu</span>
              <span aria-hidden="true" className="text-neutral-500">
                ·
              </span>
              <a
                href={OFFICIAL_CAMPUS_LOCATION.telephoneHref}
                className="tabular-nums hover:text-white transition-colors"
              >
                01-5312399
              </a>
              <span aria-hidden="true" className="text-neutral-500">
                ·
              </span>
              <a
                href={OFFICIAL_CAMPUS_LOCATION.emailHref}
                className="break-all sm:break-normal hover:text-white transition-colors"
              >
                info.capitolhillcollege@gmail.com
              </a>
            </div>
            <span className="text-[11px] font-medium tracking-[0.06em] text-neutral-300 whitespace-nowrap shrink-0">
              ...Shaping Futures Since 2005...
            </span>
          </div>
        </div>
      </section>

      {/* Latest Notices Preview Strip on Homepage */}
      <section className="py-16 bg-white border-b border-[var(--color-hairline)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-hairline)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                Official Updates
              </p>
              <h2 className="text-3xl font-semibold text-[var(--color-primary-ink)]">
                Latest Notices &amp; Announcements
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateNotices(null)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              View All Notices
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeNotices.slice(0, 3).map((notice) => (
              <article
                key={notice.id}
                className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] rounded-xl p-6 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                    <span className="font-semibold text-[var(--color-brand)]">
                      {notice.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={notice.publishedAt} className="tabular-nums">
                      {formatNoticeDate(notice.publishedAt)}
                    </time>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-[var(--color-primary-ink)] leading-snug">
                    <button
                      type="button"
                      onClick={() => onNavigateNotices(notice.slug)}
                      className="text-left hover:text-[var(--color-brand)] hover:underline underline-offset-4 transition-colors cursor-pointer"
                    >
                      {notice.title}
                    </button>
                  </h3>
                  <p className="mt-2.5 text-sm text-[var(--color-muted)] line-clamp-3">
                    {notice.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[var(--color-hairline)]">
                  <button
                    type="button"
                    onClick={() => onNavigateNotices(notice.slug)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors cursor-pointer"
                  >
                    Read Notice
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Programs Directory */}
      <section
        id="programs"
        className="py-20 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[var(--color-hairline)]">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                Academic Offerings
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary-ink)]">
                Academic Programs
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                Higher Secondary (+2) streams affiliated with the National Examinations Board (NEB)
                alongside undergraduate and postgraduate management degrees affiliated with
                Tribhuvan University (TU).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto max-w-full">
              <div
                role="group"
                aria-label="Filter academic programs by affiliation"
                className="flex flex-wrap sm:flex-nowrap items-center gap-1 p-1 bg-white border border-[var(--color-hairline)] rounded-lg max-w-full"
              >
                {PROGRAM_FILTER_TABS.map((tab) => {
                  const isActive = programDivisionFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setProgramDivisionFilter(tab.id)}
                      aria-pressed={isActive}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[var(--color-brand)] text-white shadow-2xs'
                          : 'text-[var(--color-muted)] hover:text-[var(--color-primary-ink)]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => onNavigatePrograms()}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                View All Programs
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <article
                key={program.slug}
                className="bg-white rounded-xl p-7 border border-[var(--color-hairline)] hover:border-neutral-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--color-muted)]">
                    <span className="font-semibold text-[var(--color-brand)]">
                      {program.divisionLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{program.affiliationShort}</span>
                    <span aria-hidden="true">·</span>
                    <span>{program.durationLabel}</span>
                  </div>
                  <h3 className="mt-3 text-xl sm:text-2xl font-semibold text-[var(--color-primary-ink)]">
                    <button
                      type="button"
                      onClick={() => onNavigatePrograms(program.slug)}
                      className="text-left hover:text-[var(--color-brand)] hover:underline underline-offset-4 transition-colors cursor-pointer"
                    >
                      {program.title}
                    </button>
                  </h3>
                  <p className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed">
                    {program.cardSummary}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-[var(--color-hairline)] flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigatePrograms(program.slug)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Explore Program
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenEnquiry(program.title)}
                    className="text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-primary-ink)] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Admission Enquiry
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Facilities Preview Strip on Homepage */}
      <section className="py-18 bg-white border-b border-[var(--color-hairline)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-hairline)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                Campus Environment
              </p>
              <h2 className="text-3xl font-semibold text-[var(--color-primary-ink)]">
                Facilities &amp; Services
              </h2>
            </div>
            <button
              type="button"
              onClick={onNavigateFacilities}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Explore All 6 Campus Facilities
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-7">
            {FACILITIES_LIST.slice(0, 3).map((item) => (
              <article key={item.id} className="group flex flex-col">
                <div className="rounded-xl overflow-hidden border border-[var(--color-hairline)]">
                  <CollegeImage
                    src={item.image.src}
                    alt={item.image.alt}
                    aspectClassName="aspect-[16/10]"
                    imgClassName="group-hover:scale-[1.02]"
                    fallbackTitle={item.title}
                  />
                </div>
                <div className="mt-4">
                  <p className="text-xs text-[var(--color-muted)]">
                    <span className="font-mono font-semibold text-[var(--color-brand)] tabular-nums">
                      {item.number}
                    </span>
                    <span aria-hidden="true" className="mx-1.5">
                      ·
                    </span>
                    <span>{item.categoryLabel}</span>
                  </p>
                  <h3 className="mt-1.5 text-xl font-semibold text-[var(--color-primary-ink)]">
                    <button
                      type="button"
                      onClick={onNavigateFacilities}
                      className="text-left hover:text-[var(--color-brand)] hover:underline underline-offset-4 transition-colors cursor-pointer"
                    >
                      {item.title}
                    </button>
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)] line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dedicated Principal's Message & CEO and Directors' Message Sections */}
      <LeadershipMessagesSection onNavigateLeadership={onNavigateLeadership} />

      {/* Institutional Leadership & Governance Overview */}
      <section
        id="leadership"
        className="py-20 bg-white border-b border-[var(--color-hairline)]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[var(--color-hairline)]">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                Institutional Stewardship
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary-ink)]">
                Leadership &amp; Academic Administration
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                Guided by experienced institutional stewards and academic administrators overseeing
                NEB (+2) streams and Tribhuvan University degree studies in Teku, Kathmandu.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onNavigateLeadership}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Leadership &amp; Governance
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onNavigateAdvisory}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[var(--color-primary-ink)] bg-white border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Advisory Committee
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onNavigateTeam}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Faculty &amp; Staff Directory
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {ALL_LEADERSHIP_PROFILES.map((leader) => (
              <button
                key={leader.id}
                type="button"
                onClick={onNavigateLeadership}
                className="text-left bg-[var(--color-canvas)] hover:bg-neutral-200/55 border border-[var(--color-hairline)] hover:border-neutral-400 rounded-xl p-6 flex items-center gap-4 transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-[var(--color-hairline)] shrink-0 bg-white">
                  <img
                    src={leader.portraitSrc}
                    alt={leader.portraitAlt}
                    referrerPolicy="no-referrer"
                    style={
                      leader.portraitObjectPosition
                        ? { objectPosition: leader.portraitObjectPosition }
                        : undefined
                    }
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
                      {leader.shortDesignation}
                    </p>
                    {leader.academicDistinction && (
                      <span className="font-mono text-[10px] font-bold text-[var(--color-brand)] bg-[var(--color-brand-soft)] px-1.5 py-0.5 rounded border border-[var(--color-brand)]/20 truncate">
                        {leader.academicDistinction.degreeTitle}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 text-lg font-semibold text-[var(--color-primary-ink)] truncate">
                    {leader.fullName}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--color-muted)] line-clamp-2">
                    {leader.academicDistinction
                      ? leader.academicDistinction.formattedLine
                      : leader.homepageSummaryRole}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Student Perspectives: Insights into College Life Carousel */}
      <StudentInsightsCarousel onNavigateToAllStories={onNavigateAlumni} />

      {/* Frequently Asked Questions Accordion Section */}
      <FaqSection faqs={activeFaqs} onOpenEnquiry={() => onOpenEnquiry()} />

      {/* Contact & Institutional Identity */}
      <section id="contact" className="py-16 bg-[var(--color-canvas)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[var(--color-hairline)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                CAPITOL HILL COLLEGE · Admissions &amp; Campus Desk
              </p>
              <h2 className="text-3xl font-semibold text-[var(--color-primary-ink)]">
                Contact &amp; Campus Location
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateContact()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
            >
              Open Admission &amp; Enquiry Form
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--color-primary-ink)] flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--color-brand)] shrink-0" />
                Campus Location
              </h3>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {OFFICIAL_CAMPUS_LOCATION.address}
              </p>
              <a
                href={OFFICIAL_CAMPUS_LOCATION.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] underline-offset-4 hover:underline transition-colors whitespace-nowrap"
              >
                View on Google Maps
                <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              </a>
            </div>

            <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--color-primary-ink)] flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[var(--color-brand)] shrink-0" />
                Telephone
              </h3>
              <p className="mt-2 text-sm text-[var(--color-muted)] tabular-nums">
                <a
                  href={OFFICIAL_CAMPUS_LOCATION.telephoneHref}
                  className="hover:text-[var(--color-brand)] underline-offset-4 hover:underline transition-colors"
                >
                  {OFFICIAL_CAMPUS_LOCATION.telephone}
                </a>
              </p>
            </div>

            <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--color-primary-ink)] flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[var(--color-brand)] shrink-0" />
                Official Email
              </h3>
              <p className="mt-2 text-sm text-[var(--color-muted)] break-all">
                <a
                  href={OFFICIAL_CAMPUS_LOCATION.emailHref}
                  className="hover:text-[var(--color-brand)] underline-offset-4 hover:underline transition-colors"
                >
                  {OFFICIAL_CAMPUS_LOCATION.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
