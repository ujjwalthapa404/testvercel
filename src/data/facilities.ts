export interface CollegeImageAsset {
  src: string;
  alt: string;
  caption: string;
  figureNumber: string;
}

export interface FacilitySubjectItem {
  name: string;
  focus: string;
}

export interface FacilityRecord {
  id: string;
  number: string;
  categoryLabel: string;
  title: string;
  subtitle: string;
  description: string;
  secondaryDescription?: string;
  keyAttributes: string[];
  subjectLabs?: FacilitySubjectItem[];
  verificationNote?: string;
  image: CollegeImageAsset;
}

export interface FacilityHighlightStat {
  id: string;
  value: string;
  label: string;
  context: string;
  pendingVerification: boolean;
}

export interface SocialLinkItem {
  platform: string;
  href: string;
  handleLabel: string;
}

/**
 * Official Capitol Hill College image assets hosted locally under `public/images/official/`
 * so campus photography and crest branding never break on DNS cutover.
 */
export const COLLEGE_LOGO_ASSET = {
  src: '/images/official/logo-3-120x116.png',
  alt: 'CAPITOL HILL COLLEGE official crest logo',
  width: 120,
  height: 116,
} as const;

export const VERIFIED_SOCIAL_LINKS: SocialLinkItem[] = [
  {
    platform: 'Facebook',
    href: 'https://www.facebook.com/CapitolHillAcademy123',
    handleLabel: 'Official Facebook Page',
  },
  {
    platform: 'TikTok',
    href: 'https://www.tiktok.com/@capitol.hill.coll8',
    handleLabel: '@capitol.hill.coll8',
  },
];

export const FACILITIES_HERO_CONTENT = {
  breadcrumbParent: 'Home',
  breadcrumbCurrent: 'Facilities & Services',
  kicker: 'Teku, Kathmandu · Campus Environment',
  title: 'Facilities & Services',
  supportingHeadline: 'An Inspiring Environment to Learn, Explore and Grow.',
  description:
    "Discover the learning spaces, academic resources and campus experiences at Capitol Hill College that support students' intellectual, physical and personal development.",
  heroImage: {
    src: '/images/official/building.png',
    alt: 'Exterior view of the CAPITOL HILL COLLEGE main academic building in Teku, Kathmandu',
    caption: 'CAPITOL HILL COLLEGE academic block in Teku, Kathmandu',
    figureNumber: 'Fig. 01',
  } satisfies CollegeImageAsset,
} as const;

export const FACILITIES_OVERVIEW_CONTENT = {
  kicker: 'Campus Architecture & Resources',
  heading: 'Designed for Learning. Built for Growth.',
  description:
    'At Capitol Hill College, we aim to create an environment where students can develop knowledge, practical skills, creativity and confidence. Our facilities support classroom learning, independent study and participation in campus life.',
} as const;

export const FACILITIES_LIST: FacilityRecord[] = [
  {
    id: 'infrastructure',
    number: '01',
    categoryLabel: 'Academic Spaces',
    title: 'Infrastructure',
    subtitle: 'Purpose-built classrooms and contemporary teaching environments in Teku.',
    description:
      'Capitol Hill College provides a calm, structured campus setting designed around daily academic focus. Spacious, naturally ventilated classrooms are arranged with comfortable seating and clear sightlines to support interactive lectures, seminar discussions, and collaborative coursework.',
    secondaryDescription:
      'Classrooms are equipped with modern multimedia projection and audio-visual teaching aids so faculty can bridge theoretical instruction with visual demonstrations across science, management, and humanities disciplines.',
    keyAttributes: [
      'Spacious, well-lit lecture rooms',
      'Modern audio-visual teaching technology',
      'Ergonomic student seating layout',
      'Accessible urban campus in Teku, Kathmandu',
    ],
    image: {
      src: '/images/official/building.png',
      alt: 'CAPITOL HILL COLLEGE campus building and academic infrastructure in Teku, Kathmandu',
      caption: 'Main campus infrastructure and classroom wing at Teku, Kathmandu',
      figureNumber: 'Fig. 01',
    },
  },
  {
    id: 'library',
    number: '02',
    categoryLabel: 'Knowledge & Research',
    title: 'Library',
    subtitle: 'A quiet study sanctuary stocked with academic texts, journals, and digital access.',
    description:
      'The college library serves as an intellectual anchor for students preparing for board examinations, undergraduate research, and independent inquiry. Its shelves house course textbooks, reference volumes, periodicals, academic journals, and general reading across literature and contemporary affairs.',
    secondaryDescription:
      'Dedicated reading tables and internet-enabled study access allow students to consult digital reference materials, review syllabus resources, and work quietly between lectures.',
    keyAttributes: [
      'Course textbooks & reference collections',
      'Academic journals, periodicals & diverse genres',
      'Quiet individual & group reading spaces',
      'Internet access for independent academic research',
    ],
    verificationNote:
      'Published campus schedule lists library access from 6:00 AM to 5:00 PM on working days (subject to term-wise administrative confirmation).',
    image: {
      src: '/images/official/library1.png',
      alt: 'Students studying among bookshelves inside the CAPITOL HILL COLLEGE library',
      caption: 'Reference shelves and quiet reading environment inside the college library',
      figureNumber: 'Fig. 02',
    },
  },
  {
    id: 'laboratories',
    number: '03',
    categoryLabel: 'Practical Inquiry',
    title: 'Laboratories',
    subtitle: 'Dedicated subject laboratories translating classroom theory into empirical skill.',
    description:
      'Practical mastery is central to science, technology, and hospitality education at Capitol Hill College. Rather than crowding disciplines into a single general room, the college maintains separate, purpose-equipped laboratories tailored to the safety, instrumentation, and curriculum standards of each field.',
    secondaryDescription:
      'Supervised laboratory sessions enable students to design experiments, record observations, write code, and practice operational hospitality workflows with faculty guidance.',
    keyAttributes: [
      'Separate subject-specific laboratory rooms',
      'Faculty-supervised practical sessions',
      'Curriculum-aligned apparatus & workstations',
    ],
    subjectLabs: [
      {
        name: 'Physics Laboratory',
        focus: 'Mechanics, optics, electricity, and measurement instrumentation.',
      },
      {
        name: 'Chemistry Laboratory',
        focus: 'Qualitative and quantitative analysis, titration, and organic synthesis.',
      },
      {
        name: 'Biology Laboratory',
        focus: 'Microscopy, anatomical specimens, botany, and physiological study.',
      },
      {
        name: 'Computer Science Laboratory',
        focus: 'Programming practice, database systems, networking, and digital coursework.',
      },
      {
        name: 'Hotel Management Laboratory',
        focus: 'Culinary preparation, food & beverage service, and hospitality operations.',
      },
    ],
    image: {
      src: '/images/official/lab.jpg',
      alt: 'Students conducting supervised practical work inside a CAPITOL HILL COLLEGE laboratory',
      caption: 'Dedicated laboratory workspace supporting hands-on scientific and technical learning',
      figureNumber: 'Fig. 03',
    },
  },
  {
    id: 'eca-cca',
    number: '04',
    categoryLabel: 'Student Development',
    title: 'ECA & CCA',
    subtitle: 'Extracurricular and co-curricular programs that build voice, leadership, and camaraderie.',
    description:
      'Education at Capitol Hill College extends well beyond examination halls. Regular extracurricular (ECA) and co-curricular (CCA) programs invite students to participate in debates, academic quizzes, cultural showcases, community initiatives, and student-led events.',
    secondaryDescription:
      'These shared experiences help students discover personal strengths, sharpen public speaking and organizational skills, build self-confidence, and form lasting friendships across cohorts.',
    keyAttributes: [
      'Debates, quizzes & academic symposiums',
      'Cultural celebrations & creative showcases',
      'Student leadership & collaborative event organizing',
    ],
    image: {
      src: '/images/official/college-students-eca-2026.jpg',
      alt: 'CAPITOL HILL COLLEGE students participating in extracurricular and co-curricular campus activities',
      caption: 'Students collaborating during campus extracurricular and co-curricular events',
      figureNumber: 'Fig. 04',
    },
  },
  {
    id: 'cafeteria',
    number: '05',
    categoryLabel: 'Campus Dining',
    title: 'Cafeteria',
    subtitle: 'Welcoming on-campus self-service dining offering wholesome meals at student-friendly prices.',
    description:
      'The on-campus cafeteria provides a clean, relaxed social setting where students and faculty recharge between morning and afternoon classes. Operating on an efficient self-service model, it serves freshly prepared snacks, beverages, and daily meals.',
    secondaryDescription:
      'Menus are planned with attention to hygiene, balanced variety, and reasonable pricing suited to daily student life.',
    keyAttributes: [
      'Convenient on-campus self-service format',
      'Hygienically prepared daily meals & refreshments',
      'Reasonable student-friendly pricing',
    ],
    image: {
      src: '/images/official/cafe.png',
      alt: 'Interior of the CAPITOL HILL COLLEGE self-service student cafeteria',
      caption: 'On-campus self-service cafeteria space for daily refreshments and conversation',
      figureNumber: 'Fig. 05',
    },
  },
  {
    id: 'sports',
    number: '06',
    categoryLabel: 'Athletics & Wellbeing',
    title: 'Sports',
    subtitle: 'Competitive and recreational athletics cultivating discipline, resilience, and teamwork.',
    description:
      'Physical vitality reinforces academic stamina and personal character. Capitol Hill College encourages regular athletic participation through organized inter-house competitions, tournaments, and recreational practice.',
    secondaryDescription:
      'Students compete and train across Football, Basketball, Volleyball, and Track & Field—developing sportsmanship, mutual respect, composure under pressure, and collaborative leadership.',
    keyAttributes: [
      'Football & Track and Field events',
      'Basketball & Volleyball court competitions',
      'Focus on teamwork, discipline & student leadership',
    ],
    image: {
      src: '/images/official/sport.png',
      alt: 'CAPITOL HILL COLLEGE students participating in campus sports and athletic competitions',
      caption: 'Team athletics and sporting activities fostering discipline and camaraderie',
      figureNumber: 'Fig. 06',
    },
  },
];

/**
 * Editable highlight figures sourced from the existing Capitol Hill College website.
 * Kept in a dedicated array so administrators can verify or update exact counts via CMS/database.
 */
export const FACILITY_HIGHLIGHTS: FacilityHighlightStat[] = [
  {
    id: 'years-excellence',
    value: '20+',
    label: 'Years of Excellence',
    context: 'Academic service in Kathmandu',
    pendingVerification: true,
  },
  {
    id: 'modern-labs',
    value: '4+',
    label: 'Modern Labs',
    context: 'Science, computing & hospitality spaces',
    pendingVerification: true,
  },
  {
    id: 'library-books',
    value: '1000+',
    label: 'Books in Library',
    context: 'Textbooks, references & periodicals',
    pendingVerification: true,
  },
  {
    id: 'sports-activities',
    value: '6+',
    label: 'Sports Activities',
    context: 'Team & track athletic disciplines',
    pendingVerification: true,
  },
];

export const FACILITIES_CLOSING_QUOTE = {
  quote: 'We are not just preparing students for careers; we are equipping them to change lives.',
  attribution: 'CAPITOL HILL COLLEGE',
} as const;

export const FACILITIES_CTA_CONTENT = {
  heading: 'Experience the CAPITOL HILL COLLEGE Difference',
  description:
    'Explore our academic programs and discover an environment designed to support your educational journey.',
  primaryLabel: 'Explore Academic Programs',
  secondaryLabel: 'Contact the College',
} as const;
