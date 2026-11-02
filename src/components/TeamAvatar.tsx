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

  if (variant === 'featured') {
    return (
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[var(--color-primary-ink)]">
        {showImage ? (
          <img
            src={portraitUrl}
            alt={altText}
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top transition-transform duration-200 group-hover:scale-[1.015]"
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
      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[var(--color-hairline)] bg-[var(--color-canvas)]">
        {showImage ? (
          <img
            src={portraitUrl}
            alt={altText}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top"
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
    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[var(--color-hairline)] bg-[var(--color-brand-soft)] flex items-center justify-center">
      {showImage ? (
        <img
          src={portraitUrl}
          alt={altText}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-top"
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
