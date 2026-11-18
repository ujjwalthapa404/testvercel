/**
 * Shared person formatting helpers used across leadership, faculty, and staff UIs.
 */

const HONORIFIC_PREFIX_REGEX = /^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Er\.)\s+/i;

/**
 * Extracts up to two uppercase monogram initials from a formal display name,
 * stripping common academic or courteous prefixes and punctuation.
 */
export function getPersonInitials(fullName: string): string {
  const cleaned = fullName.replace(HONORIFIC_PREFIX_REGEX, '').trim();
  const parts = cleaned
    .split(/\s+/)
    .map((part) => part.replace(/[^A-Za-z]/g, ''))
    .filter(Boolean);

  if (parts.length === 0) return 'CH';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
