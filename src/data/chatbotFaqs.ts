import { OFFICIAL_GOOGLE_MAPS_URL } from './academicPrograms';
import {
  ChatbotCategoryId,
  ChatbotCategoryMeta,
  ChatbotFaqItem,
} from '../types/chatbot';

/**
 * Capitol Hill College — Official Predefined FAQ Assistant Dataset
 *
 * HOW TO UPDATE OR ADD QUESTIONS LATER:
 * 1. Find the appropriate category in `CHATBOT_FAQ_DATABASE` below (or add a new `ChatbotFaqItem` object).
 * 2. Update `answer` (array of paragraphs) once official figures/dates are confirmed by administration.
 * 3. Remove or update `verificationNote` after replacing any `[Pending Administrative Confirmation]` placeholder.
 * 4. Add common student phrasings in `questionVariants` and key terms in `keywords`.
 */

export const CHATBOT_WELCOME_MESSAGE: string[] = [
  "Hello! How can I help you today? Welcome to CHC Campus Guide—your interactive companion for Capitol Hill College in Teku, Kathmandu.",
  'Ask me anything in your own words about our NEB (+2 Management, +2 Humanities, +2 Science, +2 Law) and Tribhuvan University (BBS & MBS) programs, our Teku location on Google Maps, admissions, or campus life!',
];

export const CHATBOT_INITIAL_SUGGESTIONS: string[] = [
  'Where is Capitol Hill College located?',
  'What programs does the college offer?',
  'How can I apply for admission?',
  'What subject combinations are in +2?',
  'Is college life all books, or do students have fun?',
  'Can I top exams without studying on the first bench?',
];

export const CHATBOT_FALLBACK_MESSAGE =
  "I couldn't find a confirmed detail for that specific query yet. Feel free to call our Teku campus desk at 01-5312399, and our team will gladly help you out!";

export const CHATBOT_CATEGORIES: ChatbotCategoryMeta[] = [
  {
    id: ChatbotCategoryId.GENERAL,
    label: 'General & Location',
    shortLabel: 'General',
  },
  {
    id: ChatbotCategoryId.PROGRAMS,
    label: 'Academic Programs',
    shortLabel: 'Programs',
  },
  {
    id: ChatbotCategoryId.ADMISSIONS,
    label: 'Admission & Enrollment',
    shortLabel: 'Admissions',
  },
  {
    id: ChatbotCategoryId.FEES,
    label: 'Fees & Scholarships',
    shortLabel: 'Fees & Aid',
  },
  {
    id: ChatbotCategoryId.FACILITIES,
    label: 'Facilities & Student Life',
    shortLabel: 'Facilities',
  },
  {
    id: ChatbotCategoryId.CONTACT,
    label: 'Contact & Support',
    shortLabel: 'Contact',
  },
  {
    id: ChatbotCategoryId.BANTER,
    label: 'Fun Questions & Campus Banter',
    shortLabel: 'Fun & Chat',
  },
];

export const CHATBOT_FAQ_DATABASE: ChatbotFaqItem[] = [
  /* ======================================================================== */
  /* A. GENERAL COLLEGE INFORMATION                                           */
  /* ======================================================================== */
  {
    id: 'gen-what-is-chc',
    category: ChatbotCategoryId.GENERAL,
    categoryLabel: 'General Information',
    question: 'What is Capitol Hill College?',
    questionVariants: [
      'tell me about capitol hill college',
      'about capitol hill college',
      'overview of the college',
      'introduce capitol hill college',
      'who founded capitol hill college',
      'college introduction',
    ],
    keywords: ['introduction', 'overview', 'history', 'founded', 'institution', 'motto'],
    answer: [
      'CAPITOL HILL COLLEGE (...Shaping Futures Since 2005...), located in Teku, Kathmandu, Nepal, is an academic institution founded by experienced academicians and dedicated to providing quality, practical education.',
      'Guided by its institutional vision—"Inspiring Minds. Shaping Futures." (Quality Education • Practical Skills • Global Opportunities)—the college offers Higher Secondary (+2), undergraduate (BBS), and postgraduate (MBS) programs affiliated with NEB and Tribhuvan University.',
    ],
    relatedIds: [
      'gen-affiliations',
      'prog-available-programs',
      'gen-location',
    ],
    primaryAction: {
      label: 'Explore Academic Programs',
      action: 'open-programs',
    },
  },
  {
    id: 'gen-location',
    category: ChatbotCategoryId.GENERAL,
    categoryLabel: 'Campus Location',
    question: 'Where is Capitol Hill College located?',
    questionVariants: [
      'where is the college located',
      'where is your college',
      'where is chc located',
      'what is the location of capitol hill',
      'can you share the college location',
      'can you tell me your address',
      'college address',
      'campus location',
      'where are you situated',
      'how can i reach the college',
      'how to reach capitol hill college',
      'directions to college',
      'exact location in kathmandu',
      'how do i get to teku campus',
      'google maps location',
    ],
    keywords: [
      'where',
      'location',
      'located',
      'address',
      'teku',
      'kathmandu',
      'situated',
      'map',
      'maps',
      'direction',
      'directions',
      'place',
    ],
    answer: [
      'Capitol Hill College is located in Teku, Kathmandu, Nepal. You can find our exact location and directions on Google Maps using the link below.',
      OFFICIAL_GOOGLE_MAPS_URL,
    ],
    relatedIds: [
      'adm-visit-before-applying',
      'gen-contact',
      'prog-available-programs',
    ],
    primaryAction: {
      label: 'View on Google Maps',
      action: 'external-link',
      externalHref: OFFICIAL_GOOGLE_MAPS_URL,
    },
  },
  {
    id: 'gen-teku-commute',
    category: ChatbotCategoryId.GENERAL,
    categoryLabel: 'Campus Location',
    question: 'How can I find directions or commute to the Teku campus?',
    questionVariants: [
      'how to commute to teku campus',
      'public transport to capitol hill college',
      'how can i reach capitol hill college',
      'bus route to teku college',
    ],
    keywords: ['commute', 'teku', 'reachable', 'accessible'],
    answer: [
      'Capitol Hill College is located in Teku, Kathmandu, Nepal. You can find our exact location and directions on Google Maps using the link below.',
      OFFICIAL_GOOGLE_MAPS_URL,
      'If you are inquiring about college transport arrangements, please call our front desk at 01-5312399 to confirm current session details.',
    ],
    relatedIds: [
      'gen-location',
      'adm-visit-before-applying',
      'gen-contact',
    ],
    primaryAction: {
      label: 'View on Google Maps',
      action: 'external-link',
      externalHref: OFFICIAL_GOOGLE_MAPS_URL,
    },
  },
  {
    id: 'gen-contact',
    category: ChatbotCategoryId.GENERAL,
    categoryLabel: 'General Information',
    question: 'How can I contact the college?',
    questionVariants: [
      'college phone number',
      'college email address',
      'contact number of capitol hill college',
      'how do i call the college',
      'official telephone and email',
    ],
    keywords: ['contact', 'phone', 'telephone', 'call', 'email', 'mail', 'number'],
    answer: [
      'You can reach Capitol Hill College through our official channels:',
      '• Location: Teku, Kathmandu, Nepal\n• Telephone: 01-5312399\n• Email: info.capitolhillcollege@gmail.com',
      'You can also submit an admission or academic enquiry directly through our Contact & Admission Enquiry page using the "Apply for Admission" button.',
    ],
    relatedIds: [
      'sup-submit-enquiry',
      'sup-schedule-visit',
      'gen-location',
    ],
    primaryAction: {
      label: 'Contact & Admission Enquiry',
      action: 'scroll-contact',
    },
  },
  {
    id: 'gen-what-makes-different',
    category: ChatbotCategoryId.GENERAL,
    categoryLabel: 'General Information',
    question: 'What makes Capitol Hill College different?',
    questionVariants: [
      'why choose capitol hill college',
      'why study at capitol hill',
      'what is special about capitol hill college',
      'strengths of the college',
      'why join this college',
    ],
    keywords: ['different', 'special', 'why choose', 'strengths', 'unique', 'advantage', 'stand out'],
    answer: [
      'Capitol Hill College combines experienced academic leadership with a disciplined, student-centered environment in Teku, Kathmandu.',
      'Key strengths include dedicated faculty across 15 academic departments, separate subject-specific laboratories (Physics, Chemistry, Biology, Computer Science, and Hotel Management), a well-stocked library, and regular co-curricular programs such as debates, inter-class quizzes, sports tournaments, and educational tours.',
    ],
    relatedIds: [
      'gen-educational-approach',
      'fac-overview',
      'gen-leadership-team',
    ],
    primaryAction: {
      label: 'Meet Our Faculty & Team',
      action: 'open-team',
    },
  },
  {
    id: 'gen-affiliations',
    category: ChatbotCategoryId.GENERAL,
    categoryLabel: 'General Information',
    question: 'What educational boards or universities is the college affiliated with?',
    questionVariants: [
      'college affiliation',
      'which board is +2 affiliated with',
      'which university is bbs affiliated with',
      'is capitol hill affiliated with tu and neb',
      'neb and tribhuvan university affiliation',
    ],
    keywords: ['affiliated', 'affiliation', 'board', 'university', 'neb', 'tu', 'tribhuvan', 'recognized'],
    answer: [
      'Capitol Hill College programs operate under recognized national academic boards and universities in Nepal:',
      '• NEB (+2) Programs: +2 Management, +2 Humanities, +2 Science, and +2 Law — affiliated with the National Examinations Board (NEB).\n• University Degrees: Bachelor of Business Studies (BBS, 4 Years) and Master of Business Studies (MBS, 2 Years) — affiliated with Tribhuvan University (TU).',
    ],
    relatedIds: [
      'prog-available-programs',
      'prog-bbs',
      'prog-plus2-science',
    ],
    primaryAction: {
      label: 'Explore Academic Programs',
      action: 'open-programs',
    },
  },
  {
    id: 'gen-educational-approach',
    category: ChatbotCategoryId.GENERAL,
    categoryLabel: 'General Information',
    question: "What is the college's educational approach?",
    questionVariants: [
      'teaching methodology',
      'how does the college teach',
      'academic philosophy',
      'teaching approach at capitol hill',
      'pedagogy and practical learning',
    ],
    keywords: ['approach', 'methodology', 'philosophy', 'teaching', 'pedagogy', 'practical', 'holistic', 'discipline'],
    answer: [
      'Capitol Hill College emphasizes balanced academic rigor, practical inquiry, and personal discipline. Classroom instruction uses audio-visual teaching aids and interactive discussion alongside supervised laboratory practicals and research reading.',
      'Beyond coursework, the college fosters communication, teamwork, and confidence through extracurricular and co-curricular activities (ECA & CCA), academic quizzes, educational tours, and campus sports.',
    ],
    relatedIds: [
      'fac-learning-environment',
      'fac-eca',
      'fac-overview',
    ],
    primaryAction: {
      label: 'Explore Campus Facilities',
      action: 'open-facilities',
    },
  },
  {
    id: 'gen-leadership-team',
    category: ChatbotCategoryId.GENERAL,
    categoryLabel: 'Leadership & Governance',
    question: 'Who are the Chairman, CEO & Director, and Principal of Capitol Hill College?',
    questionVariants: [
      'who is the principal',
      'who is the chairman',
      'who is the ceo',
      'who is pawan bista',
      'who is nischal gautam',
      'who is sagar raj khanal',
      'board of directors and governance',
      'leadership and governance',
      'college leadership',
    ],
    keywords: [
      'principal',
      'chairman',
      'ceo',
      'pawan bista',
      'nischal gautam',
      'governance',
      'director',
      'board',
      'faculty',
      'teachers',
      'sagar raj',
      'khanal',
    ],
    answer: [
      'Capitol Hill College is guided by accountable institutional governance and experienced academic administration:',
      '• Chairman: Mr. Pawan Bista (Honorary Doctorate – Lincoln University, California, USA)\n• CEO & Director: Mr. Nischal Gautam (MBA Finance – Pokhara University Topper)\n• Principal: Mr. Sagar Raj Khanal',
      'Our academic delivery is supported by 45 faculty listings across 15 departments alongside dedicated administrative staff at our Teku, Kathmandu campus.',
    ],
    relatedIds: [
      'gen-advisory-committee',
      'gen-what-makes-different',
      'prog-available-programs',
    ],
    primaryAction: {
      label: 'Leadership & Governance',
      action: 'open-leadership',
    },
  },
  {
    id: 'gen-advisory-committee',
    category: ChatbotCategoryId.GENERAL,
    categoryLabel: 'Advisory Committee',
    question: 'Does Capitol Hill College have an Advisory Committee?',
    questionVariants: [
      'advisory committee of capitol hill college',
      'who is on the advisory committee',
      'advisory board members',
      'academic advisory committee',
      'institutional advisors',
    ],
    keywords: [
      'advisory',
      'committee',
      'advisors',
      'advisory board',
      'consultative',
    ],
    answer: [
      'Yes. CAPITOL HILL COLLEGE maintains a dedicated Advisory Committee page outlining the consultative mandate that supports academic quality assurance, curriculum relevance across NEB (+2) and Tribhuvan University (BBS & MBS) programs, student career readiness, and community engagement.',
      'Individual Advisory Committee member profiles and appointments are published on the Advisory Committee page following formal institutional verification by the Board of Directors and Office of the Principal.',
    ],
    relatedIds: [
      'gen-leadership-team',
      'gen-what-makes-different',
      'gen-contact',
    ],
    primaryAction: {
      label: 'View Advisory Committee',
      action: 'open-advisory',
    },
  },

  /* ======================================================================== */
  /* B. ACADEMIC PROGRAMS                                                     */
  /* ======================================================================== */
  {
    id: 'prog-available-programs',
    category: ChatbotCategoryId.PROGRAMS,
    categoryLabel: 'Academic Programs',
    question: 'What programs are available at the college?',
    questionVariants: [
      'what programs does the college offer',
      'which courses are offered',
      'list of academic programs',
      'streams and degrees available',
      'what can i study at capitol hill college',
      'courses available',
    ],
    keywords: ['programs', 'courses', 'streams', 'degrees', 'study', 'academic offerings', 'subjects'],
    answer: [
      'Capitol Hill College offers six official academic programs across Higher Secondary (+2), Undergraduate, and Postgraduate levels:',
      '• NEB (+2) Programs: +2 Management, +2 Humanities, +2 Science, and +2 Law\n• Tribhuvan University Programs: Bachelor of Business Studies (BBS — 4 Years) and Master of Business Studies (MBS — 2 Years)',
    ],
    relatedIds: [
      'prog-plus2-management',
      'prog-plus2-science',
      'prog-bbs',
    ],
    primaryAction: {
      label: 'Explore Academic Programs',
      action: 'open-programs',
    },
  },
  {
    id: 'prog-plus2-science',
    category: ChatbotCategoryId.PROGRAMS,
    categoryLabel: 'Academic Programs',
    question: 'Does the college offer +2 Science?',
    questionVariants: [
      'tell me about +2 science',
      'grade 11 and 12 science stream',
      'plus two science subjects',
      'is +2 science available',
      '10+2 science at capitol hill',
    ],
    keywords: ['plustwo science', 'science stream', 'physics', 'chemistry', 'biology', 'grade 11 science', 'neb science'],
    answer: [
      'Yes. Capitol Hill College offers the Higher Secondary +2 Science program affiliated with the National Examinations Board (NEB).',
      'The curriculum builds a strong foundation in Physics, Chemistry, Mathematics, and Biology or Computer Science, supported by separate, faculty-supervised Physics, Chemistry, Biology, and Computer laboratories.',
    ],
    relatedIds: [
      'prog-after-science',
      'prog-diff-science-mgmt',
      'adm-how-to-apply',
    ],
    primaryAction: {
      label: 'View +2 Science Page',
      action: 'open-program-detail',
      programSlug: 'science',
    },
  },
  {
    id: 'prog-plus2-management',
    category: ChatbotCategoryId.PROGRAMS,
    categoryLabel: 'Academic Programs',
    question: 'Does the college offer +2 Management?',
    questionVariants: [
      'tell me about +2 management',
      'grade 11 and 12 management stream',
      'plus two management subjects',
      'is +2 management available',
      '10+2 management commerce',
    ],
    keywords: ['plustwo management', 'management stream', 'commerce', 'accounting', 'business studies', 'hotel management'],
    answer: [
      'Yes. Capitol Hill College offers the Higher Secondary +2 Management program under NEB affiliation.',
      'It covers Accounting, Business Studies, Computer Science, Hotel Management, Business Mathematics, and Tourism & Mountaineering—supported by dedicated Computer Science and Hotel Management practical labs.',
    ],
    relatedIds: [
      'prog-after-management',
      'prog-diff-science-mgmt',
      'adm-how-to-apply',
    ],
    primaryAction: {
      label: 'View +2 Management Page',
      action: 'open-program-detail',
      programSlug: 'management',
    },
  },
  {
    id: 'prog-plus2-humanities',
    category: ChatbotCategoryId.PROGRAMS,
    categoryLabel: 'Academic Programs',
    question: 'Does the college offer +2 Humanities?',
    questionVariants: [
      'tell me about +2 humanities',
      'grade 11 and 12 humanities stream',
      'plus two humanities subjects',
      'is +2 humanities available',
    ],
    keywords: ['plustwo humanities', 'humanities stream', 'humanities', 'sociology', 'mass communication', 'population studies', 'optional english'],
    answer: [
      'Yes. Capitol Hill College offers the NEB-affiliated +2 Humanities program for Grade 11 and Grade 12 students.',
      'Stream subjects include Sociology, Mass Communication, Population Studies, Optional English, and Tourism & Mountaineering Studies—developing critical thinking, media literacy, and social inquiry skills.',
    ],
    relatedIds: [
      'prog-available-programs',
      'prog-plus2-law',
      'adm-how-to-apply',
    ],
    primaryAction: {
      label: 'View +2 Humanities Page',
      action: 'open-program-detail',
      programSlug: 'humanities',
    },
  },
  {
    id: 'prog-plus2-law',
    category: ChatbotCategoryId.PROGRAMS,
    categoryLabel: 'Academic Programs',
    question: 'Does the college offer +2 Law?',
    questionVariants: [
      'tell me about +2 law',
      'grade 11 and 12 law stream',
      'plus two law subjects',
      'is +2 law available',
    ],
    keywords: ['plustwo law', 'law stream', 'constitutional law', 'civil law', 'procedural law', 'legal drafting'],
    answer: [
      'Yes. Capitol Hill College offers the NEB-affiliated +2 Law program for Grade 11 and Grade 12 students.',
      'Major legal subjects include Constitutional Law, Civil Law and Justice, Procedural Law, and Legal Drafting—building a strong foundation for five-year B.A. LL.B. degrees, legal practice, and public service.',
    ],
    relatedIds: [
      'prog-available-programs',
      'prog-plus2-humanities',
      'adm-how-to-apply',
    ],
    primaryAction: {
      label: 'View +2 Law Page',
      action: 'open-program-detail',
      programSlug: 'law',
    },
  },
  {
    id: 'prog-bbs',
    category: ChatbotCategoryId.PROGRAMS,
    categoryLabel: 'Academic Programs',
    question: 'Does the college offer BBS?',
    questionVariants: [
      'bachelor of business studies',
      'tell me about bbs program',
      'tu bbs course',
      'is undergraduate bbs available',
      'four year bbs degree',
    ],
    keywords: ['bbs', 'bachelor', 'business studies', 'undergraduate', 'four year', 'tu bbs'],
    answer: [
      'Yes. Capitol Hill College offers the four-year Bachelor of Business Studies (BBS) undergraduate program affiliated with Tribhuvan University (TU).',
      'The BBS program covers Accounting, Finance, Marketing, Business Management, Human Resource Management, Business Mathematics & Statistics, Business Economics, and Business Communication.',
    ],
    relatedIds: [
      'prog-after-bbs',
      'prog-mbs',
      'adm-how-to-apply',
    ],
    primaryAction: {
      label: 'View BBS Program Page',
      action: 'open-program-detail',
      programSlug: 'bbs',
    },
  },
  {
    id: 'prog-mbs',
    category: ChatbotCategoryId.PROGRAMS,
    categoryLabel: 'Academic Programs',
    question: 'Does the college offer MBS (Master of Business Studies)?',
    questionVariants: [
      'master of business studies',
      'tell me about mbs program',
      'tu mbs course',
      'postgraduate masters program at capitol hill',
      'two year mbs degree',
    ],
    keywords: ['mbs', 'masters', 'postgraduate', 'master of business studies', 'tu mbs', 'strategic management'],
    answer: [
      'Yes. Capitol Hill College offers the two-year Master of Business Studies (MBS) postgraduate program affiliated with Tribhuvan University (TU).',
      'Key subject areas include Managerial Economics, Financial Management, Marketing Management, Human Resource Management, Strategic Management, Research Methodology, International Business, and Organizational Behavior.',
    ],
    relatedIds: [
      'prog-bbs',
      'prog-available-programs',
      'adm-how-to-apply',
    ],
    primaryAction: {
      label: 'View MBS Program Page',
      action: 'open-program-detail',
      programSlug: 'mbs',
    },
  },
  {
    id: 'prog-diff-science-mgmt',
    category: ChatbotCategoryId.PROGRAMS,
    categoryLabel: 'Academic Programs',
    question: 'What is the difference between Science and Management?',
    questionVariants: [
      'science vs management',
      'which stream should i choose science or management',
      'compare +2 science and +2 management',
      'difference between +2 science and management',
    ],
    keywords: ['difference', 'compare', 'versus', 'vs', 'choose between', 'science and management', 'science or management'],
    answer: [
      '+2 Science focuses on empirical sciences and quantitative analysis—covering Physics, Chemistry, Biology, Mathematics, and Computer Science with intensive laboratory practicals. It is ideal for students aiming for medicine, engineering, IT, or pure sciences.',
      '+2 Management focuses on commerce, financial literacy, and organizational operations—covering Accounting, Economics, Business Studies, and Computer/Hospitality electives. It is tailored for students interested in business leadership, banking, accounting, entrepreneurship, or hospitality.',
      'Students from +2 Science can later transition into either science/technical or management bachelor’s degrees, whereas +2 Management leads primarily into business, IT/management, humanities, or law pathways.',
    ],
    relatedIds: [
      'prog-after-science',
      'prog-after-management',
      'adm-speak-counsellor',
    ],
    primaryAction: {
      label: 'Request Academic Counseling',
      action: 'open-enquiry',
    },
  },
  {
    id: 'prog-after-science',
    category: ChatbotCategoryId.PROGRAMS,
    categoryLabel: 'Academic Programs',
    question: 'What can I study after completing +2 Science?',
    questionVariants: [
      'career options after +2 science',
      'scope after +2 science',
      'what bachelor courses after 12th science',
      'future pathways after plus two science',
    ],
    keywords: ['after plustwo science', 'after science', 'after completing plustwo science', 'scope of science', 'bachelor after science', 'career science'],
    answer: [
      'Completing +2 Science opens a wide range of undergraduate pathways in Nepal and abroad:',
      '• Medical & Allied Health: MBBS, BDS, BSc Nursing, Pharmacy, Public Health, Medical Lab Technology (for Biology group).\n• Engineering & Architecture: Civil, Computer, Electrical, Mechanical Engineering, B.Arch (with Mathematics).\n• Computing & Sciences: BSc CSIT, BIT, BCA, BSc in Physics, Chemistry, Biology, Agriculture, or Forestry.\n• Management & Other Fields: BBS, BBA, Chartered Accountancy (CA), Law (BALLB), or Aviation.',
    ],
    relatedIds: [
      'prog-plus2-science',
      'prog-diff-science-mgmt',
      'adm-how-to-apply',
    ],
  },
  {
    id: 'prog-after-management',
    category: ChatbotCategoryId.PROGRAMS,
    categoryLabel: 'Academic Programs',
    question: 'What can I study after completing +2 Management?',
    questionVariants: [
      'career options after +2 management',
      'scope after +2 management',
      'what bachelor courses after 12th management',
      'what to do after plus two management',
    ],
    keywords: ['after plustwo management', 'after management', 'after completing plustwo management', 'scope of management', 'bachelor after management'],
    answer: [
      'Graduates of +2 Management can pursue diverse undergraduate degrees in business, finance, computing, and hospitality, including:',
      '• Business & Finance: Bachelor of Business Studies (BBS — offered right here at Capitol Hill College), BBA, BBM, BPA, or Chartered Accountancy (CA / ACCA).\n• Computing & Information Systems: BIM, BCA, or BIT (subject to university mathematics/computer prerequisites).\n• Hospitality, Law & Social Sciences: BHM (Hotel Management), BTTM (Travel & Tourism), BALLB, Economics, or Mass Communication.',
    ],
    relatedIds: [
      'prog-bbs',
      'prog-plus2-management',
      'adm-how-to-apply',
    ],
    primaryAction: {
      label: 'Explore Our BBS Program',
      action: 'scroll-programs',
    },
  },
  {
    id: 'prog-after-bbs',
    category: ChatbotCategoryId.PROGRAMS,
    categoryLabel: 'Academic Programs',
    question: 'What can I do after completing BBS?',
    questionVariants: [
      'career opportunities after bbs',
      'scope after bbs',
      'jobs and masters after bbs',
      'what can i study after bbs',
    ],
    keywords: ['after bbs', 'after completing bbs', 'scope of bbs', 'career after bbs', 'jobs after bbs', 'mbs', 'mba'],
    answer: [
      'After earning a four-year Tribhuvan University BBS degree, graduates can pursue both postgraduate education and professional careers:',
      '• Postgraduate Studies: Master of Business Studies (MBS), MBA, MBM, MPA, or professional qualifications such as CA / ACCA.\n• Career Pathways: Commercial banking and financial institutions, accounting, tax and auditing firms, corporate management, entrepreneurship, NGOs/INGOs, and Nepal civil service (Lok Sewa) officer-level positions.',
    ],
    relatedIds: [
      'prog-bbs',
      'adm-how-to-apply',
      'adm-speak-counsellor',
    ],
  },

  /* ======================================================================== */
  /* C. ADMISSION AND ENROLLMENT                                              */
  /* ======================================================================== */
  {
    id: 'adm-how-to-apply',
    category: ChatbotCategoryId.ADMISSIONS,
    categoryLabel: 'Admission & Enrollment',
    question: 'How can I apply for admission?',
    questionVariants: [
      'admission process',
      'how do i enroll',
      'steps to apply at capitol hill college',
      'how to join capitol hill college',
      'online admission form',
    ],
    keywords: ['apply', 'application', 'enroll', 'enrollment', 'admission process', 'join', 'register'],
    answer: [
      'You can begin your admission process at CAPITOL HILL COLLEGE in two convenient ways:',
      '1. Online Admission Enquiry: Click "Apply for Admission" on our website to open the Contact & Admission Enquiry page, select your program of interest, and send your details directly to our admissions desk (no sign-in required).\n2. Campus Visit: Visit the Admissions Desk at our Teku, Kathmandu campus (Sunday through Friday during regular college hours) to meet an academic counselor, review stream options, and submit your application form.',
      'For immediate assistance, call 01-5312399 or email info.capitolhillcollege@gmail.com.',
    ],
    relatedIds: [
      'adm-requirements',
      'adm-documents',
      'adm-when-open',
    ],
    primaryAction: {
      label: 'Open Contact & Enquiry Page',
      action: 'open-enquiry',
    },
  },
  {
    id: 'adm-requirements',
    category: ChatbotCategoryId.ADMISSIONS,
    categoryLabel: 'Admission & Enrollment',
    question: 'What are the admission requirements?',
    questionVariants: [
      'what are the eligibility requirements',
      'eligibility criteria for admission',
      'minimum gpa required for +2 science management bbs',
      'entrance exam requirement',
      'who is eligible to apply',
    ],
    keywords: ['eligibility', 'requirements', 'criteria', 'minimum gpa', 'grade required', 'entrance', 'qualify', 'eligible'],
    answer: [
      'Applicants must have successfully completed the prerequisite board level from a recognized board or university:',
      '• For +2 Science & +2 Management: Completion of SEE (Secondary Education Examination) or equivalent recognized board examination, meeting National Examinations Board (NEB) stream prerequisites.\n• For BBS: Completion of 10+2 (NEB) or equivalent intermediate/higher secondary qualification recognized by Tribhuvan University (TU).',
    ],
    verificationNote:
      'Current-session GPA cutoffs, subject-wise grade prerequisites, and entrance evaluation details are confirmed directly by the Capitol Hill College Admissions Office (01-5312399).',
    relatedIds: [
      'adm-documents',
      'adm-how-to-apply',
      'adm-speak-counsellor',
    ],
    primaryAction: {
      label: 'Ask Admissions About Eligibility',
      action: 'open-enquiry',
    },
  },
  {
    id: 'adm-documents',
    category: ChatbotCategoryId.ADMISSIONS,
    categoryLabel: 'Admission & Enrollment',
    question: 'What documents are required for admission?',
    questionVariants: [
      'documents needed to apply',
      'what papers should i bring for admission',
      'required certificates for +2 and bbs admission',
      'admission checklist',
    ],
    keywords: ['documents', 'certificates', 'transcript', 'marksheet', 'photos', 'character certificate', 'checklist', 'papers'],
    answer: [
      'When applying for +2 or BBS admission at Capitol Hill College, applicants should bring:',
      '• Copies of academic transcripts / grade sheets from their previous institution (SEE for +2; SEE & +2 transcripts for BBS)\n• Character certificate (and transfer/migration certificate where applicable)\n• Recent passport-sized photographs\n• A completed Capitol Hill College application form',
      'Any additional stream-specific or university registration documents are confirmed during academic counseling.',
    ],
    relatedIds: [
      'adm-requirements',
      'adm-how-to-apply',
      'adm-visit-before-applying',
    ],
  },
  {
    id: 'adm-when-open',
    category: ChatbotCategoryId.ADMISSIONS,
    categoryLabel: 'Admission & Enrollment',
    question: 'When does admission open?',
    questionVariants: [
      'admission dates and deadlines',
      'is admission open right now',
      'intake schedule',
      'last date to apply for admission',
      'when do classes start',
    ],
    keywords: ['when', 'deadline', 'intake', 'dates', 'admission open', 'last date', 'session start'],
    answer: [
      '+2 admissions generally follow the National Examinations Board (NEB) post-SEE academic calendar, while BBS admissions follow Tribhuvan University’s annual admission schedule.',
      'All official intake announcements and application deadlines are posted on our Notices & Announcements bulletin board.',
    ],
    verificationNote:
      'Specific opening and closing dates for the current intake are published on the Notices page and confirmed by college administration at 01-5312399.',
    relatedIds: [
      'adm-how-to-apply',
      'gen-notices-results',
      'adm-speak-counsellor',
    ],
    primaryAction: {
      label: 'Check Official Notices',
      action: 'open-notices',
    },
  },
  {
    id: 'adm-visit-before-applying',
    category: ChatbotCategoryId.ADMISSIONS,
    categoryLabel: 'Admission & Enrollment',
    question: 'Can I visit the college before applying?',
    questionVariants: [
      'can parents visit the campus',
      'campus tour before admission',
      'walk in visit for admission',
      'can i see classrooms and labs before joining',
    ],
    keywords: ['visit before', 'tour', 'walk in', 'see campus', 'parents visit', 'inspect'],
    answer: [
      'Yes, prospective students and guardians are warmly encouraged to visit our Teku, Kathmandu campus before applying.',
      'During your visit (Sunday through Friday during regular college hours), you can tour the classrooms, library, and laboratories and speak directly with academic counselors. Calling 01-5312399 ahead of your visit helps ensure an advisor is ready to assist you.',
    ],
    relatedIds: [
      'sup-schedule-visit',
      'gen-location',
      'adm-speak-counsellor',
    ],
    primaryAction: {
      label: 'View Campus Facilities',
      action: 'open-facilities',
    },
  },
  {
    id: 'adm-speak-counsellor',
    category: ChatbotCategoryId.ADMISSIONS,
    categoryLabel: 'Admission & Enrollment',
    question: 'How can I speak with an admission counsellor?',
    questionVariants: [
      'talk to academic advisor',
      'admission counseling',
      'guidance for choosing stream',
      'speak to admission officer',
    ],
    keywords: ['counselor', 'counsellor', 'advisor', 'counseling', 'counselling', 'guidance', 'speak with', 'talk to'],
    answer: [
      'You can connect with an admission counselor in three ways:',
      '• By Phone: Call the campus office at 01-5312399 during working hours (Sunday–Friday).\n• In Person: Visit the Admissions Desk at our Teku, Kathmandu campus.\n• Online: Submit your questions through our Contact & Admission Enquiry page ("Apply for Admission") or email info.capitolhillcollege@gmail.com directly.',
    ],
    relatedIds: [
      'adm-how-to-apply',
      'prog-diff-science-mgmt',
      'sup-admission-assistance',
    ],
    primaryAction: {
      label: 'Submit Counseling Enquiry',
      action: 'open-enquiry',
    },
  },

  /* ======================================================================== */
  /* D. FEES AND SCHOLARSHIPS                                                 */
  /* ======================================================================== */
  {
    id: 'fee-college-fees',
    category: ChatbotCategoryId.FEES,
    categoryLabel: 'Fees & Scholarships',
    question: 'What are the college fees?',
    questionVariants: [
      'tuition fee for +2 science management bbs',
      'how much does it cost to study',
      'monthly fee and admission fee',
      'total cost of bbs and +2',
      'price of admission',
    ],
    keywords: ['fees', 'fee', 'tuition', 'cost', 'charges', 'monthly fee', 'admission fee', 'price', 'total cost'],
    answer: [
      'Fee structures at Capitol Hill College vary by academic program (+2 Science, +2 Management, and BBS) and laboratory components.',
      'To ensure prospective families receive accurate current-session figures rather than outdated schedules, official admission fees, tuition, and annual charges are provided directly by the Admissions & Accounts Desk at 01-5312399 or upon submitting an online enquiry.',
    ],
    verificationNote:
      'Official tuition and fee figures must be confirmed directly with Capitol Hill College Administration.',
    relatedIds: [
      'fee-learn-structure',
      'fee-scholarships',
      'fee-installments',
    ],
    primaryAction: {
      label: 'Request Official Fee Details',
      action: 'open-enquiry',
    },
  },
  {
    id: 'fee-scholarships',
    category: ChatbotCategoryId.FEES,
    categoryLabel: 'Fees & Scholarships',
    question: 'Are scholarships available?',
    questionVariants: [
      'merit scholarship',
      'do you provide scholarships for +2 or bbs',
      'gpa based scholarship',
      'scholarship opportunities',
    ],
    keywords: ['scholarship', 'scholarships', 'merit', 'stipend', 'waiver', 'topper'],
    answer: [
      'Capitol Hill College announces merit-based scholarship opportunities during admission cycles through its official notices.',
      'Eligibility GPA tiers, entrance scholarship quotas, and fee waiver percentages are set per academic session by the Scholarship & Admissions Committee. Please check active Admission Notices or call 01-5312399 for current scholarship details.',
    ],
    verificationNote:
      'Scholarship percentages, quotas, and deadlines are subject to official confirmation by the Scholarship & Admissions Committee.',
    relatedIds: [
      'fee-discounts-aid',
      'fee-college-fees',
      'adm-when-open',
    ],
    primaryAction: {
      label: 'Enquire About Scholarships',
      action: 'open-enquiry',
    },
  },
  {
    id: 'fee-discounts-aid',
    category: ChatbotCategoryId.FEES,
    categoryLabel: 'Fees & Scholarships',
    question: 'Are there any discounts or financial assistance options?',
    questionVariants: [
      'financial aid',
      'fee concession',
      'need based scholarship or discount',
      'fee waiver for deserving students',
    ],
    keywords: ['discount', 'discounts', 'financial assistance', 'financial aid', 'concession', 'need based', 'support'],
    answer: [
      'Need-based concessions, special category discounts, and financial support provisions are reviewed directly by Capitol Hill College administration.',
      'Prospective students and guardians are encouraged to visit the Teku campus office or call 01-5312399 to discuss available financial assistance options confidentially with an admissions counselor.',
    ],
    verificationNote:
      'Discount and financial assistance eligibility rules require direct confirmation from college management.',
    relatedIds: [
      'fee-scholarships',
      'fee-installments',
      'adm-speak-counsellor',
    ],
    primaryAction: {
      label: 'Contact Admissions Office',
      action: 'scroll-contact',
    },
  },
  {
    id: 'fee-learn-structure',
    category: ChatbotCategoryId.FEES,
    categoryLabel: 'Fees & Scholarships',
    question: 'How can I learn about the fee structure?',
    questionVariants: [
      'where can i get the fee breakdown',
      'how to get fee details for my course',
      'fee structure brochure',
    ],
    keywords: ['fee structure', 'breakdown', 'fee details', 'fee sheet', 'learn about fee'],
    answer: [
      'To obtain the accurate, up-to-date fee breakdown for your chosen program (+2 Science, +2 Management, or BBS):',
      '1. Submit an online enquiry via the "Apply for Admission" button selecting your program of interest.\n2. Call our Teku campus office at 01-5312399.\n3. Email info.capitolhillcollege@gmail.com or visit the Admissions Desk in person from Sunday to Friday.',
    ],
    relatedIds: [
      'fee-college-fees',
      'fee-installments',
      'fee-scholarships',
    ],
    primaryAction: {
      label: 'Request Program Fee Sheet',
      action: 'open-enquiry',
    },
  },
  {
    id: 'fee-installments',
    category: ChatbotCategoryId.FEES,
    categoryLabel: 'Fees & Scholarships',
    question: 'Can I pay fees in installments?',
    questionVariants: [
      'installment payment plan',
      'can fees be paid term wise or monthly',
      'payment schedule for tuition',
      'flexible fee payment',
    ],
    keywords: ['installment', 'installments', 'instalment', 'payment plan', 'pay monthly', 'term wise', 'part payment'],
    answer: [
      'Payment schedules (monthly, terminal, or approved installment plans) and due dates are coordinated directly by the Capitol Hill College Accounts Office.',
      'Please call 01-5312399 or consult the Accounts & Admissions Desk during your campus visit to confirm approved payment schedules for your program.',
    ],
    verificationNote:
      'Installment terms and payment schedules must be confirmed with the Accounts Office.',
    relatedIds: [
      'fee-college-fees',
      'fee-learn-structure',
      'sup-contact-admin',
    ],
  },

  /* ======================================================================== */
  /* E. FACILITIES AND STUDENT LIFE                                           */
  /* ======================================================================== */
  {
    id: 'fac-overview',
    category: ChatbotCategoryId.FACILITIES,
    categoryLabel: 'Facilities & Student Life',
    question: 'What facilities does the college provide?',
    questionVariants: [
      'what facilities are available',
      'campus facilities and services',
      'infrastructure and amenities at capitol hill',
      'what resources do students get',
    ],
    keywords: ['facilities', 'amenities', 'services', 'infrastructure', 'campus resources', 'available facilities'],
    answer: [
      'Capitol Hill College provides six core campus facility pillars at its Teku, Kathmandu campus:',
      '1. Infrastructure: Spacious, well-lit classrooms with multimedia audio-visual teaching technology.\n2. Library: Course textbooks, reference books, journals, quiet reading spaces, and internet research access.\n3. Laboratories: Separate Physics, Chemistry, Biology, Computer Science, and Hotel Management laboratories.\n4. ECA & CCA: Debates, academic quizzes, cultural programs, and student-led events.\n5. Cafeteria: Hygienic, self-service campus dining at student-friendly prices.\n6. Sports: Football, Basketball, Volleyball, and Track & Field activities.',
    ],
    relatedIds: [
      'fac-library',
      'fac-computer-labs',
      'fac-sports',
    ],
    primaryAction: {
      label: 'Explore Facilities Page',
      action: 'open-facilities',
    },
  },
  {
    id: 'fac-library',
    category: ChatbotCategoryId.FACILITIES,
    categoryLabel: 'Facilities & Student Life',
    question: 'Does the college have a library?',
    questionVariants: [
      'library facilities and books',
      'reading room and study space',
      'library opening hours',
      'does library have internet',
    ],
    keywords: ['library', 'books', 'reading room', 'journals', 'textbooks', 'study space', 'periodicals'],
    answer: [
      'Yes. Capitol Hill College maintains a dedicated library stocked with course textbooks, reference volumes, academic journals, periodicals, and general literature.',
      'It offers quiet individual and group reading tables along with internet access for academic research.',
    ],
    verificationNote:
      'Published campus records list library hours from 6:00 AM to 5:00 PM on working days (subject to term-wise administrative confirmation).',
    relatedIds: [
      'fac-overview',
      'fac-computer-labs',
      'fac-learning-environment',
    ],
    primaryAction: {
      label: 'View Library on Facilities Page',
      action: 'open-facilities',
    },
  },
  {
    id: 'fac-computer-labs',
    category: ChatbotCategoryId.FACILITIES,
    categoryLabel: 'Facilities & Student Life',
    question: 'Are computer labs available?',
    questionVariants: [
      'does the college have a computer lab',
      'science and hotel management laboratories',
      'practical labs for physics chemistry biology computer',
      'it lab workstations',
    ],
    keywords: ['computer lab', 'computer labs', 'laboratory', 'laboratories', 'labs', 'science lab', 'hotel management lab', 'practical'],
    answer: [
      'Yes. Capitol Hill College has a dedicated Computer Science Laboratory for programming practice, database systems, networking, and digital coursework.',
      'In addition to the Computer Science Lab, the college maintains separate subject-specific laboratories for Physics, Chemistry, Biology, and Hotel Management—all supervised by subject faculty.',
    ],
    relatedIds: [
      'fac-overview',
      'prog-plus2-science',
      'prog-plus2-management',
    ],
    primaryAction: {
      label: 'Explore Campus Laboratories',
      action: 'open-facilities',
    },
  },
  {
    id: 'fac-cafeteria',
    category: ChatbotCategoryId.FACILITIES,
    categoryLabel: 'Facilities & Student Life',
    question: 'Does the college have a cafeteria or canteen?',
    questionVariants: [
      'campus food and dining',
      'canteen facility',
      'where do students eat lunch',
      'college cafe',
    ],
    keywords: ['cafeteria', 'canteen', 'food', 'dining', 'meals', 'snacks', 'cafe', 'lunch'],
    answer: [
      'Yes. Capitol Hill College features a clean, welcoming on-campus self-service cafeteria serving hygienically prepared daily meals, snacks, and refreshments at reasonable student-friendly prices.',
    ],
    relatedIds: [
      'fac-overview',
      'fac-sports',
      'fac-learning-environment',
    ],
    primaryAction: {
      label: 'View Campus Facilities',
      action: 'open-facilities',
    },
  },
  {
    id: 'fac-sports',
    category: ChatbotCategoryId.FACILITIES,
    categoryLabel: 'Facilities & Student Life',
    question: 'Does the college organize sports activities?',
    questionVariants: [
      'which sports are played at capitol hill',
      'football basketball volleyball athletics',
      'sports tournaments and games',
      'athletic facilities',
    ],
    keywords: ['sports', 'sport', 'games', 'athletics', 'football', 'basketball', 'volleyball', 'track and field', 'tournament'],
    answer: [
      'Yes. Capitol Hill College actively promotes competitive and recreational sports through inter-house and inter-college tournaments.',
      'Core athletic disciplines include Football, Basketball, Volleyball, and Track & Field—helping students build teamwork, resilience, discipline, and leadership.',
    ],
    relatedIds: [
      'fac-eca',
      'fac-educational-tours',
      'fac-overview',
    ],
    primaryAction: {
      label: 'View Sports Photos in Gallery',
      action: 'open-gallery',
    },
  },
  {
    id: 'fac-educational-tours',
    category: ChatbotCategoryId.FACILITIES,
    categoryLabel: 'Facilities & Student Life',
    question: 'Are educational tours organized?',
    questionVariants: [
      'field trips and excursions',
      'does the college take students on tours',
      'inter class educational tour',
      'study tour',
    ],
    keywords: ['tour', 'tours', 'educational tour', 'excursion', 'field trip', 'trips', 'travel'],
    answer: [
      'Yes. Capitol Hill College organizes Inter-Class Educational Tours to give students real-world learning experiences beyond the classroom.',
      'Students explore historical, cultural, and scientific destinations alongside faculty—strengthening practical observation, curiosity, and cohort teamwork.',
    ],
    relatedIds: [
      'fac-eca',
      'fac-sports',
      'fac-learning-environment',
    ],
    primaryAction: {
      label: 'Browse Educational Tour Gallery',
      action: 'open-gallery',
    },
  },
  {
    id: 'fac-eca',
    category: ChatbotCategoryId.FACILITIES,
    categoryLabel: 'Facilities & Student Life',
    question: 'Does the college organize extracurricular activities?',
    questionVariants: [
      'eca and cca activities',
      'student clubs events quiz debate cultural program',
      'welcome and farewell programs',
      'co curricular activities',
    ],
    keywords: ['extracurricular', 'eca', 'cca', 'co-curricular', 'quiz', 'debate', 'cultural', 'welcome program', 'farewell', 'events'],
    answer: [
      'Yes. Extracurricular (ECA) and co-curricular (CCA) activities are an integral part of student life at Capitol Hill College.',
      'Regular campus events include Inter-Class Quiz Competitions, debates, academic symposiums, cultural showcases, Welcome Programs for incoming cohorts, and Farewell Programs celebrating graduating students.',
    ],
    relatedIds: [
      'fac-sports',
      'fac-educational-tours',
      'fac-learning-environment',
    ],
    primaryAction: {
      label: 'Explore Campus Event Gallery',
      action: 'open-gallery',
    },
  },
  {
    id: 'fac-learning-environment',
    category: ChatbotCategoryId.FACILITIES,
    categoryLabel: 'Facilities & Student Life',
    question: 'What is the learning environment like?',
    questionVariants: [
      'campus atmosphere and discipline',
      'classroom life and dress code',
      'how is student life at capitol hill college',
      'academic culture',
    ],
    keywords: ['learning environment', 'atmosphere', 'culture', 'student life', 'classroom life', 'uniform', 'dress'],
    answer: [
      'Capitol Hill College maintains a calm, structured, and supportive academic atmosphere. Students attend classes in official college uniform, promoting professionalism, equality, and focus.',
      'Spacious classrooms with audio-visual aids, approachable faculty mentors, quiet library spaces, and collaborative events help students grow intellectually and socially.',
    ],
    relatedIds: [
      'gen-educational-approach',
      'fac-overview',
      'fac-eca',
    ],
    primaryAction: {
      label: 'See Student Life in Gallery',
      action: 'open-gallery',
    },
  },

  /* ======================================================================== */
  /* F. CONTACT AND SUPPORT                                                   */
  /* ======================================================================== */
  {
    id: 'sup-contact-admin',
    category: ChatbotCategoryId.CONTACT,
    categoryLabel: 'Contact & Support',
    question: 'How can I contact the administration?',
    questionVariants: [
      'contact college office',
      'reach administration desk',
      'administration phone and email',
      'talk to college management',
    ],
    keywords: ['administration', 'admin office', 'management office', 'contact administration', 'office desk'],
    answer: [
      'You can contact the Capitol Hill College Administration Office directly via:',
      '• Telephone: 01-5312399\n• Email: info.capitolhillcollege@gmail.com\n• Campus Office: Teku, Kathmandu, Nepal (open Sunday through Friday during regular college hours).',
    ],
    relatedIds: [
      'sup-find-contact-info',
      'sup-schedule-visit',
      'sup-submit-enquiry',
    ],
    primaryAction: {
      label: 'Go to Contact Section',
      action: 'scroll-contact',
    },
  },
  {
    id: 'sup-admission-assistance',
    category: ChatbotCategoryId.CONTACT,
    categoryLabel: 'Contact & Support',
    question: 'How can I get admission assistance?',
    questionVariants: [
      'help with admission application',
      'admission support desk',
      'need help choosing a course',
      'who can help me with admission',
    ],
    keywords: ['admission assistance', 'admission help', 'admission support', 'help applying', 'assist'],
    answer: [
      'Our Admissions Team is ready to assist you with program selection, document checklists, and application steps:',
      '• Submit an online enquiry using the "Apply for Admission" button on any page.\n• Call our Admissions Desk at 01-5312399.\n• Visit our Teku, Kathmandu campus in person from Sunday to Friday.',
    ],
    relatedIds: [
      'adm-how-to-apply',
      'adm-speak-counsellor',
      'sup-submit-enquiry',
    ],
    primaryAction: {
      label: 'Request Admission Assistance',
      action: 'open-enquiry',
    },
  },
  {
    id: 'sup-schedule-visit',
    category: ChatbotCategoryId.CONTACT,
    categoryLabel: 'Contact & Support',
    question: 'Can I schedule a college visit?',
    questionVariants: [
      'how to book a campus tour',
      'appointment to visit college',
      'visiting hours for parents and students',
      'schedule campus visit',
    ],
    keywords: ['schedule visit', 'book visit', 'appointment', 'visiting hours', 'campus visit', 'schedule a visit'],
    answer: [
      'Yes! Prospective students and guardians can visit our Teku, Kathmandu campus Sunday through Friday during regular college hours.',
      'To arrange a guided visit or ensure an academic counselor for your stream is available, please call 01-5312399 in advance or mention your preferred visit day in the online Admission Enquiry form.',
    ],
    relatedIds: [
      'adm-visit-before-applying',
      'gen-location',
      'sup-contact-admin',
    ],
    primaryAction: {
      label: 'Request Campus Visit via Enquiry',
      action: 'open-enquiry',
    },
  },
  {
    id: 'sup-submit-enquiry',
    category: ChatbotCategoryId.CONTACT,
    categoryLabel: 'Contact & Support',
    question: 'How can I submit an enquiry?',
    questionVariants: [
      'send a question online',
      'where is the enquiry form',
      'how to track my admission enquiry',
      'online inquiry submission',
    ],
    keywords: ['submit enquiry', 'enquiry form', 'send enquiry', 'track enquiry', 'online enquiry', 'ask question'],
    answer: [
      'Click "Apply for Admission" in the header (or the button below) to open our dedicated Contact & Admission Enquiry page.',
      'Fill in your full name, phone number, email address, program of interest (+2 Management, +2 Humanities, +2 Science, +2 Law, BBS, or MBS), and your questions—no account login is required. You can dispatch your formatted enquiry directly to info.capitolhillcollege@gmail.com or call 01-5312399 for immediate counseling.',
    ],
    relatedIds: [
      'adm-how-to-apply',
      'sup-admission-assistance',
      'sup-find-contact-info',
    ],
    primaryAction: {
      label: 'Open Contact & Enquiry Page',
      action: 'open-enquiry',
    },
  },
  {
    id: 'sup-find-contact-info',
    category: ChatbotCategoryId.CONTACT,
    categoryLabel: 'Contact & Support',
    question: "Where can I find the college's contact information?",
    questionVariants: [
      'where are contact details on the website',
      'official social media links facebook tiktok',
      'contact page location',
    ],
    keywords: ['find contact', 'contact information', 'contact page', 'social media', 'facebook', 'tiktok', 'footer'],
    answer: [
      'Official contact details are available on our dedicated Contact & Admission Enquiry page, in the Contact strip on the Homepage, and in the website footer on every page:',
      '• Campus Location: Teku, Kathmandu, Nepal\n• Telephone: 01-5312399\n• Official Email: info.capitolhillcollege@gmail.com\n• Official Social Channels: Facebook (@CapitolHillAcademy123) and TikTok (@capitol.hill.coll8)',
    ],
    relatedIds: [
      'gen-contact',
      'sup-contact-admin',
      'gen-location',
    ],
    primaryAction: {
      label: 'Open Contact & Enquiry Page',
      action: 'scroll-contact',
    },
  },
  {
    id: 'gen-notices-results',
    category: ChatbotCategoryId.CONTACT,
    categoryLabel: 'Contact & Support',
    question: 'Where are examination routines, results, and official notices published?',
    questionVariants: [
      'exam schedule and results',
      'where can i see college notices',
      'latest announcements and bulletin',
      'admit card and exam routine',
    ],
    keywords: ['notices', 'announcements', 'results', 'exam', 'examination', 'routine', 'admit card', 'bulletin'],
    answer: [
      'All official admission bulletins, internal assessment and pre-board examination routines, result announcements, and event updates are published on the Notices & Announcements page.',
      'You can filter notices by category (Admissions, Examinations, Results, Events, Urgent) or search by keyword anytime without needing to sign in.',
    ],
    relatedIds: [
      'adm-when-open',
      'sup-contact-admin',
      'prog-available-programs',
    ],
    primaryAction: {
      label: 'Open Notices & Announcements',
      action: 'open-notices',
    },
  },
  {
    id: 'prog-subject-combinations',
    category: ChatbotCategoryId.PROGRAMS,
    categoryLabel: 'Academic Programs',
    question: 'What subject combinations are in +2?',
    questionVariants: [
      'what subject combinations and electives are taught in +2',
      'elective subjects in +2 science and management',
      'computer science or hotel management in +2',
      'biology vs computer group in +2 science',
      'what subjects do we study in +2',
    ],
    keywords: ['subject', 'subjects', 'combinations', 'elective', 'electives', 'biology', 'hotel management', 'computer science', 'accounting', 'physics'],
    answer: [
      'Under the National Examinations Board (NEB) framework, Capitol Hill College offers practical subject groupings across both +2 streams:',
      '• +2 Science: Core Physics, Chemistry, Mathematics, English & Nepali, with Biology or Computer Science group pathways depending on medical vs. engineering/IT goals.\n• +2 Management: Core Accounting, Economics, Business Studies, English & Nepali, paired with career-focused electives such as Computer Science and Hotel Management.',
    ],
    verificationNote:
      'Exact current-session NEB elective combinations and section availability should be confirmed with the Admissions Office.',
    relatedIds: [
      'prog-plus2-science',
      'prog-plus2-management',
      'prog-diff-sci-mgmt',
    ],
    primaryAction: {
      label: 'Explore Programs Section',
      action: 'scroll-programs',
    },
  },
  {
    id: 'fac-events-orientation',
    category: ChatbotCategoryId.FACILITIES,
    categoryLabel: 'Student Life',
    question: 'What student events, quizzes, and welcome programs happen on campus?',
    questionVariants: [
      'orientation and welcome program',
      'farewell program and quiz competition',
      'college events and festivals',
      'student clubs and competitions at capitol hill',
    ],
    keywords: ['events', 'welcome', 'orientation', 'farewell', 'quiz', 'celebration', 'festivals', 'tournaments'],
    answer: [
      'Student life at Capitol Hill College stays lively throughout the academic year! Highlights include Welcome & Orientation Programs for incoming cohorts, Inter-Class Quiz Competitions, debates, cultural showcases, and Farewell Programs for graduating classes.',
      'Students also compete in Football, Basketball, Volleyball, and Track & Field events and travel on supervised Inter-Class Educational Tours. You can view real event photos in our Campus Gallery!',
    ],
    relatedIds: [
      'fac-sports',
      'fac-educational-tours',
      'fun-college-life-vibe',
    ],
    primaryAction: {
      label: 'Browse Campus Gallery',
      action: 'open-gallery',
    },
  },
  {
    id: 'sup-student-portal',
    category: ChatbotCategoryId.CONTACT,
    categoryLabel: 'Admissions & Notices',
    question: 'Do I need an account or portal login to view notices or submit an admission enquiry?',
    questionVariants: [
      'do i need to sign in to apply',
      'is student portal required',
      'how to submit enquiry without login',
      'student portal status',
    ],
    keywords: ['portal', 'sign in', 'login', 'account', 'enquiry'],
    answer: [
      'No login or portal account is required. All academic program guides, official notices, examination routines, and admission enquiries on this website are openly accessible to students, parents, and visitors.',
      'Simply click "Apply for Admission" or visit our Contact & Admission Enquiry page (/contact) to send your enquiry directly to our Teku, Kathmandu admissions office, or call 01-5312399.',
    ],
    relatedIds: [
      'sup-submit-enquiry',
      'gen-notices-results',
      'adm-how-to-apply',
    ],
    primaryAction: {
      label: 'Open Contact & Enquiry Page',
      action: 'open-enquiry',
    },
  },

  /* ======================================================================== */
  /* G. FUN QUESTIONS & HUMAN CAMPUS BANTER                                   */
  /* ======================================================================== */
  {
    id: 'fun-college-life-vibe',
    category: ChatbotCategoryId.BANTER,
    categoryLabel: 'Campus Vibe',
    question: 'Is college life all books, or do students have fun?',
    questionVariants: [
      'is capitol hill college strict or fun',
      'do students have fun at capitol hill',
      'is college boring or fun',
      'how is the vibe at capitol hill college',
    ],
    keywords: ['fun', 'boring', 'vibe', 'strict', 'all books', 'enjoy', 'college life'],
    answer: [
      'All textbooks and zero fun would turn even the brightest student into a library statue! While we take classroom learning and lab practicals seriously, campus life at Teku has plenty of energy.',
      'Between Inter-Class Quiz face-offs, Football/Basketball/Volleyball tournaments, Welcome & Farewell celebrations, educational tours, and tea breaks with friends in the cafeteria, you will make plenty of great memories alongside your grades!',
    ],
    relatedIds: [
      'fun-canteen-momo-chiya',
      'fac-events-orientation',
      'fun-pass-without-studying',
    ],
    primaryAction: {
      label: 'See Campus Life Photos',
      action: 'open-gallery',
    },
  },
  {
    id: 'fun-pass-without-studying',
    category: ChatbotCategoryId.BANTER,
    categoryLabel: 'Campus Humor',
    question: 'Can I top exams without studying on the first bench?',
    questionVariants: [
      'can i pass exams without studying',
      'how to top neb without studying',
      'first bench vs backbenchers',
      'where do backbenchers sit',
      'can you do my homework or exam',
    ],
    keywords: ['first bench', 'backbencher', 'backbenchers', 'without studying', 'top exam', 'cheat code'],
    answer: [
      'Sitting on the first bench gives you HD eye contact with the teacher—unfortunately, it still does not unlock Bluetooth syllabus download!',
      'Whether you love the front row or the back row, you will still need to open your Physics, Accounting, or BBS books. The good news? Our supportive faculty across 15 departments and hands-on labs make understanding topics way easier than panic-reading at 2:00 AM!',
    ],
    relatedIds: [
      'fun-bunk-class',
      'fun-canteen-momo-chiya',
      'prog-available-programs',
    ],
    primaryAction: {
      label: 'Meet Our Faculty Team',
      action: 'open-team',
    },
  },
  {
    id: 'fun-canteen-momo-chiya',
    category: ChatbotCategoryId.BANTER,
    categoryLabel: 'Campus Humor',
    question: 'Be honest—how is the chiya and food in the college cafeteria?',
    questionVariants: [
      'do you serve momo in cafeteria',
      'is canteen food good',
      'chiya and samosa in college canteen',
      'can i survive college without coffee',
    ],
    keywords: ['momo', 'chiya', 'samosa', 'coffee', 'tea', 'snacks', 'hungry', 'canteen food'],
    answer: [
      'Now we are getting to the most important academic research question in Kathmandu! Our self-service Teku campus cafeteria keeps students fueled with fresh meals, snacks, and warm tea/coffee during breaks.',
      "Just one friendly reminder from your Campus Guide: 'Cafeteria Studies' isn't an official NEB or TU degree yet—so make sure you attend lecture before heading down for snacks!",
    ],
    relatedIds: [
      'fac-cafeteria',
      'fun-bunk-class',
      'fun-wifi-password',
    ],
    primaryAction: {
      label: 'Explore Campus Facilities',
      action: 'open-facilities',
    },
  },
  {
    id: 'fun-bunk-class',
    category: ChatbotCategoryId.BANTER,
    categoryLabel: 'Campus Humor',
    question: 'Is bunking class allowed when it rains in Kathmandu?',
    questionVariants: [
      'can we bunk class',
      'is bunking allowed at capitol hill',
      'what happens if i skip class',
      'rainy day holiday in college',
    ],
    keywords: ['bunk', 'bunking', 'skip class', 'rainy', 'dentist'],
    answer: [
      "Legend says the Teku campus gate has a sixth sense for sudden 'urgent dentist appointments' right before first period!",
      'Capitol Hill College encourages regular attendance and punctuality—not to spoil rainy Kathmandu mornings, but because lab experiments, group discussions, and quiz prep are much easier when you don’t miss class.',
    ],
    relatedIds: [
      'fun-pass-without-studying',
      'fun-wifi-password',
      'gen-location',
    ],
  },
  {
    id: 'fun-wifi-password',
    category: ChatbotCategoryId.BANTER,
    categoryLabel: 'Campus Humor',
    question: 'What is the secret Capitol Hill College Wi-Fi password?',
    questionVariants: [
      'wifi password of college',
      'give me free wifi password',
      'what is campus wifi password',
    ],
    keywords: ['wifi', 'wi-fi', 'password', 'secret'],
    answer: [
      "Classified Teku campus intelligence! Rumor has it the password is 'FinishYourLabReportFirst123'—just kidding!",
      'Enrolled students have supervised internet and digital research access inside our Computer Science Laboratory and College Library for coursework, projects, and academic reference.',
    ],
    relatedIds: [
      'fac-computer-labs',
      'fac-library',
      'fun-do-you-sleep',
    ],
  },
  {
    id: 'fun-do-you-sleep',
    category: ChatbotCategoryId.BANTER,
    categoryLabel: 'Campus Humor',
    question: 'Do you ever sleep, or are you guarding the campus gate 24/7?',
    questionVariants: [
      'do you sleep at night',
      'are you awake 24/7',
      'do you ever get tired',
      'what do you do on saturday holiday',
    ],
    keywords: ['sleep', 'awake', 'tired', 'saturday', '24/7'],
    answer: [
      'Sleep? I run on pure Kathmandu chiya spirit and student curiosity 24/7—even on Saturdays when the rest of campus is enjoying a holiday!',
      'Our real human counselors at Teku, Kathmandu are available Sunday through Friday (01-5312399), while I hold down the fort here anytime a late-night question about +2 Science, +2 Management, or BBS crosses your mind.',
    ],
    relatedIds: [
      'gen-location',
      'gen-contact',
      'prog-available-programs',
    ],
  },
];
