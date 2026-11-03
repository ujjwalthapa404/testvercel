import React, { useState } from 'react';
import { Building2, GraduationCap } from 'lucide-react';
import { COLLEGE_LOGO_ASSET } from '../data/facilities';

interface CollegeImageProps {
  src: string;
  alt: string;
  aspectClassName?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  fallbackTitle?: string;
}

export const CollegeImage: React.FC<CollegeImageProps> = ({
  src,
  alt,
  aspectClassName = 'aspect-[16/10]',
  className = '',
  imgClassName = '',
  priority = false,
  fallbackTitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative overflow-hidden bg-[var(--color-primary-ink)] text-white flex flex-col items-center justify-center p-8 text-center ${aspectClassName} ${className}`}
      >
        <Building2 className="w-8 h-8 mb-3 text-[var(--color-brand-on-dark)] opacity-90" />
        <p className="font-display text-base font-medium text-white max-w-xs">
          {fallbackTitle || 'Capitol Hill College Campus'}
        </p>
        <p className="mt-1 text-xs text-neutral-300 max-w-xs">Teku, Kathmandu, Nepal</p>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-neutral-200/75 ${aspectClassName} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover object-center transition-transform duration-200 ${imgClassName}`}
      />
    </div>
  );
};

interface CollegeLogoProps {
  size?: 'sm' | 'md' | 'header';
  variant?: 'light' | 'dark';
}

export const CollegeLogo: React.FC<CollegeLogoProps> = ({
  size = 'md',
  variant = 'dark',
}) => {
  const [logoError, setLogoError] = useState(false);
  const dimensionClass =
    size === 'header'
      ? 'w-10 h-10 sm:w-11 sm:h-11'
      : size === 'sm'
        ? 'w-9 h-9'
        : 'w-10 h-10';

  if (logoError) {
    return (
      <span
        aria-hidden="true"
        className={`${dimensionClass} rounded-lg flex items-center justify-center shrink-0 ${
          variant === 'light'
            ? 'bg-white text-[var(--color-brand)]'
            : 'bg-[var(--color-brand)] text-white'
        }`}
      >
        <GraduationCap className="w-5 h-5" />
      </span>
    );
  }

  return (
    <img
      src={COLLEGE_LOGO_ASSET.src}
      alt={COLLEGE_LOGO_ASSET.alt}
      width={COLLEGE_LOGO_ASSET.width}
      height={COLLEGE_LOGO_ASSET.height}
      referrerPolicy="no-referrer"
      decoding="async"
      onError={() => setLogoError(true)}
      className={`${dimensionClass} object-contain shrink-0 ${
        variant === 'light' ? 'bg-white rounded-md p-0.5' : ''
      }`}
    />
  );
};
