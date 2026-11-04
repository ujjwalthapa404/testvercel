import {
  ConversationIntent,
  FacilityEntity,
  ProgramEntity,
  TopicAspect,
} from '../types/chatbot';
import { normalizeQueryText, resolveQueryTokens } from './chatbotMatcher';

export type DiscourseSubType =
  | 'greeting'
  | 'whats_up'
  | 'how_are_you'
  | 'identity'
  | 'joke'
  | 'banter_homework'
  | 'banter_canteen'
  | 'banter_bunk'
  | 'banter_wifi'
  | 'banter_sleep'
  | 'banter_compliment'
  | 'banter_romance'
  | 'banter_motivation'
  | 'help'
  | 'thanks'
  | 'ack'
  | 'affirmative'
  | 'negative'
  | 'farewell';

export type UnconfirmedTopicKey =
  | 'hostel'
  | 'transportation'
  | 'timings'
  | 'internship'
  | 'attendance';

export interface AnalyzedUserMessage {
  rawText: string;
  normalizedText: string;
  tokens: string[];
  /** True if message started with "Hi / Hello / Hey" before a real question */
  hasLeadingGreeting: boolean;
  intent: ConversationIntent;
  discourseSubType?: DiscourseSubType;
  mentionedPrograms: ProgramEntity[];
  unofferedProgramName?: string;
  mentionedFacility: FacilityEntity | null;
  detectedAspect: TopicAspect | null;
  unconfirmedTopic?: UnconfirmedTopicKey;
  hasReferentialPronoun: boolean;
  isPivotPhrase: boolean;
  isTellMeMore: boolean;
  isAvailabilityQuestion: boolean;
  isExplicitlyUnrelated: boolean;
}

const LEADING_GREETING_REGEX =
  /^(hi|hello|hey|namaste|greetings|good morning|good afternoon|good evening|hi there|hello there)\b[\s,!.:;-]*/i;

const PURE_GREETING_REGEX =
  /^(hi|hello|hey|namaste|greetings|good morning|good afternoon|good evening|hi there|hello there|hey there|namaskar)$/;

const WHATS_UP_REGEX =
  /^(whats up|what is up|wassup|sup|hows it going|how is it going|what are you doing|are you there|anyone there)$/;

const HOW_ARE_YOU_REGEX =
  /^(how are you|how are you doing|how do you do|hope you are well|how is your day|hows your day)$/;

const IDENTITY_REGEX =
  /\b(who are you|what are you|what is your name|whats your name|who made you|are you ai|are you an ai|are you a bot|are you a robot|are you human|are you a real person|are you chatgpt|do you use ai|artificial intelligence)\b/;

const JOKE_REGEX =
  /\b(tell me a joke|tell a joke|another joke|know any jokes|share a joke|make me laugh|say something funny|something funny|funny question|funny questions|crack a joke|got a joke|humor|humour)\b|^joke$|^funny$/;

const BANTER_HOMEWORK_REGEX =
  /\b(do my homework|write my assignment|do my assignment|take my exam|without studying|first bench|backbencher|backbenchers|cheat in exam|cheat code)\b/;

const BANTER_CANTEEN_REGEX =
  /\b(momo|momos|chiya|samosa|chowmein|hungry|starving|survive without coffee|canteen food)\b/;

const BANTER_BUNK_REGEX =
  /\b(bunk|bunking|skip class|cut class|sneak out)\b/;

const BANTER_WIFI_REGEX =
  /\b(wifi password|wi fi password|secret wifi|free wifi password|router password)\b/;

const BANTER_SLEEP_REGEX =
  /\b(do you sleep|do you ever sleep|are you tired|do you get tired|are you awake|do you eat|guarding the campus)\b/;

const BANTER_COMPLIMENT_REGEX =
  /\b(you are|youre)\s+(?:really\s+|so\s+|very\s+|super\s+|pretty\s+|quite\s+)?(smart|cool|funny|awesome|great|amazing|helpful|sweet|witty)\b|\b(good bot|nice bot|smart guide|love talking to you)\b/;

const BANTER_ROMANCE_REGEX =
  /\b(are you single|marry me|i love you|be my girlfriend|be my boyfriend|go on a date|do you have a crush)\b/;

const BANTER_MOTIVATION_REGEX =
  /\b(i am bored|im bored|entertain me|motivate me|study motivation|scared of exams|exam stress|nervous about college)\b/;

const HELP_REGEX =
  /^(help|help me|what can you do|what can i ask|what can i ask you|what do you know|how can you help|options|topics)$/;

const THANKS_REGEX =
  /^(thanks|thank you|thankyou|thank you so much|thanks a lot|many thanks|thx|ty|appreciate it|much appreciated|that was helpful|very helpful|thanks for the info|thank you for the help)$/;

const FAREWELL_REGEX =
  /^(bye|goodbye|good bye|see you|see ya|take care|have a good day|have a nice day|good night|talk to you later|cya)$/;

const ACK_REGEX =
  /^(ok|okay|k|kk|alright|got it|i got it|understood|i understand|makes sense|that makes sense|i see|oh i see|cool|nice|great|awesome|perfect|good to know|noted|fine|sounds good|fair enough)$/;

const AFFIRMATIVE_REGEX =
  /^(yes|yeah|yep|yup|sure|yes please|sure please|of course|definitely|please do|go ahead|why not|okay sure|ok sure|ye)$/;

const NEGATIVE_REGEX =
  /^(no|nope|nah|no thanks|no thank you|not right now|not now|nothing else|thats all|that is all|im good|i am good|all good|never mind|nevermind)$/;

const TELL_ME_MORE_REGEX =
  /\b(tell me more|more details|more detail|more info|more information|elaborate|explain more|can you explain more|know more|give me more details|go on|anything else about)\b|^(more|details|elaborate|explain)$/;

const CLARIFICATION_ASK_REGEX =
  /\b(what do you mean|can you clarify|clarify that|not clear|i dont understand|i do not understand|explain that|what does that mean|which ones)\b/;

const AVAILABILITY_ONLY_REGEX =
  /^(is it available|is that available|do you have it|do you offer it|do you offer that|is it offered|are they available)$/;

const PRONOUN_REGEX =
  /\b(it|its|that|this|they|them|their|there|same|both)\b/;

const PIVOT_PREFIX_REGEX =
  /^(what about|how about|and what about|and how about|and for|what for|and in|and|also|or)\b/;

const UNOFFERED_PROGRAM_PATTERNS: Array<[RegExp, string]> = [
  [/\bbba\b|\bbachelor of business administration\b/, 'BBA'],
  [/\bbca\b|\bbachelor of computer application\b/, 'BCA'],
  [/\bbim\b|\bbachelor of information management\b/, 'BIM'],
  [/\bcsit\b|\bbsc csit\b/, 'BSc CSIT'],
  [/\bbit\b/, 'BIT'],
  [/\bbhm\b|\bbachelor of hotel management\b/, 'BHM'],
  [/\bmbbs\b|\bbds\b|\bnursing\b/, 'Medical / Nursing degrees'],
  [/\bengineering\b|\bbarch\b/, 'Engineering degrees'],
  [/\bballb\b|\bba llb\b|\bllb\b/, 'B.A. LL.B. / LL.B. (Note: we offer Higher Secondary +2 Law under NEB)'],
  [/\beducation stream\b|\bplustwo education\b|\bb\s*ed\b/, 'Education (+2 Education / B.Ed)'],
  [/\bchartered accountancy\b|\baccu?\b/, 'CA / ACCA'],
  [/\ba\s*level\b|\ba\s*levels\b/, 'A-Levels'],
  [/\bmba\b|\bmaster of business administration\b/, 'MBA (Note: we offer Master of Business Studies / MBS under Tribhuvan University)'],
];

const UNRELATED_KEYWORDS = new Set([
  'weather',
  'rain',
  'raining',
  'sunny',
  'temperature',
  'forecast',
  'recipe',
  'cook',
  'cooking',
  'pizza',
  'burger',
  'restaurant',
  'movie',
  'movies',
  'netflix',
  'cinema',
  'actor',
  'song',
  'songs',
  'lyrics',
  'spotify',
  'cricket',
  'worldcup',
  'messi',
  'ronaldo',
  'premier',
  'ipl',
  'politics',
  'politician',
  'election',
  'minister',
  'president',
  'bitcoin',
  'crypto',
  'ethereum',
  'forex',
  'stocks',
  'astrology',
  'horoscope',
  'zodiac',
  'poem',
  'poetry',
  'essay',
  'python',
  'javascript',
  'leetcode',
]);

const UNRELATED_PHRASE_REGEX =
  /\b(what time is it|what day is today|who won the|capital of|tallest mountain|mount everest|write a poem|write an essay|write code|solve this|translate this|who is the prime minister|who is the president)\b/;

function extractProgramMentions(normalized: string, tokens: string[]): ProgramEntity[] {
  const found: ProgramEntity[] = [];
  const padded = ` ${normalized} `;

  // Avoid treating "computer science lab" or "hotel management lab" purely as program switches when asking about labs
  const isLabSpecific =
    tokens.includes('laboratory') ||
    tokens.includes('computerlab') ||
    padded.includes(' lab ') ||
    padded.includes(' labs ');

  if (
    padded.includes(' plustwo science ') ||
    padded.includes(' science stream ') ||
    padded.includes(' science group ') ||
    (!isLabSpecific &&
      (tokens.includes('science') ||
        (tokens.includes('physics') && tokens.includes('chemistry'))))
  ) {
    // Exclude "computer science" when clearly talking about management elective ("management with computer science")
    const isOnlyComputerScience =
      padded.includes(' computer science ') &&
      !padded.includes(' plustwo science ') &&
      !padded.includes(' science stream ');
    if (!isOnlyComputerScience) {
      found.push('plus2_science');
    }
  }

  if (
    padded.includes(' plustwo management ') ||
    padded.includes(' management stream ') ||
    tokens.includes('commerce') ||
    (!isLabSpecific &&
      (tokens.includes('management') || padded.includes(' hotel management ')))
  ) {
    // Avoid matching "college management" / "talk to management" as +2 Management
    const isAdminManagement =
      padded.includes(' college management ') ||
      padded.includes(' management office ') ||
      padded.includes(' management team ');
    if (!isAdminManagement) {
      found.push('plus2_management');
    }
  }

  if (
    padded.includes(' plustwo humanities ') ||
    padded.includes(' humanities stream ') ||
    tokens.includes('humanities') ||
    tokens.includes('sociology') ||
    padded.includes(' mass communication ') ||
    padded.includes(' population studies ') ||
    padded.includes(' optional english ')
  ) {
    found.push('plus2_humanities');
  }

  if (
    padded.includes(' plustwo law ') ||
    padded.includes(' law stream ') ||
    padded.includes(' constitutional law ') ||
    padded.includes(' procedural law ') ||
    padded.includes(' legal drafting ') ||
    (tokens.includes('law') && !padded.includes(' business law ') && !/\bballb\b|\bllb\b/.test(normalized))
  ) {
    found.push('plus2_law');
  }

  if (
    tokens.includes('bbs') ||
    padded.includes(' bachelor ') ||
    padded.includes(' bachelors ') ||
    padded.includes(' undergraduate ')
  ) {
    found.push('bbs');
  }

  if (
    tokens.includes('mbs') ||
    tokens.includes('masters') ||
    tokens.includes('master') ||
    tokens.includes('postgraduate') ||
    padded.includes(' graduate program ') ||
    padded.includes(' graduate courses ')
  ) {
    found.push('mbs');
  }

  return found;
}

function extractFacilityMention(normalized: string, tokens: string[]): FacilityEntity | null {
  const padded = ` ${normalized} `;
  if (tokens.includes('library') || padded.includes(' reading room ')) return 'library';
  if (
    tokens.includes('laboratory') ||
    tokens.includes('computerlab') ||
    padded.includes(' lab ') ||
    padded.includes(' labs ')
  ) {
    return 'labs';
  }
  if (tokens.includes('cafeteria')) return 'cafeteria';
  if (
    tokens.includes('sports') ||
    tokens.includes('football') ||
    tokens.includes('basketball') ||
    tokens.includes('volleyball')
  ) {
    return 'sports';
  }
  if (tokens.includes('educationaltour')) return 'tours';
  if (
    tokens.includes('eca') ||
    tokens.includes('cca') ||
    tokens.includes('extracurricular') ||
    tokens.includes('events') ||
    tokens.includes('orientation') ||
    tokens.includes('quiz') ||
    tokens.includes('quizzes') ||
    tokens.includes('debate') ||
    tokens.includes('farewell') ||
    padded.includes(' welcome program ') ||
    padded.includes(' welcome programs ')
  ) {
    return 'eca';
  }
  if (
    padded.includes(' learning environment ') ||
    tokens.includes('uniform') ||
    tokens.includes('atmosphere') ||
    padded.includes(' student life ') ||
    padded.includes(' dress code ')
  ) {
    return 'environment';
  }
  return null;
}

function detectUnconfirmedCollegeTopic(
  normalized: string,
  tokens: string[],
): UnconfirmedTopicKey | undefined {
  const padded = ` ${normalized} `;
  if (
    tokens.includes('hostel') ||
    tokens.includes('hostels') ||
    tokens.includes('dormitory') ||
    tokens.includes('dorm') ||
    tokens.includes('accommodation') ||
    tokens.includes('boarding')
  ) {
    return 'hostel';
  }
  if (
    tokens.includes('bus') ||
    tokens.includes('buses') ||
    tokens.includes('van') ||
    tokens.includes('transport') ||
    tokens.includes('transportation') ||
    tokens.includes('shuttle') ||
    padded.includes(' pick up ') ||
    tokens.includes('pickup')
  ) {
    return 'transportation';
  }
  if (
    tokens.includes('shift') ||
    tokens.includes('shifts') ||
    padded.includes(' morning shift ') ||
    padded.includes(' day shift ') ||
    padded.includes(' class time ') ||
    padded.includes(' class timing ') ||
    padded.includes(' class timings ') ||
    padded.includes(' what time do classes ')
  ) {
    return 'timings';
  }
  if (
    tokens.includes('internship') ||
    tokens.includes('internships') ||
    tokens.includes('placement') ||
    tokens.includes('placements')
  ) {
    return 'internship';
  }
  if (tokens.includes('attendance')) {
    return 'attendance';
  }
  return undefined;
}

function detectTopicAspect(
  normalized: string,
  tokens: string[],
  mentionedPrograms: ProgramEntity[],
  mentionedFacility: FacilityEntity | null,
): TopicAspect | null {
  const padded = ` ${normalized} `;

  // 1. Comparison cues
  const hasCompareWord =
    tokens.includes('difference') ||
    padded.includes(' better ') ||
    padded.includes(' choose between ') ||
    padded.includes(' or ');
  if (
    (mentionedPrograms.length >= 2 && (hasCompareWord || tokens.includes('difference'))) ||
    (tokens.includes('difference') && mentionedPrograms.length >= 1)
  ) {
    return 'comparison';
  }

  // 2. Career / Further study after completing a course
  if (
    tokens.includes('after') ||
    tokens.includes('completing') ||
    tokens.includes('scope') ||
    tokens.includes('career') ||
    tokens.includes('careers') ||
    tokens.includes('jobs') ||
    tokens.includes('job') ||
    padded.includes(' future ')
  ) {
    return 'after_study';
  }

  // 3. Fees, installments & scholarships
  if (tokens.includes('installment') || padded.includes(' pay monthly ')) {
    return 'installments';
  }
  if (tokens.includes('feestructure') || padded.includes(' breakdown ')) {
    return 'fee_structure';
  }
  if (tokens.includes('discount') || tokens.includes('financialaid')) {
    return 'discounts';
  }
  if (tokens.includes('scholarship') || tokens.includes('merit')) {
    return 'scholarships';
  }
  if (
    tokens.includes('fees') ||
    padded.includes(' how much ') ||
    padded.includes(' what does it cost ') ||
    tokens.includes('expensive') ||
    tokens.includes('affordable')
  ) {
    return 'fees';
  }

  // 4. Admission, documents, eligibility, deadlines, visits, counseling
  if (tokens.includes('documents') || tokens.includes('marksheet') || tokens.includes('migration')) {
    return 'documents';
  }
  if (
    tokens.includes('eligibility') ||
    tokens.includes('requirement') ||
    tokens.includes('gpa') ||
    tokens.includes('entrance') ||
    padded.includes(' minimum grade ') ||
    padded.includes(' cut off ') ||
    tokens.includes('cutoff')
  ) {
    return 'eligibility';
  }
  if (
    tokens.includes('deadline') ||
    tokens.includes('deadlines') ||
    tokens.includes('intake') ||
    (tokens.includes('when') &&
      (tokens.includes('admission') ||
        tokens.includes('apply') ||
        tokens.includes('open') ||
        tokens.includes('start'))) ||
    padded.includes(' admission open ')
  ) {
    return 'deadlines';
  }
  if (
    tokens.includes('visit') ||
    padded.includes(' campus tour ') ||
    padded.includes(' walk in ') ||
    padded.includes(' see the college ') ||
    padded.includes(' see the campus ')
  ) {
    return 'visit';
  }
  if (tokens.includes('counselor')) {
    return 'counselor';
  }
  if (tokens.includes('apply') || tokens.includes('admission')) {
    return 'admission_apply';
  }

  // 5. Location & Contact
  const isReachLocationPhrase =
    padded.includes(' how can i reach ') ||
    padded.includes(' how do i reach ') ||
    padded.includes(' how to reach ') ||
    padded.includes(' reach the college ') ||
    padded.includes(' reach your college ') ||
    padded.includes(' reach the campus ') ||
    padded.includes(' reach capitol ') ||
    padded.includes(' reach chc ') ||
    padded.includes(' get to the college ') ||
    padded.includes(' get to capitol ') ||
    padded.includes(' find the college ') ||
    padded.includes(' share location ') ||
    padded.includes(' college location ') ||
    padded.includes(' campus location ') ||
    padded.includes(' google map ') ||
    padded.includes(' google maps ');

  if (
    isReachLocationPhrase ||
    tokens.includes('location') ||
    tokens.includes('located') ||
    tokens.includes('situated') ||
    tokens.includes('address') ||
    tokens.includes('teku') ||
    tokens.includes('direction') ||
    tokens.includes('directions') ||
    tokens.includes('landmark') ||
    tokens.includes('map') ||
    tokens.includes('maps') ||
    padded.includes(' where is chc ') ||
    padded.includes(' where is capitol ') ||
    padded.includes(' where is your ') ||
    padded.includes(' where is the college ') ||
    padded.includes(' where are you ') ||
    padded.includes(' how do i get to ') ||
    (tokens.includes('kathmandu') && !tokens.includes('weather'))
  ) {
    return 'location';
  }
  if (
    tokens.includes('contact') ||
    tokens.includes('telephone') ||
    tokens.includes('email') ||
    tokens.includes('enquiry') ||
    tokens.includes('facebook') ||
    tokens.includes('tiktok') ||
    tokens.includes('administration')
  ) {
    return 'contact';
  }

  // 6. Leadership, Affiliations, Approach, Notices
  if (
    tokens.includes('principal') ||
    tokens.includes('chairman') ||
    tokens.includes('pawan') ||
    tokens.includes('bista') ||
    tokens.includes('nischal') ||
    tokens.includes('gautam') ||
    tokens.includes('sagar') ||
    tokens.includes('khanal') ||
    tokens.includes('governance') ||
    tokens.includes('advisory') ||
    tokens.includes('committee') ||
    tokens.includes('director') ||
    tokens.includes('faculty') ||
    tokens.includes('teachers') ||
    padded.includes(' advisory committee ') ||
    padded.includes(' advisory board ') ||
    padded.includes(' vice principal ') ||
    padded.includes(' board of directors ') ||
    padded.includes(' team ')
  ) {
    return 'leadership';
  }
  if (
    tokens.includes('affiliation') ||
    tokens.includes('neb') ||
    tokens.includes('tu') ||
    tokens.includes('university') ||
    tokens.includes('board')
  ) {
    return 'affiliations';
  }
  if (
    tokens.includes('approach') ||
    tokens.includes('methodology') ||
    tokens.includes('philosophy') ||
    tokens.includes('pedagogy')
  ) {
    return 'approach';
  }
  if (
    tokens.includes('notices') ||
    tokens.includes('results') ||
    tokens.includes('examination') ||
    tokens.includes('routine')
  ) {
    return 'notices';
  }

  // 7. Facilities
  if (mentionedFacility) {
    return 'facility_detail';
  }
  if (tokens.includes('facilities') || tokens.includes('infrastructure')) {
    return 'facilities_overview';
  }

  // 8. Programs
  if (mentionedPrograms.length === 1) {
    return 'program_detail';
  }
  if (tokens.includes('programs') || padded.includes(' what can i study ')) {
    return 'programs_overview';
  }

  // 9. General College Info
  if (
    tokens.includes('different') ||
    tokens.includes('special') ||
    tokens.includes('unique') ||
    tokens.includes('overview') ||
    tokens.includes('history') ||
    tokens.includes('founded') ||
    tokens.includes('motto')
  ) {
    return 'college_overview';
  }

  return null;
}

export function analyzeUserMessage(rawInput: string): AnalyzedUserMessage {
  const trimmed = rawInput.trim();
  const fullNormalized = normalizeQueryText(trimmed);

  // Check if message is purely a greeting vs a greeting followed by a question ("Hi, what programs do you offer?")
  let hasLeadingGreeting = false;
  let coreRawText = trimmed;
  if (LEADING_GREETING_REGEX.test(trimmed) && !PURE_GREETING_REGEX.test(fullNormalized)) {
    const stripped = trimmed.replace(LEADING_GREETING_REGEX, '').trim();
    if (stripped.length >= 3) {
      hasLeadingGreeting = true;
      coreRawText = stripped;
    }
  }

  const normalizedText = hasLeadingGreeting
    ? normalizeQueryText(coreRawText)
    : fullNormalized;
  const tokens = resolveQueryTokens(normalizedText);

  const hasReferentialPronoun = PRONOUN_REGEX.test(normalizedText);
  const isPivotPhrase = PIVOT_PREFIX_REGEX.test(normalizedText);
  const isTellMeMore = TELL_ME_MORE_REGEX.test(normalizedText);
  const isAvailabilityQuestion = AVAILABILITY_ONLY_REGEX.test(normalizedText);

  // 1. Pure greeting
  if (PURE_GREETING_REGEX.test(fullNormalized)) {
    return {
      rawText: trimmed,
      normalizedText: fullNormalized,
      tokens,
      hasLeadingGreeting: true,
      intent: ConversationIntent.GREETING,
      discourseSubType: 'greeting',
      mentionedPrograms: [],
      mentionedFacility: null,
      detectedAspect: null,
      hasReferentialPronoun: false,
      isPivotPhrase: false,
      isTellMeMore: false,
      isAvailabilityQuestion: false,
      isExplicitlyUnrelated: false,
    };
  }

  // 2. General conversational small-talk (What's up, How are you, Joke, Identity, Help)
  if (WHATS_UP_REGEX.test(normalizedText)) {
    return {
      rawText: trimmed,
      normalizedText,
      tokens,
      hasLeadingGreeting,
      intent: ConversationIntent.GENERAL_CONVERSATION,
      discourseSubType: 'whats_up',
      mentionedPrograms: [],
      mentionedFacility: null,
      detectedAspect: null,
      hasReferentialPronoun: false,
      isPivotPhrase: false,
      isTellMeMore: false,
      isAvailabilityQuestion: false,
      isExplicitlyUnrelated: false,
    };
  }

  if (HOW_ARE_YOU_REGEX.test(normalizedText)) {
    return {
      rawText: trimmed,
      normalizedText,
      tokens,
      hasLeadingGreeting,
      intent: ConversationIntent.GENERAL_CONVERSATION,
      discourseSubType: 'how_are_you',
      mentionedPrograms: [],
      mentionedFacility: null,
      detectedAspect: null,
      hasReferentialPronoun: false,
      isPivotPhrase: false,
      isTellMeMore: false,
      isAvailabilityQuestion: false,
      isExplicitlyUnrelated: false,
    };
  }

  if (JOKE_REGEX.test(normalizedText)) {
    return {
      rawText: trimmed,
      normalizedText,
      tokens,
      hasLeadingGreeting,
      intent: ConversationIntent.GENERAL_CONVERSATION,
      discourseSubType: 'joke',
      mentionedPrograms: [],
      mentionedFacility: null,
      detectedAspect: null,
      hasReferentialPronoun: false,
      isPivotPhrase: false,
      isTellMeMore: false,
      isAvailabilityQuestion: false,
      isExplicitlyUnrelated: false,
    };
  }

  const banterMatchers: Array<[RegExp, DiscourseSubType]> = [
    [BANTER_HOMEWORK_REGEX, 'banter_homework'],
    [BANTER_CANTEEN_REGEX, 'banter_canteen'],
    [BANTER_BUNK_REGEX, 'banter_bunk'],
    [BANTER_WIFI_REGEX, 'banter_wifi'],
    [BANTER_SLEEP_REGEX, 'banter_sleep'],
    [BANTER_COMPLIMENT_REGEX, 'banter_compliment'],
    [BANTER_ROMANCE_REGEX, 'banter_romance'],
    [BANTER_MOTIVATION_REGEX, 'banter_motivation'],
  ];

  for (const [pattern, subType] of banterMatchers) {
    if (pattern.test(normalizedText)) {
      return {
        rawText: trimmed,
        normalizedText,
        tokens,
        hasLeadingGreeting,
        intent: ConversationIntent.GENERAL_CONVERSATION,
        discourseSubType: subType,
        mentionedPrograms: [],
        mentionedFacility: null,
        detectedAspect: null,
        hasReferentialPronoun: false,
        isPivotPhrase: false,
        isTellMeMore: false,
        isAvailabilityQuestion: false,
        isExplicitlyUnrelated: false,
      };
    }
  }

  if (IDENTITY_REGEX.test(normalizedText)) {
    return {
      rawText: trimmed,
      normalizedText,
      tokens,
      hasLeadingGreeting,
      intent: ConversationIntent.GENERAL_CONVERSATION,
      discourseSubType: 'identity',
      mentionedPrograms: [],
      mentionedFacility: null,
      detectedAspect: null,
      hasReferentialPronoun: false,
      isPivotPhrase: false,
      isTellMeMore: false,
      isAvailabilityQuestion: false,
      isExplicitlyUnrelated: false,
    };
  }

  if (HELP_REGEX.test(normalizedText)) {
    return {
      rawText: trimmed,
      normalizedText,
      tokens,
      hasLeadingGreeting,
      intent: ConversationIntent.GENERAL_CONVERSATION,
      discourseSubType: 'help',
      mentionedPrograms: [],
      mentionedFacility: null,
      detectedAspect: null,
      hasReferentialPronoun: false,
      isPivotPhrase: false,
      isTellMeMore: false,
      isAvailabilityQuestion: false,
      isExplicitlyUnrelated: false,
    };
  }

  // 3. Thanks, Acknowledgements, Yes/No, Farewells
  if (THANKS_REGEX.test(normalizedText)) {
    return {
      rawText: trimmed,
      normalizedText,
      tokens,
      hasLeadingGreeting,
      intent: ConversationIntent.THANKS_ACKNOWLEDGEMENT,
      discourseSubType: 'thanks',
      mentionedPrograms: [],
      mentionedFacility: null,
      detectedAspect: null,
      hasReferentialPronoun: false,
      isPivotPhrase: false,
      isTellMeMore: false,
      isAvailabilityQuestion: false,
      isExplicitlyUnrelated: false,
    };
  }

  if (FAREWELL_REGEX.test(normalizedText)) {
    return {
      rawText: trimmed,
      normalizedText,
      tokens,
      hasLeadingGreeting,
      intent: ConversationIntent.THANKS_ACKNOWLEDGEMENT,
      discourseSubType: 'farewell',
      mentionedPrograms: [],
      mentionedFacility: null,
      detectedAspect: null,
      hasReferentialPronoun: false,
      isPivotPhrase: false,
      isTellMeMore: false,
      isAvailabilityQuestion: false,
      isExplicitlyUnrelated: false,
    };
  }

  if (AFFIRMATIVE_REGEX.test(normalizedText)) {
    return {
      rawText: trimmed,
      normalizedText,
      tokens,
      hasLeadingGreeting,
      intent: ConversationIntent.THANKS_ACKNOWLEDGEMENT,
      discourseSubType: 'affirmative',
      mentionedPrograms: [],
      mentionedFacility: null,
      detectedAspect: null,
      hasReferentialPronoun: false,
      isPivotPhrase: false,
      isTellMeMore: false,
      isAvailabilityQuestion: false,
      isExplicitlyUnrelated: false,
    };
  }

  if (NEGATIVE_REGEX.test(normalizedText)) {
    return {
      rawText: trimmed,
      normalizedText,
      tokens,
      hasLeadingGreeting,
      intent: ConversationIntent.THANKS_ACKNOWLEDGEMENT,
      discourseSubType: 'negative',
      mentionedPrograms: [],
      mentionedFacility: null,
      detectedAspect: null,
      hasReferentialPronoun: false,
      isPivotPhrase: false,
      isTellMeMore: false,
      isAvailabilityQuestion: false,
      isExplicitlyUnrelated: false,
    };
  }

  if (ACK_REGEX.test(normalizedText)) {
    return {
      rawText: trimmed,
      normalizedText,
      tokens,
      hasLeadingGreeting,
      intent: ConversationIntent.THANKS_ACKNOWLEDGEMENT,
      discourseSubType: 'ack',
      mentionedPrograms: [],
      mentionedFacility: null,
      detectedAspect: null,
      hasReferentialPronoun: false,
      isPivotPhrase: false,
      isTellMeMore: false,
      isAvailabilityQuestion: false,
      isExplicitlyUnrelated: false,
    };
  }

  // 4. Extract domain entities & topic aspects
  const mentionedPrograms = extractProgramMentions(normalizedText, tokens);
  const mentionedFacility = extractFacilityMention(normalizedText, tokens);
  const unconfirmedTopic = detectUnconfirmedCollegeTopic(normalizedText, tokens);
  const detectedAspect = detectTopicAspect(
    normalizedText,
    tokens,
    mentionedPrograms,
    mentionedFacility,
  );

  // Detect unoffered degrees (e.g., BBA, BCA, BIM, BSc CSIT) unless asking about post-+2 pathways
  let unofferedProgramName: string | undefined;
  if (detectedAspect !== 'after_study') {
    for (const [pattern, label] of UNOFFERED_PROGRAM_PATTERNS) {
      if (pattern.test(normalizedText)) {
        unofferedProgramName = label;
        break;
      }
    }
  }

  // Detect explicitly unrelated non-college queries
  const isExplicitlyUnrelated =
    UNRELATED_PHRASE_REGEX.test(normalizedText) ||
    tokens.some((tok) => UNRELATED_KEYWORDS.has(tok));

  // 5. Clarification requests ("What do you mean?", "Can you clarify?")
  if (CLARIFICATION_ASK_REGEX.test(normalizedText) && !detectedAspect && mentionedPrograms.length === 0) {
    return {
      rawText: trimmed,
      normalizedText,
      tokens,
      hasLeadingGreeting,
      intent: ConversationIntent.CLARIFICATION_REQUEST,
      mentionedPrograms,
      mentionedFacility,
      detectedAspect,
      hasReferentialPronoun,
      isPivotPhrase,
      isTellMeMore,
      isAvailabilityQuestion,
      isExplicitlyUnrelated: false,
    };
  }

  // 6. Unrelated topic check (when no college aspect/program is being asked)
  if (isExplicitlyUnrelated && mentionedPrograms.length === 0 && !mentionedFacility) {
    return {
      rawText: trimmed,
      normalizedText,
      tokens,
      hasLeadingGreeting,
      intent: ConversationIntent.UNRELATED_TOPIC,
      mentionedPrograms: [],
      mentionedFacility: null,
      detectedAspect: null,
      hasReferentialPronoun,
      isPivotPhrase,
      isTellMeMore: false,
      isAvailabilityQuestion: false,
      isExplicitlyUnrelated: true,
    };
  }

  // 7. Unconfirmed college topics (hostel, bus, shift timings, internships, unoffered degrees)
  if (unconfirmedTopic || unofferedProgramName) {
    return {
      rawText: trimmed,
      normalizedText,
      tokens,
      hasLeadingGreeting,
      intent: ConversationIntent.UNCONFIRMED_COLLEGE_TOPIC,
      mentionedPrograms,
      unofferedProgramName,
      mentionedFacility,
      detectedAspect,
      unconfirmedTopic,
      hasReferentialPronoun,
      isPivotPhrase,
      isTellMeMore,
      isAvailabilityQuestion,
      isExplicitlyUnrelated: false,
    };
  }

  // 8. Contextual Follow-Ups ("Tell me more", "What about Management?", "What about its fees?", "Is it available?")
  if (
    isTellMeMore ||
    isAvailabilityQuestion ||
    (isPivotPhrase && (mentionedPrograms.length > 0 || mentionedFacility !== null || detectedAspect !== null)) ||
    (hasReferentialPronoun && detectedAspect !== null && mentionedPrograms.length === 0 && !mentionedFacility)
  ) {
    return {
      rawText: trimmed,
      normalizedText,
      tokens,
      hasLeadingGreeting,
      intent: ConversationIntent.FOLLOW_UP,
      mentionedPrograms,
      mentionedFacility,
      detectedAspect,
      hasReferentialPronoun,
      isPivotPhrase,
      isTellMeMore,
      isAvailabilityQuestion,
      isExplicitlyUnrelated: false,
    };
  }

  // 9. Map primary domain aspect to primary ConversationIntent
  let primaryIntent: ConversationIntent = ConversationIntent.UNKNOWN;
  switch (detectedAspect) {
    case 'comparison':
      primaryIntent = ConversationIntent.PROGRAM_COMPARISON;
      break;
    case 'programs_overview':
    case 'program_detail':
    case 'after_study':
      primaryIntent = ConversationIntent.ACADEMIC_PROGRAMS;
      break;
    case 'admission_apply':
    case 'documents':
    case 'deadlines':
    case 'visit':
    case 'counselor':
      primaryIntent = ConversationIntent.ADMISSION;
      break;
    case 'eligibility':
      primaryIntent = ConversationIntent.ELIGIBILITY;
      break;
    case 'fees':
    case 'fee_structure':
    case 'installments':
      primaryIntent = ConversationIntent.FEES;
      break;
    case 'scholarships':
    case 'discounts':
      primaryIntent = ConversationIntent.SCHOLARSHIPS;
      break;
    case 'facilities_overview':
    case 'facility_detail':
      primaryIntent = ConversationIntent.FACILITIES;
      break;
    case 'location':
      primaryIntent = ConversationIntent.LOCATION;
      break;
    case 'contact':
      primaryIntent = ConversationIntent.CONTACT_INFO;
      break;
    case 'college_overview':
    case 'leadership':
    case 'affiliations':
    case 'approach':
    case 'notices':
      primaryIntent = ConversationIntent.COLLEGE_INFO;
      break;
    default:
      primaryIntent = ConversationIntent.UNKNOWN;
      break;
  }

  return {
    rawText: trimmed,
    normalizedText,
    tokens,
    hasLeadingGreeting,
    intent: primaryIntent,
    mentionedPrograms,
    mentionedFacility,
    detectedAspect,
    hasReferentialPronoun,
    isPivotPhrase,
    isTellMeMore,
    isAvailabilityQuestion,
    isExplicitlyUnrelated: false,
  };
}
