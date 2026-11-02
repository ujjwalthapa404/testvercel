import React, { useState } from 'react';
import { User } from 'lucide-react';

interface AlumniAvatarProps {
  fullName: string;
  initials: string;
  photoUrl?: string;
  photoAlt: string;
  isSamplePlaceholder?: boolean;
  variant?: 'card' | 'avatar';
}

export const AlumniAvatar: React.FC<AlumniAvatarProps> = ({
  fullName,
  initials,
  photoUrl,
  photoAlt,
  isSamplePlaceholder = false,
  variant = 'card',
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const hasValidPhoto = Boolean(photoUrl && photoUrl.trim().length > 0 && !imgFailed);

  if (variant === 'avatar') {
    return (
      <div className="w-12 h-12 rounded-lg overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-canvas)] shrink-0 flex items-center justify-center">
        {hasValidPhoto ? (
          <img
            src={photoUrl}
            alt={photoAlt || fullName}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <span
            aria-hidden="true"
            className="font-mono text-xs font-semibold tracking-wider text-[var(--color-brand)] select-none"
          >
            {initials}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]">
      {hasValidPhoto ? (
        <img
          src={photoUrl}
          alt={photoAlt || fullName}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div
          role="img"
          aria-label={photoAlt || `${fullName} portrait placeholder`}
          className="w-full h-full flex flex-col items-center justify-center px-6 text-center select-none bg-[var(--color-canvas)]"
        >
          <div className="w-16 h-16 rounded-xl bg-white border border-[var(--color-hairline)] flex items-center justify-center text-[var(--color-brand)] shadow-2xs">
            <User className="w-7 h-7 stroke-[1.6]" aria-hidden="true" />
          </div>
          <p className="mt-3 font-mono text-xs font-medium tracking-wider uppercase text-[var(--color-primary-ink)]">
            {initials}
          </p>
          {isSamplePlaceholder && (
            <p className="mt-1 text-[11px] text-[var(--color-muted)]">
              Sample Portrait Placeholder
            </p>
          )}
        </div>
      )}
    </div>
  );
};
