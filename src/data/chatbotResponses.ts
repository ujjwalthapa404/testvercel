import {
  ChatbotQuickAction,
  FacilityEntity,
  ProgramEntity,
  TopicAspect,
} from '../types/chatbot';

export interface ConversationalTemplate {
  paragraphs: string[];
  categoryLabel?: string;
  verificationNote?: string;
  suggestedQuestions?: string[];
  actions?: ChatbotQuickAction[];
  offeredNextStep?: {
    aspect: TopicAspect;
    program?: ProgramEntity | null;
    description: string;
  };
}

export interface ProgramConversationalProfile {
  entity: ProgramEntity;
  displayName: string;
  shortName: string;
  boardAffiliation: string;
  enquiryProgramTitle?: string;
  overview: string[];
  deeperDetail: string[];
  eligibility: {
    paragraphs: string[];
    verificationNote: string;
  };
  documents: string[];
  fees: {
    paragraphs: string[];
    verificationNote: string;
  };
  scholarships: {
    paragraphs: string[];
    verificationNote: string;
  };
  deadlines: {
    paragraphs: string[];
    verificationNote: string;
  };
  afterStudy: string[];
  howToApply: string[];
}

export const PROGRAM_PROFILES: Record<ProgramEntity, ProgramConversationalProfile> = {
  plus2_science: {
    entity: 'plus2_science',
    displayName: '+2 Science',
    shortName: 'Science',
    boardAffiliation: 'National Examinations Board (NEB)',
    enquiryProgramTitle: '+2 Science',
    overview: [
      '+2 Science is one of our core Higher Secondary programs affiliated with the National Examinations Board (NEB).',
      'It builds a strong foundation in Physics, Chemistry, Biology, Mathematics, and Computer Science, supported by separate, faculty-supervised Physics, Chemistry, Biology, and Computer Science laboratories at our Teku campus.',
      'Would you like to know about +2 Science eligibility requirements, career pathways, or how to apply?',
    ],
    deeperDetail: [
      'In +2 Science at Capitol Hill College, classroom teaching is paired with regular practical sessions in dedicated Physics, Chemistry, Biology, and Computer labs, along with multimedia-equipped classrooms and research library access.',
      'Students typically choose Biology or Mathematics/Computer group combinations depending on whether they plan to pursue medicine and health sciences or engineering and IT after Grade 12.',
    ],
    eligibility: {
      paragraphs: [
        'To apply for +2 Science, students must have completed the SEE (Secondary Education Examination) or an equivalent recognized board examination and meet NEB Science stream prerequisites.',
        'Exact minimum GPA cutoffs, subject-wise grade requirements, and entrance assessment details for the current session need confirmation from our Admissions Office at 01-5312399.',
      ],
      verificationNote:
        'Current-intake GPA cutoffs and entrance criteria for +2 Science require confirmation from the Admissions Office.',
    },
    documents: [
      'To apply for +2 Science at Capitol Hill College, please prepare:',
      '• SEE grade sheet / academic transcript copy\n• Character certificate (and transfer certificate where applicable)\n• Recent passport-sized photographs\n• Completed Capitol Hill College admission application form',
    ],
    fees: {
      paragraphs: [
        'The fee information for +2 Science (including admission, monthly tuition, and laboratory charges) is not currently published online and needs confirmation from our administration.',
        'Please contact the Capitol Hill College Admissions & Accounts Desk at 01-5312399 or submit an online enquiry for the latest verified +2 Science fee structure.',
      ],
      verificationNote:
        'Official +2 Science tuition and laboratory fee figures require confirmation from Capitol Hill College administration.',
    },
    scholarships: {
      paragraphs: [
        'Capitol Hill College announces merit-based scholarship opportunities for +2 Science applicants during admission intakes.',
        'Exact SEE GPA scholarship tiers, entrance waiver percentages, and quotas are confirmed per session by the Scholarship & Admissions Committee. Please call 01-5312399 or check our Notices page for active announcements.',
      ],
      verificationNote:
        'Specific +2 Science scholarship percentages and SEE GPA cutoffs must be confirmed with the Admissions Office.',
    },
    deadlines: {
      paragraphs: [
        '+2 Science admissions open following the publication of SEE results according to the NEB academic calendar.',
        'Exact opening dates and application deadlines for the current intake need confirmation from college administration—you can check our Notices page or call 01-5312399.',
      ],
      verificationNote:
        'Exact current-session +2 Science admission deadlines require administrative confirmation.',
    },
    afterStudy: [
      'After completing +2 Science, students can pursue a wide spectrum of bachelor’s degrees:',
      '• Medical & Health Sciences: MBBS, BDS, BSc Nursing, Pharmacy, Public Health (Biology group)\n• Engineering & Architecture: Civil, Computer, Electrical, Mechanical Engineering, B.Arch\n• IT & Pure Sciences: BSc CSIT, BIT, BCA, BSc Physics/Chemistry/Biology, Agriculture, Forestry\n• Business & Law: BBS, BBA, Chartered Accountancy (CA), or BALLB',
    ],
    howToApply: [
      'You can apply or enquire for +2 Science in two easy ways:',
      '1. Click "Enquire About +2 Science" below to submit your details online and track counselor responses in your Student Portal.\n2. Visit our Admissions Desk at Teku, Kathmandu (Sunday–Friday during college hours) or call 01-5312399 to speak with a Science stream counselor.',
    ],
  },

  plus2_management: {
    entity: 'plus2_management',
    displayName: '+2 Management',
    shortName: 'Management',
    boardAffiliation: 'National Examinations Board (NEB)',
    enquiryProgramTitle: '+2 Management',
    overview: [
      '+2 Management is our NEB-affiliated Higher Secondary stream designed for students interested in business, finance, accounting, computing, and hospitality.',
      'The curriculum covers Accounting, Economics, and Business Studies alongside practical electives such as Computer Science and Hotel Management—supported by dedicated Computer and Hotel Management labs.',
      'Would you like to check +2 Management admission requirements, subject options, or career pathways?',
    ],
    deeperDetail: [
      '+2 Management at Capitol Hill College blends conceptual commerce classes with hands-on practical training in our Computer Science Laboratory and Hotel Management Laboratory.',
      'Students also build communication, leadership, and teamwork skills through inter-class quizzes, debates, educational tours, and campus events—creating a smooth foundation for undergraduate degrees like BBS, BBA, BIM, or BHM.',
    ],
    eligibility: {
      paragraphs: [
        'Applicants for +2 Management must hold an SEE (Secondary Education Examination) qualification or equivalent recognized board certificate meeting NEB Management stream norms.',
        'Exact minimum GPA requirements and subject-specific prerequisites for the current intake need confirmation from our Admissions Office at 01-5312399.',
      ],
      verificationNote:
        'Current-session GPA cutoffs and elective eligibility for +2 Management require confirmation from administration.',
    },
    documents: [
      'For +2 Management admission, applicants should bring:',
      '• Copy of SEE grade sheet / transcript\n• Character certificate from your previous school\n• Recent passport-sized photographs\n• Completed Capitol Hill College application form',
    ],
    fees: {
      paragraphs: [
        'The fee information for +2 Management (including tuition and Computer or Hotel Management practical charges) is not currently available online and requires confirmation from our administration.',
        'Please reach out to our Teku campus office at 01-5312399 or submit an online enquiry for the latest +2 Management fee breakdown.',
      ],
      verificationNote:
        'Official +2 Management fee schedules and elective lab charges must be confirmed with Capitol Hill College administration.',
    },
    scholarships: {
      paragraphs: [
        'Merit-based scholarship provisions for +2 Management are announced by the college during each post-SEE admission window.',
        'Because SEE GPA tiers and fee-waiver percentages are set per academic session, please confirm current +2 Management scholarship eligibility with our Admissions Desk at 01-5312399.',
      ],
      verificationNote:
        '+2 Management scholarship percentages and GPA tiers require confirmation from college administration.',
    },
    deadlines: {
      paragraphs: [
        '+2 Management enrollment follows the annual post-SEE National Examinations Board (NEB) admission schedule.',
        'Exact intake opening and closing dates for the current academic session need confirmation from administration—please check our Notices page or call 01-5312399.',
      ],
      verificationNote:
        'Current-session +2 Management admission deadlines require administrative confirmation.',
    },
    afterStudy: [
      'Completing +2 Management prepares students for strong undergraduate pathways, including:',
      '• Business & Finance: Bachelor of Business Studies (BBS — offered right here at Capitol Hill College), BBA, BBM, BPA, and CA / ACCA\n• IT & Management: BIM, BCA, or BIT (subject to university prerequisites)\n• Hospitality & Law: BHM (Hotel Management), BTTM, BALLB, Economics, or Mass Communication',
    ],
    howToApply: [
      'To start your +2 Management application or counseling:',
      '1. Use the "Enquire About +2 Management" button below to submit your enquiry online.\n2. Visit our Teku, Kathmandu campus (Sunday–Friday) to tour the classrooms and Computer/Hotel Management labs and consult an admission counselor, or call 01-5312399.',
    ],
  },

  bbs: {
    entity: 'bbs',
    displayName: 'Bachelor of Business Studies (BBS)',
    shortName: 'BBS',
    boardAffiliation: 'Tribhuvan University (TU)',
    enquiryProgramTitle: 'Bachelor of Business Studies (BBS)',
    overview: [
      'Our Bachelor of Business Studies (BBS) is a four-year undergraduate degree program affiliated with Tribhuvan University (TU).',
      'It equips students with strong foundations in accounting, finance, taxation, economics, business law, and organizational management—preparing graduates for banking, corporate roles, entrepreneurship, and civil service.',
      'Would you like details on BBS eligibility, required documents, or career scope?',
    ],
    deeperDetail: [
      'Across its four academic years under Tribhuvan University, the BBS program builds progressive analytical skills in corporate finance, auditing, marketing, human resource management, and business research.',
      'Students benefit from experienced Management and Economics faculty, quiet library reference collections, internet research access, and co-curricular academic activities at our Teku campus.',
    ],
    eligibility: {
      paragraphs: [
        'To enroll in the four-year BBS program, applicants must have completed 10+2 (Higher Secondary / NEB) or an equivalent intermediate qualification from a board or university recognized by Tribhuvan University.',
        'Students from both +2 Management and +2 Science backgrounds can apply, subject to Tribhuvan University’s current minimum grade/GPA rules—please confirm exact current-year criteria with our Admissions Office at 01-5312399.',
      ],
      verificationNote:
        'Current-intake Tribhuvan University BBS minimum grade/division requirements should be confirmed with the Admissions Office.',
    },
    documents: [
      'When applying for the BBS undergraduate program, please bring:',
      '• Academic transcripts / grade sheets for both SEE and 10+2 (Grade 11 & 12)\n• Character certificate and migration / provisional certificate (for TU registration)\n• Copy of citizenship certificate (if issued) and recent passport-sized photographs\n• Completed Capitol Hill College BBS admission form',
    ],
    fees: {
      paragraphs: [
        'The fee information for the four-year BBS program (admission, annual/monthly tuition, and TU registration/exam charges) is not currently published online and needs confirmation from our administration.',
        'Please call our Teku campus office at 01-5312399 or submit an online BBS enquiry for the official current-session fee structure.',
      ],
      verificationNote:
        'Official BBS tuition and university registration fees require confirmation from Capitol Hill College administration.',
    },
    scholarships: {
      paragraphs: [
        'Scholarship and fee-concession opportunities for BBS applicants are determined per intake by the Capitol Hill College Scholarship & Admissions Committee.',
        'Please contact our Admissions Office at 01-5312399 or visit the Teku campus to confirm current +2 grade-based scholarships for BBS.',
      ],
      verificationNote:
        'BBS scholarship tiers and fee waivers require direct confirmation from college administration.',
    },
    deadlines: {
      paragraphs: [
        'BBS admissions follow Tribhuvan University’s annual Faculty of Management admission calendar.',
        'Exact application opening dates and TU registration deadlines for the current intake need confirmation from administration—please check our Notices page or call 01-5312399.',
      ],
      verificationNote:
        'Current-session BBS admission and TU registration deadlines require administrative confirmation.',
    },
    afterStudy: [
      'Graduates of our four-year Tribhuvan University BBS program have strong academic and career pathways:',
      '• Postgraduate Degrees: Master of Business Studies (MBS), MBA, MBM, MPA, or professional qualifications like CA and ACCA\n• Career Opportunities: Commercial banks and financial institutions, tax/audit firms, corporate management, entrepreneurship, NGOs/INGOs, and Nepal civil service (Lok Sewa) officer roles',
    ],
    howToApply: [
      'You can enquire or apply for BBS by:',
      '1. Clicking "Enquire About BBS" below to send your academic query directly to our admissions counselors.\n2. Visiting the Capitol Hill College Admissions Desk in Teku, Kathmandu (Sunday–Friday) or calling 01-5312399.',
    ],
  },

  graduate: {
    entity: 'graduate',
    displayName: "Master's / Postgraduate Programs",
    shortName: "Master's",
    boardAffiliation: 'Subject to Administrative Verification',
    enquiryProgramTitle: "Master's / Graduate Enquiry",
    overview: [
      "Information regarding active Master's or postgraduate specializations at Capitol Hill College is currently pending official confirmation from college administration.",
      'Our confirmed academic programs on record are +2 Science (NEB), +2 Management (NEB), and the four-year Bachelor of Business Studies / BBS (Tribhuvan University).',
      'Please contact our administration office at 01-5312399 or submit a graduate enquiry for up-to-date postgraduate details.',
    ],
    deeperDetail: [
      'Because postgraduate course offerings and university seat approvals are subject to session-by-session administrative confirmation, we avoid listing unverified Master’s streams.',
      'Calling 01-5312399 or emailing info.capitolhillcollege@gmail.com will connect you directly with our academic office for verified information.',
    ],
    eligibility: {
      paragraphs: [
        "Eligibility criteria for any postgraduate / Master's offerings depend on active university-affiliated intakes and require confirmation from Capitol Hill College administration (01-5312399).",
      ],
      verificationNote:
        "Master's / postgraduate program availability and eligibility require administrative confirmation.",
    },
    documents: [
      "Document checklists for postgraduate programs depend on active intakes—please contact the Capitol Hill College Administration Office at 01-5312399 to verify availability first.",
    ],
    fees: {
      paragraphs: [
        "Fee details and active availability for Master's / postgraduate courses are not published online and require confirmation from Capitol Hill College administration at 01-5312399.",
      ],
      verificationNote:
        "Postgraduate availability and fee schedules require administrative confirmation.",
    },
    scholarships: {
      paragraphs: [
        "Any postgraduate scholarship provisions must be confirmed directly with Capitol Hill College administration at 01-5312399.",
      ],
      verificationNote:
        "Postgraduate scholarship policies require administrative confirmation.",
    },
    deadlines: {
      paragraphs: [
        "Please contact Capitol Hill College administration at 01-5312399 to confirm whether any postgraduate intakes are scheduled for the current session.",
      ],
      verificationNote:
        "Postgraduate intake dates require administrative confirmation.",
    },
    afterStudy: [
      'If you have recently completed a Bachelor’s degree such as BBS, please contact our Teku campus office at 01-5312399 to verify whether postgraduate guidance or programs are currently offered.',
    ],
    howToApply: [
      "You can submit a Master's / Graduate Enquiry using the button below or call 01-5312399 to speak directly with our administration team.",
    ],
  },
};

export const PROGRAM_COMPARISON_TEMPLATES: Record<string, ConversationalTemplate> = {
  science_vs_management: {
    categoryLabel: 'Program Comparison',
    paragraphs: [
      'Both +2 Science and +2 Management at Capitol Hill College are two-year Higher Secondary programs affiliated with NEB, but they serve different interests and career goals:',
      '• +2 Science centers on Physics, Chemistry, Biology, Mathematics, and Computer Science with intensive lab work in dedicated Physics, Chemistry, Biology, and Computer labs. It keeps both technical/medical (MBBS, Engineering, BSc CSIT) and business pathways open.\n• +2 Management centers on Accounting, Economics, and Business Studies with Computer Science or Hotel Management electives and practical labs—ideal if your goal is business, banking, CA, BBA/BBS, IT-management, or hospitality.',
      'Not sure which fits you best? Tell me what subjects or careers interest you, or connect with an academic counselor!',
    ],
    suggestedQuestions: [
      'Tell me more about +2 Science',
      'Tell me more about +2 Management',
      'How can I speak with an admission counsellor?',
    ],
    actions: [{ label: 'Request Stream Counseling', action: 'open-enquiry' }],
  },

  management_vs_bbs: {
    categoryLabel: 'Program Comparison',
    paragraphs: [
      '+2 Management and BBS represent two consecutive academic levels rather than competing streams:',
      '• +2 Management (NEB) is a two-year Higher Secondary program (Grades 11 & 12) taken right after SEE.\n• Bachelor of Business Studies / BBS (Tribhuvan University) is a four-year undergraduate degree taken after completing 10+2 (+2 Management or +2 Science).',
      'Many students complete +2 Management at Capitol Hill College and then continue into our four-year TU BBS degree. Which level are you currently preparing for?',
    ],
    suggestedQuestions: [
      'Tell me more about +2 Management',
      'Tell me more about BBS',
      'What are the admission requirements?',
    ],
  },

  science_vs_bbs: {
    categoryLabel: 'Program Comparison',
    paragraphs: [
      '+2 Science and BBS are for different stages of education:',
      '• +2 Science (NEB) is for students who have just completed SEE (Grades 11 & 12), focusing on Physics, Chemistry, Biology, Mathematics, and Computer Science.\n• BBS (Tribhuvan University) is a four-year bachelor’s degree in business and management taken after completing Grade 12.',
      'Notably, students who finish +2 Science are eligible to join BBS if they decide to shift toward business, finance, or management at the bachelor’s level.',
    ],
    suggestedQuestions: [
      'Tell me more about +2 Science',
      'Tell me more about BBS',
      'What can I study after completing +2 Science?',
    ],
  },
};

export type HumanBanterKey =
  | 'banter_homework'
  | 'banter_canteen'
  | 'banter_bunk'
  | 'banter_wifi'
  | 'banter_sleep'
  | 'banter_compliment'
  | 'banter_romance'
  | 'banter_motivation';

export const STUDENT_JOKES: string[] = [
  'Quick Teku campus break! Why did the +2 Science student bring a ladder to Capitol Hill College? Because they heard we offer Higher Secondary education! Whenever you are ready, ask me about our streams or Teku campus.',
  'Here is an Accounting classic from our +2 Management & BBS wing: Why did the balance sheet go to the counselor? Because it just could not find its balance before finals! Want to explore Management or BBS?',
  'One from the Science laboratory: Never trust an atom in Chemistry lab—they literally make up everything! By the way, we have separate Physics, Chemistry, Biology, and Computer labs if you want to check them out.',
  'Library humor: Why was the Mathematics textbook looking so stressed in our Teku library? Because it had way too many problems! Luckily, our faculty across 15 departments help solve them.',
  'Kathmandu student truth: A student asked if sitting on the first bench guarantees a 4.0 GPA. Sadly, eye contact with the lecturer still does not support Bluetooth syllabus transfer!',
  'Campus Wi-Fi joke: Why did the Computer Science student cross the courtyard? To get closer to the lab router—and maybe grab a cup of chiya on the way back!',
];

export const HUMAN_BANTER_TEMPLATES: Record<
  HumanBanterKey,
  { paragraphs: string[]; suggestedQuestions: string[] }
> = {
  banter_homework: {
    paragraphs: [
      'Nice try! If I walked into your NEB or TU exam hall in college uniform, the Teku invigilators would definitely get suspicious.',
      "Even sitting on the first bench doesn't unlock Bluetooth syllabus download—but our supportive teachers across 15 academic departments, library study halls, and practical labs make acing your exams way easier than 2:00 AM cramming!",
    ],
    suggestedQuestions: [
      'Is college life all books, or do students have fun?',
      'What programs does the college offer?',
      'Tell me another joke',
    ],
  },
  banter_canteen: {
    paragraphs: [
      'Asking the most important research question in Kathmandu! Our self-service Teku campus cafeteria keeps students happily fueled with fresh meals, snacks, and warm chiya or coffee between classes.',
      "Just one friendly tip from your CHC Campus Guide: 'Cafeteria Honours' still isn't an official NEB or TU major—so don't skip lab practicals for extra snacks!",
    ],
    suggestedQuestions: [
      'What facilities are available?',
      'Is bunking class allowed when it rains in Kathmandu?',
      'Where is Capitol Hill College located?',
    ],
  },
  banter_bunk: {
    paragraphs: [
      "Legend says the Teku campus gate has a sixth sense for sudden 'urgent dentist appointments' five minutes before first period!",
      'Capitol Hill College does value regular attendance and punctuality—mostly because our hands-on lab sessions, inter-class quizzes, sports tournaments, and educational tours are way more fun when you are actually there.',
    ],
    suggestedQuestions: [
      'Is college life all books, or do students have fun?',
      'What student events, quizzes, and welcome programs happen on campus?',
      'Where is Capitol Hill College located?',
    ],
  },
  banter_wifi: {
    paragraphs: [
      "Classified Teku campus intelligence! Rumor says the secret Wi-Fi password is 'FinishYourLabReportFirst123'—just kidding!",
      'Enrolled students enjoy supervised internet and digital research access in our Computer Science Laboratory and College Library for projects, assignments, and reference study.',
    ],
    suggestedQuestions: [
      'What facilities are available?',
      'Do you ever sleep, or are you guarding the campus gate 24/7?',
    ],
  },
  banter_sleep: {
    paragraphs: [
      'Sleep? I run on pure Kathmandu chiya energy and student curiosity 24/7—even on Saturdays when the rest of campus is enjoying a holiday!',
      'Our real human counselors welcome visitors at Teku, Kathmandu from Sunday through Friday (01-5312399), while I stay awake here anytime a midnight question about +2 Science, +2 Management, or BBS pops up.',
    ],
    suggestedQuestions: [
      'Where is Capitol Hill College located?',
      'What programs does the college offer?',
      'Tell me a joke',
    ],
  },
  banter_compliment: {
    paragraphs: [
      "Stop it—you're going to make my CHC Campus Guide badge shine! Thank you so much; chatting with curious students and visitors is easily the best part of my job.",
      'What else can I help you explore—our Teku location, +2 & BBS programs, or another fun campus question?',
    ],
    suggestedQuestions: [
      'Where is Capitol Hill College located?',
      'What programs does the college offer?',
      'Tell me a joke',
    ],
  },
  banter_romance: {
    paragraphs: [
      "I'm genuinely flattered—but I'm already in a committed four-year relationship with our TU BBS and NEB +2 academic handbooks!",
      'How about I help you fall in love with the right college stream at our Teku campus instead?',
    ],
    suggestedQuestions: [
      'What is the difference between +2 Science and +2 Management?',
      'Where is Capitol Hill College located?',
    ],
  },
  banter_motivation: {
    paragraphs: [
      'Take a deep breath—you have got this! Every doctor, banker, entrepreneur, and engineer in Nepal once sat right where you are, wondering which college path to choose after SEE or +2.',
      'Take it one chapter (and one warm cup of chiya) at a time. Want a quick campus joke to lighten the mood, or would you like help comparing +2 Science, +2 Management, and BBS?',
    ],
    suggestedQuestions: [
      'What is the difference between +2 Science and +2 Management?',
      'Tell me a joke',
      'How can I speak with an admission counsellor?',
    ],
  },
};

export const UNCONFIRMED_COLLEGE_TOPICS: Record<
  'hostel' | 'transportation' | 'timings' | 'internship' | 'attendance',
  ConversationalTemplate
> = {
  hostel: {
    categoryLabel: 'Needs Confirmation',
    paragraphs: [
      'Details regarding college hostel or student accommodation arrangements are not currently confirmed in our published records.',
      'Please contact Capitol Hill College administration directly at 01-5312399 or email info.capitolhillcollege@gmail.com to check whether hostel or nearby accommodation guidance is available.',
    ],
    verificationNote:
      'Hostel / accommodation availability must be confirmed directly with Capitol Hill College administration.',
    suggestedQuestions: [
      'Where is Capitol Hill College located?',
      'What facilities does the college provide?',
    ],
    actions: [
      { label: 'Contact College Office', action: 'scroll-contact' },
      { label: 'Submit Enquiry', action: 'open-enquiry' },
    ],
  },

  transportation: {
    categoryLabel: 'Needs Confirmation',
    paragraphs: [
      'Information about college bus routes or student transportation services is not currently available in our verified website data and needs confirmation from administration.',
      'Our campus is centrally located in Teku, Kathmandu. Please call 01-5312399 to confirm current transportation arrangements from your area.',
    ],
    verificationNote:
      'Student bus / transportation availability and routes require confirmation from college administration.',
    suggestedQuestions: [
      'Where is Capitol Hill College located?',
      'Can I visit the college before applying?',
    ],
    actions: [{ label: 'Contact Administration', action: 'scroll-contact' }],
  },

  timings: {
    categoryLabel: 'Needs Confirmation',
    paragraphs: [
      'Capitol Hill College operates Sunday through Friday, while exact daily class timings and morning or day shift schedules for +2 Science, +2 Management, and BBS need confirmation from the administration office.',
      'Published campus records note library hours from 6:00 AM to 5:00 PM on working days (subject to term-wise confirmation). Please call 01-5312399 for exact shift timings for your stream.',
    ],
    verificationNote:
      'Exact morning/day shift schedules and class start times require confirmation from college administration.',
    suggestedQuestions: [
      'What programs do you offer?',
      'Can I visit the college before applying?',
    ],
    actions: [{ label: 'Ask via Online Enquiry', action: 'open-enquiry' }],
  },

  internship: {
    categoryLabel: 'Needs Confirmation',
    paragraphs: [
      'Specific details on formal internship placements or job-placement cells are not currently confirmed in our official dataset.',
      'While our +2 Management (Hotel Management / Computer labs) and four-year TU BBS curriculum emphasize practical career preparation, please confirm any internship support directly with our administration at 01-5312399.',
    ],
    verificationNote:
      'Internship and placement coordination details require confirmation from college administration.',
    suggestedQuestions: [
      'What can I do after completing BBS?',
      'How can I speak with an admission counsellor?',
    ],
  },

  attendance: {
    categoryLabel: 'Needs Confirmation',
    paragraphs: [
      'Capitol Hill College emphasizes regular attendance, punctuality, and academic discipline (including official college uniform during class hours).',
      'However, exact minimum attendance percentages and board exam eligibility thresholds follow NEB / Tribhuvan University and internal college rules—please confirm specific policy details with the administration office at 01-5312399.',
    ],
    verificationNote:
      'Specific attendance percentage thresholds require confirmation from the academic administration.',
    suggestedQuestions: [
      'What is the learning environment like?',
      'Where are examination routines and notices published?',
    ],
  },
};

export const FACILITY_DEEPER_DETAILS: Record<FacilityEntity, string[]> = {
  library: [
    'Beyond course textbooks, students use the library for quiet exam preparation, group reading, consulting reference volumes and journals, and online academic research.',
    'Published campus records indicate working-day hours from 6:00 AM to 5:00 PM (subject to term-wise administrative confirmation).',
  ],
  labs: [
    'Having separate laboratories for Physics, Chemistry, Biology, Computer Science, and Hotel Management ensures students get hands-on equipment access rather than crowded shared rooms.',
    'All laboratory practicals are guided directly by subject faculty aligned with NEB and university practical requirements.',
  ],
  cafeteria: [
    'The campus cafeteria operates on a convenient self-service model so students can get fresh meals, snacks, and beverages quickly during breaks in a clean social space.',
  ],
  sports: [
    'Students participate in inter-house and inter-college competitions across Football, Basketball, Volleyball, and Track & Field—You can also browse photographs from recent tournaments on our Campus Gallery page.',
  ],
  tours: [
    'Inter-Class Educational Tours connect classroom learning with historical, cultural, and scientific field observation under faculty supervision. Photos from recent tours are featured in our Campus Gallery.',
  ],
  eca: [
    'Throughout the academic calendar, student committees and faculty organize Inter-Class Quiz Competitions, debates, cultural showcases, Welcome Programs for new students, and Farewell Programs for graduating cohorts.',
  ],
  environment: [
    'With 45 faculty listings across 15 academic departments and multimedia-enabled classrooms, students receive attentive mentorship in a focused, respectful campus setting at Teku, Kathmandu.',
  ],
};
