import {
  CHATBOT_FALLBACK_MESSAGE,
  CHATBOT_FAQ_DATABASE,
  CHATBOT_INITIAL_SUGGESTIONS,
} from '../data/chatbotFaqs';
import {
  ChatbotFaqItem,
  ChatbotMatchResult,
  ChatbotQuickAction,
} from '../types/chatbot';

/**
 * Deterministic, purely client-side FAQ matching engine for Capitol Hill College.
 * Uses multi-stage normalization, synonym canonicalization, phrase matching,
 * weighted token scoring, and bounded Levenshtein typo tolerance — with zero AI APIs.
 */

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'am',
  'do',
  'does',
  'did',
  'can',
  'could',
  'would',
  'should',
  'will',
  'shall',
  'may',
  'might',
  'to',
  'of',
  'in',
  'on',
  'at',
  'by',
  'for',
  'with',
  'from',
  'as',
  'into',
  'i',
  'me',
  'my',
  'we',
  'our',
  'you',
  'your',
  'it',
  'its',
  'they',
  'them',
  'their',
  'this',
  'that',
  'these',
  'those',
  'there',
  'here',
  'please',
  'kindly',
  'tell',
  'know',
  'want',
  'need',
  'give',
  'get',
  'show',
  'find',
  'like',
  'some',
  'any',
  'all',
  'more',
  'detail',
  'details',
  'info',
]);

/* Domain context words that appear in almost every query ("Does Capitol Hill College have...")
 * They should not trigger false-positive matches on unrelated topics. */
const DOMAIN_NEUTRAL_WORDS = new Set([
  'capitol',
  'capital',
  'hill',
  'college',
  'campus',
  'chc',
  'school',
  'institute',
]);

/* Generic verbs/adjectives that support a query but must NOT match a topic on their own */
const WEAK_MODIFIER_WORDS = new Set([
  'what',
  'how',
  'which',
  'who',
  'offer',
  'offered',
  'offers',
  'available',
  'provide',
  'provides',
  'provided',
  'have',
  'has',
  'organize',
  'organized',
  'organizes',
  'about',
  'make',
  'makes',
  'study',
  'take',
  'options',
  'option',
]);

/**
 * Multi-word & single-word canonical synonym replacements applied during normalization.
 */
const PHRASE_SYNONYMS: Array<[RegExp, string]> = [
  [/\b10\s*\+\s*2\b/g, 'plustwo'],
  [/\+\s*2\b/g, 'plustwo'],
  [/\bplus\s+two\b/g, 'plustwo'],
  [/\bplus\s*2\b/g, 'plustwo'],
  [/\bgrade\s*(11|12|xi|xii)\b/g, 'plustwo'],
  [/\bclass\s*(11|12|xi|xii)\b/g, 'plustwo'],
  [/\b11th\b|\b12th\b/g, 'plustwo'],
  [/\bb\s*\.\s*b\s*\.\s*s\s*\.?\b/g, 'bbs'],
  [/\bbachelor\s+of\s+business\s+studies\b/g, 'bbs'],
  [/\bm\s*\.\s*b\s*\.\s*s\s*\.?\b/g, 'mbs'],
  [/\bmaster\s+of\s+business\s+studies\b/g, 'mbs'],
  [/\bn\s*\.\s*e\s*\.\s*b\s*\.?\b/g, 'neb'],
  [/\bt\s*\.\s*u\s*\.?\b/g, 'tu'],
  [/\btribhuvan\s+university\b/g, 'tu'],
  [/\be\s*\.\s*c\s*\.\s*a\s*\.?\b/g, 'eca'],
  [/\bc\s*\.\s*c\s*\.\s*a\s*\.?\b/g, 'cca'],
  [/\bextra\s*curricular\b/g, 'extracurricular'],
  [/\bco\s*curricular\b/g, 'extracurricular'],
  [/\bfee\s+structure\b/g, 'feestructure'],
  [/\bfinancial\s+aid\b/g, 'financialaid'],
  [/\bfinancial\s+assistance\b/g, 'financialaid'],
  [/\bcomputer\s+labs?\b/g, 'computerlab'],
  [/\beducational\s+tours?\b/g, 'educationaltour'],
  [/\bfield\s+trips?\b/g, 'educationaltour'],
  [/\bstudy\s+tours?\b/g, 'educationaltour'],
];

const TOKEN_SYNONYMS: Record<string, string> = {
  courses: 'programs',
  course: 'programs',
  program: 'programs',
  programme: 'programs',
  programmes: 'programs',
  streams: 'programs',
  stream: 'programs',
  degrees: 'programs',
  degree: 'programs',
  located: 'location',
  where: 'location',
  address: 'location',
  map: 'location',
  maps: 'location',
  directions: 'location',
  direction: 'location',
  situated: 'location',
  place: 'location',
  reach: 'contact',
  phone: 'telephone',
  call: 'telephone',
  mobile: 'telephone',
  mail: 'email',
  counsellor: 'counselor',
  counselling: 'counselor',
  counseling: 'counselor',
  advisor: 'counselor',
  instalment: 'installment',
  instalments: 'installment',
  installments: 'installment',
  tuition: 'fees',
  fee: 'fees',
  cost: 'fees',
  costs: 'fees',
  price: 'fees',
  charges: 'fees',
  scholarships: 'scholarship',
  stipend: 'scholarship',
  waiver: 'scholarship',
  discounts: 'discount',
  concession: 'discount',
  concessions: 'discount',
  labs: 'laboratory',
  lab: 'laboratory',
  laboratories: 'laboratory',
  practicals: 'laboratory',
  books: 'library',
  canteen: 'cafeteria',
  cafe: 'cafeteria',
  food: 'cafeteria',
  dining: 'cafeteria',
  lunch: 'cafeteria',
  sport: 'sports',
  athletics: 'sports',
  games: 'sports',
  tournaments: 'sports',
  tours: 'educationaltour',
  tour: 'educationaltour',
  excursion: 'educationaltour',
  excursions: 'educationaltour',
  trips: 'educationaltour',
  activities: 'extracurricular',
  clubs: 'extracurricular',
  enquiry: 'enquiry',
  enquiries: 'enquiry',
  inquiry: 'enquiry',
  inquiries: 'enquiry',
  enquire: 'enquiry',
  inquire: 'enquiry',
  enroll: 'apply',
  enrol: 'apply',
  enrollment: 'apply',
  join: 'apply',
  register: 'apply',
  application: 'apply',
  criteria: 'eligibility',
  eligible: 'eligibility',
  qualify: 'eligibility',
  qualification: 'eligibility',
  requirements: 'requirement',
  certificates: 'documents',
  certificate: 'documents',
  transcripts: 'documents',
  transcript: 'documents',
  marksheet: 'documents',
  papers: 'documents',
  affiliations: 'affiliation',
  affiliated: 'affiliation',
  boards: 'affiliation',
  universities: 'affiliation',
  vs: 'difference',
  versus: 'difference',
  compare: 'difference',
  comparison: 'difference',
  facility: 'facilities',
  amenities: 'facilities',
  exam: 'examination',
  exams: 'examination',
  examinations: 'examination',
  result: 'results',
  notice: 'notices',
  announcement: 'notices',
  announcements: 'notices',
};

export function normalizeQueryText(raw: string): string {
  let text = raw.toLowerCase().trim();
  text = text.replace(/['’`]/g, '');

  for (const [pattern, replacement] of PHRASE_SYNONYMS) {
    text = text.replace(pattern, ` ${replacement} `);
  }

  text = text.replace(/[^a-z0-9\s]/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

function tokenizeNormalized(normalized: string): string[] {
  if (!normalized) return [];
  return normalized
    .split(' ')
    .filter(Boolean)
    .map((tok) => TOKEN_SYNONYMS[tok] ?? tok);
}

/**
 * Bounded Levenshtein edit distance for handling common student spelling typos
 * (e.g., "scolarship", "eligibilty", "admision", "facilites", "managment").
 */
function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 3;

  const matrix: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= b.length; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

/* Build vocabulary of known FAQ tokens once for typo correction */
const KNOWN_VOCABULARY: string[] = (() => {
  const vocab = new Set<string>(Object.keys(TOKEN_SYNONYMS));
  for (const val of Object.values(TOKEN_SYNONYMS)) {
    vocab.add(val);
  }
  for (const item of CHATBOT_FAQ_DATABASE) {
    const combined = [
      item.question,
      ...item.questionVariants,
      ...item.keywords,
    ].join(' ');
    for (const tok of tokenizeNormalized(normalizeQueryText(combined))) {
      if (tok.length >= 4 && !STOP_WORDS.has(tok)) {
        vocab.add(tok);
      }
    }
  }
  return Array.from(vocab);
})();

const KNOWN_VOCABULARY_SET = new Set<string>(KNOWN_VOCABULARY);

/* Distinct English words that must NEVER be fuzzy-mutated into similar-looking FAQ words
 * (e.g., preventing "hostel" -> "hotel" or "shift" -> "sheet") */
const DO_NOT_TYPO_CORRECT = new Set<string>([
  'hostel',
  'hostels',
  'dorm',
  'dormitory',
  'accommodation',
  'boarding',
  'bus',
  'buses',
  'shuttle',
  'pickup',
  'transport',
  'transportation',
  'shift',
  'shifts',
  'timing',
  'timings',
  'internship',
  'internships',
  'placement',
  'placements',
  'attendance',
  'weather',
  'rain',
  'sunny',
  'forecast',
  'recipe',
  'movie',
  'movies',
  'music',
  'cricket',
  'politics',
  'minister',
  'president',
  'bitcoin',
  'crypto',
  'joke',
  'jokes',
  'funny',
]);

function resolveTypoToken(token: string): string {
  if (
    token.length < 4 ||
    DO_NOT_TYPO_CORRECT.has(token) ||
    KNOWN_VOCABULARY_SET.has(token)
  ) {
    return TOKEN_SYNONYMS[token] ?? token;
  }

  const maxDist = token.length >= 7 ? 2 : 1;
  let bestWord = token;
  let bestDist = maxDist + 1;

  for (const candidate of KNOWN_VOCABULARY) {
    if (candidate[0] !== token[0]) continue;
    const dist = levenshteinDistance(token, candidate);
    if (dist < bestDist) {
      bestDist = dist;
      bestWord = candidate;
    }
  }

  return TOKEN_SYNONYMS[bestWord] ?? bestWord;
}

export function resolveQueryTokens(normalized: string): string[] {
  return tokenizeNormalized(normalized).map(resolveTypoToken);
}

interface PrecomputedFaqIndex {
  item: ChatbotFaqItem;
  normalizedQuestion: string;
  normalizedVariants: string[];
  questionTokens: Set<string>;
  keywordTokens: Set<string>;
  multiWordPhrases: string[];
}

const FAQ_INDEX: PrecomputedFaqIndex[] = CHATBOT_FAQ_DATABASE.map((item) => {
  const normalizedQuestion = normalizeQueryText(item.question);
  const normalizedVariants = item.questionVariants.map(normalizeQueryText);
  const normalizedKeywords = item.keywords.map(normalizeQueryText);

  const qTokens = new Set<string>(
    tokenizeNormalized(normalizedQuestion).filter(
      (t) => !STOP_WORDS.has(t) && !DOMAIN_NEUTRAL_WORDS.has(t)
    )
  );
  for (const v of normalizedVariants) {
    for (const t of tokenizeNormalized(v)) {
      if (!STOP_WORDS.has(t) && !DOMAIN_NEUTRAL_WORDS.has(t)) {
        qTokens.add(t);
      }
    }
  }

  const kwTokens = new Set<string>();
  for (const kw of normalizedKeywords) {
    for (const t of tokenizeNormalized(kw)) {
      if (!STOP_WORDS.has(t) && !DOMAIN_NEUTRAL_WORDS.has(t)) {
        kwTokens.add(t);
      }
    }
  }

  const multiWordPhrases = [
    normalizedQuestion,
    ...normalizedVariants,
    ...normalizedKeywords,
  ].filter((p) => p.includes(' ') && p.length >= 6);

  return {
    item,
    normalizedQuestion,
    normalizedVariants,
    questionTokens: qTokens,
    keywordTokens: kwTokens,
    multiWordPhrases,
  };
});

function getRelatedQuestions(item: ChatbotFaqItem): string[] {
  const related: string[] = [];
  for (const relId of item.relatedIds) {
    const found = CHATBOT_FAQ_DATABASE.find((f) => f.id === relId);
    if (found && found.id !== item.id) {
      related.push(found.question);
    }
  }
  return related.slice(0, 3);
}

const GREETING_PATTERNS =
  /^(hi|hello|hey|namaste|good morning|good afternoon|good evening|greetings|hi there|hello there)$/;

const THANKS_PATTERNS =
  /^(thanks|thank you|thankyou|thank you so much|thanks a lot|thx|appreciate it|helpful)$/;

const GENERAL_OVERVIEW_PATTERNS = [
  'what is capitol hill college',
  'what is capital hill college',
  'about capitol hill college',
  'about capital hill college',
  'tell me about capitol hill',
  'tell me about the college',
  'tell me about your college',
  'about the college',
  'about your college',
  'overview of capitol hill',
  'who are you',
  'what can you do',
];

export function matchUserQuestion(rawInput: string): ChatbotMatchResult {
  const normalizedRaw = normalizeQueryText(rawInput);

  if (!normalizedRaw) {
    return {
      type: 'fallback',
      confidence: 0,
      replyParagraphs: [CHATBOT_FALLBACK_MESSAGE],
      relatedQuestions: CHATBOT_INITIAL_SUGGESTIONS.slice(0, 3),
      actions: [
        { label: 'Contact College', action: 'scroll-contact' },
        { label: 'Submit Enquiry', action: 'open-enquiry' },
      ],
    };
  }

  /* 1. Polite Greeting Intent */
  if (GREETING_PATTERNS.test(normalizedRaw)) {
    return {
      type: 'greeting',
      confidence: 1,
      categoryLabel: 'FAQ Assistant',
      replyParagraphs: [
        'Hello! Welcome to Capitol Hill College. You can ask me about our NEB (+2 Management, +2 Humanities, +2 Science, +2 Law) and Tribhuvan University (BBS & MBS) programs, campus location, admissions, or facilities.',
      ],
      relatedQuestions: CHATBOT_INITIAL_SUGGESTIONS.slice(0, 4),
      actions: [],
    };
  }

  /* 2. Polite Gratitude Intent */
  if (THANKS_PATTERNS.test(normalizedRaw)) {
    return {
      type: 'thanks',
      confidence: 1,
      categoryLabel: 'FAQ Assistant',
      replyParagraphs: [
        "You're very welcome! Let me know if you have any more questions about Capitol Hill College, or feel free to reach our Teku campus office at 01-5312399.",
      ],
      relatedQuestions: [
        'How can I apply for admission?',
        'Can I visit the college before applying?',
        'Where is Capitol Hill College located?',
      ],
      actions: [{ label: 'Apply for Admission', action: 'open-enquiry' }],
    };
  }

  /* 3. Direct Exact Match on Canonical Question or Variant */
  for (const entry of FAQ_INDEX) {
    if (
      entry.normalizedQuestion === normalizedRaw ||
      entry.normalizedVariants.includes(normalizedRaw)
    ) {
      const actions: ChatbotQuickAction[] = entry.item.primaryAction
        ? [entry.item.primaryAction]
        : [];
      return {
        type: 'match',
        matchedItem: entry.item,
        confidence: 1,
        categoryLabel: entry.item.categoryLabel,
        replyParagraphs: entry.item.answer,
        verificationNote: entry.item.verificationNote,
        relatedQuestions: getRelatedQuestions(entry.item),
        actions,
      };
    }
  }

  /* 4. Explicit "What is Capitol Hill College / About the college" check */
  if (GENERAL_OVERVIEW_PATTERNS.some((pat) => normalizedRaw === pat || normalizedRaw.startsWith(pat))) {
    const overviewItem = CHATBOT_FAQ_DATABASE[0];
    return {
      type: 'match',
      matchedItem: overviewItem,
      confidence: 0.95,
      categoryLabel: overviewItem.categoryLabel,
      replyParagraphs: overviewItem.answer,
      verificationNote: overviewItem.verificationNote,
      relatedQuestions: getRelatedQuestions(overviewItem),
      actions: overviewItem.primaryAction ? [overviewItem.primaryAction] : [],
    };
  }

  /* 5. Tokenize with typo correction and classify meaningful vs neutral tokens */
  const rawTokens = tokenizeNormalized(normalizedRaw).map(resolveTypoToken);
  const meaningfulTokens = rawTokens.filter(
    (t) => !STOP_WORDS.has(t) && !DOMAIN_NEUTRAL_WORDS.has(t)
  );
  const paddedResolvedPhrase = ` ${rawTokens.join(' ')} `;

  if (meaningfulTokens.length === 0) {
    /* User only typed "Capitol Hill College?" */
    const overviewItem = CHATBOT_FAQ_DATABASE[0];
    return {
      type: 'match',
      matchedItem: overviewItem,
      confidence: 0.75,
      categoryLabel: overviewItem.categoryLabel,
      replyParagraphs: overviewItem.answer,
      relatedQuestions: getRelatedQuestions(overviewItem),
      actions: overviewItem.primaryAction ? [overviewItem.primaryAction] : [],
    };
  }

  /* Identify substantive content tokens (non-weak modifiers) and out-of-domain tokens */
  const substantiveTokens = meaningfulTokens.filter((t) => !WEAK_MODIFIER_WORDS.has(t));
  const outOfDomainCount = substantiveTokens.filter(
    (t) => !KNOWN_VOCABULARY_SET.has(t)
  ).length;

  let bestEntry: PrecomputedFaqIndex | null = null;
  let bestScore = 0;

  for (const entry of FAQ_INDEX) {
    let score = 0;
    let matchedSubstantiveCount = 0;

    /* A. Multi-word phrase containment bonus (whole-word bounded) */
    for (const phrase of entry.multiWordPhrases) {
      if (paddedResolvedPhrase.includes(` ${phrase} `)) {
        score += 5.5;
      }
    }

    /* B. Token-level scoring */
    for (const tok of meaningfulTokens) {
      const isWeak = WEAK_MODIFIER_WORDS.has(tok);
      const inKeywords = entry.keywordTokens.has(tok);
      const inQuestions = entry.questionTokens.has(tok);

      if (inKeywords) {
        score += isWeak ? 0.45 : 3.2;
        if (!isWeak) matchedSubstantiveCount += 1;
      } else if (inQuestions) {
        score += isWeak ? 0.35 : 2.1;
        if (!isWeak) matchedSubstantiveCount += 1;
      }
    }

    /* C. Disambiguation boosts for closely related intents */
    const hasAfter =
      meaningfulTokens.includes('after') ||
      meaningfulTokens.includes('completing') ||
      meaningfulTokens.includes('scope') ||
      meaningfulTokens.includes('career');
    const hasScience = meaningfulTokens.includes('science');
    const hasManagement = meaningfulTokens.includes('management');
    const hasBbs = meaningfulTokens.includes('bbs');
    const hasDifference =
      meaningfulTokens.includes('difference') || (hasScience && hasManagement);

    if (entry.item.id === 'prog-diff-science-mgmt' && hasDifference && hasScience && hasManagement) {
      score += 6;
    }
    if (entry.item.id === 'prog-after-science' && hasAfter && hasScience) {
      score += 6;
    }
    if (entry.item.id === 'prog-after-management' && hasAfter && hasManagement) {
      score += 6;
    }
    if (entry.item.id === 'prog-after-bbs' && hasAfter && hasBbs) {
      score += 6;
    }
    if (entry.item.id === 'fee-installments' && meaningfulTokens.includes('installment')) {
      score += 5;
    }
    if (entry.item.id === 'adm-documents' && meaningfulTokens.includes('documents')) {
      score += 4.5;
    }
    if (entry.item.id === 'adm-when-open' && meaningfulTokens.includes('when')) {
      score += 3.5;
    }

    /* D. Guard against false positives when query has unverified/unknown topics
     * (e.g., "hostel", "bus", "weather", "swimming") */
    if (substantiveTokens.length > 0 && matchedSubstantiveCount === 0) {
      score = 0;
    } else if (outOfDomainCount > 0 && matchedSubstantiveCount <= outOfDomainCount) {
      score = 0;
    } else if (substantiveTokens.length >= 2) {
      const unmatchedRatio =
        (substantiveTokens.length - matchedSubstantiveCount) / substantiveTokens.length;
      if (unmatchedRatio > 0.65) {
        score *= 0.45;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  /* Minimum confidence threshold to return an answer rather than inventing or guessing */
  const MIN_SCORE_THRESHOLD = 2.1;

  if (!bestEntry || bestScore < MIN_SCORE_THRESHOLD) {
    return {
      type: 'fallback',
      confidence: 0,
      categoryLabel: 'Direct Assistance',
      replyParagraphs: [
        CHATBOT_FALLBACK_MESSAGE,
        'You can reach our Teku, Kathmandu office directly at 01-5312399 or email info.capitolhillcollege@gmail.com.',
      ],
      relatedQuestions: [
        'How can I contact the college?',
        'How can I submit an enquiry?',
        'What programs does the college offer?',
      ],
      actions: [
        { label: 'Go to Contact Section', action: 'scroll-contact' },
        { label: 'Submit Online Enquiry', action: 'open-enquiry' },
      ],
    };
  }

  const matched = bestEntry.item;
  const actions: ChatbotQuickAction[] = matched.primaryAction
    ? [matched.primaryAction]
    : [];

  return {
    type: 'match',
    matchedItem: matched,
    confidence: Math.min(1, bestScore / 8),
    categoryLabel: matched.categoryLabel,
    replyParagraphs: matched.answer,
    verificationNote: matched.verificationNote,
    relatedQuestions: getRelatedQuestions(matched),
    actions,
  };
}
