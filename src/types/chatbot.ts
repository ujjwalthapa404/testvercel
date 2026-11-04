import { AcademicProgramSlug } from '../data/academicPrograms';

export enum ChatbotCategoryId {
  GENERAL = 'general',
  PROGRAMS = 'programs',
  ADMISSIONS = 'admissions',
  FEES = 'fees',
  FACILITIES = 'facilities',
  CONTACT = 'contact',
  BANTER = 'banter',
}

export interface ChatbotCategoryMeta {
  id: ChatbotCategoryId;
  label: string;
  shortLabel: string;
}

export type ChatbotActionType =
  | 'open-enquiry'
  | 'open-programs'
  | 'open-program-detail'
  | 'scroll-programs'
  | 'scroll-contact'
  | 'scroll-about'
  | 'open-leadership'
  | 'open-advisory'
  | 'open-facilities'
  | 'open-gallery'
  | 'open-team'
  | 'open-notices'
  | 'external-link';

export interface ChatbotQuickAction {
  label: string;
  action: ChatbotActionType;
  programTitle?: string;
  programSlug?: AcademicProgramSlug;
  externalHref?: string;
}

export interface ChatbotFaqItem {
  id: string;
  category: ChatbotCategoryId;
  categoryLabel: string;
  question: string;
  /** Alternative natural phrasings visitors commonly type */
  questionVariants: string[];
  /** Primary topic keywords weighted highest during matching */
  keywords: string[];
  /** Official verified answer paragraphs (supports clear administrative placeholders where needed) */
  answer: string[];
  /** Optional note highlighting items pending administrative confirmation */
  verificationNote?: string;
  /** IDs of related FAQ items to suggest as follow-ups */
  relatedIds: string[];
  /** Optional contextual navigation or enquiry button */
  primaryAction?: ChatbotQuickAction;
}

export type ChatSender = 'bot' | 'user';

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  textParagraphs: string[];
  timestampLabel: string;
  categoryLabel?: string;
  verificationNote?: string;
  suggestedQuestions?: string[];
  actions?: ChatbotQuickAction[];
  isFallback?: boolean;
}

/**
 * Manually coded conversational intent categories
 */
export enum ConversationIntent {
  GREETING = 'greeting',
  GENERAL_CONVERSATION = 'general_conversation',
  COLLEGE_INFO = 'college_info',
  ACADEMIC_PROGRAMS = 'academic_programs',
  PROGRAM_COMPARISON = 'program_comparison',
  ADMISSION = 'admission',
  ELIGIBILITY = 'eligibility',
  FEES = 'fees',
  SCHOLARSHIPS = 'scholarships',
  FACILITIES = 'facilities',
  LOCATION = 'location',
  CONTACT_INFO = 'contact_info',
  FOLLOW_UP = 'follow_up',
  CLARIFICATION_REQUEST = 'clarification_request',
  THANKS_ACKNOWLEDGEMENT = 'thanks_acknowledgement',
  NEEDS_CLARIFICATION = 'needs_clarification',
  UNCONFIRMED_COLLEGE_TOPIC = 'unconfirmed_college_topic',
  UNRELATED_TOPIC = 'unrelated_topic',
  UNKNOWN = 'unknown',
}

export type ProgramEntity =
  | 'plus2_science'
  | 'plus2_management'
  | 'plus2_humanities'
  | 'plus2_law'
  | 'bbs'
  | 'mbs';

export type FacilityEntity =
  | 'library'
  | 'labs'
  | 'cafeteria'
  | 'sports'
  | 'tours'
  | 'eca'
  | 'environment';

export type TopicAspect =
  | 'programs_overview'
  | 'program_detail'
  | 'comparison'
  | 'after_study'
  | 'admission_apply'
  | 'eligibility'
  | 'documents'
  | 'deadlines'
  | 'visit'
  | 'counselor'
  | 'fees'
  | 'fee_structure'
  | 'installments'
  | 'scholarships'
  | 'discounts'
  | 'facilities_overview'
  | 'facility_detail'
  | 'location'
  | 'contact'
  | 'leadership'
  | 'affiliations'
  | 'approach'
  | 'college_overview'
  | 'notices';

export interface ConversationTurnRecord {
  role: ChatSender;
  text: string;
  intent?: ConversationIntent;
  program?: ProgramEntity | null;
  aspect?: TopicAspect | null;
}

export interface PendingConversationPrompt {
  /** If the assistant asked a clarification question (e.g., "Which program's fees?") */
  awaitingEntityForAspect?: TopicAspect;
  /** If the assistant offered a natural next step at the end of a response (for "Yes"/"Sure") */
  suggestedNextStep?: {
    aspect: TopicAspect;
    program?: ProgramEntity | null;
    description: string;
  };
}

export interface ConversationContextState {
  /** Short rolling memory of the current chat session (up to 10 turns) */
  history: ConversationTurnRecord[];
  /** Currently focused academic program across turns */
  activeProgram: ProgramEntity | null;
  /** Currently focused facility across turns */
  activeFacility: FacilityEntity | null;
  /** Most recent college topic aspect discussed */
  activeAspect: TopicAspect | null;
  /** Last matched FAQ ID so "Tell me more" expands rather than repeating verbatim */
  lastFaqId: string | null;
  /** Tracks how many consecutive detail expansions occurred on the same topic */
  detailDepth: number;
  /** Rotating index for light-hearted predefined jokes */
  jokeIndex: number;
  /** Tracks pending clarification question or follow-up offer */
  pending: PendingConversationPrompt | null;
}

export interface ChatbotMatchResult {
  type: 'match' | 'greeting' | 'thanks' | 'fallback';
  intent?: ConversationIntent;
  matchedItem?: ChatbotFaqItem;
  confidence: number;
  replyParagraphs: string[];
  categoryLabel?: string;
  verificationNote?: string;
  relatedQuestions: string[];
  actions: ChatbotQuickAction[];
}
