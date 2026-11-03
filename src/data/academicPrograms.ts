export const OFFICIAL_GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/GawWXEWEpCaCsAqdA';

export const OFFICIAL_CAMPUS_LOCATION = {
  collegeName: 'Capitol Hill College',
  address: 'Teku, Kathmandu, Nepal',
  telephone: '01-5312399',
  telephoneHref: 'tel:015312399',
  email: 'info.capitolhillcollege@gmail.com',
  emailHref: 'mailto:info.capitolhillcollege@gmail.com',
  googleMapsUrl: OFFICIAL_GOOGLE_MAPS_URL,
} as const;

export type AcademicProgramSlug =
  | 'management'
  | 'humanities'
  | 'science'
  | 'law'
  | 'bbs'
  | 'mbs';

export type AcademicDivisionId = 'neb-plus-two' | 'tribhuvan-university';

export interface ProgramSubjectItem {
  name: string;
  description: string;
}

export interface ProgramSubjectGroup {
  groupTitle: string;
  selectionNote: string;
  subjects: ProgramSubjectItem[];
}

export interface AcademicProgramRecord {
  slug: AcademicProgramSlug;
  routePath: `/academic-programs/${AcademicProgramSlug}`;
  navLabel: string;
  title: string;
  shortTitle: string;
  divisionId: AcademicDivisionId;
  divisionLabel: string;
  affiliation: string;
  affiliationShort: string;
  academicLevel: string;
  durationLabel: string;
  heroTagline: string;
  cardSummary: string;
  keyHighlights: string[];
  introduction: string;
  overviewParagraphs: string[];
  subjectGroups: ProgramSubjectGroup[];
  curriculumNote: string;
  campusSupportFacilities: string[];
  learningOutcomes: string[];
  careerPathways: string[];
  higherEducationOpportunities: string[];
  admissionVerificationNote: string;
  image: {
    src: string;
    alt: string;
    caption: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export const ACADEMIC_PROGRAMS: readonly AcademicProgramRecord[] = [
  {
    slug: 'management',
    routePath: '/academic-programs/management',
    navLabel: '+2 Management',
    title: '+2 Management',
    shortTitle: '+2 Management',
    divisionId: 'neb-plus-two',
    divisionLabel: 'NEB (+2) Programs',
    affiliation: 'National Examinations Board (NEB)',
    affiliationShort: 'NEB Affiliated',
    academicLevel: 'Higher Secondary (Grade 11 & Grade 12)',
    durationLabel: '2 Years (Grade 11 & 12)',
    heroTagline:
      'Foundational business, accounting, computing, and hospitality education preparing students for management degrees and professional enterprise.',
    cardSummary:
      'Covers core business concepts across Accounting, Business Studies, Computer Science, Hotel Management, Business Mathematics, and Tourism—developing practical communication, leadership, and decision-making abilities.',
    keyHighlights: [
      'Accounting & Business Studies',
      'Computer Science / Hotel Management',
      'Business Mathematics & Tourism',
    ],
    introduction:
      'The +2 Management program at Capitol Hill College, affiliated with the National Examinations Board (NEB), introduces Grade 11 and Grade 12 students to essential principles of commerce, accounting, organizational management, computing, and hospitality.',
    overviewParagraphs: [
      'Designed for students aspiring toward business leadership, banking, entrepreneurship, information systems, or hospitality management, the +2 Management stream combines structured classroom instruction with practical skill development.',
      'At our Teku, Kathmandu campus, theoretical coursework in financial accounting and business operations is reinforced through supervised practical sessions in dedicated Computer Science and Hotel Management laboratories alongside co-curricular presentations, quizzes, and educational visits.',
    ],
    subjectGroups: [
      {
        groupTitle: 'Core Foundation Subjects',
        selectionNote:
          'Prescribed foundational language and social studies coursework under the National Examinations Board (NEB) Grade 11 & 12 framework.',
        subjects: [
          {
            name: 'English',
            description:
              'Academic reading, business writing, analytical comprehension, and professional communication.',
          },
          {
            name: 'Nepali',
            description:
              'Language proficiency, formal composition, literature, and clear expression.',
          },
          {
            name: 'Social Studies & Life Skills Education / Mathematics Framework',
            description:
              'Civic understanding, contemporary social context, analytical life skills, or quantitative foundations as prescribed by NEB.',
          },
        ],
      },
      {
        groupTitle: 'Major & Elective Stream Subjects',
        selectionNote:
          'Subject combinations offered within the +2 Management stream at Capitol Hill College (students select approved subject combinations during admission counseling).',
        subjects: [
          {
            name: 'Accounting',
            description:
              'Financial accounting principles, systematic bookkeeping, cost concepts, and financial statement analysis.',
          },
          {
            name: 'Business Studies',
            description:
              'Core management principles, organizational structure, business operations, and entrepreneurship.',
          },
          {
            name: 'Computer Science',
            description:
              'Digital literacy, office and database applications, computer systems, and foundational programming.',
          },
          {
            name: 'Hotel Management',
            description:
              'Hospitality operations, front office procedures, culinary fundamentals, and food and beverage service.',
          },
          {
            name: 'Business Mathematics',
            description:
              'Commercial calculations, quantitative analysis, probability, statistics, and financial mathematics.',
          },
          {
            name: 'Tourism and Mountaineering Studies',
            description:
              'Tourism management fundamentals, travel operations, heritage tourism, and mountaineering basics in Nepal.',
          },
        ],
      },
    ],
    curriculumNote:
      'Optional and stream subject combinations (such as Computer Science, Hotel Management, Business Mathematics, or Tourism and Mountaineering) are selected according to NEB curriculum rules and active group schedules confirmed during admission counseling.',
    campusSupportFacilities: [
      'Dedicated Computer Science Laboratory for practical computing and software exercises',
      'Dedicated Hotel Management Laboratory for hospitality and service practicals',
      'Audio-visual classrooms and academic reference library in Teku, Kathmandu',
    ],
    learningOutcomes: [
      'Understand fundamental accounting records, financial statements, and commercial calculations.',
      'Analyze how business organizations plan, operate, and respond to economic environments.',
      'Build practical proficiency in computing tools or hospitality operations depending on chosen electives.',
      'Strengthen leadership, teamwork, presentation, and analytical decision-making skills.',
    ],
    careerPathways: [
      'Business Administration & Operations Support',
      'Banking, Microfinance & Financial Services',
      'Accounting & Bookkeeping Foundations',
      'Entrepreneurship & Small Business Ventures',
      'Marketing, Sales & Client Relations',
      'Hospitality, Travel & Tourism Sector Pathways',
    ],
    higherEducationOpportunities: [
      'Bachelor of Business Studies (BBS) — offered at Capitol Hill College under Tribhuvan University',
      'Bachelor of Business Administration (BBA) & Bachelor of Business Management (BBM)',
      'Bachelor of Information Management (BIM) & Bachelor of Computer Application (BCA)',
      'Bachelor of Hotel Management (BHM) & Bachelor of Travel and Tourism Management (BTTM)',
      'Chartered Accountancy (CA) & ACCA professional accounting pathways',
    ],
    admissionVerificationNote:
      'SEE grade eligibility, active subject-combination groups, class shift timings, and current-session fee or scholarship details should be confirmed directly with the Capitol Hill College Admissions Office.',
    image: {
      src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/c1-scaled.jpg',
      alt: 'Capitol Hill College students attending an interactive classroom session in Teku, Kathmandu',
      caption: 'Interactive classroom learning at Capitol Hill College, Teku, Kathmandu.',
    },
    seo: {
      title: '+2 Management (NEB) | Academic Programs — Capitol Hill College',
      description:
        'Explore the NEB-affiliated +2 Management program at Capitol Hill College in Teku, Kathmandu, covering Accounting, Business Studies, Computer Science, Hotel Management, Business Mathematics, and Tourism.',
    },
  },
  {
    slug: 'humanities',
    routePath: '/academic-programs/humanities',
    navLabel: '+2 Humanities',
    title: '+2 Humanities',
    shortTitle: '+2 Humanities',
    divisionId: 'neb-plus-two',
    divisionLabel: 'NEB (+2) Programs',
    affiliation: 'National Examinations Board (NEB)',
    affiliationShort: 'NEB Affiliated',
    academicLevel: 'Higher Secondary (Grade 11 & Grade 12)',
    durationLabel: '2 Years (Grade 11 & 12)',
    heroTagline:
      'Critical inquiry into human society, media, demographics, literature, and culture under the National Examinations Board.',
    cardSummary:
      'Emphasizes human interactions, social institutions, media studies, demographic analysis, and literary expression through Sociology, Mass Communication, Population Studies, Tourism, and Optional English.',
    keyHighlights: [
      'Sociology & Population Studies',
      'Mass Communication & Media',
      'Optional English & Tourism',
    ],
    introduction:
      'The +2 Humanities program at Capitol Hill College, affiliated with the National Examinations Board (NEB), provides an intellectually engaging higher secondary education centered on society, culture, communication, demographics, and literature.',
    overviewParagraphs: [
      'Designed for students curious about social structures, public communication, journalism, literature, and community development, the +2 Humanities stream nurtures analytical reading, ethical reflection, and persuasive writing.',
      'Through classroom seminars, debates, inter-class quizzes, field observation, and library research at our Teku campus, students build strong interpretive and communication skills suited for diverse university degrees in social sciences, media, arts, and public service.',
    ],
    subjectGroups: [
      {
        groupTitle: 'Core Foundation Subjects',
        selectionNote:
          'Compulsory language and social foundation coursework prescribed under the NEB Higher Secondary curriculum.',
        subjects: [
          {
            name: 'English',
            description:
              'Critical reading, academic essay writing, communication skills, and textual interpretation.',
          },
          {
            name: 'Nepali',
            description:
              'Nepali literature, grammar, formal writing, and expressive discourse.',
          },
          {
            name: 'Social Studies & Life Skills Education',
            description:
              'Social awareness, civic responsibility, contemporary Nepali and global issues, and life skills.',
          },
        ],
      },
      {
        groupTitle: 'Major & Elective Humanities Subjects',
        selectionNote:
          'Humanities discipline subjects listed for the stream at Capitol Hill College (exact student subject pairings follow NEB subject-group guidelines).',
        subjects: [
          {
            name: 'Sociology',
            description:
              'Study of human society, social relationships, cultural diversity, community structures, and social institutions.',
          },
          {
            name: 'Mass Communication',
            description:
              'Media studies, journalism fundamentals, communication theories, public media ethics, and digital media practices.',
          },
          {
            name: 'Population Studies',
            description:
              'Demographic concepts, population trends, migration, urbanization, and foundational social statistics.',
          },
          {
            name: 'Optional English',
            description:
              'Advanced literary appreciation, prose, poetry, drama, creative writing, and literary analysis.',
          },
          {
            name: 'Tourism and Mountaineering Studies',
            description:
              'Cultural and heritage tourism principles, travel operations, and mountaineering foundations.',
          },
        ],
      },
    ],
    curriculumNote:
      'Students select approved optional subject combinations from the Humanities offerings above in accordance with NEB regulations and active session subject groups confirmed at enrollment.',
    campusSupportFacilities: [
      'Quiet academic library with social science, journalism, and literary reference resources',
      'Regular debates, public speaking forums, quizzes, and co-curricular cultural programs',
      'Educational tours and field exposure visits organized by the college',
    ],
    learningOutcomes: [
      'Examine social institutions, cultural change, and demographic patterns using structured analytical frameworks.',
      'Communicate clearly and persuasively across written journalism, academic essays, and public speaking.',
      'Interpret literary texts, media messages, and public policy discussions critically and ethically.',
      'Develop research, observation, and interpersonal skills essential for social and civic professions.',
    ],
    careerPathways: [
      'Journalism, Broadcast & Digital Media',
      'Social Work, Community Development & NGOs/INGOs',
      'Education, Teaching & Academic Writing',
      'Civil Services (Lok Sewa) & Public Administration Pathways',
      'Sociological & Demographic Research Assistance',
      'Cultural Heritage, Travel & Tourism Operations',
    ],
    higherEducationOpportunities: [
      'Bachelor of Arts (BA) in Sociology, Journalism & Mass Communication, English, or Population Studies',
      'Bachelor of Social Work (BSW) & Development Studies',
      'Bachelor of Arts Bachelor of Legislative Law (B.A. LL.B.)',
      'Bachelor of Public Administration (BPA) & International Relations',
      'Bachelor of Travel and Tourism Management (BTTM) & Bachelor of Computer Application (BCA — subject to university rules)',
    ],
    admissionVerificationNote:
      'SEE grade requirements, available optional subject pairings, shift schedules, and current tuition or scholarship provisions should be verified with the Capitol Hill College Admissions Desk.',
    image: {
      src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/uiz2-scaled.jpg',
      alt: 'Capitol Hill College students participating in an academic quiz and discussion program',
      caption: 'Academic dialogue, quizzes, and student engagement at Capitol Hill College.',
    },
    seo: {
      title: '+2 Humanities (NEB) | Academic Programs — Capitol Hill College',
      description:
        'Explore the NEB-affiliated +2 Humanities program at Capitol Hill College in Teku, Kathmandu, featuring Sociology, Mass Communication, Population Studies, Optional English, and Tourism.',
    },
  },
  {
    slug: 'science',
    routePath: '/academic-programs/science',
    navLabel: '+2 Science',
    title: '+2 Science',
    shortTitle: '+2 Science',
    divisionId: 'neb-plus-two',
    divisionLabel: 'NEB (+2) Programs',
    affiliation: 'National Examinations Board (NEB)',
    affiliationShort: 'NEB Affiliated',
    academicLevel: 'Higher Secondary (Grade 11 & Grade 12)',
    durationLabel: '2 Years (Grade 11 & 12)',
    heroTagline:
      'Rigorous empirical inquiry and quantitative foundations across Physics, Chemistry, Mathematics, Biology, and Computer Science.',
    cardSummary:
      'Fosters scientific literacy, laboratory precision, and analytical problem-solving through Physics, Chemistry, Mathematics, and Biology or Computer Science in separate subject-specific laboratories.',
    keyHighlights: [
      'Physics, Chemistry & Mathematics',
      'Biology / Computer Science Groups',
      'Separate Subject Laboratories',
    ],
    introduction:
      'The +2 Science program at Capitol Hill College, affiliated with the National Examinations Board (NEB), delivers a rigorous Grade 11 and Grade 12 scientific foundation for students preparing for medicine, engineering, computing, and pure or applied sciences.',
    overviewParagraphs: [
      'Structured to cultivate scientific literacy, critical reasoning, and quantitative accuracy, the +2 Science curriculum pairs conceptual classroom lectures with systematic experimental work.',
      'Capitol Hill College maintains separate, well-equipped Physics, Chemistry, Biology, and Computer Science laboratories at its Teku campus so students gain direct hands-on experience in observation, measurement, and scientific reporting.',
    ],
    subjectGroups: [
      {
        groupTitle: 'Core Foundation Subjects',
        selectionNote:
          'Compulsory language coursework prescribed by the National Examinations Board (NEB) for the Science stream.',
        subjects: [
          {
            name: 'English',
            description:
              'Scientific and academic comprehension, technical writing, and structured communication.',
          },
          {
            name: 'Nepali',
            description:
              'Compulsory national language coursework, composition, and literary studies per NEB structure.',
          },
        ],
      },
      {
        groupTitle: 'Core Scientific & Stream Elective Subjects',
        selectionNote:
          'Core physical sciences and mathematics paired with either the Biology group or Computer Science group according to NEB Science stream norms.',
        subjects: [
          {
            name: 'Physics',
            description:
              'Mechanics, heat and thermodynamics, waves and optics, electricity and magnetism, and modern physics with laboratory experiments.',
          },
          {
            name: 'Chemistry',
            description:
              'Physical, inorganic, and organic chemistry—covering atomic structure, chemical bonding, reactions, periodicity, and qualitative/quantitative lab analysis.',
          },
          {
            name: 'Mathematics',
            description:
              'Algebra, trigonometry, analytical geometry, vectors, calculus, and statistics essential for science and engineering.',
          },
          {
            name: 'Biology (Biological Group Option)',
            description:
              'Botany and zoology covering cell biology, genetics, human physiology, biodiversity, and ecology with specimen and microscopy practicals.',
          },
          {
            name: 'Computer Science (Physical / Computer Group Option)',
            description:
              'Programming fundamentals, algorithms, data structures, database management, web technologies, and digital logic systems.',
          },
        ],
      },
    ],
    curriculumNote:
      'Students choose between approved Biological and Physical/Computer Science subject combinations in line with NEB Grade 11 & 12 curriculum regulations and their intended undergraduate entrance goals.',
    campusSupportFacilities: [
      'Separate dedicated Physics, Chemistry, and Biology laboratories with faculty supervision',
      'Dedicated Computer Science laboratory with modern workstations and internet access',
      'Academic reference library stocked with science textbooks, journals, and past board references',
    ],
    learningOutcomes: [
      'Apply mathematical modeling and physical laws to solve complex quantitative problems.',
      'Conduct safe, accurate laboratory experiments, record empirical observations, and interpret data.',
      'Build strong conceptual readiness for competitive medical, engineering, and IT entrance examinations.',
      'Develop disciplined analytical study habits, scientific curiosity, and technical communication skills.',
    ],
    careerPathways: [
      'Medicine, Dentistry, Nursing & Allied Health Sciences (following university degrees)',
      'Civil, Computer, Electrical, Mechanical & Architecture Engineering',
      'Software Development, Data Science & Information Technology',
      'Pharmacy, Biotechnology, Microbiology & Environmental Sciences',
      'Scientific Research, Aviation, Agriculture & Forestry',
    ],
    higherEducationOpportunities: [
      'Medical & Health Degrees: MBBS, BDS, B.Sc. Nursing, B.Pharm, BPH, BMLT (Biology group)',
      'Engineering & Architecture: B.E. (Civil, Computer, Electronics, Electrical, Mechanical), B.Arch',
      'IT & Computing: B.Sc. CSIT, BIT, BCA, BIM, Software Engineering',
      'Pure & Applied Sciences: B.Sc. (Physics, Chemistry, Biology, Statistics), B.Sc. Agriculture, B.Sc. Forestry',
      'Management & Professional Pathways: BBS, BBA, Chartered Accountancy (CA), B.A. LL.B.',
    ],
    admissionVerificationNote:
      'Current-session SEE GPA cutoffs, entrance test requirements, laboratory schedules, and merit scholarship criteria must be confirmed with the Capitol Hill College Admissions Office.',
    image: {
      src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/science.jpg',
      alt: 'Capitol Hill College +2 Science students performing supervised laboratory practicals',
      caption: 'Supervised +2 Science laboratory practical session at Capitol Hill College.',
    },
    seo: {
      title: '+2 Science (NEB) | Academic Programs — Capitol Hill College',
      description:
        'Explore the NEB-affiliated +2 Science program at Capitol Hill College in Teku, Kathmandu, featuring Physics, Chemistry, Mathematics, Biology, and Computer Science with separate dedicated laboratories.',
    },
  },
  {
    slug: 'law',
    routePath: '/academic-programs/law',
    navLabel: '+2 Law',
    title: '+2 Law',
    shortTitle: '+2 Law',
    divisionId: 'neb-plus-two',
    divisionLabel: 'NEB (+2) Programs',
    affiliation: 'National Examinations Board (NEB)',
    affiliationShort: 'NEB Affiliated',
    academicLevel: 'Higher Secondary (Grade 11 & Grade 12)',
    durationLabel: '2 Years (Grade 11 & 12)',
    heroTagline:
      'Foundational legal education in constitutional governance, civil justice, court procedure, and legal drafting at the higher secondary level.',
    cardSummary:
      'Introduces Grade 11 and 12 students to legal principles, justice systems, civic rights, Constitutional Law, Civil Law, Procedural Law, and Legal Drafting to build strong reasoning and advocacy skills.',
    keyHighlights: [
      'Constitutional & Civil Law',
      'Procedural Law & Justice System',
      'Legal Drafting & Civic Reasoning',
    ],
    introduction:
      'The +2 Law program at Capitol Hill College, affiliated with the National Examinations Board (NEB), is a specialized higher secondary stream offering early academic grounding in jurisprudence, constitutionalism, civil rights, and legal procedure.',
    overviewParagraphs: [
      'Introduced to serve students interested in law, judiciary studies, public policy, human rights, and governance right after SEE, the +2 Law stream demystifies how legal institutions operate in Nepal and internationally.',
      'Through structured study of constitutional provisions, civil justice, procedural rules, and practical legal drafting—supported by debates, mooting-style discussions, and reference reading—students cultivate logical argumentation, ethical judgment, and clear formal writing.',
    ],
    subjectGroups: [
      {
        groupTitle: 'Core Foundation Subjects',
        selectionNote:
          'Compulsory language and social foundation subjects prescribed under the NEB Grade 11 & 12 framework.',
        subjects: [
          {
            name: 'English',
            description:
              'Precise comprehension, formal argumentation, legal vocabulary, and structured writing.',
          },
          {
            name: 'Nepali',
            description:
              'Formal Nepali composition, comprehension, and official terminology essential for Nepali legal practice.',
          },
          {
            name: 'Social Studies & Life Skills Education',
            description:
              'Civic institutions, social justice context, governance awareness, and ethical life skills.',
          },
        ],
      },
      {
        groupTitle: 'Core Legal Stream Subjects',
        selectionNote:
          'Specialized Grade 11 & 12 legal subjects highlighted in Capitol Hill College’s +2 Law curriculum.',
        subjects: [
          {
            name: 'Constitutional Law',
            description:
              'Constitutional principles, fundamental rights and duties, state organs, federalism, and governance structure.',
          },
          {
            name: 'Civil Law and Justice',
            description:
              'Principles of civil rights, property and contract foundations, legal obligations, and the civil justice system.',
          },
          {
            name: 'Procedural Law',
            description:
              'Introduction to court procedures, stages of litigation, rules of evidence, and judicial processes.',
          },
          {
            name: 'Legal Drafting',
            description:
              'Practical preparation of formal legal documents, petitions, applications, contracts, affidavits, and case briefs.',
          },
        ],
      },
    ],
    curriculumNote:
      'Year-by-year Grade 11 and Grade 12 legal papers (such as General Principles of Law, Nepalese Legal System, Human Rights, or Optional papers) follow the official NEB Law curriculum; confirm exact session paper allocation with the academic office.',
    campusSupportFacilities: [
      'Academic library with constitutional texts, legal references, and quiet reading space',
      'Debate forums, public speaking events, and analytical discussion sessions',
      'Faculty mentorship preparing students for undergraduate law entrance examinations',
    ],
    learningOutcomes: [
      'Understand Nepal’s constitutional framework, fundamental rights, civic duties, and judicial structure.',
      'Distinguish between substantive civil law principles and procedural court rules.',
      'Draft structured legal applications, formal notices, summaries, and analytical arguments in English and Nepali.',
      'Think critically, evaluate evidence logically, and articulate reasoned positions in debate and writing.',
    ],
    careerPathways: [
      'Advocate / Legal Practitioner (upon completing a recognized university law degree and Bar Council licensing)',
      'Judicial Service, Court Administration & Public Prosecution Pathways',
      'Corporate Legal Compliance & Contract Advisory',
      'Civil Services (Lok Sewa), Diplomacy & Public Administration',
      'Human Rights Advocacy, Policy Research & Legal Journalism',
    ],
    higherEducationOpportunities: [
      'Five-Year Integrated Bachelor of Arts Bachelor of Legislative Law (B.A. LL.B.)',
      'Bachelor of Business Management LL.B. (B.B.M. LL.B.) & Comparative Law Degrees',
      'Bachelor of Arts (BA) in Political Science, International Relations, Sociology, or Journalism',
      'Bachelor of Public Administration (BPA) & Bachelor of Social Work (BSW)',
    ],
    admissionVerificationNote:
      'SEE eligibility criteria, exact Grade 11/12 NEB paper combinations, intake seats, and fee details for +2 Law should be verified directly with the Capitol Hill College Admissions Office.',
    image: {
      src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/05/library1.png',
      alt: 'Capitol Hill College academic library and reference study environment in Teku, Kathmandu',
      caption: 'Reference study and legal reading resources at Capitol Hill College.',
    },
    seo: {
      title: '+2 Law (NEB) | Academic Programs — Capitol Hill College',
      description:
        'Explore the NEB-affiliated +2 Law program at Capitol Hill College in Teku, Kathmandu, covering Constitutional Law, Civil Law and Justice, Procedural Law, and Legal Drafting.',
    },
  },
  {
    slug: 'bbs',
    routePath: '/academic-programs/bbs',
    navLabel: 'BBS',
    title: 'Bachelor of Business Studies (BBS)',
    shortTitle: 'BBS',
    divisionId: 'tribhuvan-university',
    divisionLabel: 'Tribhuvan University Programs',
    affiliation: 'Tribhuvan University (TU) — Faculty of Management',
    affiliationShort: 'Tribhuvan University Affiliated',
    academicLevel: 'Undergraduate Degree (Bachelor’s Level)',
    durationLabel: '4 Years Undergraduate Program',
    heroTagline:
      'A comprehensive four-year Tribhuvan University undergraduate degree developing competent managers, financial analysts, and entrepreneurs.',
    cardSummary:
      'Equips undergraduate students with rigorous grounding in Accounting, Finance, Marketing, Business Management, Human Resource Management, Economics, Business Statistics, and Business Communication.',
    keyHighlights: [
      '4-Year TU Faculty of Management Degree',
      'Accounting, Finance & Marketing',
      'Management, Economics & Business Statistics',
    ],
    introduction:
      'The Bachelor of Business Studies (BBS) at Capitol Hill College is a four-year undergraduate degree affiliated with Tribhuvan University (TU), designed to build analytical competence and practical management leadership for dynamic business environments.',
    overviewParagraphs: [
      'Combining theoretical management foundations with applied financial, economic, and organizational analysis, the four-year BBS curriculum prepares graduates to take on professional responsibilities across private corporations, commercial banks, insurance companies, public enterprises, and entrepreneurial ventures.',
      'Guided by experienced Management, Accounting, Finance, and Economics faculty at our Teku campus, students progress from core business communication, economics, and quantitative methods into specialized concentration study and final-year business research.',
    ],
    subjectGroups: [
      {
        groupTitle: 'Core Business & Analytical Disciplines',
        selectionNote:
          'Foundational and functional management disciplines studied across the four-year Tribhuvan University BBS curriculum.',
        subjects: [
          {
            name: 'Accounting',
            description:
              'Financial accounting, cost and management accounting, taxation concepts, and auditing foundations.',
          },
          {
            name: 'Finance',
            description:
              'Corporate finance, financial management, capital budgeting, working capital, and investment analysis.',
          },
          {
            name: 'Marketing',
            description:
              'Principles of marketing, consumer behavior, market analysis, brand management, and marketing strategy.',
          },
          {
            name: 'Business Management',
            description:
              'Principles of management, organizational operations, strategic planning, and entrepreneurship.',
          },
          {
            name: 'Human Resource Management',
            description:
              'Talent acquisition, training and development, performance appraisal, and organizational behavior.',
          },
        ],
      },
      {
        groupTitle: 'Quantitative, Economic & Communication Foundations',
        selectionNote:
          'Analytical and professional support subjects prescribed under Tribhuvan University’s BBS structure (plus final-year concentration/project requirements per TU norms).',
        subjects: [
          {
            name: 'Business Mathematics & Statistics',
            description:
              'Quantitative methods, statistical inference, probability, data analysis, and business forecasting.',
          },
          {
            name: 'Business Economics',
            description:
              'Microeconomic and macroeconomic analysis, market structures, and the national/global business environment.',
          },
          {
            name: 'Business Communication',
            description:
              ' Managerial writing, business correspondence, report preparation, and executive presentation skills.',
          },
        ],
      },
    ],
    curriculumNote:
      'Annual paper structure, business law/taxation modules, final-year functional concentration choices (Accounting, Finance, Management, or Marketing), and project report guidelines follow Tribhuvan University’s official Faculty of Management syllabus.',
    campusSupportFacilities: [
      'Experienced Management, Accounting, Finance, and Economics faculty members',
      'Reference library with TU syllabus texts, financial journals, and quiet study space',
      'Structured morning/day academic environment in central Teku, Kathmandu (confirm exact shift timing with office)',
    ],
    learningOutcomes: [
      'Prepare, interpret, and evaluate financial statements, cost structures, and corporate investment decisions.',
      'Apply economic reasoning and statistical methods to real-world organizational and market problems.',
      'Manage teams, human resource processes, and marketing initiatives with professional ethics.',
      'Conduct structured business research and communicate findings through clear reports and presentations.',
    ],
    careerPathways: [
      'Commercial Banking, Development Banks & Financial Institutions',
      'Accounting, Taxation, Internal Control & Auditing Firms',
      'Corporate Management, Operations & Business Development',
      'Insurance, Capital Markets & Investment Advisory',
      'Marketing, Brand Management & Supply Chain Coordination',
      'Nepal Civil Services (Lok Sewa), Public Enterprises & Entrepreneurship',
    ],
    higherEducationOpportunities: [
      'Master of Business Studies (MBS) — offered at Capitol Hill College under Tribhuvan University',
      'Master of Business Administration (MBA) & Master of Business Management (MBM)',
      'Master of Public Administration (MPA) & Master of Finance and Control (MFC)',
      'Professional Qualifications: Chartered Accountancy (CA), ACCA, and CFA pathways',
    ],
    admissionVerificationNote:
      'Applicants must hold 10+2 (NEB) or an equivalent qualification recognized by Tribhuvan University. Exact minimum grade requirements, TU registration deadlines, shift timings, and fee structures should be confirmed with the Admissions Office.',
    image: {
      src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/04/c3.jpg',
      alt: 'Undergraduate business classroom lecture at Capitol Hill College, Teku, Kathmandu',
      caption: 'Undergraduate BBS academic coursework at Capitol Hill College.',
    },
    seo: {
      title: 'Bachelor of Business Studies (BBS) | Tribhuvan University — Capitol Hill College',
      description:
        'Study the 4-year Tribhuvan University affiliated Bachelor of Business Studies (BBS) at Capitol Hill College in Teku, Kathmandu, covering Accounting, Finance, Marketing, HR, and Economics.',
    },
  },
  {
    slug: 'mbs',
    routePath: '/academic-programs/mbs',
    navLabel: 'MBS',
    title: 'Master of Business Studies (MBS)',
    shortTitle: 'MBS',
    divisionId: 'tribhuvan-university',
    divisionLabel: 'Tribhuvan University Programs',
    affiliation: 'Tribhuvan University (TU) — Faculty of Management',
    affiliationShort: 'Tribhuvan University Affiliated',
    academicLevel: 'Postgraduate Degree (Master’s Level)',
    durationLabel: '2 Years Postgraduate Program',
    heroTagline:
      'Advanced postgraduate management education under Tribhuvan University cultivating strategic leadership, executive decision-making, and business research.',
    cardSummary:
      'A two-year Tribhuvan University Master’s degree focusing on Managerial Economics, Financial Management, Marketing Management, Strategic Management, Human Resource Management, Organizational Behavior, International Business, and Research Methodology.',
    keyHighlights: [
      '2-Year TU Postgraduate Degree',
      'Strategic, Financial & Marketing Management',
      'Research Methodology & International Business',
    ],
    introduction:
      'The Master of Business Studies (MBS) at Capitol Hill College is a two-year postgraduate management degree affiliated with Tribhuvan University (TU), designed to prepare high-level managers, analysts, academics, and organizational leaders.',
    overviewParagraphs: [
      'Built upon Tribhuvan University’s graduate management framework, the MBS program deepens analytical mastery across corporate finance, managerial economics, strategic planning, marketing leadership, human capital development, and international business.',
      'Emphasis is placed on case-oriented discussion, empirical research methodology, and independent scholarly inquiry—equipping graduates to assume managerial and advisory roles across private industry, banking, public sector institutions, NGOs, INGOs, and multinational organizations.',
    ],
    subjectGroups: [
      {
        groupTitle: 'Core Graduate Management & Strategy Areas',
        selectionNote:
          'Advanced functional and strategic management subjects covered within the Tribhuvan University MBS program.',
        subjects: [
          {
            name: 'Strategic Management',
            description:
              'Corporate strategy formulation, competitive positioning, industry analysis, and long-term governance.',
          },
          {
            name: 'Financial Management',
            description:
              'Advanced corporate finance, portfolio and investment analysis, capital structure, and financial risk management.',
          },
          {
            name: 'Marketing Management',
            description:
              'Strategic marketing planning, consumer insights, brand equity management, and integrated market strategy.',
          },
          {
            name: 'Human Resource Management',
            description:
              'Strategic human resource planning, leadership development, performance systems, and labor relations.',
          },
          {
            name: 'Organizational Behavior',
            description:
              'Individual motivation, leadership dynamics, organizational culture, negotiation, and change management.',
          },
        ],
      },
      {
        groupTitle: 'Economic Analysis, Global Context & Research',
        selectionNote:
          'Analytical economics, global trade context, and graduate research methodology under TU Faculty of Management norms (plus specialization/dissertation requirements).',
        subjects: [
          {
            name: 'Managerial Economics',
            description:
              'Application of microeconomic and macroeconomic theory to pricing, demand forecasting, and executive decision-making.',
          },
          {
            name: 'International Business',
            description:
              'Global business operations, international trade frameworks, cross-cultural management, and foreign market entry.',
          },
          {
            name: 'Research Methodology',
            description:
              'Quantitative and qualitative business research design, statistical analysis, academic writing, and thesis/dissertation preparation.',
          },
        ],
      },
    ],
    curriculumNote:
      'Semester/credit distribution, CMAT entrance requirements, functional specialization electives (Finance, Accountancy, Management, or Marketing), and thesis guidelines follow Tribhuvan University Faculty of Management regulations.',
    campusSupportFacilities: [
      'Senior graduate faculty with academic and industry research experience',
      'Library access for graduate management texts, research methodology references, and thesis preparation',
      'Focused seminar and discussion environment at our Teku, Kathmandu campus',
    ],
    learningOutcomes: [
      'Formulate and evaluate organization-wide strategies in complex domestic and international markets.',
      'Synthesize financial, economic, and market data to guide executive-level decisions under uncertainty.',
      'Design and execute rigorous independent business research and scholarly dissertations.',
      'Lead multidisciplinary teams effectively with strong ethical governance and interpersonal insight.',
    ],
    careerPathways: [
      'Mid- to Senior-Level Corporate & Operations Management',
      'Commercial Banking, Investment Analysis & Financial Risk Roles',
      'Public Sector Enterprises, Policy Advisory & Civil Service Leadership',
      'Development Sector Management across NGOs, INGOs & Multilateral Projects',
      'University Lecturing, Academic Research & Business Consulting',
      'Multinational Business Operations & Strategic Entrepreneurship',
    ],
    higherEducationOpportunities: [
      'Master of Philosophy (M.Phil.) in Management',
      'Doctor of Philosophy (PhD) & Doctor of Business Administration (DBA) in Management, Finance, or Economics',
      'Postgraduate Executive Fellowships & International Research Pathways',
    ],
    admissionVerificationNote:
      'Applicants require a recognized Bachelor’s degree (such as BBS, BBA, or equivalent) and must satisfy Tribhuvan University Faculty of Management entrance (CMAT) and intake rules. Please confirm active intake schedule, seat availability, class timings, and fee structure with Capitol Hill College administration.',
    image: {
      src: 'https://capitolhillcollege.edu.np/wp-content/uploads/2026/05/building.png',
      alt: 'Capitol Hill College main campus building in Teku, Kathmandu',
      caption: 'Capitol Hill College campus in Teku, Kathmandu — offering NEB and Tribhuvan University programs.',
    },
    seo: {
      title: 'Master of Business Studies (MBS) | Tribhuvan University — Capitol Hill College',
      description:
        'Explore the 2-year Tribhuvan University affiliated Master of Business Studies (MBS) postgraduate program at Capitol Hill College in Teku, Kathmandu.',
    },
  },
];

export const NEB_PLUS_TWO_PROGRAMS: readonly AcademicProgramRecord[] =
  ACADEMIC_PROGRAMS.filter((program) => program.divisionId === 'neb-plus-two');

export const TU_DEGREE_PROGRAMS: readonly AcademicProgramRecord[] =
  ACADEMIC_PROGRAMS.filter((program) => program.divisionId === 'tribhuvan-university');

const PROGRAM_SLUG_MAP = new Map<string, AcademicProgramRecord>(
  ACADEMIC_PROGRAMS.map((program) => [program.slug, program]),
);

export function isAcademicProgramSlug(value: string): value is AcademicProgramSlug {
  return PROGRAM_SLUG_MAP.has(value);
}

export function getAcademicProgramBySlug(
  slug: string | null | undefined,
): AcademicProgramRecord | undefined {
  if (!slug) return undefined;
  return PROGRAM_SLUG_MAP.get(slug.toLowerCase());
}
