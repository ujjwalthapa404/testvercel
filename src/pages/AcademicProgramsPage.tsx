import React, { useState } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { CollegeImage } from '../components/CollegeImage';
import {
  ACADEMIC_PROGRAMS,
  AcademicDivisionId,
  AcademicProgramRecord,
  AcademicProgramSlug,
  NEB_PLUS_TWO_PROGRAMS,
  OFFICIAL_CAMPUS_LOCATION,
  TU_DEGREE_PROGRAMS,
} from '../data/academicPrograms';

interface AcademicProgramsPageProps {
  onNavigateHome: (sectionId?: string) => void;
  onSelectProgram: (slug: AcademicProgramSlug) => void;
  onNavigateFacilities: () => void;
  onOpenEnquiry: (programTitle?: string) => void;
}

type DivisionFilter = 'all' | AcademicDivisionId;

interface ProgramCatalogCardProps {
  program: AcademicProgramRecord;
  indexNumber: string;
  onSelectProgram: (slug: AcademicProgramSlug) => void;
  onOpenEnquiry: (programTitle?: string) => void;
}

const ProgramCatalogCard: React.FC<ProgramCatalogCardProps> = ({
  program,
  indexNumber,
  onSelectProgram,
  onOpenEnquiry,
}) => {
  return (
    <article className="group bg-white border border-[var(--color-hairline)] hover:border-neutral-400 rounded-xl overflow-hidden flex flex-col justify-between transition-colors">
      <div>
        <button
          type="button"
          onClick={() => onSelectProgram(program.slug)}
          aria-label={`Explore ${program.title}`}
          className="block w-full text-left overflow-hidden border-b border-[var(--color-hairline)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-brand)]"
        >
          <CollegeImage
            src={program.image.src}
            alt={program.image.alt}
            aspectClassName="aspect-[16/9]"
            imgClassName="group-hover:scale-[1.02]"
            fallbackTitle={program.title}
          />
        </button>

        <div className="p-6 sm:p-7">
          {/* Clean Unboxed Institutional Metadata */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--color-muted)]">
            <span className="font-mono font-semibold text-[var(--color-brand)] tabular-nums">
              {indexNumber}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-[var(--color-primary-ink)]">
              {program.affiliationShort}
            </span>
            <span aria-hidden="true">·</span>
            <span>{program.durationLabel}</span>
          </div>

          <h3 className="mt-2.5 text-2xl font-semibold text-[var(--color-primary-ink)] leading-snug">
            <button
              type="button"
              onClick={() => onSelectProgram(program.slug)}
              className="text-left hover:text-[var(--color-brand)] transition-colors cursor-pointer"
            >
              {program.title}
            </button>
          </h3>

          <p className="mt-1 text-xs text-[var(--color-muted)]">{program.academicLevel}</p>

          <p className="mt-3.5 text-sm sm:text-[15px] text-[var(--color-ink)] leading-relaxed">
            {program.cardSummary}
          </p>

          {/* Key Subject Areas / Highlights */}
          <div className="mt-5 pt-4 border-t border-[var(--color-hairline)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Key Academic Focus
            </p>
            <p className="mt-1.5 text-xs sm:text-[13px] text-[var(--color-primary-ink)] leading-relaxed">
              {program.keyHighlights.join(' · ')}
            </p>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="px-6 sm:px-7 py-4 bg-[var(--color-canvas)] border-t border-[var(--color-hairline)] flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onSelectProgram(program.slug)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Explore Program</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => onOpenEnquiry(program.title)}
          className="inline-flex items-center gap-1.5 py-2 text-xs sm:text-sm font-semibold text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Admission Enquiry</span>
        </button>
      </div>
    </article>
  );
};

export const AcademicProgramsPage: React.FC<AcademicProgramsPageProps> = ({
  onNavigateHome,
  onSelectProgram,
  onNavigateFacilities,
  onOpenEnquiry,
}) => {
  const [divisionFilter, setDivisionFilter] = useState<DivisionFilter>('all');

  const showNebSection = divisionFilter === 'all' || divisionFilter === 'neb-plus-two';
  const showTuSection = divisionFilter === 'all' || divisionFilter === 'tribhuvan-university';

  return (
    <div className="bg-white text-[var(--color-ink)]">
      {/* Institutional Hero Header */}
      <section className="bg-[var(--color-primary-ink)] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-14 sm:py-18 lg:py-20">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-neutral-300 mb-5"
          >
            <button
              type="button"
              onClick={() => onNavigateHome()}
              className="hover:text-white underline-offset-4 hover:underline transition-colors cursor-pointer"
            >
              Home
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-white font-medium">Academic Programs</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-on-dark)] mb-3">
                NEB (+2) &amp; Tribhuvan University Affiliated · Teku, Kathmandu
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white [text-wrap:balance]">
                Academic Programs
              </h1>
              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-neutral-200 leading-relaxed max-w-2xl">
                Capitol Hill College offers recognized Higher Secondary (+2) streams under the
                National Examinations Board (NEB) alongside undergraduate and postgraduate business
                degrees affiliated with Tribhuvan University (TU)—combining disciplined academic
                foundations with practical inquiry.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3">
              <button
                type="button"
                onClick={() => onOpenEnquiry()}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Request Admission Information</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
              <button
                type="button"
                onClick={onNavigateFacilities}
                className="inline-flex items-center justify-center min-h-11 px-6 py-2.5 text-sm font-medium text-white border border-white/30 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Explore Campus Laboratories &amp; Library
              </button>
            </div>
          </div>
        </div>

        {/* Operational Institutional Summary Ribbon */}
        <div className="border-t border-white/15 bg-black/25">
          <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-neutral-300">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 tabular-nums">
              <span className="text-white font-medium">
                {ACADEMIC_PROGRAMS.length} Official Academic Programs
              </span>
              <span aria-hidden="true">·</span>
              <span>4 NEB (+2) Streams</span>
              <span aria-hidden="true">·</span>
              <span>2 Tribhuvan University Degrees (BBS &amp; MBS)</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{OFFICIAL_CAMPUS_LOCATION.address}</span>
              <span aria-hidden="true">·</span>
              <a
                href={OFFICIAL_CAMPUS_LOCATION.telephoneHref}
                className="text-white hover:underline underline-offset-4 tabular-nums"
              >
                {OFFICIAL_CAMPUS_LOCATION.telephone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Division Filter & Quick Program Jump Bar */}
      <section className="bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div
            role="group"
            aria-label="Filter programs by academic affiliation"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-white border border-[var(--color-hairline)] rounded-lg self-start"
          >
            <button
              type="button"
              onClick={() => setDivisionFilter('all')}
              aria-pressed={divisionFilter === 'all'}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                divisionFilter === 'all'
                  ? 'bg-[var(--color-brand)] text-white'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-primary-ink)]'
              }`}
            >
              All Programs ({ACADEMIC_PROGRAMS.length})
            </button>
            <button
              type="button"
              onClick={() => setDivisionFilter('neb-plus-two')}
              aria-pressed={divisionFilter === 'neb-plus-two'}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                divisionFilter === 'neb-plus-two'
                  ? 'bg-[var(--color-brand)] text-white'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-primary-ink)]'
              }`}
            >
              NEB (+2) Programs ({NEB_PLUS_TWO_PROGRAMS.length})
            </button>
            <button
              type="button"
              onClick={() => setDivisionFilter('tribhuvan-university')}
              aria-pressed={divisionFilter === 'tribhuvan-university'}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                divisionFilter === 'tribhuvan-university'
                  ? 'bg-[var(--color-brand)] text-white'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-primary-ink)]'
              }`}
            >
              Tribhuvan University Programs ({TU_DEGREE_PROGRAMS.length})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[var(--color-muted)]">
            <span className="font-semibold text-[var(--color-primary-ink)]">Direct Access:</span>
            {ACADEMIC_PROGRAMS.map((prog, index) => (
              <React.Fragment key={prog.slug}>
                {index > 0 && <span aria-hidden="true">·</span>}
                <button
                  type="button"
                  onClick={() => onSelectProgram(prog.slug)}
                  className="hover:text-[var(--color-brand)] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {prog.navLabel}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Division 01: NEB (+2) Higher Secondary Programs */}
      {showNebSection && (
        <section
          aria-labelledby="neb-programs-heading"
          className="py-16 sm:py-20 bg-white border-b border-[var(--color-hairline)]"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="pb-8 border-b border-[var(--color-hairline)] flex flex-col lg:flex-row lg:items-end justify-between gap-5">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                  01 · National Examinations Board (NEB)
                </p>
                <h2
                  id="neb-programs-heading"
                  className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary-ink)] [text-wrap:balance]"
                >
                  NEB (+2) Higher Secondary Programs
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                  Two-year Grade 11 and Grade 12 academic streams designed for SEE graduates—offering
                  focused pathways in business management, humanities and media, pure and applied
                  sciences, and foundational legal studies.
                </p>
              </div>
              <p className="text-xs text-[var(--color-muted)] tabular-nums shrink-0">
                Grade 11 &amp; Grade 12 · 2-Year Full-Time Curriculum
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {NEB_PLUS_TWO_PROGRAMS.map((program, idx) => (
                <ProgramCatalogCard
                  key={program.slug}
                  program={program}
                  indexNumber={`0${idx + 1}`}
                  onSelectProgram={onSelectProgram}
                  onOpenEnquiry={onOpenEnquiry}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Division 02: Tribhuvan University Undergraduate & Postgraduate Programs */}
      {showTuSection && (
        <section
          aria-labelledby="tu-programs-heading"
          className="py-16 sm:py-20 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="pb-8 border-b border-[var(--color-hairline)] flex flex-col lg:flex-row lg:items-end justify-between gap-5">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                  02 · Tribhuvan University (TU)
                </p>
                <h2
                  id="tu-programs-heading"
                  className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary-ink)] [text-wrap:balance]"
                >
                  Tribhuvan University Degree Programs
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                  University-affiliated undergraduate and postgraduate degrees under Tribhuvan
                  University’s Faculty of Management—preparing graduates for banking, corporate
                  management, public service, entrepreneurship, and scholarly research.
                </p>
              </div>
              <p className="text-xs text-[var(--color-muted)] shrink-0">
                Undergraduate (BBS · 4 Years) · Postgraduate (MBS · 2 Years)
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {TU_DEGREE_PROGRAMS.map((program, idx) => (
                <ProgramCatalogCard
                  key={program.slug}
                  program={program}
                  indexNumber={`0${NEB_PLUS_TWO_PROGRAMS.length + idx + 1}`}
                  onSelectProgram={onSelectProgram}
                  onOpenEnquiry={onOpenEnquiry}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Academic Counseling & Admissions Guidance Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-2xl bg-[var(--color-primary-ink)] text-white p-8 sm:p-10 lg:p-12 border border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-on-dark)] mb-2">
                Academic Counseling &amp; Admissions
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white [text-wrap:balance]">
                Need Guidance Choosing the Right Stream or Degree?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
                Our academic counselors at the Teku, Kathmandu campus assist prospective students
                and parents in reviewing subject combinations, eligibility prerequisites, laboratory
                facilities, and admission timelines across all NEB (+2) and Tribhuvan University
                programs.
              </p>
              <p className="mt-3 text-xs text-neutral-400">
                Note: Session-specific intake dates, optional subject group schedules, and fee or
                scholarship structures are confirmed directly by the Capitol Hill College Admissions
                Office.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3">
              <button
                type="button"
                onClick={() => onOpenEnquiry()}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Submit Admission Enquiry</span>
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
        </div>
      </section>
    </div>
  );
};
