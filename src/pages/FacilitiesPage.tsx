import React, { useEffect, useState } from 'react';
import { ArrowRight, Expand, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CollegeImageAsset,
  FACILITIES_CLOSING_QUOTE,
  FACILITIES_CTA_CONTENT,
  FACILITIES_HERO_CONTENT,
  FACILITIES_LIST,
  FACILITIES_OVERVIEW_CONTENT,
  FACILITY_HIGHLIGHTS,
  FacilityRecord,
} from '../data/facilities';
import { CollegeImage } from '../components/CollegeImage';

interface FacilitiesPageProps {
  onNavigateHome: (sectionId?: string) => void;
  onExplorePrograms: () => void;
  onContactCollege: () => void;
  onOpenEnquiry: (programTitle?: string) => void;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({
  onNavigateHome,
  onExplorePrograms,
  onContactCollege,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const infrastructure = FACILITIES_LIST[0];
  const library = FACILITIES_LIST[1];
  const laboratories = FACILITIES_LIST[2];
  const ecaCca = FACILITIES_LIST[3];
  const cafeteria = FACILITIES_LIST[4];
  const sports = FACILITIES_LIST[5];

  const galleryAssets: { title: string; number: string; asset: CollegeImageAsset }[] =
    FACILITIES_LIST.map((item) => ({
      title: item.title,
      number: item.number,
      asset: item.image,
    }));

  useEffect(() => {
    if (lightboxIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % galleryAssets.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + galleryAssets.length) % galleryAssets.length
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, galleryAssets.length]);

  const scrollToFacility = (facilityId: string) => {
    const el = document.getElementById(`facility-${facilityId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openLightboxForFacility = (facility: FacilityRecord) => {
    const idx = FACILITIES_LIST.findIndex((f) => f.id === facility.id);
    if (idx >= 0) {
      setLightboxIndex(idx);
    }
  };

  const activeLightboxItem =
    lightboxIndex !== null ? galleryAssets[lightboxIndex] : null;

  return (
    <div className="bg-[var(--color-canvas)] text-[var(--color-ink)]">
      {/* Section B — Hero Section */}
      <section
        aria-labelledby="facilities-hero-heading"
        className="bg-white border-b border-[var(--color-hairline)]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 sm:py-14 lg:py-18">
          {/* Subtle Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateHome()}
                  className="hover:text-[var(--color-brand)] underline-offset-4 hover:underline transition-colors cursor-pointer"
                >
                  {FACILITIES_HERO_CONTENT.breadcrumbParent}
                </button>
              </li>
              <li aria-hidden="true" className="text-neutral-400">
                /
              </li>
              <li aria-current="page" className="text-[var(--color-primary-ink)] font-semibold">
                {FACILITIES_HERO_CONTENT.breadcrumbCurrent}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Editorial Copy Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-brand)] font-semibold mb-3">
                  {FACILITIES_HERO_CONTENT.kicker}
                </p>
                <h1
                  id="facilities-hero-heading"
                  className="text-4xl sm:text-5xl lg:text-[3.35rem] font-semibold tracking-tight leading-[1.1] text-[var(--color-primary-ink)]"
                >
                  {FACILITIES_HERO_CONTENT.title}
                </h1>
                <p className="mt-4 font-sans text-lg sm:text-xl font-semibold text-[var(--color-brand)] leading-snug max-w-xl">
                  {FACILITIES_HERO_CONTENT.supportingHeadline}
                </p>
                <p className="mt-4 text-[15px] sm:text-base text-[var(--color-muted)] leading-relaxed max-w-xl">
                  {FACILITIES_HERO_CONTENT.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--color-hairline)] flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onExplorePrograms}
                  className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Explore Academic Programs
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onContactCollege}
                  className="inline-flex items-center justify-center min-h-11 px-6 py-3 text-sm font-semibold text-[var(--color-primary-ink)] bg-white border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Schedule a Campus Visit
                </button>
              </div>
            </div>

            {/* Image-Led Campus Frame */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="relative flex-1 rounded-xl overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-canvas)]">
                <CollegeImage
                  src={FACILITIES_HERO_CONTENT.heroImage.src}
                  alt={FACILITIES_HERO_CONTENT.heroImage.alt}
                  aspectClassName="aspect-[16/11] lg:aspect-auto lg:h-full min-h-[290px]"
                  priority
                  fallbackTitle="Capitol Hill College Building"
                />
                <button
                  type="button"
                  onClick={() => setLightboxIndex(0)}
                  aria-label="Inspect full-size photograph of Capitol Hill College building"
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171717]/80 hover:bg-[var(--color-brand)] text-xs font-medium text-white backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <Expand className="w-3.5 h-3.5" />
                  View Photo
                </button>
              </div>
              <p className="mt-2.5 text-xs text-[var(--color-muted)] flex items-center justify-between gap-4">
                <span>
                  <span className="font-mono font-semibold text-[var(--color-brand)] mr-2">
                    {FACILITIES_HERO_CONTENT.heroImage.figureNumber}
                  </span>
                  {FACILITIES_HERO_CONTENT.heroImage.caption}
                </span>
                <span className="text-[var(--color-muted)] shrink-0">Teku, Kathmandu</span>
              </p>
            </div>
          </div>
        </div>

        {/* Chapter Jump Strip */}
        <div className="border-t border-[var(--color-hairline)] bg-[var(--color-canvas)]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 py-3.5 flex items-center gap-6 overflow-x-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] whitespace-nowrap shrink-0">
              On This Page
            </span>
            <div className="flex items-center gap-5 text-xs font-medium text-[var(--color-primary-ink)]">
              {FACILITIES_LIST.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToFacility(item.id)}
                  className="hover:text-[var(--color-brand)] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1"
                >
                  <span className="font-mono font-semibold text-[var(--color-brand)] mr-1.5 tabular-nums">
                    {item.number}.
                  </span>
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section C — Facilities Overview */}
      <section
        aria-labelledby="facilities-overview-heading"
        className="bg-white border-b border-[var(--color-hairline)] py-16 lg:py-24"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2.5">
              {FACILITIES_OVERVIEW_CONTENT.kicker}
            </p>
            <h2
              id="facilities-overview-heading"
              className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary-ink)] leading-tight"
            >
              {FACILITIES_OVERVIEW_CONTENT.heading}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-base sm:text-lg text-[var(--color-ink)] leading-relaxed max-w-2xl">
              {FACILITIES_OVERVIEW_CONTENT.description}
            </p>
            <div className="mt-6 pt-6 border-t border-[var(--color-hairline)] flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--color-muted)]">
              <span>6 Core Campus Pillars</span>
              <span aria-hidden="true">·</span>
              <span>Academic Classrooms &amp; Specialized Labs</span>
              <span aria-hidden="true">·</span>
              <span>Co-Curricular &amp; Athletic Holistic Growth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section D — Featured Facilities (Editorial Varied Architecture) */}
      <div aria-label="Featured Campus Facilities">
        {/* 01. Infrastructure — Asymmetric Split (Image Left 7 / Narrative Right 5) */}
        <article
          id={`facility-${infrastructure.id}`}
          className="scroll-mt-24 py-16 lg:py-24 max-w-7xl mx-auto px-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <figure className="lg:col-span-7">
              <div className="relative rounded-xl overflow-hidden border border-[var(--color-hairline)] bg-white">
                <CollegeImage
                  src={infrastructure.image.src}
                  alt={infrastructure.image.alt}
                  aspectClassName="aspect-[16/10]"
                  fallbackTitle={infrastructure.title}
                />
                <button
                  type="button"
                  onClick={() => openLightboxForFacility(infrastructure)}
                  aria-label={`View larger image of ${infrastructure.title}`}
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171717]/75 hover:bg-[var(--color-brand)] text-xs font-medium text-white transition-colors cursor-pointer"
                >
                  <Expand className="w-3.5 h-3.5" />
                  Enlarge
                </button>
              </div>
              <figcaption className="mt-2.5 text-xs text-[var(--color-muted)]">
                <span className="font-mono font-semibold text-[var(--color-brand)] mr-2">
                  {infrastructure.image.figureNumber}
                </span>
                {infrastructure.image.caption}
              </figcaption>
            </figure>

            <div className="lg:col-span-5">
              <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-3">
                <span className="font-mono font-semibold text-[var(--color-brand)] tabular-nums">
                  {infrastructure.number}
                </span>
                <span aria-hidden="true">/</span>
                <span className="uppercase tracking-widest font-semibold">
                  {infrastructure.categoryLabel}
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary-ink)]">
                {infrastructure.title}
              </h3>
              <p className="mt-3 font-medium text-base text-[var(--color-ink)] leading-snug">
                {infrastructure.subtitle}
              </p>
              <p className="mt-4 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                {infrastructure.description}
              </p>
              {infrastructure.secondaryDescription && (
                <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                  {infrastructure.secondaryDescription}
                </p>
              )}

              <ul className="mt-6 pt-5 border-t border-[var(--color-hairline)] grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs font-medium text-[var(--color-ink)]">
                {infrastructure.keyAttributes.map((attr) => (
                  <li key={attr} className="flex items-baseline gap-2">
                    <span aria-hidden="true" className="text-[var(--color-brand)] font-semibold">
                      —
                    </span>
                    <span>{attr}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* 02. Library — Reversed Editorial Split on Crisp White Surface (Narrative Left 5 / Image Right 7) */}
        <article
          id={`facility-${library.id}`}
          className="scroll-mt-24 py-16 lg:py-24 bg-white border-y border-[var(--color-hairline)]"
        >
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-3">
                <span className="font-mono font-semibold text-[var(--color-brand)] tabular-nums">
                  {library.number}
                </span>
                <span aria-hidden="true">/</span>
                <span className="uppercase tracking-widest font-semibold">
                  {library.categoryLabel}
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary-ink)]">
                {library.title}
              </h3>
              <p className="mt-3 font-medium text-base text-[var(--color-ink)] leading-snug">
                {library.subtitle}
              </p>
              <p className="mt-4 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                {library.description}
              </p>
              {library.secondaryDescription && (
                <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                  {library.secondaryDescription}
                </p>
              )}

              <ul className="mt-6 pt-5 border-t border-[var(--color-hairline)] space-y-2 text-xs font-medium text-[var(--color-ink)]">
                {library.keyAttributes.map((attr) => (
                  <li key={attr} className="flex items-baseline gap-2">
                    <span aria-hidden="true" className="text-[var(--color-brand)] font-semibold">
                      —
                    </span>
                    <span>{attr}</span>
                  </li>
                ))}
              </ul>

              {library.verificationNote && (
                <p className="mt-5 pt-4 border-t border-[var(--color-hairline)] text-xs text-[var(--color-muted)] leading-relaxed">
                  <strong className="font-semibold text-[var(--color-ink)]">Reading Hours Note:</strong>{' '}
                  {library.verificationNote}
                </p>
              )}
            </div>

            <figure className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative rounded-xl overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-canvas)]">
                <CollegeImage
                  src={library.image.src}
                  alt={library.image.alt}
                  aspectClassName="aspect-[16/10]"
                  fallbackTitle={library.title}
                />
                <button
                  type="button"
                  onClick={() => openLightboxForFacility(library)}
                  aria-label={`View larger image of ${library.title}`}
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171717]/75 hover:bg-[var(--color-brand)] text-xs font-medium text-white transition-colors cursor-pointer"
                >
                  <Expand className="w-3.5 h-3.5" />
                  Enlarge
                </button>
              </div>
              <figcaption className="mt-2.5 text-xs text-[var(--color-muted)]">
                <span className="font-mono font-semibold text-[var(--color-brand)] mr-2">
                  {library.image.figureNumber}
                </span>
                {library.image.caption}
              </figcaption>
            </figure>
          </div>
        </article>

        {/* 03. Laboratories — Architectural Showcase + Dedicated 5-Discipline Matrix */}
        <article
          id={`facility-${laboratories.id}`}
          className="scroll-mt-24 py-16 lg:py-24 max-w-7xl mx-auto px-6 border-b border-[var(--color-hairline)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-3">
                <span className="font-mono font-semibold text-[var(--color-brand)] tabular-nums">
                  {laboratories.number}
                </span>
                <span aria-hidden="true">/</span>
                <span className="uppercase tracking-widest font-semibold">
                  {laboratories.categoryLabel}
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary-ink)]">
                {laboratories.title}
              </h3>
              <p className="mt-3 font-medium text-base text-[var(--color-ink)] leading-snug">
                {laboratories.subtitle}
              </p>
              <p className="mt-4 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                {laboratories.description}
              </p>
              {laboratories.secondaryDescription && (
                <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                  {laboratories.secondaryDescription}
                </p>
              )}
            </div>

            <figure className="lg:col-span-7">
              <div className="relative rounded-xl overflow-hidden border border-[var(--color-hairline)] bg-white">
                <CollegeImage
                  src={laboratories.image.src}
                  alt={laboratories.image.alt}
                  aspectClassName="aspect-[16/10]"
                  fallbackTitle={laboratories.title}
                />
                <button
                  type="button"
                  onClick={() => openLightboxForFacility(laboratories)}
                  aria-label={`View larger image of ${laboratories.title}`}
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171717]/75 hover:bg-[var(--color-brand)] text-xs font-medium text-white transition-colors cursor-pointer"
                >
                  <Expand className="w-3.5 h-3.5" />
                  Enlarge
                </button>
              </div>
              <figcaption className="mt-2.5 text-xs text-[var(--color-muted)]">
                <span className="font-mono font-semibold text-[var(--color-brand)] mr-2">
                  {laboratories.image.figureNumber}
                </span>
                {laboratories.image.caption}
              </figcaption>
            </figure>
          </div>

          {/* 5 Specialized Departmental Laboratories Ledger (Unboxed hairline grid, no nested cards) */}
          {laboratories.subjectLabs && (
            <div className="mt-12 pt-8 border-t border-[var(--color-hairline)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-6">
                Specialized Practical Laboratories Described Across Disciplines
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {laboratories.subjectLabs.map((lab, idx) => (
                  <div
                    key={lab.name}
                    className="pt-4 border-t border-[var(--color-hairline)]"
                  >
                    <dt className="text-sm font-semibold text-[var(--color-primary-ink)] flex items-baseline gap-2">
                      <span className="font-mono text-xs text-[var(--color-brand)] tabular-nums">
                        03.{idx + 1}
                      </span>
                      <span>{lab.name}</span>
                    </dt>
                    <dd className="mt-2 text-xs text-[var(--color-muted)] leading-relaxed">
                      {lab.focus}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </article>

        {/* 04. ECA & CCA + 05. Cafeteria — Curatorial Two-Column Campus Life Diptych */}
        <section
          aria-label="Campus Life and Student Dining"
          className="py-16 lg:py-24 max-w-7xl mx-auto px-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
            {[ecaCca, cafeteria].map((facility, idx) => (
              <article
                key={facility.id}
                id={`facility-${facility.id}`}
                className={`scroll-mt-24 lg:col-span-6 ${
                  idx === 1
                    ? 'lg:pl-7 lg:border-l lg:border-[var(--color-hairline)]'
                    : ''
                }`}
              >
                <figure>
                  <div className="relative rounded-xl overflow-hidden border border-[var(--color-hairline)] bg-white">
                    <CollegeImage
                      src={facility.image.src}
                      alt={facility.image.alt}
                      aspectClassName="aspect-[16/10]"
                      fallbackTitle={facility.title}
                    />
                    <button
                      type="button"
                      onClick={() => openLightboxForFacility(facility)}
                      aria-label={`View larger image of ${facility.title}`}
                      className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171717]/75 hover:bg-[var(--color-brand)] text-xs font-medium text-white transition-colors cursor-pointer"
                    >
                      <Expand className="w-3.5 h-3.5" />
                      Enlarge
                    </button>
                  </div>
                  <figcaption className="mt-2.5 text-xs text-[var(--color-muted)]">
                    <span className="font-mono font-semibold text-[var(--color-brand)] mr-2">
                      {facility.image.figureNumber}
                    </span>
                    {facility.image.caption}
                  </figcaption>
                </figure>

                <div className="mt-7">
                  <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-2.5">
                    <span className="font-mono font-semibold text-[var(--color-brand)] tabular-nums">
                      {facility.number}
                    </span>
                    <span aria-hidden="true">/</span>
                    <span className="uppercase tracking-widest font-semibold">
                      {facility.categoryLabel}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-[var(--color-primary-ink)]">
                    {facility.title}
                  </h3>
                  <p className="mt-2.5 font-medium text-sm sm:text-base text-[var(--color-ink)] leading-snug">
                    {facility.subtitle}
                  </p>
                  <p className="mt-3.5 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                    {facility.description}
                  </p>
                  {facility.secondaryDescription && (
                    <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                      {facility.secondaryDescription}
                    </p>
                  )}

                  <ul className="mt-5 pt-4 border-t border-[var(--color-hairline)] space-y-2 text-xs font-medium text-[var(--color-ink)]">
                    {facility.keyAttributes.map((attr) => (
                      <li key={attr} className="flex items-baseline gap-2">
                        <span aria-hidden="true" className="text-[var(--color-brand)] font-semibold">
                          —
                        </span>
                        <span>{attr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 06. Sports — Full-Width Closing Feature on Crisp White Surface */}
        <article
          id={`facility-${sports.id}`}
          className="scroll-mt-24 py-16 lg:py-24 bg-white border-t border-[var(--color-hairline)]"
        >
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-3">
                <span className="font-mono font-semibold text-[var(--color-brand)] tabular-nums">
                  {sports.number}
                </span>
                <span aria-hidden="true">/</span>
                <span className="uppercase tracking-widest font-semibold">
                  {sports.categoryLabel}
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary-ink)]">
                {sports.title}
              </h3>
              <p className="mt-3 font-medium text-base text-[var(--color-ink)] leading-snug">
                {sports.subtitle}
              </p>
              <p className="mt-4 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                {sports.description}
              </p>
              {sports.secondaryDescription && (
                <p className="mt-3 text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                  {sports.secondaryDescription}
                </p>
              )}

              <div className="mt-6 pt-5 border-t border-[var(--color-hairline)]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-3">
                  Core Athletic Disciplines
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-[var(--color-primary-ink)]">
                  <span>Football</span>
                  <span aria-hidden="true" className="text-[var(--color-muted)] font-normal">
                    ·
                  </span>
                  <span>Basketball</span>
                  <span aria-hidden="true" className="text-[var(--color-muted)] font-normal">
                    ·
                  </span>
                  <span>Volleyball</span>
                  <span aria-hidden="true" className="text-[var(--color-muted)] font-normal">
                    ·
                  </span>
                  <span>Track &amp; Field</span>
                </div>
              </div>
            </div>

            <figure className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative rounded-xl overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-canvas)]">
                <CollegeImage
                  src={sports.image.src}
                  alt={sports.image.alt}
                  aspectClassName="aspect-[16/10]"
                  fallbackTitle={sports.title}
                />
                <button
                  type="button"
                  onClick={() => openLightboxForFacility(sports)}
                  aria-label={`View larger image of ${sports.title}`}
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171717]/75 hover:bg-[var(--color-brand)] text-xs font-medium text-white transition-colors cursor-pointer"
                >
                  <Expand className="w-3.5 h-3.5" />
                  Enlarge
                </button>
              </div>
              <figcaption className="mt-2.5 text-xs text-[var(--color-muted)]">
                <span className="font-mono font-semibold text-[var(--color-brand)] mr-2">
                  {sports.image.figureNumber}
                </span>
                {sports.image.caption}
              </figcaption>
            </figure>
          </div>
        </article>
      </div>

      {/* Section E — College Facilities Highlights (Restrained Tabular Ledger) */}
      <section
        aria-labelledby="facilities-highlights-heading"
        className="py-16 lg:py-20 bg-[var(--color-canvas)] border-t border-[var(--color-hairline)]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[var(--color-hairline)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-2">
                At a Glance
              </p>
              <h2
                id="facilities-highlights-heading"
                className="text-2xl sm:text-3xl font-semibold text-[var(--color-primary-ink)]"
              >
                Campus Facilities Highlights
              </h2>
            </div>
            <p className="text-xs text-[var(--color-muted)] max-w-md">
              Published overview figures from Capitol Hill College records (pending final
              administrative audit for the current academic session).
            </p>
          </div>

          <dl className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-hairline)] border-b border-[var(--color-hairline)]">
            {FACILITY_HIGHLIGHTS.map((stat, idx) => (
              <div
                key={stat.id}
                className={`py-8 ${
                  idx === 0
                    ? 'sm:pr-8'
                    : idx === FACILITY_HIGHLIGHTS.length - 1
                      ? 'sm:pl-8'
                      : 'sm:px-8'
                }`}
              >
                <dd className="font-display text-4xl sm:text-5xl font-semibold text-[var(--color-primary-ink)] tabular-nums tracking-tight">
                  {stat.value}
                </dd>
                <dt className="mt-2.5 text-sm font-semibold text-[var(--color-ink)]">
                  {stat.label}
                </dt>
                <p className="mt-1 text-xs text-[var(--color-muted)]">{stat.context}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Section F — Editorial Closing Statement (Hairline rules, zero thick left border) */}
      <section
        aria-label="Institutional Commitment"
        className="py-20 lg:py-28 bg-white border-t border-[var(--color-hairline)]"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="py-10 border-y border-[var(--color-hairline)]">
            <blockquote className="font-display italic text-2xl sm:text-3xl lg:text-4xl text-[var(--color-primary-ink)] leading-relaxed">
              &ldquo;{FACILITIES_CLOSING_QUOTE.quote}&rdquo;
            </blockquote>
            <cite className="mt-6 block not-italic text-xs uppercase tracking-[0.16em] font-semibold text-[var(--color-brand)]">
              — {FACILITIES_CLOSING_QUOTE.attribution}
            </cite>
          </div>
        </div>
      </section>

      {/* Section G — Call to Action */}
      <section
        aria-labelledby="facilities-cta-heading"
        className="bg-[var(--color-primary-ink)] text-white py-16 lg:py-20 border-t-4 border-t-[var(--color-brand)]"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-on-dark)] mb-2.5">
              Visit Capitol Hill College · Teku
            </p>
            <h2
              id="facilities-cta-heading"
              className="text-3xl sm:text-4xl font-semibold text-white leading-tight"
            >
              {FACILITIES_CTA_CONTENT.heading}
            </h2>
            <p className="mt-3.5 text-base text-neutral-300 leading-relaxed">
              {FACILITIES_CTA_CONTENT.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={onExplorePrograms}
              className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {FACILITIES_CTA_CONTENT.primaryLabel}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onContactCollege}
              className="inline-flex items-center justify-center min-h-11 px-6 py-3 text-sm font-semibold text-white border border-white/30 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {FACILITIES_CTA_CONTENT.secondaryLabel}
            </button>
          </div>
        </div>
      </section>

      {/* Accessible Full-Resolution Campus Photo Lightbox */}
      {activeLightboxItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeLightboxItem.title} campus photograph viewer`}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="max-w-5xl w-full bg-[var(--color-primary-ink)] border border-white/15 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 text-white">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-[var(--color-brand-on-dark)] tabular-nums">
                  {activeLightboxItem.number} / 06
                </span>
                <span aria-hidden="true" className="text-neutral-500">
                  ·
                </span>
                <span className="font-medium">{activeLightboxItem.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close photograph viewer"
                className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-black flex items-center justify-center max-h-[72vh] overflow-hidden">
              <img
                src={activeLightboxItem.asset.src}
                alt={activeLightboxItem.asset.alt}
                referrerPolicy="no-referrer"
                className="max-h-[72vh] w-auto object-contain"
              />
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + galleryAssets.length) % galleryAssets.length
                  )
                }
                aria-label="Previous facility photograph"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/65 hover:bg-[var(--color-brand)] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((lightboxIndex + 1) % galleryAssets.length)
                }
                aria-label="Next facility photograph"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/65 hover:bg-[var(--color-brand)] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-3.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-300">
              <span>
                <span className="font-mono text-[var(--color-brand-on-dark)] mr-2">
                  {activeLightboxItem.asset.figureNumber}
                </span>
                {activeLightboxItem.asset.caption}
              </span>
              <span className="text-neutral-400 shrink-0">Capitol Hill College · Teku</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
