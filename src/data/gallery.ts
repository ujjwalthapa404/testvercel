export type GalleryCategoryId =
  | 'all'
  | 'classroom'
  | 'sports'
  | 'educational-tours'
  | 'welcome-program'
  | 'quiz-competition'
  | 'science-practical'
  | 'farewell';

export type GallerySectionLayoutVariant =
  | 'classroom-diptych-portrait'
  | 'sports-feature-left'
  | 'tours-editorial-triptych'
  | 'welcome-feature-right'
  | 'quiz-panoramic-marquee'
  | 'science-wide-plus-portraits'
  | 'farewell-portrait-finale';

export interface GalleryImageItem {
  id: string;
  assetCode: string;
  categoryId: Exclude<GalleryCategoryId, 'all'>;
  categoryName: string;
  eventTitle: string;
  src: string;
  alt: string;
  caption: string;
  naturalWidth: number;
  naturalHeight: number;
}

export interface GalleryCategoryCollection {
  id: Exclude<GalleryCategoryId, 'all'>;
  sectionNumber: string;
  name: string;
  eventTitle: string;
  description: string;
  layoutVariant: GallerySectionLayoutVariant;
  images: GalleryImageItem[];
}

export const GALLERY_PAGE_HEADER = {
  breadcrumbParent: 'Home',
  breadcrumbCurrent: 'Gallery',
  kicker: 'Student Life & Campus Moments',
  heading: 'Our Gallery',
  supportingText:
    'Discover the moments, experiences, and achievements that make life at Capitol Hill College memorable.',
} as const;

export const GALLERY_CTA_CONTENT = {
  heading: 'Experience Campus Life Firsthand',
  supportingText:
    'Explore our academic programs, tour our Teku campus facilities, or connect with our admissions office to learn more about Capitol Hill College.',
  primaryLabel: 'Explore Academic Programs',
  secondaryLabel: 'Contact Us',
} as const;

/**
 * Complete, verified Capitol Hill College Gallery Collections (7 categories, 21 full-resolution images).
 * All image URLs and natural pixel dimensions were verified against the official Capitol Hill College
 * WordPress Media Library (HTTP 200 image/jpeg):
 * - Welcome Program identifier `f1=a2` maps to the verified asset `f1a2.jpg` (alt="f1=a2" on live site).
 * - Educational Tours and Quiz Competition are cleanly separated into distinct categories.
 */
export const GALLERY_COLLECTIONS: GalleryCategoryCollection[] = [
  {
    id: 'classroom',
    sectionNumber: '01',
    name: 'Classroom',
    eventTitle: 'Student Classroom Life – Capitol Hill College',
    description:
      'Students at Capitol Hill College attend classes in their official college dress, maintaining discipline and professionalism. The classroom environment promotes focused learning, active participation, and a positive academic atmosphere where students grow both academically and personally.',
    layoutVariant: 'classroom-diptych-portrait',
    images: [
      {
        id: 'gal-classroom-c1',
        assetCode: 'c1',
        categoryId: 'classroom',
        categoryName: 'Classroom',
        eventTitle: 'Student Classroom Life – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/c1-scaled.jpg',
        alt: 'Students in official Capitol Hill College uniform attending an interactive classroom lecture',
        caption: 'Focused classroom instruction and active student participation',
        naturalWidth: 2560,
        naturalHeight: 1183,
      },
      {
        id: 'gal-classroom-c3',
        assetCode: 'c3',
        categoryId: 'classroom',
        categoryName: 'Classroom',
        eventTitle: 'Student Classroom Life – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/c3.jpg',
        alt: 'Capitol Hill College students seated attentively during daily academic sessions',
        caption: 'Collaborative learning atmosphere inside the academic block',
        naturalWidth: 2048,
        naturalHeight: 1220,
      },
      {
        id: 'gal-classroom-class',
        assetCode: 'class',
        categoryId: 'classroom',
        categoryName: 'Classroom',
        eventTitle: 'Student Classroom Life – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/class.jpg',
        alt: 'Students engaged in daily coursework wearing Capitol Hill College uniform',
        caption: 'Academic discipline and peer learning in class',
        naturalWidth: 1440,
        naturalHeight: 2048,
      },
    ],
  },
  {
    id: 'sports',
    sectionNumber: '02',
    name: 'Sports',
    eventTitle: 'Capitol Hill College Sports Gallery',
    description:
      'Experience the energy and spirit of Capitol Hill College through our sports gallery. From football and basketball matches to inter-college competitions, this section showcases teamwork, dedication, and the achievements of our students in action.',
    layoutVariant: 'sports-feature-left',
    images: [
      {
        id: 'gal-sports-game',
        assetCode: 'game',
        categoryId: 'sports',
        categoryName: 'Sports',
        eventTitle: 'Capitol Hill College Sports Gallery',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/game.jpg',
        alt: 'Capitol Hill College students competing during an athletic match',
        caption: 'Team spirit and athletic competition among Capitol Hill College students',
        naturalWidth: 2048,
        naturalHeight: 1536,
      },
      {
        id: 'gal-sports-game1',
        assetCode: 'game1',
        categoryId: 'sports',
        categoryName: 'Sports',
        eventTitle: 'Capitol Hill College Sports Gallery',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/game1.jpg',
        alt: 'Student athletes in action during Capitol Hill College sports events',
        caption: 'On-court energy and sportsmanship during college tournaments',
        naturalWidth: 2048,
        naturalHeight: 1536,
      },
      {
        id: 'gal-sports-game12',
        assetCode: 'game12',
        categoryId: 'sports',
        categoryName: 'Sports',
        eventTitle: 'Capitol Hill College Sports Gallery',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/game12.jpg',
        alt: 'Students gathered for inter-class and inter-college sporting activities',
        caption: 'Dedication and teamwork across student sporting disciplines',
        naturalWidth: 2048,
        naturalHeight: 1536,
      },
    ],
  },
  {
    id: 'educational-tours',
    sectionNumber: '03',
    name: 'Educational Tours',
    eventTitle: 'Inter-Class Educational Tour – Capitol Hill College',
    description:
      'The Educational Tour at Capitol Hill College is designed to provide students with real-world learning experiences beyond the classroom. It helps students explore historical, cultural, and scientific places while enhancing practical knowledge, curiosity, and teamwork.',
    layoutVariant: 'tours-editorial-triptych',
    images: [
      {
        id: 'gal-tours-t1',
        assetCode: 't1',
        categoryId: 'educational-tours',
        categoryName: 'Educational Tours',
        eventTitle: 'Inter-Class Educational Tour – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/t1.jpg',
        alt: 'Capitol Hill College students and faculty during an inter-class educational tour',
        caption: 'Field observation and shared discovery beyond the classroom',
        naturalWidth: 2048,
        naturalHeight: 1536,
      },
      {
        id: 'gal-tours-tour2',
        assetCode: 'tour2',
        categoryId: 'educational-tours',
        categoryName: 'Educational Tours',
        eventTitle: 'Inter-Class Educational Tour – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/tour2.jpg',
        alt: 'Students exploring cultural and historical landmarks on a Capitol Hill College educational tour',
        caption: 'Exploring cultural and historical heritage as a cohort',
        naturalWidth: 2048,
        naturalHeight: 1536,
      },
      {
        id: 'gal-tours-tour3',
        assetCode: 'tour3',
        categoryId: 'educational-tours',
        categoryName: 'Educational Tours',
        eventTitle: 'Inter-Class Educational Tour – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/tour3.jpg',
        alt: 'Group photograph of Capitol Hill College students during an outdoor educational excursion',
        caption: 'Building camaraderie and practical perspective on study excursions',
        naturalWidth: 2048,
        naturalHeight: 1536,
      },
    ],
  },
  {
    id: 'welcome-program',
    sectionNumber: '04',
    name: 'Welcome Program',
    eventTitle: 'Welcome Program – Capitol Hill College',
    description:
      'Join us in celebrating the beginning of a new academic journey at Capitol Hill College. The Welcome Program is designed to introduce new students to campus life, faculty, and opportunities while creating a warm and friendly environment for learning and growth.',
    layoutVariant: 'welcome-feature-right',
    images: [
      {
        id: 'gal-welcome-wecome',
        assetCode: 'wecome',
        categoryId: 'welcome-program',
        categoryName: 'Welcome Program',
        eventTitle: 'Welcome Program – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/wecome.jpg',
        alt: 'New students welcomed by faculty and peers during the Capitol Hill College Welcome Program',
        caption: 'Welcoming incoming students into the Capitol Hill College community',
        naturalWidth: 2048,
        naturalHeight: 1365,
      },
      {
        id: 'gal-welcome-f1a2',
        assetCode: 'f1a2',
        categoryId: 'welcome-program',
        categoryName: 'Welcome Program',
        eventTitle: 'Welcome Program – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/f1a2.jpg',
        alt: 'Cultural performance and student orientation at the Capitol Hill College Welcome Program',
        caption: 'Student performances and orientation celebrations',
        naturalWidth: 2048,
        naturalHeight: 1365,
      },
      {
        id: 'gal-welcome-p',
        assetCode: 'p',
        categoryId: 'welcome-program',
        categoryName: 'Welcome Program',
        eventTitle: 'Welcome Program – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/p.jpg',
        alt: 'Faculty and students gathered during the Capitol Hill College orientation and welcome event',
        caption: 'Beginning a new academic chapter together',
        naturalWidth: 2048,
        naturalHeight: 1365,
      },
    ],
  },
  {
    id: 'quiz-competition',
    sectionNumber: '05',
    name: 'Quiz Competition',
    eventTitle: 'Inter-Class Quiz Competition – Capitol Hill College',
    description:
      'The Quiz Competition at Capitol Hill College is an engaging academic event designed to enhance knowledge, critical thinking, and teamwork among students. It encourages healthy competition while making learning fun and interactive across various subjects.',
    layoutVariant: 'quiz-panoramic-marquee',
    images: [
      {
        id: 'gal-quiz-uiz2',
        assetCode: 'uiz2',
        categoryId: 'quiz-competition',
        categoryName: 'Quiz Competition',
        eventTitle: 'Inter-Class Quiz Competition – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/uiz2-scaled.jpg',
        alt: 'Student teams seated on stage during the Inter-Class Quiz Competition at Capitol Hill College',
        caption: 'Inter-class teams competing across academic rounds',
        naturalWidth: 2560,
        naturalHeight: 1183,
      },
      {
        id: 'gal-quiz-extra2',
        assetCode: 'extra2',
        categoryId: 'quiz-competition',
        categoryName: 'Quiz Competition',
        eventTitle: 'Inter-Class Quiz Competition – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/extra2.jpg',
        alt: 'Audience and participants engaged during a Capitol Hill College quiz round',
        caption: 'Critical thinking and collaborative deliberation during quiz rounds',
        naturalWidth: 2048,
        naturalHeight: 1650,
      },
      {
        id: 'gal-quiz-quiz3',
        assetCode: 'quiz3',
        categoryId: 'quiz-competition',
        categoryName: 'Quiz Competition',
        eventTitle: 'Inter-Class Quiz Competition – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/quiz3.jpg',
        alt: 'Students participating actively in the Capitol Hill College Inter-Class Quiz Competition',
        caption: 'Healthy academic competition across subject disciplines',
        naturalWidth: 1950,
        naturalHeight: 1848,
      },
    ],
  },
  {
    id: 'science-practical',
    sectionNumber: '06',
    name: 'Science Practical',
    eventTitle: 'Science Practical Session – Capitol Hill College',
    description:
      'The Science Practical Sessions at Capitol Hill College provide students with hands-on laboratory experience to understand scientific concepts better. Through experiments in physics, chemistry, and biology, students develop observation skills, critical thinking, and practical knowledge.',
    layoutVariant: 'science-wide-plus-portraits',
    images: [
      {
        id: 'gal-science-main',
        assetCode: 'science',
        categoryId: 'science-practical',
        categoryName: 'Science Practical',
        eventTitle: 'Science Practical Session – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/science.jpg',
        alt: 'Capitol Hill College science students conducting laboratory experiments',
        caption: 'Supervised laboratory experimentation across physics, chemistry, and biology',
        naturalWidth: 2048,
        naturalHeight: 1153,
      },
      {
        id: 'gal-science-cience3',
        assetCode: 'cience3',
        categoryId: 'science-practical',
        categoryName: 'Science Practical',
        eventTitle: 'Science Practical Session – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/cience3.jpg',
        alt: 'Student performing careful measurement during a Capitol Hill College science practical session',
        caption: 'Precision observation and empirical lab technique',
        naturalWidth: 1153,
        naturalHeight: 2048,
      },
      {
        id: 'gal-science-s1',
        assetCode: 's1',
        categoryId: 'science-practical',
        categoryName: 'Science Practical',
        eventTitle: 'Science Practical Session – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/s1.jpg',
        alt: 'Hands-on laboratory apparatus work during a Capitol Hill College science practical',
        caption: 'Applying classroom theory in dedicated science laboratories',
        naturalWidth: 1153,
        naturalHeight: 2048,
      },
    ],
  },
  {
    id: 'farewell',
    sectionNumber: '07',
    name: 'Farewell',
    eventTitle: 'Farewell Program – Capitol Hill College',
    description:
      'The Farewell Program at Capitol Hill College is a heartfelt event dedicated to celebrating the achievements and memories of graduating students. It is a time to honor their journey, share experiences, and wish them success for their future endeavors.',
    layoutVariant: 'farewell-portrait-finale',
    images: [
      {
        id: 'gal-farewell-h1',
        assetCode: 'h1',
        categoryId: 'farewell',
        categoryName: 'Farewell',
        eventTitle: 'Farewell Program – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/h1.jpg',
        alt: 'Graduating students honored at the Capitol Hill College Farewell Program',
        caption: 'Honoring graduating students and their academic milestone',
        naturalWidth: 1285,
        naturalHeight: 1600,
      },
      {
        id: 'gal-farewell-ca1',
        assetCode: 'ca1',
        categoryId: 'farewell',
        categoryName: 'Farewell',
        eventTitle: 'Farewell Program – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/ca1.jpg',
        alt: 'Celebratory gathering during the Capitol Hill College Farewell Program',
        caption: 'Celebrating shared memories and achievements at farewell',
        naturalWidth: 2048,
        naturalHeight: 1152,
      },
      {
        id: 'gal-farewell-fare6',
        assetCode: 'fare6',
        categoryId: 'farewell',
        categoryName: 'Farewell',
        eventTitle: 'Farewell Program – Capitol Hill College',
        src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/fare6.jpg',
        alt: 'Students and faculty sharing farewell wishes at Capitol Hill College',
        caption: 'Sending off graduates with pride and warm wishes',
        naturalWidth: 1600,
        naturalHeight: 1200,
      },
    ],
  },
];

export const ALL_GALLERY_IMAGES: GalleryImageItem[] = GALLERY_COLLECTIONS.flatMap(
  (col) => col.images
);
