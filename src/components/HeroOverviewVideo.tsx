import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

/**
 * Official asset paths for the Homepage Hero Overview Video.
 * To replace the sample video with actual Capitol Hill College campus footage later,
 * simply overwrite `public/videos/college-overview.mp4` (and optionally
 * `public/images/college-overview-poster.jpg`) without changing any code.
 */
export const HERO_OVERVIEW_VIDEO_SRC = '/videos/college-overview.mp4';
export const HERO_OVERVIEW_POSTER_SRC = '/images/college-overview-poster.jpg';

export const HeroOverviewVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    // Explicitly set DOM muted properties to guarantee browser autoplay compliance
    videoEl.defaultMuted = true;
    videoEl.muted = true;

    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPaused(false);
        })
        .catch(() => {
          // Browser autoplay policy or system data-saver paused initial playback
          setIsPaused(true);
        });
    }
  }, []);

  const handleTogglePlayback = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      void videoEl.play().then(() => setIsPaused(false)).catch(() => {});
    } else {
      videoEl.pause();
      setIsPaused(true);
    }
  };

  return (
    <div className="relative w-full aspect-video lg:aspect-auto lg:absolute lg:inset-0 lg:h-full lg:w-full bg-[var(--color-primary-ink)] overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={HERO_OVERVIEW_POSTER_SRC}
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        aria-label="Capitol Hill College academic and campus overview video"
        className="h-full w-full object-cover object-center"
      >
        <source src={HERO_OVERVIEW_VIDEO_SRC} type="video/mp4" />
        Your browser does not support HTML5 video playback.
      </video>

      {/* Mobile & Tablet bottom edge blend into the architectural charcoal introduction panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#171717] via-[#171717]/35 to-transparent lg:hidden"
      />

      {/* Desktop directional charcoal scrim: strong readability behind left typography, vivid open video on the right */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:block absolute inset-0 bg-gradient-to-r from-[#171717]/92 via-[#171717]/65 via-[46%] to-[#171717]/14"
      />

      {/* Desktop subtle top and bottom framing vignettes */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:block absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#171717]/35 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:block absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#171717]/92 via-[#171717]/35 to-transparent"
      />

      {/* Accessible Play / Pause control (44px min touch target; top-right on desktop to leave bottom-right clear for chat greeting) */}
      <button
        type="button"
        onClick={handleTogglePlayback}
        aria-label={isPaused ? 'Play campus overview video' : 'Pause campus overview video'}
        title={isPaused ? 'Play video' : 'Pause video'}
        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 lg:bottom-auto lg:top-6 lg:right-8 z-20 pointer-events-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/25 bg-[#171717]/80 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-xs transition-colors hover:bg-[var(--color-brand)] hover:border-white/40 focus-visible:outline-2 focus-visible:outline-white whitespace-nowrap shrink-0 cursor-pointer"
      >
        {isPaused ? (
          <>
            <Play className="h-3.5 w-3.5 fill-current shrink-0" />
            <span>Play Video</span>
          </>
        ) : (
          <>
            <Pause className="h-3.5 w-3.5 fill-current shrink-0" />
            <span>Pause Video</span>
          </>
        )}
      </button>
    </div>
  );
};
