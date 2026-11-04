/**
 * Shared CSS/container framing helpers for Principal Mr. Sagar Raj Khanal's
 * official transparent portrait (`/images/leadership/sagar-raj-khanal.png`, 433x423 RGBA).
 *
 * Strictly aligns and centers the photograph via CSS container transforms only —
 * zero pixel modification, regeneration, distortion, or facial alteration.
 */

export function isPrincipalCutoutPortrait(src?: string | null): boolean {
  return Boolean(src && src.endsWith('sagar-raj-khanal.png'));
}

export const PRINCIPAL_PORTRAIT_BG_CLASS =
  'bg-gradient-to-b from-[#FAF9F7] via-[#F2F0EC] to-[#E8E5DF]';

export const PRINCIPAL_PORTRAIT_THUMB_BG_CLASS = 'bg-[#F2F0EC]';

/**
 * 4:5 portrait container classes:
 * - `-rotate-[2.8deg]` corrects the slight clockwise lean in the source cutout so posture, shoulders, and tie are upright.
 * - `scale-[1.16]` and `-translate-y-[3.5%]` eliminate excess transparent space above the Dhaka topi (~13% natural studio headroom)
 *   while ensuring full edge-to-edge coverage on all four borders without corner gaps.
 * - `object-[52%_center] -translate-x-[1.5%]` centers the Principal horizontally on the 50% vertical axis.
 */
export const PRINCIPAL_PORTRAIT_4X5_IMG_CLASS =
  'w-full h-full object-cover object-[52%_center] origin-center -rotate-[2.8deg] scale-[1.16] -translate-y-[3.5%] -translate-x-[1.5%] transform-gpu select-none';

export const PRINCIPAL_PORTRAIT_4X5_HOVER_IMG_CLASS =
  'w-full h-full object-cover object-[52%_center] origin-center -rotate-[2.8deg] scale-[1.16] group-hover:scale-[1.18] -translate-y-[3.5%] -translate-x-[1.5%] transition-transform duration-300 transform-gpu select-none';

/**
 * 1:1 square/circular thumbnail classes (`w-16 h-16`, `w-14 h-14`, `w-8 h-8`):
 * Centers head, Dhaka topi, and upper collar cleanly with upright alignment.
 */
export const PRINCIPAL_PORTRAIT_THUMB_IMG_CLASS =
  'w-full h-full object-cover object-[52%_center] origin-center -rotate-[2.8deg] scale-[1.28] -translate-y-[6%] -translate-x-[1.5%] transform-gpu select-none';
