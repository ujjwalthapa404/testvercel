/**
 * Derived Leadership Messages Selector Module
 * Capitol Hill College — Teku, Kathmandu, Nepal
 *
 * Derives `PRINCIPAL_MESSAGE`, `CEO_DIRECTOR_MESSAGE`, and `ADDITIONAL_DIRECTORS_MESSAGES`
 * directly from the canonical `BOARD_OF_DIRECTORS` and `EXECUTIVE_LEADERSHIP` records in
 * `./leadershipData.ts` so leader names, portraits, designations, and official messages
 * are never duplicated across multiple files.
 */

import {
  BOARD_OF_DIRECTORS,
  EXECUTIVE_LEADERSHIP,
  LeadershipMemberProfile,
  LeadershipMessageSubsection,
} from './leadershipData';

export type { LeadershipMessageSubsection };

export interface LeadershipMessageEntry {
  id: string;
  memberId: string;
  sectionKicker: string;
  sectionHeading: string;
  campusLocationLine: string;
  leaderName: string;
  designation: string;
  institution: string;
  portraitSrc: string;
  portraitAlt: string;
  /** True ONLY for transparent-background cutout portraits */
  isCutoutPortrait?: boolean;
  /** Optional concise verified institutional highlights shown beneath the nameplate */
  institutionalHighlights?: string[];
  salutation: string;
  openingParagraphs: string[];
  subsections?: LeadershipMessageSubsection[];
  closingPhrase: string;
}

function toMessageEntry(member: LeadershipMemberProfile): LeadershipMessageEntry {
  if (!member.officialMessage) {
    throw new Error(`Missing canonical officialMessage for leader '${member.id}'.`);
  }

  const msg = member.officialMessage;
  return {
    id: msg.id,
    memberId: member.id,
    sectionKicker: msg.sectionKicker,
    sectionHeading: msg.sectionHeading,
    campusLocationLine: msg.campusLocationLine,
    leaderName: member.fullName,
    designation: member.shortDesignation,
    institution: 'CAPITOL HILL COLLEGE',
    portraitSrc: member.portraitSrc ?? '',
    portraitAlt: member.portraitAlt,
    isCutoutPortrait: member.isCutoutPortrait,
    institutionalHighlights: msg.institutionalHighlights,
    salutation: msg.salutation,
    openingParagraphs: msg.openingParagraphs,
    subsections: msg.subsections,
    closingPhrase: msg.closingPhrase,
  };
}

const principalRecord = EXECUTIVE_LEADERSHIP.find(
  (leader) => leader.id === 'sagar-raj-khanal' && Boolean(leader.officialMessage)
);

const ceoDirectorRecord = BOARD_OF_DIRECTORS.find(
  (leader) => leader.id === 'nischal-gautam' && Boolean(leader.officialMessage)
);

if (!principalRecord || !ceoDirectorRecord) {
  throw new Error('Canonical Principal or CEO & Director leadership record is missing.');
}

export const PRINCIPAL_MESSAGE: LeadershipMessageEntry = toMessageEntry(principalRecord);

export const CEO_DIRECTOR_MESSAGE: LeadershipMessageEntry = toMessageEntry(ceoDirectorRecord);

/**
 * Automatically derives any additional Board Directors' published messages from `BOARD_OF_DIRECTORS`.
 */
export const ADDITIONAL_DIRECTORS_MESSAGES: LeadershipMessageEntry[] = BOARD_OF_DIRECTORS.filter(
  (director) => director.id !== 'nischal-gautam' && Boolean(director.officialMessage)
).map(toMessageEntry);
