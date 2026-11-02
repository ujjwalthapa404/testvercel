import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Expand,
  Images,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  ALL_GALLERY_IMAGES,
  GALLERY_COLLECTIONS,
  GALLERY_CTA_CONTENT,
  GALLERY_PAGE_HEADER,
  GalleryCategoryCollection,
  GalleryCategoryId,
  GalleryImageItem,
} from '../data/gallery';

/* -------------------------------------------------------------------------- */
/* Resilient Photo Tile                                                       */
/* -------------------------------------------------------------------------- */

interface GalleryPhotoButtonProps {
  image: GalleryImageItem;
  aspectClassName: string;
  className?: string;
  objectPositionClassName?: string;
  priority?: boolean;
  showCaptionBar?: boolean;
  onOpen: (imageId: string) => void;
}

const GalleryPhotoButton: React.FC<GalleryPhotoButtonProps> = ({
  image,
  aspectClassName,
  className = '',
  objectPositionClassName = 'object-center',
  priority = false,
  showCaptionBar = true,
  onOpen,
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <figure className={`flex flex-col ${className}`}>
      <button
        type="button"
        onClick={() => onOpen(image.id)}
        aria-label={`Open full-size photograph: ${image.caption} (${image.categoryName})`}
        className={`group relative w-full overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-[var(--color-primary-ink)] text-left focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] cursor-pointer ${aspectClassName}`}
      >
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[var(--color-primary-ink)] to-[var(--color-charcoal)] text-white">
            <Images className="w-7 h-7 text-[var(--color-brand-on-dark)] mb-2.5 opacity-90" />
            <span className="font-display text-sm font-medium">{image.categoryName}</span>
            <span className="mt-1 text-xs text-neutral-300">{image.caption}</span>
          </div>
        ) : (
          <img
            src={image.src}
            alt={image.alt}
            width={image.naturalWidth}
            height={image.naturalHeight}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover ${objectPositionClassName} transition-transform duration-200 group-hover:scale-[1.02]`}
          />
        )}

        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#171717]/80 text-white text-xs font-medium opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150"
        >
          <Expand className="w-3.5 h-3.5" />
          View
        </span>
      </button>

      {showCaptionBar && (
        <figcaption className="mt-2.5 flex items-baseline justify-between gap-3 text-xs text-[var(--color-muted)]">
          <span className="leading-relaxed">{image.caption}</span>
        </figcaption>
      )}
    </figure>
  );
};

/* -------------------------------------------------------------------------- */
/* GalleryHero — Layered Editorial Mosaic Header                              */
/* -------------------------------------------------------------------------- */

interface GalleryHeroProps {
  totalPhotos: number;
  totalCategories: number;
  onNavigateHome: () => void;
  onOpenImage: (imageId: string) => void;
}

export const GalleryHero: React.FC<GalleryHeroProps> = ({
  totalPhotos,
  totalCategories,
  onNavigateHome,
  onOpenImage,
}) => {
  /* Select 3 authentic photographs across Classroom, Sports & Welcome for the asymmetric hero mosaic */
  const heroPrimary = GALLERY_COLLECTIONS[0].images[0]; // Classroom c1
  const heroSecondaryTop = GALLERY_COLLECTIONS[1].images[0]; // Sports game
  const heroSecondaryBottom = GALLERY_COLLECTIONS[3].images[0]; // Welcome wecome

  return (
    <section
      aria-labelledby="gallery-hero-heading"
      className="bg-white border-b border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <li>
              <button
                type="button"
                onClick={onNavigateHome}
                className="hover:text-[var(--color-brand)] underline-offset-4 hover:underline transition-colors cursor-pointer"
              >
                {GALLERY_PAGE_HEADER.breadcrumbParent}
              </button>
            </li>
            <li aria-hidden="true" className="text-neutral-400">
              /
            </li>
            <li aria-current="page" className="text-[var(--color-primary-ink)] font-semibold">
              {GALLERY_PAGE_HEADER.breadcrumbCurrent}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Clean Institutional Typography */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-3">
              {GALLERY_PAGE_HEADER.kicker}
            </p>
            <h1
              id="gallery-hero-heading"
              className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1] text-[var(--color-primary-ink)]"
            >
              {GALLERY_PAGE_HEADER.heading}
            </h1>
            <p className="mt-4 text-[15px] sm:text-base text-[var(--color-muted)] leading-relaxed max-w-lg">
              {GALLERY_PAGE_HEADER.supportingText}
            </p>

            <div className="mt-7 pt-5 border-t border-[var(--color-hairline)] flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[var(--color-muted)]">
              <span className="tabular-nums font-semibold text-[var(--color-brand)]">
                {totalCategories} Event Collections
              </span>
              <span aria-hidden="true" className="text-neutral-400">
                ·
              </span>
              <span className="tabular-nums font-medium text-[var(--color-primary-ink)]">
                {totalPhotos} Campus Photographs
              </span>
              <span aria-hidden="true" className="text-neutral-400">
                ·
              </span>
              <span>Teku, Kathmandu</span>
            </div>
          </div>

          {/* Right Column: Asymmetric 3-Photo Editorial Arrangement */}
          <div className="lg:col-span-7 grid grid-cols-12 gap-3.5 items-stretch">
            <div className="col-span-12 sm:col-span-7 flex">
              <button
                type="button"
                onClick={() => onOpenImage(heroPrimary.id)}
                aria-label={`Inspect ${heroPrimary.categoryName} photograph`}
                className="group relative w-full rounded-xl overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-primary-ink)] aspect-[16/10] sm:aspect-auto sm:h-full min-h-[220px] cursor-pointer"
              >
                <img
                  src={heroPrimary.src}
                  alt={heroPrimary.alt}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-[1.02]"
                />
                <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-[#171717]/80 text-[11px] text-white font-medium">
                  Classroom Life
                </span>
              </button>
            </div>

            <div className="col-span-12 sm:col-span-5 grid grid-cols-2 sm:grid-cols-1 gap-3.5">
              <button
                type="button"
                onClick={() => onOpenImage(heroSecondaryTop.id)}
                aria-label={`Inspect ${heroSecondaryTop.categoryName} photograph`}
                className="group relative w-full rounded-xl overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-primary-ink)] aspect-[4/3] sm:aspect-[16/10] cursor-pointer"
              >
                <img
                  src={heroSecondaryTop.src}
                  alt={heroSecondaryTop.alt}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-[1.02]"
                />
                <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-[#171717]/80 text-[11px] text-white font-medium">
                  Campus Sports
                </span>
              </button>

              <button
                type="button"
                onClick={() => onOpenImage(heroSecondaryBottom.id)}
                aria-label={`Inspect ${heroSecondaryBottom.categoryName} photograph`}
                className="group relative w-full rounded-xl overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-primary-ink)] aspect-[4/3] sm:aspect-[16/10] cursor-pointer"
              >
                <img
                  src={heroSecondaryBottom.src}
                  alt={heroSecondaryBottom.alt}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-[1.02]"
                />
                <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-[#171717]/80 text-[11px] text-white font-medium">
                  Welcome Program
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* GalleryFilters — Understated Category Filter Bar                           */
/* -------------------------------------------------------------------------- */

interface GalleryFiltersProps {
  collections: GalleryCategoryCollection[];
  activeCategory: GalleryCategoryId;
  totalCount: number;
  onSelectCategory: (category: GalleryCategoryId) => void;
}

export const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  collections,
  activeCategory,
  totalCount,
  onSelectCategory,
}) => {
  const filterTabs: { id: GalleryCategoryId; label: string; count: number }[] = useMemo(
    () => [
      { id: 'all', label: 'All', count: totalCount },
      ...collections.map((c) => ({
        id: c.id,
        label: c.name,
        count: c.images.length,
      })),
    ],
    [collections, totalCount]
  );

  return (
    <div className="bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Gallery event categories"
          className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0"
        >
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)] font-semibold'
                    : 'bg-white text-[var(--color-ink)] border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`tabular-nums text-[11px] ${
                    isActive ? 'text-white/85' : 'text-[var(--color-muted)]'
                  }`}
                >
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>

        {activeCategory !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Show All Collections
          </button>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* GalleryImageGrid — 7 Bespoke Proportion-True Editorial Compositions        */
/* -------------------------------------------------------------------------- */

interface GalleryImageGridProps {
  collection: GalleryCategoryCollection;
  onOpenImage: (imageId: string) => void;
}

export const GalleryImageGrid: React.FC<GalleryImageGridProps> = ({
  collection,
  onOpenImage,
}) => {
  const [img0, img1, img2] = collection.images;

  switch (collection.layoutVariant) {
    /* 01. Classroom: 2 wide landscapes stacked left (7 cols) + 1 tall vertical portrait right (5 cols) */
    case 'classroom-diptych-portrait':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
            <GalleryPhotoButton
              image={img0}
              aspectClassName="aspect-[21/10]"
              onOpen={onOpenImage}
            />
            <GalleryPhotoButton
              image={img1}
              aspectClassName="aspect-[16/10]"
              onOpen={onOpenImage}
            />
          </div>
          <div className="lg:col-span-5 flex flex-col">
            <GalleryPhotoButton
              image={img2}
              aspectClassName="aspect-[3/4] lg:aspect-auto lg:flex-1 min-h-[340px]"
              className="h-full"
              objectPositionClassName="object-top"
              onOpen={onOpenImage}
            />
          </div>
        </div>
      );

    /* 02. Sports: Dominant 4:3 feature left (8 cols) + 2 supporting 4:3 frames stacked right (4 cols) */
    case 'sports-feature-left':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 flex flex-col">
            <GalleryPhotoButton
              image={img0}
              aspectClassName="aspect-[4/3] lg:aspect-auto lg:flex-1 min-h-[320px]"
              className="h-full"
              onOpen={onOpenImage}
            />
          </div>
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <GalleryPhotoButton
              image={img1}
              aspectClassName="aspect-[4/3]"
              onOpen={onOpenImage}
            />
            <GalleryPhotoButton
              image={img2}
              aspectClassName="aspect-[4/3]"
              onOpen={onOpenImage}
            />
          </div>
        </div>
      );

    /* 03. Educational Tours: Asymmetric Editorial Collage (7 cols + 5 cols top-aligned, or 5/7 offset) */
    case 'tours-editorial-triptych':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7">
              <GalleryPhotoButton
                image={img0}
                aspectClassName="aspect-[4/3]"
                onOpen={onOpenImage}
              />
            </div>
            <div className="md:col-span-5 grid grid-cols-1 gap-6">
              <GalleryPhotoButton
                image={img1}
                aspectClassName="aspect-[4/3]"
                onOpen={onOpenImage}
              />
              <GalleryPhotoButton
                image={img2}
                aspectClassName="aspect-[16/10]"
                onOpen={onOpenImage}
              />
            </div>
          </div>
        </div>
      );

    /* 04. Welcome Program: Reversed Polarity — 2 supporting 3:2 frames left (4 cols) + Large 3:2 feature right (8 cols) */
    case 'welcome-feature-right':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-4 order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <GalleryPhotoButton
              image={img1}
              aspectClassName="aspect-[3/2]"
              onOpen={onOpenImage}
            />
            <GalleryPhotoButton
              image={img2}
              aspectClassName="aspect-[3/2]"
              onOpen={onOpenImage}
            />
          </div>
          <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col">
            <GalleryPhotoButton
              image={img0}
              aspectClassName="aspect-[3/2] lg:aspect-auto lg:flex-1 min-h-[320px]"
              className="h-full"
              onOpen={onOpenImage}
            />
          </div>
        </div>
      );

    /* 05. Quiz Competition: Full-Span Panoramic Stage (2560x1183) on top + Asymmetric 7/5 Pair below */
    case 'quiz-panoramic-marquee':
      return (
        <div className="space-y-6">
          <GalleryPhotoButton
            image={img0}
            aspectClassName="aspect-[16/9] sm:aspect-[21/10]"
            onOpen={onOpenImage}
          />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            <div className="md:col-span-7 flex flex-col">
              <GalleryPhotoButton
                image={img1}
                aspectClassName="aspect-[5/4] md:aspect-auto md:flex-1 min-h-[280px]"
                className="h-full"
                onOpen={onOpenImage}
              />
            </div>
            <div className="md:col-span-5">
              <GalleryPhotoButton
                image={img2}
                aspectClassName="aspect-square"
                onOpen={onOpenImage}
              />
            </div>
          </div>
        </div>
      );

    /* 06. Science Practical: Widescreen Lab Anchor (6 cols) + Twin Vertical Portrait Columns (3 cols + 3 cols) */
    case 'science-wide-plus-portraits':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-6 flex flex-col">
            <GalleryPhotoButton
              image={img0}
              aspectClassName="aspect-[16/10] lg:aspect-auto lg:flex-1 min-h-[320px]"
              className="h-full"
              onOpen={onOpenImage}
            />
          </div>
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <GalleryPhotoButton
              image={img1}
              aspectClassName="aspect-[3/4]"
              objectPositionClassName="object-top"
              onOpen={onOpenImage}
            />
            <GalleryPhotoButton
              image={img2}
              aspectClassName="aspect-[3/4]"
              objectPositionClassName="object-top"
              onOpen={onOpenImage}
            />
          </div>
        </div>
      );

    /* 07. Farewell: Reflective Finale — Tall 4:5 Portrait Left (5 cols) + Widescreen & 4:3 Stack Right (7 cols) */
    case 'farewell-portrait-finale':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 flex flex-col">
            <GalleryPhotoButton
              image={img0}
              aspectClassName="aspect-[4/5] lg:aspect-auto lg:flex-1 min-h-[360px]"
              className="h-full"
              objectPositionClassName="object-top"
              onOpen={onOpenImage}
            />
          </div>
          <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
            <GalleryPhotoButton
              image={img1}
              aspectClassName="aspect-[16/9]"
              onOpen={onOpenImage}
            />
            <GalleryPhotoButton
              image={img2}
              aspectClassName="aspect-[4/3] sm:aspect-[16/10]"
              onOpen={onOpenImage}
            />
          </div>
        </div>
      );
  }
};

/* -------------------------------------------------------------------------- */
/* GallerySection — Editorial Event Story + Bespoke Grid                      */
/* -------------------------------------------------------------------------- */

interface GallerySectionProps {
  collection: GalleryCategoryCollection;
  surfaceTone: 'canvas' | 'white';
  onOpenImage: (imageId: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  collection,
  surfaceTone,
  onOpenImage,
}) => {
  return (
    <section
      id={`gallery-${collection.id}`}
      aria-labelledby={`gallery-heading-${collection.id}`}
      className={`py-14 lg:py-20 border-b border-[var(--color-hairline)] ${
        surfaceTone === 'white' ? 'bg-white' : 'bg-[var(--color-canvas)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial Category Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end pb-8 mb-9 border-b border-[var(--color-hairline)]">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-2.5">
              <span className="font-mono font-semibold text-[var(--color-brand)] tabular-nums">
                {collection.sectionNumber}
              </span>
              <span aria-hidden="true">/</span>
              <span className="uppercase tracking-widest font-semibold text-[var(--color-primary-ink)]">
                {collection.name}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{collection.images.length} Photos</span>
            </div>
            <h2
              id={`gallery-heading-${collection.id}`}
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--color-primary-ink)] leading-tight"
            >
              {collection.eventTitle}
            </h2>
          </div>

          <div className="lg:col-span-7">
            <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed max-w-2xl">
              {collection.description}
            </p>
          </div>
        </div>

        {/* Proportion-True Editorial Image Grid */}
        <GalleryImageGrid collection={collection} onOpenImage={onOpenImage} />
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* GalleryLightbox — Accessible Keyboard & Touch Modal Viewer                 */
/* -------------------------------------------------------------------------- */

interface GalleryLightboxProps {
  images: GalleryImageItem[];
  activeIndex: number | null;
  scopeLabel: string;
  onClose: () => void;
  onChangeIndex: (nextIndex: number) => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  images,
  activeIndex,
  scopeLabel,
  onClose,
  onChangeIndex,
}) => {
  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        onChangeIndex((activeIndex + 1) % images.length);
      } else if (e.key === 'ArrowLeft') {
        onChangeIndex((activeIndex - 1 + images.length) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, images.length, onChangeIndex, onClose]);

  if (activeIndex === null || !images[activeIndex]) {
    return null;
  }

  const currentImage = images[activeIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${currentImage.eventTitle} — Photograph ${activeIndex + 1} of ${images.length}`}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="max-w-5xl w-full bg-[var(--color-primary-ink)] border border-white/15 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Metadata & Close Bar */}
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 border-b border-white/10 text-white shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <span className="font-mono text-[var(--color-brand-on-dark)] tabular-nums">
                {activeIndex + 1} / {images.length}
              </span>
              <span aria-hidden="true" className="text-neutral-500">
                ·
              </span>
              <span className="truncate">{scopeLabel}</span>
            </div>
            <p className="text-sm font-semibold text-white truncate mt-0.5">
              {currentImage.eventTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close photograph viewer"
            className="w-10 h-10 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Full-Resolution Uncropped Image Stage */}
        <div className="relative bg-black flex-1 min-h-0 flex items-center justify-center p-2 sm:p-4">
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            referrerPolicy="no-referrer"
            className="max-h-[68vh] sm:max-h-[72vh] max-w-full w-auto h-auto object-contain rounded"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  onChangeIndex((activeIndex - 1 + images.length) % images.length)
                }
                aria-label="Previous photograph"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-[var(--color-brand)] border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => onChangeIndex((activeIndex + 1) % images.length)}
                aria-label="Next photograph"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-[var(--color-brand)] border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Bottom Caption Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-300 shrink-0">
          <span>{currentImage.caption}</span>
          <span className="text-neutral-400 shrink-0">
            {currentImage.categoryName} · Capitol Hill College
          </span>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* GalleryCTA — Closing Call to Action                                        */
/* -------------------------------------------------------------------------- */

interface GalleryCTAProps {
  onExplorePrograms: () => void;
  onContactUs: () => void;
}

export const GalleryCTA: React.FC<GalleryCTAProps> = ({
  onExplorePrograms,
  onContactUs,
}) => {
  return (
    <section
      aria-labelledby="gallery-cta-heading"
      className="bg-[var(--color-primary-ink)] text-white py-16 lg:py-20 border-t-4 border-t-[var(--color-brand)]"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-on-dark)] mb-2.5">
            Admissions &amp; Campus Life
          </p>
          <h2
            id="gallery-cta-heading"
            className="text-3xl sm:text-4xl font-semibold text-white leading-tight"
          >
            {GALLERY_CTA_CONTENT.heading}
          </h2>
          <p className="mt-3.5 text-base text-neutral-300 leading-relaxed">
            {GALLERY_CTA_CONTENT.supportingText}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={onExplorePrograms}
            className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {GALLERY_CTA_CONTENT.primaryLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onContactUs}
            className="inline-flex items-center justify-center min-h-11 px-6 py-3 text-sm font-semibold text-white border border-white/30 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {GALLERY_CTA_CONTENT.secondaryLabel}
          </button>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Complete CampusGalleryPage                                                 */
/* -------------------------------------------------------------------------- */

interface CampusGalleryPageProps {
  onNavigateHome: () => void;
  onExplorePrograms: () => void;
  onContactUs: () => void;
}

export const CampusGalleryPage: React.FC<CampusGalleryPageProps> = ({
  onNavigateHome,
  onExplorePrograms,
  onContactUs,
}) => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategoryId>('all');
  const [lightboxImageId, setLightboxImageId] = useState<string | null>(null);

  const visibleCollections = useMemo(() => {
    if (activeCategory === 'all') {
      return GALLERY_COLLECTIONS;
    }
    return GALLERY_COLLECTIONS.filter((c) => c.id === activeCategory);
  }, [activeCategory]);

  /* Active lightbox pool scopes to the selected category (or all 21 photos if viewing 'All' or clicked from Hero) */
  const lightboxPool = useMemo(() => {
    const visibleFlat = visibleCollections.flatMap((c) => c.images);
    if (
      lightboxImageId &&
      !visibleFlat.some((img) => img.id === lightboxImageId)
    ) {
      return ALL_GALLERY_IMAGES;
    }
    return visibleFlat;
  }, [visibleCollections, lightboxImageId]);

  const activeLightboxIndex = useMemo(() => {
    if (!lightboxImageId) return null;
    const idx = lightboxPool.findIndex((img) => img.id === lightboxImageId);
    return idx >= 0 ? idx : null;
  }, [lightboxImageId, lightboxPool]);

  const lightboxScopeLabel = useMemo(() => {
    if (activeCategory === 'all' || lightboxPool.length === ALL_GALLERY_IMAGES.length) {
      return 'All Gallery Collections';
    }
    return visibleCollections[0]?.name ?? 'Gallery';
  }, [activeCategory, lightboxPool.length, visibleCollections]);

  const handleLightboxIndexChange = (nextIndex: number) => {
    const target = lightboxPool[nextIndex];
    if (target) {
      setLightboxImageId(target.id);
    }
  };

  return (
    <div className="bg-[var(--color-canvas)] text-[var(--color-ink)]">
      <GalleryHero
        totalPhotos={ALL_GALLERY_IMAGES.length}
        totalCategories={GALLERY_COLLECTIONS.length}
        onNavigateHome={onNavigateHome}
        onOpenImage={(id) => setLightboxImageId(id)}
      />

      <GalleryFilters
        collections={GALLERY_COLLECTIONS}
        activeCategory={activeCategory}
        totalCount={ALL_GALLERY_IMAGES.length}
        onSelectCategory={setActiveCategory}
      />

      <div aria-live="polite">
        {visibleCollections.map((collection, index) => (
          <GallerySection
            key={collection.id}
            collection={collection}
            surfaceTone={index % 2 === 0 ? 'white' : 'canvas'}
            onOpenImage={(id) => setLightboxImageId(id)}
          />
        ))}
      </div>

      <GalleryCTA
        onExplorePrograms={onExplorePrograms}
        onContactUs={onContactUs}
      />

      <GalleryLightbox
        images={lightboxPool}
        activeIndex={activeLightboxIndex}
        scopeLabel={lightboxScopeLabel}
        onClose={() => setLightboxImageId(null)}
        onChangeIndex={handleLightboxIndexChange}
      />
    </div>
  );
};
