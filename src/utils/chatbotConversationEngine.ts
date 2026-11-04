import { OFFICIAL_GOOGLE_MAPS_URL } from '../data/academicPrograms';
import {
  CHATBOT_FAQ_DATABASE,
  CHATBOT_INITIAL_SUGGESTIONS,
} from '../data/chatbotFaqs';
import {
  FACILITY_DEEPER_DETAILS,
  HUMAN_BANTER_TEMPLATES,
  PROGRAM_COMPARISON_TEMPLATES,
  PROGRAM_PROFILES,
  STUDENT_JOKES,
  UNCONFIRMED_COLLEGE_TOPICS,
} from '../data/chatbotResponses';
import {
  ChatbotQuickAction,
  ConversationContextState,
  ConversationIntent,
  ConversationTurnRecord,
  FacilityEntity,
  ProgramEntity,
  TopicAspect,
} from '../types/chatbot';
import { analyzeUserMessage } from './chatbotIntentEngine';
import { matchUserQuestion } from './chatbotMatcher';

export interface ProcessedConversationTurn {
  intent: ConversationIntent;
  replyParagraphs: string[];
  categoryLabel?: string;
  verificationNote?: string;
  suggestedQuestions: string[];
  actions: ChatbotQuickAction[];
  isFallback: boolean;
  nextContext: ConversationContextState;
}

const MAX_HISTORY_TURNS = 10;

export function createInitialConversationContext(): ConversationContextState {
  return {
    history: [],
    activeProgram: null,
    activeFacility: null,
    activeAspect: null,
    lastFaqId: null,
    detailDepth: 0,
    jokeIndex: 0,
    pending: null,
  };
}

function appendTurnHistory(
  history: ConversationTurnRecord[],
  userTurn: ConversationTurnRecord,
  botText: string,
  intent: ConversationIntent,
  program: ProgramEntity | null,
  aspect: TopicAspect | null,
): ConversationTurnRecord[] {
  const updated = [
    ...history,
    userTurn,
    {
      role: 'bot' as const,
      text: botText,
      intent,
      program,
      aspect,
    },
  ];
  return updated.slice(-MAX_HISTORY_TURNS);
}

function findFaqItem(id: string) {
  return CHATBOT_FAQ_DATABASE.find((item) => item.id === id);
}

function buildGreetingPrefix(rawText: string, enabled: boolean): string {
  if (!enabled) return '';
  const lower = rawText.toLowerCase();
  if (lower.startsWith('good morning')) return 'Good morning! ';
  if (lower.startsWith('good afternoon')) return 'Good afternoon! ';
  if (lower.startsWith('good evening')) return 'Good evening! ';
  if (lower.startsWith('namaste') || lower.startsWith('namaskar')) return 'Namaste! ';
  return 'Hello! ';
}

function applyLeadingGreeting(paragraphs: string[], prefix: string): string[] {
  if (!prefix || paragraphs.length === 0) return paragraphs;
  const first = paragraphs[0];
  if (/^(hello|hi|good morning|good afternoon|good evening|namaste)/i.test(first)) {
    return paragraphs;
  }
  const loweredFirst =
    // Preserve acronyms/symbols like "+2", "BBS", "Capitol Hill", "NEB", "TU", "SEE", "I", "I'm"
    /^(\+2|BBS|NEB|TU|SEE|Capitol|I\b|I')/.test(first)
      ? first
      : first.charAt(0).toLowerCase() + first.slice(1);
  return [`${prefix}${loweredFirst}`, ...paragraphs.slice(1)];
}

/**
 * Generates a program-specific response for any aspect (overview, fees, eligibility, documents, scholarships, deadlines, after_study, apply)
 */
function buildProgramAspectResponse(
  program: ProgramEntity,
  aspect: TopicAspect,
): {
  paragraphs: string[];
  categoryLabel: string;
  verificationNote?: string;
  suggestedQuestions: string[];
  actions: ChatbotQuickAction[];
  suggestedNextAspect?: TopicAspect;
} {
  const profile = PROGRAM_PROFILES[program];
  const programPageAction: ChatbotQuickAction = {
    label: `Explore ${profile.shortName} Page`,
    action: 'open-program-detail',
    programSlug: profile.programSlug,
  };
  const enquiryAction: ChatbotQuickAction = {
    label: `Enquire About ${profile.shortName}`,
    action: 'open-enquiry',
    programTitle: profile.enquiryProgramTitle,
  };

  switch (aspect) {
    case 'fees':
    case 'fee_structure':
      return {
        paragraphs: profile.fees.paragraphs,
        categoryLabel: `${profile.displayName} · Fees`,
        verificationNote: profile.fees.verificationNote,
        suggestedQuestions: [
          `Are scholarships available for ${profile.shortName}?`,
          `What are the eligibility requirements for ${profile.shortName}?`,
          'Can I pay fees in installments?',
        ],
        actions: [
          enquiryAction,
          { label: 'Contact Office', action: 'scroll-contact' },
        ],
        suggestedNextAspect: 'scholarships',
      };

    case 'scholarships':
    case 'discounts':
      return {
        paragraphs: profile.scholarships.paragraphs,
        categoryLabel: `${profile.displayName} · Scholarships`,
        verificationNote: profile.scholarships.verificationNote,
        suggestedQuestions: [
          `How can I apply for ${profile.shortName}?`,
          `What documents do I need for ${profile.shortName}?`,
        ],
        actions: [enquiryAction],
        suggestedNextAspect: 'admission_apply',
      };

    case 'eligibility':
      return {
        paragraphs: profile.eligibility.paragraphs,
        categoryLabel: `${profile.displayName} · Eligibility`,
        verificationNote: profile.eligibility.verificationNote,
        suggestedQuestions: [
          `What documents do I need for ${profile.shortName}?`,
          `What about ${profile.shortName} fees?`,
          `How can I apply for ${profile.shortName}?`,
        ],
        actions: [enquiryAction],
        suggestedNextAspect: 'documents',
      };

    case 'documents':
      return {
        paragraphs: profile.documents,
        categoryLabel: `${profile.displayName} · Documents`,
        suggestedQuestions: [
          `When does admission open for ${profile.shortName}?`,
          'Can I visit the college before applying?',
        ],
        actions: [enquiryAction],
        suggestedNextAspect: 'admission_apply',
      };

    case 'deadlines':
      return {
        paragraphs: profile.deadlines.paragraphs,
        categoryLabel: `${profile.displayName} · Intake Schedule`,
        verificationNote: profile.deadlines.verificationNote,
        suggestedQuestions: [
          `How can I apply for ${profile.shortName}?`,
          `What documents do I need for ${profile.shortName}?`,
        ],
        actions: [
          { label: 'Check Official Notices', action: 'open-notices' },
          enquiryAction,
        ],
        suggestedNextAspect: 'admission_apply',
      };

    case 'after_study':
      return {
        paragraphs: profile.afterStudy,
        categoryLabel: `${profile.displayName} · Career Scope`,
        suggestedQuestions: [
          `What are the eligibility requirements for ${profile.shortName}?`,
          `How can I apply for ${profile.shortName}?`,
        ],
        actions: [enquiryAction],
        suggestedNextAspect: 'eligibility',
      };

    case 'admission_apply':
      return {
        paragraphs: profile.howToApply,
        categoryLabel: `${profile.displayName} · Admissions`,
        suggestedQuestions: [
          `What documents do I need for ${profile.shortName}?`,
          `What about ${profile.shortName} fees?`,
        ],
        actions: [enquiryAction],
        suggestedNextAspect: 'documents',
      };

    case 'program_detail':
    default:
      return {
        paragraphs: profile.overview,
        categoryLabel: profile.displayName,
        suggestedQuestions: [
          `What are the eligibility requirements for ${profile.shortName}?`,
          `What about its fees?`,
          `What can I study after ${profile.displayName}?`,
        ],
        actions: [programPageAction, enquiryAction],
        suggestedNextAspect: 'eligibility',
      };
  }
}

function mapFacilityToFaqId(facility: FacilityEntity): string {
  switch (facility) {
    case 'library':
      return 'fac-library';
    case 'labs':
      return 'fac-computer-labs';
    case 'cafeteria':
      return 'fac-cafeteria';
    case 'sports':
      return 'fac-sports';
    case 'tours':
      return 'fac-educational-tours';
    case 'eca':
      return 'fac-eca';
    case 'environment':
      return 'fac-learning-environment';
  }
}

function inferAspectFromFaqId(faqId: string): TopicAspect {
  if (faqId === 'prog-available-programs') return 'programs_overview';
  if (faqId.startsWith('prog-diff')) return 'comparison';
  if (faqId.startsWith('prog-after')) return 'after_study';
  if (faqId.startsWith('prog-')) return 'program_detail';
  if (faqId === 'adm-requirements') return 'eligibility';
  if (faqId === 'adm-documents') return 'documents';
  if (faqId === 'adm-when-open') return 'deadlines';
  if (faqId === 'adm-visit-before-applying' || faqId === 'sup-schedule-visit') return 'visit';
  if (faqId === 'adm-speak-counsellor') return 'counselor';
  if (faqId.startsWith('adm-') || faqId === 'sup-admission-assistance') return 'admission_apply';
  if (faqId === 'fee-installments') return 'installments';
  if (faqId === 'fee-learn-structure') return 'fee_structure';
  if (faqId === 'fee-scholarships') return 'scholarships';
  if (faqId === 'fee-discounts-aid') return 'discounts';
  if (faqId.startsWith('fee-')) return 'fees';
  if (faqId === 'fac-overview') return 'facilities_overview';
  if (faqId.startsWith('fac-')) return 'facility_detail';
  if (faqId === 'gen-location') return 'location';
  if (faqId === 'gen-leadership-team' || faqId === 'gen-advisory-committee') return 'leadership';
  if (faqId === 'gen-affiliations') return 'affiliations';
  if (faqId === 'gen-educational-approach') return 'approach';
  if (faqId === 'gen-notices-results') return 'notices';
  if (faqId.startsWith('sup-') || faqId === 'gen-contact') return 'contact';
  return 'college_overview';
}

function inferProgramFromFaqId(faqId: string): ProgramEntity | null {
  if (faqId.includes('science') && !faqId.includes('mgmt')) return 'plus2_science';
  if (faqId.includes('management')) return 'plus2_management';
  if (faqId.includes('humanities')) return 'plus2_humanities';
  if (faqId.includes('law')) return 'plus2_law';
  if (faqId.includes('mbs')) return 'mbs';
  if (faqId.includes('bbs')) return 'bbs';
  return null;
}

export function processConversationTurn(
  rawInput: string,
  context: ConversationContextState,
): ProcessedConversationTurn {
  const analyzed = analyzeUserMessage(rawInput);
  const greetingPrefix = buildGreetingPrefix(
    rawInput,
    analyzed.hasLeadingGreeting && analyzed.intent !== ConversationIntent.GREETING,
  );

  const userTurnRecord: ConversationTurnRecord = {
    role: 'user',
    text: rawInput.trim(),
    intent: analyzed.intent,
    program: analyzed.mentionedPrograms[0] ?? null,
    aspect: analyzed.detectedAspect,
  };

  /* ======================================================================== */
  /* 0. RESOLVE PENDING CLARIFICATION PROMPT (e.g., user answers "Science")   */
  /* ======================================================================== */
  if (
    context.pending?.awaitingEntityForAspect &&
    analyzed.mentionedPrograms.length === 1 &&
    (!analyzed.detectedAspect || analyzed.detectedAspect === 'program_detail')
  ) {
    const resolvedProgram = analyzed.mentionedPrograms[0];
    const resolvedAspect = context.pending.awaitingEntityForAspect;
    const built = buildProgramAspectResponse(resolvedProgram, resolvedAspect);
    const paragraphs = applyLeadingGreeting(built.paragraphs, greetingPrefix);

    const nextContext: ConversationContextState = {
      ...context,
      history: appendTurnHistory(
        context.history,
        userTurnRecord,
        paragraphs[0],
        ConversationIntent.FOLLOW_UP,
        resolvedProgram,
        resolvedAspect,
      ),
      activeProgram: resolvedProgram,
      activeFacility: null,
      activeAspect: resolvedAspect,
      detailDepth: 0,
      pending: built.suggestedNextAspect
        ? {
            suggestedNextStep: {
              aspect: built.suggestedNextAspect,
              program: resolvedProgram,
              description: `${PROGRAM_PROFILES[resolvedProgram].displayName} ${built.suggestedNextAspect}`,
            },
          }
        : null,
    };

    return {
      intent: ConversationIntent.FOLLOW_UP,
      replyParagraphs: paragraphs,
      categoryLabel: built.categoryLabel,
      verificationNote: built.verificationNote,
      suggestedQuestions: built.suggestedQuestions,
      actions: built.actions,
      isFallback: false,
      nextContext,
    };
  }

  /* ======================================================================== */
  /* 1. GREETINGS                                                             */
  /* ======================================================================== */
  if (analyzed.intent === ConversationIntent.GREETING) {
    const greetWord = buildGreetingPrefix(rawInput, true).trim() || 'Hello!';
    const hasActiveProgram = context.activeProgram !== null;
    const reply = hasActiveProgram
      ? `${greetWord} How can I help you further? We can continue with ${PROGRAM_PROFILES[context.activeProgram!].displayName} or switch to any other question about Capitol Hill College.`
      : `${greetWord} Welcome to Capitol Hill College. I can help you with our academic programs (+2 Management, +2 Humanities, +2 Science, +2 Law, BBS, and MBS), our Teku campus location, admissions, or facilities. What would you like to know?`;

    const nextContext: ConversationContextState = {
      ...context,
      history: appendTurnHistory(
        context.history,
        userTurnRecord,
        reply,
        ConversationIntent.GREETING,
        context.activeProgram,
        context.activeAspect,
      ),
    };

    return {
      intent: ConversationIntent.GREETING,
      replyParagraphs: [reply],
      categoryLabel: 'Conversation',
      suggestedQuestions: hasActiveProgram
        ? [
            `What about ${PROGRAM_PROFILES[context.activeProgram!].shortName} fees?`,
            'What facilities are available?',
          ]
        : CHATBOT_INITIAL_SUGGESTIONS.slice(0, 3),
      actions: [],
      isFallback: false,
      nextContext,
    };
  }

  /* ======================================================================== */
  /* 2. GENERAL CONVERSATION (What's up, How are you, Joke, Identity, Help)   */
  /* ======================================================================== */
  if (analyzed.intent === ConversationIntent.GENERAL_CONVERSATION) {
    let paragraphs: string[] = [];
    let suggested: string[] = [];
    let nextJokeIndex = context.jokeIndex;

    switch (analyzed.discourseSubType) {
      case 'whats_up':
        paragraphs = [
          "I'm here and ready to help! Are you looking for information about Capitol Hill College?",
        ];
        suggested = [
          'What programs do you offer?',
          'Where is Capitol Hill College located?',
        ];
        break;

      case 'how_are_you':
        paragraphs = [
          "I'm doing great, thank you for asking! I'm ready to help with any questions about Capitol Hill College—whether you're exploring +2 Science, +2 Management, BBS, admissions, or campus life.",
        ];
        suggested = ['What programs do you offer?', 'How can I apply for admission?'];
        break;

      case 'identity':
        paragraphs = [
          "I'm the CHC Campus Guide—Capitol Hill College's interactive campus desk! I use verified college records and conversational guidance (rather than external generative AI) to give you accurate answers—plus a little friendly Teku campus humor along the way.",
          'Feel free to ask about +2 Science, +2 Management, BBS, our Teku location, or even test me with a fun college question!',
        ];
        suggested = [
          'Where is Capitol Hill College located?',
          'What programs do you offer?',
          'Tell me a joke',
        ];
        break;

      case 'joke':
        paragraphs = [STUDENT_JOKES[context.jokeIndex % STUDENT_JOKES.length]];
        nextJokeIndex = context.jokeIndex + 1;
        suggested = [
          'Tell me another joke',
          'Is college life all books, or do students have fun?',
          'Where is Capitol Hill College located?',
        ];
        break;

      case 'banter_homework':
      case 'banter_canteen':
      case 'banter_bunk':
      case 'banter_wifi':
      case 'banter_sleep':
      case 'banter_compliment':
      case 'banter_romance':
      case 'banter_motivation': {
        const banter = HUMAN_BANTER_TEMPLATES[analyzed.discourseSubType];
        paragraphs = banter.paragraphs;
        suggested = banter.suggestedQuestions;
        break;
      }

      case 'help':
      default:
        paragraphs = [
          'You can chat with me naturally in your own words! Here is what I can help you explore as your CHC Campus Guide:',
          '• Campus Location & Visits: Teku, Kathmandu address, Valley commute & visiting hours\n• Academic Programs: +2 Science, +2 Management (NEB), BBS (TU) & +2 subject combinations\n• Admissions, Fees & Scholarships: How to apply, documents & counseling\n• Campus Life & Fun Banter: Labs, library, events, student jokes & friendly campus chat!',
        ];
        suggested = CHATBOT_INITIAL_SUGGESTIONS.slice(0, 4);
        break;
    }

    const nextContext: ConversationContextState = {
      ...context,
      jokeIndex: nextJokeIndex,
      history: appendTurnHistory(
        context.history,
        userTurnRecord,
        paragraphs[0],
        ConversationIntent.GENERAL_CONVERSATION,
        context.activeProgram,
        context.activeAspect,
      ),
    };

    return {
      intent: ConversationIntent.GENERAL_CONVERSATION,
      replyParagraphs: paragraphs,
      categoryLabel: 'Conversation',
      suggestedQuestions: suggested,
      actions: [],
      isFallback: false,
      nextContext,
    };
  }

  /* ======================================================================== */
  /* 3. THANKS, ACKNOWLEDGEMENTS, YES / NO, FAREWELLS                         */
  /* ======================================================================== */
  if (analyzed.intent === ConversationIntent.THANKS_ACKNOWLEDGEMENT) {
    // Handle "Yes / Sure" when a concrete follow-up step was just offered
    if (analyzed.discourseSubType === 'affirmative') {
      if (context.pending?.suggestedNextStep) {
        const step = context.pending.suggestedNextStep;
        if (step.program) {
          const built = buildProgramAspectResponse(step.program, step.aspect);
          const nextContext: ConversationContextState = {
            ...context,
            history: appendTurnHistory(
              context.history,
              userTurnRecord,
              built.paragraphs[0],
              ConversationIntent.FOLLOW_UP,
              step.program,
              step.aspect,
            ),
            activeProgram: step.program,
            activeAspect: step.aspect,
            detailDepth: 0,
            pending: built.suggestedNextAspect
              ? {
                  suggestedNextStep: {
                    aspect: built.suggestedNextAspect,
                    program: step.program,
                    description: `${PROGRAM_PROFILES[step.program].displayName} ${built.suggestedNextAspect}`,
                  },
                }
              : null,
          };
          return {
            intent: ConversationIntent.FOLLOW_UP,
            replyParagraphs: built.paragraphs,
            categoryLabel: built.categoryLabel,
            verificationNote: built.verificationNote,
            suggestedQuestions: built.suggestedQuestions,
            actions: built.actions,
            isFallback: false,
            nextContext,
          };
        }
      }

      // If no specific pending offer was active, ask what they'd like to explore rather than guessing
      const clarifyYes = context.activeProgram
        ? `Great! Would you like to check ${PROGRAM_PROFILES[context.activeProgram].displayName} eligibility requirements, required documents, fees, or how to apply?`
        : 'Sure! Which topic would you like to explore—our academic programs (+2 Science, +2 Management, BBS), admissions, campus facilities, or contact details?';

      const nextContext: ConversationContextState = {
        ...context,
        history: appendTurnHistory(
          context.history,
          userTurnRecord,
          clarifyYes,
          ConversationIntent.NEEDS_CLARIFICATION,
          context.activeProgram,
          context.activeAspect,
        ),
      };

      return {
        intent: ConversationIntent.NEEDS_CLARIFICATION,
        replyParagraphs: [clarifyYes],
        categoryLabel: 'Conversation',
        suggestedQuestions: context.activeProgram
          ? [
              `What are the eligibility requirements for ${PROGRAM_PROFILES[context.activeProgram].shortName}?`,
              `What about its fees?`,
              `How can I apply for ${PROGRAM_PROFILES[context.activeProgram].shortName}?`,
            ]
          : CHATBOT_INITIAL_SUGGESTIONS.slice(0, 3),
        actions: [],
        isFallback: false,
        nextContext,
      };
    }

    if (analyzed.discourseSubType === 'negative') {
      const reply =
        'No problem at all! Let me know anytime if another question comes up about Capitol Hill College.';
      const nextContext: ConversationContextState = {
        ...context,
        pending: null,
        history: appendTurnHistory(
          context.history,
          userTurnRecord,
          reply,
          ConversationIntent.THANKS_ACKNOWLEDGEMENT,
          context.activeProgram,
          context.activeAspect,
        ),
      };
      return {
        intent: ConversationIntent.THANKS_ACKNOWLEDGEMENT,
        replyParagraphs: [reply],
        categoryLabel: 'Conversation',
        suggestedQuestions: [],
        actions: [],
        isFallback: false,
        nextContext,
      };
    }

    if (analyzed.discourseSubType === 'farewell') {
      const reply =
        'Goodbye, and best wishes with your studies! You are always welcome to visit our campus in Teku, Kathmandu or call 01-5312399 whenever you need assistance.';
      const nextContext: ConversationContextState = {
        ...context,
        pending: null,
        history: appendTurnHistory(
          context.history,
          userTurnRecord,
          reply,
          ConversationIntent.THANKS_ACKNOWLEDGEMENT,
          context.activeProgram,
          context.activeAspect,
        ),
      };
      return {
        intent: ConversationIntent.THANKS_ACKNOWLEDGEMENT,
        replyParagraphs: [reply],
        categoryLabel: 'Conversation',
        suggestedQuestions: [],
        actions: [],
        isFallback: false,
        nextContext,
      };
    }

    if (analyzed.discourseSubType === 'ack') {
      const reply = context.activeProgram
        ? `Sounds good! Feel free to ask anything else about ${PROGRAM_PROFILES[context.activeProgram].displayName}, or switch to another topic anytime.`
        : 'Glad that helped! Feel free to ask another question whenever you are ready.';
      const nextContext: ConversationContextState = {
        ...context,
        history: appendTurnHistory(
          context.history,
          userTurnRecord,
          reply,
          ConversationIntent.THANKS_ACKNOWLEDGEMENT,
          context.activeProgram,
          context.activeAspect,
        ),
      };
      return {
        intent: ConversationIntent.THANKS_ACKNOWLEDGEMENT,
        replyParagraphs: [reply],
        categoryLabel: 'Conversation',
        suggestedQuestions: [],
        actions: [],
        isFallback: false,
        nextContext,
      };
    }

    // Default: 'thanks'
    const thanksReply = "You're very welcome! Let me know if you need anything else.";
    const nextContext: ConversationContextState = {
      ...context,
      history: appendTurnHistory(
        context.history,
        userTurnRecord,
        thanksReply,
        ConversationIntent.THANKS_ACKNOWLEDGEMENT,
        context.activeProgram,
        context.activeAspect,
      ),
    };
    return {
      intent: ConversationIntent.THANKS_ACKNOWLEDGEMENT,
      replyParagraphs: [thanksReply],
      categoryLabel: 'Conversation',
      suggestedQuestions: [],
      actions: [],
      isFallback: false,
      nextContext,
    };
  }

  /* ======================================================================== */
  /* 4. UNRELATED NON-COLLEGE TOPICS                                          */
  /* ======================================================================== */
  if (analyzed.intent === ConversationIntent.UNRELATED_TOPIC) {
    const paragraphs = [
      "I'm the Capitol Hill College assistant, so I focus on college-related questions rather than general topics like that.",
      'I would be happy to help you with information about our +2 Science, +2 Management, and BBS programs, admissions, campus facilities, or contact details!',
    ];
    const nextContext: ConversationContextState = {
      ...context,
      history: appendTurnHistory(
        context.history,
        userTurnRecord,
        paragraphs[0],
        ConversationIntent.UNRELATED_TOPIC,
        context.activeProgram,
        context.activeAspect,
      ),
    };
    return {
      intent: ConversationIntent.UNRELATED_TOPIC,
      replyParagraphs: paragraphs,
      categoryLabel: 'College Assistant',
      suggestedQuestions: [
        'What programs do you offer?',
        'Where is Capitol Hill College located?',
        'What facilities are available?',
      ],
      actions: [],
      isFallback: false,
      nextContext,
    };
  }

  /* ======================================================================== */
  /* 5. UNCONFIRMED COLLEGE TOPICS (Hostel, Bus, Shifts, Unoffered Degrees)   */
  /* ======================================================================== */
  if (analyzed.intent === ConversationIntent.UNCONFIRMED_COLLEGE_TOPIC) {
    if (analyzed.unofferedProgramName) {
      const paragraphs = applyLeadingGreeting(
        [
          `${analyzed.unofferedProgramName} is not listed among our offered academic programs at Capitol Hill College.`,
          'Our official academic programs are +2 Management, +2 Humanities, +2 Science, and +2 Law (affiliated with NEB), along with Bachelor of Business Studies (BBS) and Master of Business Studies (MBS) (affiliated with Tribhuvan University).',
          'Would you like details on one of these programs, or would you prefer to speak directly with our administration at 01-5312399?',
        ],
        greetingPrefix,
      );

      const nextContext: ConversationContextState = {
        ...context,
        history: appendTurnHistory(
          context.history,
          userTurnRecord,
          paragraphs[0],
          ConversationIntent.UNCONFIRMED_COLLEGE_TOPIC,
          context.activeProgram,
          'programs_overview',
        ),
        activeAspect: 'programs_overview',
      };

      return {
        intent: ConversationIntent.UNCONFIRMED_COLLEGE_TOPIC,
        replyParagraphs: paragraphs,
        categoryLabel: 'Academic Offerings',
        suggestedQuestions: [
          'What programs do you offer?',
          'Tell me about +2 Management',
          'Tell me about BBS',
        ],
        actions: [
          { label: 'Explore Academic Programs', action: 'open-programs' },
          { label: 'Contact Administration', action: 'scroll-contact' },
        ],
        isFallback: false,
        nextContext,
      };
    }

    if (analyzed.unconfirmedTopic) {
      const template = UNCONFIRMED_COLLEGE_TOPICS[analyzed.unconfirmedTopic];
      const paragraphs = applyLeadingGreeting(template.paragraphs, greetingPrefix);
      const nextContext: ConversationContextState = {
        ...context,
        history: appendTurnHistory(
          context.history,
          userTurnRecord,
          paragraphs[0],
          ConversationIntent.UNCONFIRMED_COLLEGE_TOPIC,
          context.activeProgram,
          context.activeAspect,
        ),
      };

      return {
        intent: ConversationIntent.UNCONFIRMED_COLLEGE_TOPIC,
        replyParagraphs: paragraphs,
        categoryLabel: template.categoryLabel,
        verificationNote: template.verificationNote,
        suggestedQuestions: template.suggestedQuestions ?? [],
        actions: template.actions ?? [],
        isFallback: false,
        nextContext,
      };
    }
  }

  /* ======================================================================== */
  /* 6. PROGRAM COMPARISONS (Science vs Management, Management vs BBS, etc.)  */
  /* ======================================================================== */
  if (
    analyzed.intent === ConversationIntent.PROGRAM_COMPARISON ||
    (analyzed.mentionedPrograms.length >= 2 &&
      (analyzed.detectedAspect === 'comparison' ||
        analyzed.detectedAspect === 'program_detail' ||
        analyzed.detectedAspect === 'programs_overview' ||
        analyzed.detectedAspect === null))
  ) {
    const progs = analyzed.mentionedPrograms;
    let compKey = 'science_vs_management';
    if (progs.includes('plus2_management') && progs.includes('bbs')) {
      compKey = 'management_vs_bbs';
    } else if (progs.includes('plus2_science') && progs.includes('bbs')) {
      compKey = 'science_vs_bbs';
    }

    const template = PROGRAM_COMPARISON_TEMPLATES[compKey];
    const paragraphs = applyLeadingGreeting(template.paragraphs, greetingPrefix);

    const nextContext: ConversationContextState = {
      ...context,
      history: appendTurnHistory(
        context.history,
        userTurnRecord,
        paragraphs[0],
        ConversationIntent.PROGRAM_COMPARISON,
        null,
        'comparison',
      ),
      activeProgram: null,
      activeFacility: null,
      activeAspect: 'comparison',
      detailDepth: 0,
      pending: null,
    };

    return {
      intent: ConversationIntent.PROGRAM_COMPARISON,
      replyParagraphs: paragraphs,
      categoryLabel: template.categoryLabel,
      suggestedQuestions: template.suggestedQuestions ?? [],
      actions: template.actions ?? [],
      isFallback: false,
      nextContext,
    };
  }

  /* ======================================================================== */
  /* 7. CLARIFICATION REQUESTS & "TELL ME MORE" EXPANSIONS                    */
  /* ======================================================================== */
  if (
    (analyzed.isTellMeMore || analyzed.intent === ConversationIntent.CLARIFICATION_REQUEST) &&
    analyzed.mentionedPrograms.length === 0 &&
    !analyzed.mentionedFacility
  ) {
    // Case A: Active program in session -> provide deeper non-repetitive verified details
    if (context.activeProgram) {
      const profile = PROGRAM_PROFILES[context.activeProgram];
      const nextDepth = context.detailDepth + 1;
      const paragraphs =
        nextDepth === 1
          ? profile.deeperDetail
          : [...profile.afterStudy, ...profile.howToApply.slice(0, 1)];

      const nextContext: ConversationContextState = {
        ...context,
        history: appendTurnHistory(
          context.history,
          userTurnRecord,
          paragraphs[0],
          ConversationIntent.FOLLOW_UP,
          context.activeProgram,
          'program_detail',
        ),
        detailDepth: nextDepth,
        pending: {
          suggestedNextStep: {
            aspect: 'eligibility',
            program: context.activeProgram,
            description: `${profile.displayName} eligibility`,
          },
        },
      };

      return {
        intent: ConversationIntent.FOLLOW_UP,
        replyParagraphs: paragraphs,
        categoryLabel: `${profile.displayName} · Details`,
        suggestedQuestions: [
          `What about ${profile.shortName} fees?`,
          `What documents do I need for ${profile.shortName}?`,
        ],
        actions: [
          {
            label: `Enquire About ${profile.shortName}`,
            action: 'open-enquiry',
            programTitle: profile.enquiryProgramTitle,
          },
        ],
        isFallback: false,
        nextContext,
      };
    }

    // Case B: Active facility in session -> provide deeper facility details
    if (context.activeFacility) {
      const paragraphs = FACILITY_DEEPER_DETAILS[context.activeFacility];
      const nextContext: ConversationContextState = {
        ...context,
        history: appendTurnHistory(
          context.history,
          userTurnRecord,
          paragraphs[0],
          ConversationIntent.FOLLOW_UP,
          null,
          'facility_detail',
        ),
        detailDepth: context.detailDepth + 1,
      };
      return {
        intent: ConversationIntent.FOLLOW_UP,
        replyParagraphs: paragraphs,
        categoryLabel: 'Campus Facilities · Details',
        suggestedQuestions: [
          'Can I visit the college before applying?',
          'What programs do you offer?',
        ],
        actions: [{ label: 'Explore Facilities Page', action: 'open-facilities' }],
        isFallback: false,
        nextContext,
      };
    }

    // Case C: Active general aspect (programs_overview, fees, facilities_overview, college_overview)
    if (context.activeAspect === 'programs_overview') {
      const reply =
        'Our +2 Science and +2 Management streams are two-year Higher Secondary programs under NEB (for students who completed SEE), while BBS is a four-year undergraduate degree under Tribhuvan University (for students who completed 10+2). Which specific program would you like me to explain in detail?';
      const nextContext: ConversationContextState = {
        ...context,
        history: appendTurnHistory(
          context.history,
          userTurnRecord,
          reply,
          ConversationIntent.NEEDS_CLARIFICATION,
          null,
          'programs_overview',
        ),
        pending: { awaitingEntityForAspect: 'program_detail' },
      };
      return {
        intent: ConversationIntent.NEEDS_CLARIFICATION,
        replyParagraphs: [reply],
        categoryLabel: 'Academic Programs',
        suggestedQuestions: [
          'Tell me more about +2 Science',
          'Tell me more about +2 Management',
          'Tell me more about BBS',
        ],
        actions: [],
        isFallback: false,
        nextContext,
      };
    }

    if (context.activeAspect === 'fees' || context.activeAspect === 'scholarships') {
      const reply =
        'Because tuition fees and scholarship quotas are reviewed per academic session by Capitol Hill College administration, we avoid quoting unverified figures in chat. Calling 01-5312399 or submitting an online enquiry for your chosen stream gets you the official fee and scholarship breakdown directly from our Admissions Desk.';
      const nextContext: ConversationContextState = {
        ...context,
        history: appendTurnHistory(
          context.history,
          userTurnRecord,
          reply,
          ConversationIntent.FOLLOW_UP,
          null,
          context.activeAspect,
        ),
      };
      return {
        intent: ConversationIntent.FOLLOW_UP,
        replyParagraphs: [reply],
        categoryLabel: 'Fees & Scholarships',
        suggestedQuestions: ['Can I pay fees in installments?', 'How can I apply for admission?'],
        actions: [{ label: 'Open Enquiry Form', action: 'open-enquiry' }],
        isFallback: false,
        nextContext,
      };
    }

    if (context.activeAspect === 'college_overview') {
      const leadershipFaq = findFaqItem('gen-leadership-team');
      const paragraphs = leadershipFaq
        ? leadershipFaq.answer
        : [
            'Capitol Hill College is guided by Chairman Mr. Pawan Bista, CEO & Director Mr. Nischal Gautam, and Principal Mr. Sagar Raj Khanal, supported by 45 faculty listings across 15 departments.',
          ];
      const nextContext: ConversationContextState = {
        ...context,
        history: appendTurnHistory(
          context.history,
          userTurnRecord,
          paragraphs[0],
          ConversationIntent.FOLLOW_UP,
          null,
          'leadership',
        ),
        activeAspect: 'leadership',
      };
      return {
        intent: ConversationIntent.FOLLOW_UP,
        replyParagraphs: paragraphs,
        categoryLabel: 'Leadership & Governance',
        suggestedQuestions: [
          'Does Capitol Hill College have an Advisory Committee?',
          'What programs do you offer?',
        ],
        actions: [
          { label: 'Leadership & Governance', action: 'open-leadership' },
          { label: 'Advisory Committee', action: 'open-advisory' },
          { label: 'Faculty & Staff Directory', action: 'open-team' },
        ],
        isFallback: false,
        nextContext,
      };
    }

    // Case D: No clear prior context -> do NOT guess; ask a short clarification question!
    const clarifyPrompt =
      'I would be happy to explain further! Could you clarify which topic you would like more details on—for example, +2 Science, +2 Management, BBS, admissions, or campus facilities?';
    const nextContext: ConversationContextState = {
      ...context,
      history: appendTurnHistory(
        context.history,
        userTurnRecord,
        clarifyPrompt,
        ConversationIntent.NEEDS_CLARIFICATION,
        null,
        null,
      ),
      pending: { awaitingEntityForAspect: 'program_detail' },
    };
    return {
      intent: ConversationIntent.NEEDS_CLARIFICATION,
      replyParagraphs: [clarifyPrompt],
      categoryLabel: 'Clarification',
      suggestedQuestions: [
        'Tell me about +2 Science',
        'Tell me about +2 Management',
        'Tell me about BBS',
      ],
      actions: [],
      isFallback: false,
      nextContext,
    };
  }

  /* ======================================================================== */
  /* 8. AMBIGUOUS "IS IT AVAILABLE?" CHECK                                    */
  /* ======================================================================== */
  if (analyzed.isAvailabilityQuestion) {
    if (context.activeProgram) {
      const built = buildProgramAspectResponse(context.activeProgram, 'program_detail');
      const nextContext: ConversationContextState = {
        ...context,
        history: appendTurnHistory(
          context.history,
          userTurnRecord,
          built.paragraphs[0],
          ConversationIntent.FOLLOW_UP,
          context.activeProgram,
          'program_detail',
        ),
      };
      return {
        intent: ConversationIntent.FOLLOW_UP,
        replyParagraphs: built.paragraphs,
        categoryLabel: built.categoryLabel,
        verificationNote: built.verificationNote,
        suggestedQuestions: built.suggestedQuestions,
        actions: built.actions,
        isFallback: false,
        nextContext,
      };
    }

    const askAvailClarification =
      'Could you clarify what you are checking availability for—a specific academic program (+2 Science, +2 Management, BBS), scholarships, or a campus facility?';
    const nextContext: ConversationContextState = {
      ...context,
      history: appendTurnHistory(
        context.history,
        userTurnRecord,
        askAvailClarification,
        ConversationIntent.NEEDS_CLARIFICATION,
        null,
        null,
      ),
      pending: { awaitingEntityForAspect: 'program_detail' },
    };
    return {
      intent: ConversationIntent.NEEDS_CLARIFICATION,
      replyParagraphs: [askAvailClarification],
      categoryLabel: 'Clarification',
      suggestedQuestions: [
        'What programs do you offer?',
        'Are scholarships available?',
        'What facilities are available?',
      ],
      actions: [],
      isFallback: false,
      nextContext,
    };
  }

  /* ======================================================================== */
  /* 9. ENTITY SWITCH / PIVOT ("What about Management?", "And the library?")  */
  /* ======================================================================== */
  if (analyzed.mentionedPrograms.length === 1) {
    const targetProgram = analyzed.mentionedPrograms[0];
    const inheritedProgramAspects = new Set<TopicAspect>([
      'fees',
      'fee_structure',
      'scholarships',
      'discounts',
      'eligibility',
      'documents',
      'deadlines',
      'after_study',
      'admission_apply',
    ]);

    // If user pivoted with "What about Management?" without naming a new aspect, carry over the previous program aspect!
    let targetAspect: TopicAspect = analyzed.detectedAspect ?? 'program_detail';
    if (
      analyzed.isPivotPhrase &&
      targetAspect === 'program_detail' &&
      context.activeAspect &&
      inheritedProgramAspects.has(context.activeAspect)
    ) {
      targetAspect = context.activeAspect;
    }

    // Handle "Can I visit?" / "Where is it located?" even when program is mentioned
    if (targetAspect !== 'location' && targetAspect !== 'visit' && targetAspect !== 'contact') {
      const built = buildProgramAspectResponse(targetProgram, targetAspect);
      const paragraphs = applyLeadingGreeting(built.paragraphs, greetingPrefix);

      const resolvedIntent =
        analyzed.isPivotPhrase || analyzed.isTellMeMore
          ? ConversationIntent.FOLLOW_UP
          : analyzed.intent === ConversationIntent.UNKNOWN
            ? ConversationIntent.ACADEMIC_PROGRAMS
            : analyzed.intent;

      const nextContext: ConversationContextState = {
        ...context,
        history: appendTurnHistory(
          context.history,
          userTurnRecord,
          paragraphs[0],
          resolvedIntent,
          targetProgram,
          targetAspect,
        ),
        activeProgram: targetProgram,
        activeFacility: null,
        activeAspect: targetAspect,
        detailDepth: 0,
        pending: built.suggestedNextAspect
          ? {
              suggestedNextStep: {
                aspect: built.suggestedNextAspect,
                program: targetProgram,
                description: `${PROGRAM_PROFILES[targetProgram].displayName} ${built.suggestedNextAspect}`,
              },
            }
          : null,
      };

      return {
        intent: resolvedIntent,
        replyParagraphs: paragraphs,
        categoryLabel: built.categoryLabel,
        verificationNote: built.verificationNote,
        suggestedQuestions: built.suggestedQuestions,
        actions: built.actions,
        isFallback: false,
        nextContext,
      };
    }
  }

  /* ======================================================================== */
  /* 10. CONTEXTUAL FOLLOW-UP USING ACTIVE PROGRAM ("What about its fees?",   */
  /*     "How much does it cost?", "What documents do I need?", "Can I visit?")*/
  /* ======================================================================== */
  const programBoundAspects = new Set<TopicAspect>([
    'fees',
    'fee_structure',
    'scholarships',
    'eligibility',
    'documents',
    'deadlines',
    'after_study',
    'admission_apply',
  ]);

  if (
    analyzed.mentionedPrograms.length === 0 &&
    !analyzed.mentionedFacility &&
    analyzed.detectedAspect &&
    programBoundAspects.has(analyzed.detectedAspect)
  ) {
    // A. If we have an active program in session and user asks a follow-up ("its fees", "how much does it cost?", "what documents do I need?")
    const shouldBindToActiveProgram =
      context.activeProgram !== null &&
      (analyzed.hasReferentialPronoun ||
        analyzed.isPivotPhrase ||
        analyzed.detectedAspect === 'fees' ||
        analyzed.detectedAspect === 'documents' ||
        analyzed.detectedAspect === 'eligibility' ||
        analyzed.detectedAspect === 'after_study' ||
        analyzed.detectedAspect === 'admission_apply');

    // Note: If the user explicitly asks general "What are the college fees?" without pronouns while no program is active, fall through to general FAQ;
    // if a program IS active (e.g. +2 Science), answering specifically for +2 Science feels natural and directly addresses their thread!
    if (shouldBindToActiveProgram && context.activeProgram) {
      const isExplicitlyGeneralCollegeQuery =
        /\bcollege fees\b|\ball programs\b|\bin general\b/.test(analyzed.normalizedText) &&
        !analyzed.hasReferentialPronoun;

      if (!isExplicitlyGeneralCollegeQuery) {
        const built = buildProgramAspectResponse(
          context.activeProgram,
          analyzed.detectedAspect,
        );
        const paragraphs = applyLeadingGreeting(built.paragraphs, greetingPrefix);

        const nextContext: ConversationContextState = {
          ...context,
          history: appendTurnHistory(
            context.history,
            userTurnRecord,
            paragraphs[0],
            ConversationIntent.FOLLOW_UP,
            context.activeProgram,
            analyzed.detectedAspect,
          ),
          activeAspect: analyzed.detectedAspect,
          detailDepth: 0,
          pending: built.suggestedNextAspect
            ? {
                suggestedNextStep: {
                  aspect: built.suggestedNextAspect,
                  program: context.activeProgram,
                  description: `${PROGRAM_PROFILES[context.activeProgram].displayName} ${built.suggestedNextAspect}`,
                },
              }
            : null,
        };

        return {
          intent: ConversationIntent.FOLLOW_UP,
          replyParagraphs: paragraphs,
          categoryLabel: built.categoryLabel,
          verificationNote: built.verificationNote,
          suggestedQuestions: built.suggestedQuestions,
          actions: built.actions,
          isFallback: false,
          nextContext,
        };
      }
    }

    // B. If NO program is active yet, and user used an ambiguous pronoun ("What about its fees?", "How much does it cost?", "What can I study after completing it?")
    if (
      !context.activeProgram &&
      (analyzed.hasReferentialPronoun || analyzed.detectedAspect === 'after_study')
    ) {
      const aspectLabel =
        analyzed.detectedAspect === 'fees'
          ? 'fee information'
          : analyzed.detectedAspect === 'after_study'
            ? 'career and study pathways'
            : analyzed.detectedAspect === 'eligibility'
              ? 'eligibility criteria'
              : analyzed.detectedAspect === 'documents'
                ? 'required documents'
                : 'details';

      const clarifyProgram = `Could you clarify which program's ${aspectLabel} you are asking about—+2 Science, +2 Management, or BBS?`;
      const nextContext: ConversationContextState = {
        ...context,
        history: appendTurnHistory(
          context.history,
          userTurnRecord,
          clarifyProgram,
          ConversationIntent.NEEDS_CLARIFICATION,
          null,
          analyzed.detectedAspect,
        ),
        pending: { awaitingEntityForAspect: analyzed.detectedAspect },
      };

      return {
        intent: ConversationIntent.NEEDS_CLARIFICATION,
        replyParagraphs: [clarifyProgram],
        categoryLabel: 'Clarification',
        suggestedQuestions: ['+2 Science', '+2 Management', 'BBS'],
        actions: [],
        isFallback: false,
        nextContext,
      };
    }
  }

  /* ======================================================================== */
  /* 11. CONTEXTUAL "WHERE IS IT LOCATED?" & "CAN I VISIT?"                   */
  /* ======================================================================== */
  if (analyzed.detectedAspect === 'location') {
    const paragraphs = applyLeadingGreeting(
      [
        'Capitol Hill College is located in Teku, Kathmandu, Nepal. You can find our exact location and directions on Google Maps using the link below.',
        OFFICIAL_GOOGLE_MAPS_URL,
      ],
      greetingPrefix,
    );

    const nextContext: ConversationContextState = {
      ...context,
      history: appendTurnHistory(
        context.history,
        userTurnRecord,
        paragraphs[0],
        ConversationIntent.LOCATION,
        context.activeProgram,
        'location',
      ),
      activeAspect: 'location',
      detailDepth: 0,
      pending: null,
    };

    return {
      intent: ConversationIntent.LOCATION,
      replyParagraphs: paragraphs,
      categoryLabel: 'Campus Location',
      suggestedQuestions: [
        'Can I visit the college before applying?',
        'What programs does the college offer?',
        'How can I contact the college?',
      ],
      actions: [
        {
          label: 'View on Google Maps',
          action: 'external-link',
          externalHref: OFFICIAL_GOOGLE_MAPS_URL,
        },
        { label: 'Schedule a Campus Visit', action: 'open-enquiry' },
      ],
      isFallback: false,
      nextContext,
    };
  }

  if (analyzed.detectedAspect === 'visit') {
    const programVisitTouch = context.activeProgram
      ? ` Since you were exploring ${PROGRAM_PROFILES[context.activeProgram].displayName}, you can also tour the relevant classrooms and laboratories and speak with an academic counselor during your visit.`
      : ' During your visit, you can tour our classrooms, library, and laboratories and speak directly with an academic counselor.';

    const paragraphs = applyLeadingGreeting(
      [
        `Yes, you are warmly welcome to visit our campus in Teku, Kathmandu before applying (Sunday through Friday during regular college hours).${programVisitTouch}`,
        'Calling 01-5312399 ahead of time helps ensure a counselor is ready to welcome you.',
      ],
      greetingPrefix,
    );

    const nextContext: ConversationContextState = {
      ...context,
      history: appendTurnHistory(
        context.history,
        userTurnRecord,
        paragraphs[0],
        ConversationIntent.ADMISSION,
        context.activeProgram,
        'visit',
      ),
      activeAspect: 'visit',
      detailDepth: 0,
      pending: null,
    };

    return {
      intent: ConversationIntent.ADMISSION,
      replyParagraphs: paragraphs,
      categoryLabel: 'Campus Visit',
      suggestedQuestions: [
        'Where is Capitol Hill College located?',
        'How can I apply for admission?',
      ],
      actions: [
        {
          label: 'Schedule Visit via Enquiry',
          action: 'open-enquiry',
          programTitle: context.activeProgram
            ? PROGRAM_PROFILES[context.activeProgram].enquiryProgramTitle
            : undefined,
        },
      ],
      isFallback: false,
      nextContext,
    };
  }

  /* ======================================================================== */
  /* 12. CONVERSATIONAL PROGRAMS OVERVIEW ("What programs do you offer?")     */
  /* ======================================================================== */
  if (
    analyzed.detectedAspect === 'programs_overview' &&
    analyzed.mentionedPrograms.length === 0
  ) {
    const paragraphs = applyLeadingGreeting(
      [
        'Capitol Hill College offers six official academic programs across NEB (+2) and Tribhuvan University:',
        '• NEB (+2) Programs: +2 Management, +2 Humanities, +2 Science, and +2 Law\n• Tribhuvan University Programs: Bachelor of Business Studies (BBS — 4 Years) and Master of Business Studies (MBS — 2 Years)',
        'Which of these programs would you like to explore in detail?',
      ],
      greetingPrefix,
    );

    const nextContext: ConversationContextState = {
      ...context,
      history: appendTurnHistory(
        context.history,
        userTurnRecord,
        paragraphs[0],
        ConversationIntent.ACADEMIC_PROGRAMS,
        null,
        'programs_overview',
      ),
      activeProgram: null,
      activeFacility: null,
      activeAspect: 'programs_overview',
      detailDepth: 0,
      pending: { awaitingEntityForAspect: 'program_detail' },
    };

    return {
      intent: ConversationIntent.ACADEMIC_PROGRAMS,
      replyParagraphs: paragraphs,
      categoryLabel: 'Academic Programs',
      suggestedQuestions: [
        'Tell me about +2 Management',
        'Tell me about +2 Science',
        'Tell me about BBS',
        'Tell me about MBS',
      ],
      actions: [{ label: 'Explore Academic Programs', action: 'open-programs' }],
      isFallback: false,
      nextContext,
    };
  }

  /* ======================================================================== */
  /* 13. SPECIFIC FACILITY ENTITY ("What about the library?", "Computer lab?")*/
  /* ======================================================================== */
  if (analyzed.mentionedFacility) {
    const faqId = mapFacilityToFaqId(analyzed.mentionedFacility);
    const faqItem = findFaqItem(faqId);
    if (faqItem) {
      const paragraphs = applyLeadingGreeting(faqItem.answer, greetingPrefix);
      const related = faqItem.relatedIds
        .map((id) => findFaqItem(id)?.question)
        .filter((q): q is string => Boolean(q))
        .slice(0, 2);

      const nextContext: ConversationContextState = {
        ...context,
        history: appendTurnHistory(
          context.history,
          userTurnRecord,
          paragraphs[0],
          ConversationIntent.FACILITIES,
          context.activeProgram,
          'facility_detail',
        ),
        activeFacility: analyzed.mentionedFacility,
        activeAspect: 'facility_detail',
        lastFaqId: faqItem.id,
        detailDepth: 0,
        pending: null,
      };

      return {
        intent: ConversationIntent.FACILITIES,
        replyParagraphs: paragraphs,
        categoryLabel: faqItem.categoryLabel,
        verificationNote: faqItem.verificationNote,
        suggestedQuestions: related,
        actions: faqItem.primaryAction ? [faqItem.primaryAction] : [],
        isFallback: false,
        nextContext,
      };
    }
  }

  /* ======================================================================== */
  /* 14. VERIFIED KNOWLEDGE BASE MATCHER + CONVERSATIONAL FALLBACK            */
  /* ======================================================================== */
  const queryToMatch = analyzed.hasLeadingGreeting
    ? analyzed.normalizedText
    : rawInput;
  const faqMatch = matchUserQuestion(queryToMatch);

  if (faqMatch.type === 'match' && faqMatch.matchedItem) {
    const item = faqMatch.matchedItem;
    const inferredAspect = inferAspectFromFaqId(item.id);
    const inferredProgram = inferProgramFromFaqId(item.id) ?? context.activeProgram;
    const paragraphs = applyLeadingGreeting(faqMatch.replyParagraphs, greetingPrefix);

    const nextContext: ConversationContextState = {
      ...context,
      history: appendTurnHistory(
        context.history,
        userTurnRecord,
        paragraphs[0],
        analyzed.intent !== ConversationIntent.UNKNOWN
          ? analyzed.intent
          : ConversationIntent.COLLEGE_INFO,
        inferredProgram,
        inferredAspect,
      ),
      activeProgram: inferredProgram,
      activeFacility: null,
      activeAspect: inferredAspect,
      lastFaqId: item.id,
      detailDepth: 0,
      pending: null,
    };

    return {
      intent:
        analyzed.intent !== ConversationIntent.UNKNOWN
          ? analyzed.intent
          : ConversationIntent.COLLEGE_INFO,
      replyParagraphs: paragraphs,
      categoryLabel: faqMatch.categoryLabel,
      verificationNote: faqMatch.verificationNote,
      suggestedQuestions: faqMatch.relatedQuestions.slice(0, 2),
      actions: faqMatch.actions,
      isFallback: false,
      nextContext,
    };
  }

  /* ======================================================================== */
  /* 15. SHORT / VAGUE INPUT -> ASK FOR CLARIFICATION INSTEAD OF GUESSING     */
  /* ======================================================================== */
  if (
    analyzed.tokens.length <= 2 ||
    analyzed.hasReferentialPronoun ||
    analyzed.isPivotPhrase
  ) {
    const clarifyShort =
      "I want to make sure I give you the right information—could you share a little more detail about what you're looking for? For example, you can ask about +2 Science, +2 Management, BBS, admissions, fees, or campus facilities.";

    const nextContext: ConversationContextState = {
      ...context,
      history: appendTurnHistory(
        context.history,
        userTurnRecord,
        clarifyShort,
        ConversationIntent.NEEDS_CLARIFICATION,
        context.activeProgram,
        context.activeAspect,
      ),
    };

    return {
      intent: ConversationIntent.NEEDS_CLARIFICATION,
      replyParagraphs: [clarifyShort],
      categoryLabel: 'Clarification',
      suggestedQuestions: [
        'What programs do you offer?',
        'How can I apply for admission?',
        'Where is Capitol Hill College located?',
      ],
      actions: [],
      isFallback: false,
      nextContext,
    };
  }

  /* ======================================================================== */
  /* 16. UNKNOWN COLLEGE OR UNSUPPORTED QUERY -> HONEST FALLBACK              */
  /* ======================================================================== */
  const hasAnyCollegeSignal =
    /\b(college|campus|student|students|study|class|classes|teacher|teachers|exam|grade|neb|tu|capitol|teku|admission|course|subject)\b/i.test(
      rawInput,
    );

  if (!hasAnyCollegeSignal) {
    const unrelatedGuide = [
      "I mainly help with questions related to Capitol Hill College, so I don't have an answer for that topic.",
      'If you are exploring college options in Kathmandu, I would be glad to tell you about our +2 Science, +2 Management, and BBS programs, admissions, or campus facilities!',
    ];
    const nextContext: ConversationContextState = {
      ...context,
      history: appendTurnHistory(
        context.history,
        userTurnRecord,
        unrelatedGuide[0],
        ConversationIntent.UNRELATED_TOPIC,
        context.activeProgram,
        context.activeAspect,
      ),
    };
    return {
      intent: ConversationIntent.UNRELATED_TOPIC,
      replyParagraphs: unrelatedGuide,
      categoryLabel: 'College Assistant',
      suggestedQuestions: [
        'What programs do you offer?',
        'Where is Capitol Hill College located?',
      ],
      actions: [],
      isFallback: false,
      nextContext,
    };
  }

  const unknownCollegeParagraphs = [
    "I don't have confirmed details on that specific question in our current college records, and I want to avoid sharing unverified information.",
    'Please contact Capitol Hill College administration directly at 01-5312399 or info.capitolhillcollege@gmail.com, and our team will be happy to confirm the exact details for you.',
  ];

  const nextContext: ConversationContextState = {
    ...context,
    history: appendTurnHistory(
      context.history,
      userTurnRecord,
      unknownCollegeParagraphs[0],
      ConversationIntent.UNKNOWN,
      context.activeProgram,
      context.activeAspect,
    ),
  };

  return {
    intent: ConversationIntent.UNKNOWN,
    replyParagraphs: unknownCollegeParagraphs,
    categoryLabel: 'Direct Assistance',
    suggestedQuestions: [
      'How can I contact the college?',
      'What programs do you offer?',
    ],
    actions: [
      { label: 'Contact & Admission Enquiry', action: 'scroll-contact' },
      { label: 'Submit Online Enquiry', action: 'open-enquiry' },
    ],
    isFallback: true,
    nextContext,
  };
}
