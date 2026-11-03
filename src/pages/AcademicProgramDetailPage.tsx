import React from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { CollegeImage } from '../components/CollegeImage';
import {
  ACADEMIC_PROGRAMS,
  AcademicProgramRecord,
  AcademicProgramSlug,
  OFFICIAL_CAMPUS_LOCATION,
} from '../data/academicPrograms';

interface AcademicProgramDetailPageProps {
  program: AcademicProgramRecord;
  onNavigateHome: (sectionId?: string) => void;
  onNavigateAllPrograms: () => void;
  onSelectProgram: (slug: AcademicProgramSlug) => void;
  onNavigateFacilities: () => void;
  onOpenEnquiry: (programTitle?: string) => void;
}

export const AcademicProgramDetailPage: React.FC<AcademicProgramDetailPageProps> = ({
  program,
  onNavigateHome,
  onNavigateAllPrograms,
  onSelectProgram,
  onNavigateFacilities,
  onOpenEnquiry,
}) => {
  const relatedPrograms = ACADEMIC_PROGRAMS.filter((item) => item.slug !== program.slug);

  return (
    <div className="bg-white text-[var(--color-ink)]">
      {/* 1. Program Title, Breadcrumb & Introduction + 2. Affiliation & Academic Level */}
      <section className="bg-[var(--color-primary-ink)] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16 lg:py-20">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-neutral-300 mb-6"
          >
            <button
              type="button"
              onClick={() => onNavigateHome()}
              className="hover:text-white underline-offset-4 hover:underline transition-colors cursor-pointer"
            >
              Home
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={onNavigateAllPrograms}
              className="hover:text-white underline-offset-4 hover:underline transition-colors cursor-pointer"
            >
              Academic Programs
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-white font-medium">{program.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-on-dark)] mb-3">
                {program.divisionLabel} · {program.affiliationShort}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white [text-wrap:balance]">
                {program.title}
              </h1>
              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-neutral-200 leading-relaxed max-w-2xl">
                {program.introduction}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3">
              <button
                type="button"
                onClick={() => onOpenEnquiry(program.title)}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Enquire About {program.shortTitle}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
              <button
                type="button"
                onClick={onNavigateAllPrograms}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 text-sm font-medium text-white border border-white/30 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>All Academic Programs</span>
              </button>
            </div>
          </div>

          {/* Institutional Metadata Definition Strip */}
          <dl className="mt-10 pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Affiliated Board / University
              </dt>
              <dd className="mt-1.5 text-sm font-medium text-white">{program.affiliation}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Academic Level
              </dt>
              <dd className="mt-1.5 text-sm font-medium text-white">{program.academicLevel}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Program Duration
              </dt>
              <dd className="mt-1.5 text-sm font-medium text-white tabular-nums">
                {program.durationLabel}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Campus Location
              </dt>
              <dd className="mt-1.5 text-sm font-medium text-white">
                {OFFICIAL_CAMPUS_LOCATION.address}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 3. Program Overview & Campus Learning Support */}
      <section className="py-16 sm:py-20 bg-white border-b border-[var(--color-hairline)]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Editorial Program Narrative */}
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
              01 · Program Overview
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-primary-ink)] [text-wrap:balance]">
              Academic Purpose &amp; Learning Environment
            </h2>

            <div className="mt-5 space-y-4 text-[15px] sm:text-base text-[var(--color-ink)] leading-relaxed max-w-prose">
              {program.overviewParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Campus Laboratories, Library & Academic Support */}
            <div className="mt-8 pt-7 border-t border-[var(--color-hairline)]">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold text-[var(--color-primary-ink)]">
                  Campus Facilities &amp; Academic Resources
                </h3>
                <button
                  type="button"
                  onClick={onNavigateFacilities}
                  className="text-xs font-semibold text-[var(--color-brand)] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
                >
                  View Campus Facilities
                </button>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-[var(--color-ink)]">
                {program.campusSupportFacilities.map((facilityItem) => (
                  <li
                    key={facilityItem}
                    className="flex items-start gap-3 py-1"
                  >
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs font-semibold text-[var(--color-brand)] mt-0.5 select-none"
                    >
                      —
                    </span>
                    <span className="leading-relaxed">{facilityItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Visual Campus Showcase + Direct Counseling Contact Box */}
          <div className="lg:col-span-5 space-y-6">
            <figure className="rounded-xl overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-canvas)]">
              <CollegeImage
                src={program.image.src}
                alt={program.image.alt}
                aspectClassName="aspect-[16/10]"
                priority
                fallbackTitle={program.title}
              />
              <figcaption className="px-4 py-3 text-xs text-[var(--color-muted)] border-t border-[var(--color-hairline)]">
                {program.image.caption}
              </figcaption>
            </figure>

            <div className="rounded-xl bg-[var(--color-canvas)] border border-[var(--color-hairline)] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
                Admissions &amp; Counseling Desk
              </p>
              <h3 className="mt-1.5 text-lg font-semibold text-[var(--color-primary-ink)]">
                Speak with an Academic Counselor
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed">
                Have questions regarding subject combinations, eligibility, or enrollment for{' '}
                <strong className="font-semibold text-[var(--color-primary-ink)]">
                  {program.title}
                </strong>
                ? Connect directly with our Teku campus office.
              </p>
              <div className="mt-4 pt-4 border-t border-[var(--color-hairline)] space-y-2 text-xs text-[var(--color-ink)]">
                <p className="flex items-center gap-2 tabular-nums">
                  <Phone className="w-3.5 h-3.5 text-[var(--color-brand)] shrink-0" />
                  <a
                    href={OFFICIAL_CAMPUS_LOCATION.telephoneHref}
                    className="font-medium hover:text-[var(--color-brand)] hover:underline underline-offset-4"
                  >
                    {OFFICIAL_CAMPUS_LOCATION.telephone}
                  </a>
                </p>
                <p className="flex items-center gap-2 break-all">
                  <Mail className="w-3.5 h-3.5 text-[var(--color-brand)] shrink-0" />
                  <a
                    href={OFFICIAL_CAMPUS_LOCATION.emailHref}
                    className="hover:text-[var(--color-brand)] hover:underline underline-offset-4"
                  >
                    {OFFICIAL_CAMPUS_LOCATION.email}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-brand)] shrink-0" />
                  <a
                    href={OFFICIAL_CAMPUS_LOCATION.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[var(--color-brand)] hover:underline underline-offset-4"
                  >
                    <span>{OFFICIAL_CAMPUS_LOCATION.address}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-75" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Major Subjects & Curriculum Areas */}
      <section className="py-16 sm:py-20 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl pb-8 border-b border-[var(--color-hairline)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
              02 · Curriculum &amp; Subject Areas
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-primary-ink)] [text-wrap:balance]">
              Major Subjects &amp; Academic Structure
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
              Coursework in {program.title} combines foundational core studies with specialized
              disciplinary subjects under {program.affiliation}.
            </p>
          </div>

          <div className="mt-10 space-y-12">
            {program.subjectGroups.map((group) => (
              <div key={group.groupTitle}>
                <div className="mb-5">
                  <h3 className="text-xl font-semibold text-[var(--color-primary-ink)]">
                    {group.groupTitle}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-[var(--color-muted)]">
                    {group.selectionNote}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {group.subjects.map((subject, sIdx) => (
                    <div
                      key={subject.name}
                      className="bg-white border border-[var(--color-hairline)] rounded-xl p-5 flex flex-col justify-between"
                    >
                      <div>
                        <p className="text-[11px] font-mono font-semibold text-[var(--color-brand)] tabular-nums">
                          {String(sIdx + 1).padStart(2, '0')}
                        </p>
                        <h4 className="mt-1.5 text-base font-semibold text-[var(--color-primary-ink)]">
                          {subject.name}
                        </h4>
                        <p className="mt-2 text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed">
                          {subject.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Transparent Curriculum Selection Note */}
          <p className="mt-8 pt-6 border-t border-[var(--color-hairline)] text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed max-w-4xl">
            <strong className="font-semibold text-[var(--color-primary-ink)]">
              Curriculum Note:{' '}
            </strong>
            {program.curriculumNote}
          </p>
        </div>
      </section>

      {/* 5. Learning Outcomes & Skills Developed */}
      <section className="py-16 sm:py-20 bg-white border-b border-[var(--color-hairline)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl pb-8 border-b border-[var(--color-hairline)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
              03 · Academic Competencies
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-primary-ink)] [text-wrap:balance]">
              Learning Outcomes &amp; Skills Developed
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {program.learningOutcomes.map((outcome, index) => (
              <div
                key={outcome}
                className="p-6 rounded-xl bg-[var(--color-canvas)] border border-[var(--color-hairline)] flex items-start gap-4"
              >
                <span className="font-mono text-sm font-semibold text-[var(--color-brand)] tabular-nums shrink-0 mt-0.5">
                  {String(index + 1).padStart(2, '0')}.
                </span>
                <p className="text-sm sm:text-[15px] text-[var(--color-ink)] leading-relaxed">
                  {outcome}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Possible Career Pathways & 7. Higher Education Opportunities */}
      <section className="py-16 sm:py-20 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Career Pathways */}
          <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                04 · Professional Scope
              </p>
              <h2 className="text-2xl font-semibold text-[var(--color-primary-ink)]">
                Possible Career Pathways
              </h2>
              <p className="mt-2.5 text-sm text-[var(--color-muted)] leading-relaxed">
                Graduates of {program.title} develop analytical and practical foundations suited for
                entry-level roles and long-term professional careers across:
              </p>

              <ul className="mt-6 divide-y divide-[var(--color-hairline)] border-t border-b border-[var(--color-hairline)]">
                {program.careerPathways.map((pathway, idx) => (
                  <li
                    key={pathway}
                    className="py-3 flex items-start gap-3 text-sm text-[var(--color-ink)]"
                  >
                    <span className="font-mono text-xs font-semibold text-[var(--color-brand)] tabular-nums mt-0.5 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="leading-relaxed">{pathway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Higher Education Opportunities */}
          <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                05 · Academic Progression
              </p>
              <h2 className="text-2xl font-semibold text-[var(--color-primary-ink)]">
                Higher Education Opportunities
              </h2>
              <p className="mt-2.5 text-sm text-[var(--color-muted)] leading-relaxed">
                Completing {program.title} prepares students to pursue recognized university degrees
                and professional qualifications in Nepal and abroad, including:
              </p>

              <ul className="mt-6 divide-y divide-[var(--color-hairline)] border-t border-b border-[var(--color-hairline)]">
                {program.higherEducationOpportunities.map((opportunity, idx) => (
                  <li
                    key={opportunity}
                    className="py-3 flex items-start gap-3 text-sm text-[var(--color-ink)]"
                  >
                    <span className="font-mono text-xs font-semibold text-[var(--color-brand)] tabular-nums mt-0.5 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="leading-relaxed">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call-to-Action to Enquire or Contact Admission + Other Programs Directory */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          {/* Primary Admission Enquiry Banner */}
          <div className="rounded-2xl bg-[var(--color-primary-ink)] text-white p-8 sm:p-10 lg:p-12 border border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-on-dark)] mb-2">
                Admissions &amp; Enrollment · {program.shortTitle}
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white [text-wrap:balance]">
                Interested in {program.title} at Capitol Hill College?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-200 leading-relaxed max-w-2xl">
                Submit an online admission enquiry to connect with our Teku campus admissions team,
                or visit Capitol Hill College Sunday through Friday during regular college hours for
                in-person academic counseling.
              </p>
              <p className="mt-3.5 text-xs text-neutral-400 leading-relaxed max-w-2xl">
                {program.admissionVerificationNote}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3">
              <button
                type="button"
                onClick={() => onOpenEnquiry(program.title)}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Enquire About {program.shortTitle}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
              <a
                href={OFFICIAL_CAMPUS_LOCATION.telephoneHref}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-2.5 text-sm font-medium text-white border border-white/25 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap shrink-0 tabular-nums"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>Call {OFFICIAL_CAMPUS_LOCATION.telephone}</span>
              </a>
            </div>
          </div>

          {/* Explore Other Academic Programs */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-[var(--color-hairline)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-1">
                  Continue Exploring
                </p>
                <h3 className="text-xl sm:text-2xl font-semibold text-[var(--color-primary-ink)]">
                  Other Academic Programs at Capitol Hill College
                </h3>
              </div>
              <button
                type="button"
                onClick={onNavigateAllPrograms}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>View All 6 Programs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {relatedPrograms.map((other) => (
                <button
                  key={other.slug}
                  type="button"
                  onClick={() => onSelectProgram(other.slug)}
                  className="text-left p-4 rounded-xl bg-[var(--color-canvas)] hover:bg-white border border-[var(--color-hairline)] hover:border-[var(--color-brand)] transition-colors flex flex-col justify-between gap-3 cursor-pointer group"
                >
                  <div>
                    <p className="text-[11px] text-[var(--color-muted)]">
                      {other.affiliationShort}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--color-primary-ink)] group-hover:text-[var(--color-brand)] transition-colors">
                      {other.title}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brand)]">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
