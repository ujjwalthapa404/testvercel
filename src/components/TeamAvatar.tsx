import React, { useState } from 'react';
import { getPersonInitials } from '../data/team';

interface TeamAvatarProps {
  name: string;
  designationOrContext?: string;
  portraitUrl?: string;
  variant: 'featured' | 'board' | 'compact';
}

export const TeamAvatar: React.FC<TeamAvatarProps> = ({
  name,
  designationOrContext,
  portraitUrl,
  variant,
}) => {
  const [imgError, setImgError] = useState(false);
  const initials = getPersonInitials(name);
  const showImage = Boolean(portraitUrl) && !imgError;

  const altText = designationOrContext
    ? `${name}, ${designationOrContext} at Capitol Hill College`
    : `${name}, Capitol Hill College`;

  const isCutout = Boolean(portraitUrl?.endsWith('sagar-raj-khanal.png'));

  if (variant === 'featured') {
    return (
      <div
        className={`relative w-full aspect-[4/5] overflow-hidden ${
          isCutout && showImage
            ? 'bg-gradient-to-b from-[#FAF9F7] via-[#F2F0EC] to-[#E8E5DF]'
            : 'bg-[var(--color-primary-ink)]'
        }`}
      >
        {showImage ? (
          <img
            src={portraitUrl}
            alt={altText}
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className={
              isCutout
                ? 'w-full h-full object-contain object-bottom pt-6 px-3 transition-transform duration-200 group-hover:scale-[1.015]'
                : 'w-full h-full object-cover object-top transition-transform duration-200 group-hover:scale-[1.015]'
            }
          />
        ) : (
          <div
            aria-hidden="true"
            className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[var(--color-charcoal)] to-[var(--color-primary-ink)] text-white select-none"
          >
            <span className="font-display text-4xl font-semibold tracking-wider text-white">
              {initials}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'board') {
    return (
      <div
        className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[var(--color-hairline)] ${
          isCutout && showImage ? 'bg-[#F2F0EC]' : 'bg-[var(--color-canvas)]'
        }`}
      >
        {showImage ? (
          <img
            src={portraitUrl}
            alt={altText}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className={
              isCutout
                ? 'w-full h-full object-contain object-bottom pt-1'
                : 'w-full h-full object-cover object-top'
            }
          />
        ) : (
          <div
            aria-hidden="true"
            className="w-full h-full flex items-center justify-center bg-[var(--color-primary-ink)] text-white font-display text-base font-semibold tracking-wide select-none"
          >
            {initials}
          </div>
        )}
      </div>
    );
  }

  /* Compact variant for Faculty & General Staff rows */
  return (
    <div
      className={`relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[var(--color-hairline)] flex items-center justify-center ${
        isCutout && showImage ? 'bg-[#F2F0EC]' : 'bg-[var(--color-brand-soft)]'
      }`}
    >
      {showImage ? (
        <img
          src={portraitUrl}
          alt={altText}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className={
            isCutout
              ? 'w-full h-full object-contain object-bottom pt-0.5'
              : 'w-full h-full object-cover object-top'
          }
        />
      ) : (
        <span
          aria-hidden="true"
          className="text-[11px] font-semibold tracking-wide text-[var(--color-brand)] select-none"
        >
          {initials}
        </span>
      )}
    </div>
  );
};
