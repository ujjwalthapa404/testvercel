import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Atom,
  BookOpen,
  Briefcase,
  Calculator,
  Feather,
  FlaskConical,
  Globe,
  Landmark,
  Library,
  Microscope,
  Monitor,
  Radio,
  RotateCcw,
  Scale,
  Search,
  Sigma,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  ACADEMIC_STREAMS,
  AcademicDepartment,
  AcademicStreamId,
  DepartmentIconKey,
  FACULTY_DEPARTMENTS,
  FACULTY_SECTION_COPY,
  FacultyMemberEntry,
  GENERAL_STAFF_MEMBERS,
  GENERAL_STAFF_SECTION_COPY,
  GeneralStaffMember,
  LEADERSHIP_MEMBERS,
  LEADERSHIP_SECTION_COPY,
  LeadershipMember,
  TEAM_CTA_COPY,
  TEAM_HERO_CONTENT,
} from '../data/team';
import { CollegeImage } from '../components/CollegeImage';
import { TeamAvatar } from '../components/TeamAvatar';

/* -------------------------------------------------------------------------- */
/* Subject Icon Mapper                                                        */
/* -------------------------------------------------------------------------- */

const DepartmentIcon: React.FC<{ iconKey: DepartmentIconKey; className?: string }> = ({
  iconKey,
  className = 'w-4 h-4',
}) => {
  switch (iconKey) {
    case 'book-open':
      return <BookOpen className={className} aria-hidden="true" />;
    case 'calculator':
      return <Calculator className={className} aria-hidden="true" />;
    case 'trending-up':
      return <TrendingUp className={className} aria-hidden="true" />;
    case 'sigma':
      return <Sigma className={className} aria-hidden="true" />;
    case 'briefcase':
      return <Briefcase className={className} aria-hidden="true" />;
    case 'monitor':
      return <Monitor className={className} aria-hidden="true" />;
    case 'feather':
      return <Feather className={className} aria-hidden="true" />;
    case 'atom':
      return <Atom className={className} aria-hidden="true" />;
    case 'flask':
      return <FlaskConical className={className} aria-hidden="true" />;
    case 'microscope':
      return <Microscope className={className} aria-hidden="true" />;
    case 'scale':
      return <Scale className={className} aria-hidden="true" />;
    case 'radio':
      return <Radio className={className} aria-hidden="true" />;
    case 'globe':
      return <Globe className={className} aria-hidden="true" />;
    case 'landmark':
      return <Landmark className={className} aria-hidden="true" />;
    case 'library':
      return <Library className={className} aria-hidden="true" />;
  }
};

/* -------------------------------------------------------------------------- */
/* Section A — TeamPageHero                                                   */
/* -------------------------------------------------------------------------- */

interface TeamPageHeroProps {
  onNavigateHome: () => void;
  leadershipCount: number;
  departmentCount: number;
  facultyCount: number;
  generalStaffCount: number;
}

export const TeamPageHero: React.FC<TeamPageHeroProps> = ({
  onNavigateHome,
  leadershipCount,
  departmentCount,
  facultyCount,
  generalStaffCount,
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      aria-labelledby="team-hero-heading"
      className="bg-white border-b border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 sm:py-14 lg:py-18">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <li>
              <button
                type="button"
                onClick={onNavigateHome}
                className="hover:text-[var(--color-brand)] underline-offset-4 hover:underline transition-colors cursor-pointer"
              >
                {TEAM_HERO_CONTENT.breadcrumbParent}
              </button>
            </li>
            <li aria-hidden="true" className="text-neutral-400">
              /
            </li>
            <li aria-current="page" className="text-[var(--color-primary-ink)] font-semibold">
              {TEAM_HERO_CONTENT.heading}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)] mb-3">
                Capitol Hill College · Teku, Kathmandu
              </p>
              <h1
                id="team-hero-heading"
                className="text-4xl sm:text-5xl lg:text-[3.3rem] font-semibold tracking-tight leading-[1.1] text-[var(--color-primary-ink)]"
              >
                {TEAM_HERO_CONTENT.heading}
              </h1>
              <p className="mt-4 font-sans text-lg sm:text-xl font-semibold text-[var(--color-brand)] leading-snug max-w-2xl">
                {TEAM_HERO_CONTENT.supportingText}
              </p>
              <p className="mt-4 text-[15px] sm:text-base text-[var(--color-muted)] leading-relaxed max-w-xl">
                {TEAM_HERO_CONTENT.introStatement}
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-[var(--color-hairline)] flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-[var(--color-primary-ink)]">
              <button
                type="button"
                onClick={() => scrollToSection('team-leadership')}
                className="hover:text-[var(--color-brand)] transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1"
              >
                <span className="font-mono font-semibold text-[var(--color-brand)] mr-1.5 tabular-nums">
                  01.
                </span>
                Executive &amp; Academic Leadership ({leadershipCount})
              </button>
              <span aria-hidden="true" className="text-neutral-400 hidden sm:inline">
                ·
              </span>
              <button
                type="button"
                onClick={() => scrollToSection('team-faculty')}
                className="hover:text-[var(--color-brand)] transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1"
              >
                <span className="font-mono font-semibold text-[var(--color-brand)] mr-1.5 tabular-nums">
                  02.
                </span>
                Faculty ({facultyCount} across {departmentCount} Departments)
              </button>
              <span aria-hidden="true" className="text-neutral-400 hidden sm:inline">
                ·
              </span>
              <button
                type="button"
                onClick={() => scrollToSection('team-general-staff')}
                className="hover:text-[var(--color-brand)] transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1"
              >
                <span className="font-mono font-semibold text-[var(--color-brand)] mr-1.5 tabular-nums">
                  03.
                </span>
                General Staff ({generalStaffCount})
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="flex-1 rounded-xl overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-canvas)]">
              <CollegeImage
                src={TEAM_HERO_CONTENT.campusBackdropUrl}
                alt={TEAM_HERO_CONTENT.campusBackdropAlt}
                aspectClassName="aspect-[16/10] lg:aspect-auto lg:h-full min-h-[260px]"
                priority
                fallbackTitle="Capitol Hill College Campus"
              />
            </div>
            <p className="mt-2.5 text-xs text-[var(--color-muted)] flex items-center justify-between gap-4">
              <span>Capitol Hill College Campus</span>
              <span className="text-[var(--color-muted)] shrink-0">Teku, Kathmandu</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Section B — LeadershipProfile & LeadershipSection                          */
/* -------------------------------------------------------------------------- */

interface LeadershipProfileProps {
  member: LeadershipMember;
}

export const LeadershipProfile: React.FC<LeadershipProfileProps> = ({ member }) => {
  if (member.tier === 'senior') {
    return (
      <article className="group bg-white rounded-xl border border-[var(--color-hairline)] overflow-hidden flex flex-col">
        <TeamAvatar
          name={member.name}
          designationOrContext={member.designation}
          portraitUrl={member.portraitUrl}
          variant="featured"
        />
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[var(--color-brand)]">
              {member.designation}
            </p>
            <h3 className="mt-1.5 text-xl sm:text-2xl font-semibold text-[var(--color-primary-ink)] leading-snug">
              {member.name}
            </h3>
          </div>
          <p className="mt-4 pt-3 border-t border-[var(--color-hairline)] text-xs text-[var(--color-muted)]">
            {member.designation === 'Chairman'
              ? 'Board of Directors · Capitol Hill College'
              : member.designation === 'CEO & Director'
                ? 'Executive Governance & Board of Directors · Capitol Hill College'
                : 'Office of the Principal · Capitol Hill College'}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-xl border border-[var(--color-hairline)] p-4 flex items-center gap-4">
      <TeamAvatar
        name={member.name}
        designationOrContext={member.designation}
        portraitUrl={member.portraitUrl}
        variant="board"
      />
      <div className="min-w-0">
        <h4 className="font-sans text-base font-semibold text-[var(--color-primary-ink)] leading-snug">
          {member.name}
        </h4>
        <p className="mt-0.5 text-xs text-[var(--color-muted)]">{member.designation}</p>
      </div>
    </article>
  );
};

interface LeadershipSectionProps {
  members: LeadershipMember[];
  onNavigateLeadership?: () => void;
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({
  members,
  onNavigateLeadership,
}) => {
  const seniorLeaders = useMemo(
    () => members.filter((m) => m.tier === 'senior').sort((a, b) => a.sortOrder - b.sortOrder),
    [members]
  );
  const boardMembers = useMemo(
    () => members.filter((m) => m.tier === 'board').sort((a, b) => a.sortOrder - b.sortOrder),
    [members]
  );

  return (
    <section
      id="team-leadership"
      aria-labelledby="leadership-heading"
      className="scroll-mt-20 py-16 lg:py-24 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[var(--color-hairline)]">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-brand)] font-semibold mb-2">
              {LEADERSHIP_SECTION_COPY.subheading}
            </p>
            <h2
              id="leadership-heading"
              className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary-ink)]"
            >
              {LEADERSHIP_SECTION_COPY.heading}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[var(--color-muted)] max-w-md">
            {LEADERSHIP_SECTION_COPY.supportingText}
          </p>
        </div>

        {/* Senior Executive Leadership (Chairman, Principal, Vice-Principal) */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-7">
          {seniorLeaders.map((leader) => (
            <LeadershipProfile key={leader.id} member={leader} />
          ))}
        </div>

        {/* Board Members Directory or Governance Cross-Reference */}
        {boardMembers.length > 0 ? (
          <div className="mt-12 pt-10 border-t border-[var(--color-hairline)]">
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <h3 className="text-lg font-semibold text-[var(--color-primary-ink)]">
                Board Members
              </h3>
              <span className="text-xs text-[var(--color-muted)] tabular-nums">
                {boardMembers.length} Members
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {boardMembers.map((member) => (
                <LeadershipProfile key={member.id} member={member} />
              ))}
            </div>
          </div>
        ) : (
          onNavigateLeadership && (
            <div className="mt-10 rounded-xl bg-white border border-[var(--color-hairline)] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                  Institutional Governance
                </p>
                <p className="mt-1.5 text-sm sm:text-base text-[var(--color-ink)] leading-relaxed">
                  View executive biography dossiers, Board of Directors oversight pillars, and
                  institutional governance principles on our dedicated Leadership &amp; Governance
                  page.
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateLeadership}
                className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 text-xs font-semibold text-[var(--color-primary-ink)] bg-[var(--color-canvas)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Leadership &amp; Governance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )
        )}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Section C & D — DepartmentNavigation, DepartmentSection & FacultyDirectory */
/* -------------------------------------------------------------------------- */

interface DepartmentNavigationProps {
  departments: AcademicDepartment[];
  selectedStream: AcademicStreamId;
  selectedDepartmentId: string;
  searchQuery: string;
  visibleDepartmentCount: number;
  visibleMemberCount: number;
  totalMemberCount: number;
  onSelectStream: (stream: AcademicStreamId) => void;
  onSelectDepartment: (deptId: string) => void;
  onSearchChange: (q: string) => void;
  onResetFilters: () => void;
}

export const DepartmentNavigation: React.FC<DepartmentNavigationProps> = ({
  departments,
  selectedStream,
  selectedDepartmentId,
  searchQuery,
  visibleDepartmentCount,
  visibleMemberCount,
  totalMemberCount,
  onSelectStream,
  onSelectDepartment,
  onSearchChange,
  onResetFilters,
}) => {
  const hasActiveFilter =
    selectedStream !== 'all' ||
    selectedDepartmentId !== 'all' ||
    searchQuery.trim().length > 0;

  return (
    <div className="mt-8 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl p-4 sm:p-5 space-y-4">
      {/* Row 1: Search Input + Specific Department Selector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        <div className="md:col-span-7 relative">
          <label htmlFor="faculty-search-input" className="sr-only">
            Search faculty by name or department
          </label>
          <Search
            aria-hidden="true"
            className="w-4 h-4 text-[var(--color-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            id="faculty-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by faculty member name or department (e.g., Physics, Sharma)..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-[var(--color-hairline)] rounded-lg text-[var(--color-ink)] placeholder:text-[var(--color-muted)]/75 focus:border-[var(--color-brand)] focus:outline-none"
          />
          {searchQuery.length > 0 && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="md:col-span-5">
          <label htmlFor="department-select" className="sr-only">
            Filter by specific academic department
          </label>
          <select
            id="department-select"
            value={selectedDepartmentId}
            onChange={(e) => onSelectDepartment(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[var(--color-hairline)] rounded-lg text-[var(--color-ink)] focus:border-[var(--color-brand)] focus:outline-none cursor-pointer"
          >
            <option value="all">All {departments.length} Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name} ({dept.members.length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Stream Segmented Filter Controls + Live Result Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        <div
          role="group"
          aria-label="Filter departments by academic area"
          className="flex items-center gap-1 p-1 bg-white border border-[var(--color-hairline)] rounded-lg overflow-x-auto"
        >
          {ACADEMIC_STREAMS.map((stream) => {
            const isActive =
              selectedStream === stream.id && selectedDepartmentId === 'all';
            return (
              <button
                key={stream.id}
                type="button"
                onClick={() => onSelectStream(stream.id)}
                aria-pressed={isActive}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-brand)] text-white font-semibold'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-primary-ink)]'
                }`}
              >
                {stream.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-4 text-xs text-[var(--color-muted)]">
          <span className="tabular-nums">
            Showing <strong className="text-[var(--color-ink)]">{visibleMemberCount}</strong> of{' '}
            {totalMemberCount} listings across{' '}
            <strong className="text-[var(--color-ink)]">{visibleDepartmentCount}</strong>{' '}
            {visibleDepartmentCount === 1 ? 'department' : 'departments'}
          </span>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              All Faculty
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface FilteredDepartmentView {
  department: AcademicDepartment;
  displayedMembers: FacultyMemberEntry[];
  totalInDepartment: number;
}

interface DepartmentSectionProps {
  item: FilteredDepartmentView;
  isIsolated: boolean;
  onSelectDepartment: (deptId: string) => void;
}

export const DepartmentSection: React.FC<DepartmentSectionProps> = ({
  item,
  isIsolated,
  onSelectDepartment,
}) => {
  const { department, displayedMembers, totalInDepartment } = item;
  const useTwoColMembers = displayedMembers.length >= 4;

  const countText =
    displayedMembers.length === totalInDepartment
      ? `${totalInDepartment} ${totalInDepartment === 1 ? 'Member' : 'Members'}`
      : `${displayedMembers.length} of ${totalInDepartment} Members`;

  return (
    <section
      aria-labelledby={`heading-${department.id}`}
      className={`bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl p-6 transition-colors ${
        useTwoColMembers && isIsolated ? 'lg:col-span-2' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--color-hairline)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-lg bg-[var(--color-brand-soft)] border border-[var(--color-brand-border)] text-[var(--color-brand)] flex items-center justify-center shrink-0">
            <DepartmentIcon iconKey={department.iconKey} className="w-4 h-4" />
          </span>
          <h3
            id={`heading-${department.id}`}
            className="font-sans text-base sm:text-lg font-semibold text-[var(--color-primary-ink)] leading-snug"
          >
            <button
              type="button"
              onClick={() =>
                onSelectDepartment(isIsolated ? 'all' : department.id)
              }
              title={
                isIsolated
                  ? 'Return to all departments'
                  : `Focus on ${department.name}`
              }
              className="text-left hover:text-[var(--color-brand)] hover:underline underline-offset-4 transition-colors cursor-pointer"
            >
              {department.name}
            </button>
          </h3>
        </div>

        <span className="text-xs text-[var(--color-muted)] tabular-nums whitespace-nowrap shrink-0 pt-1">
          {countText}
        </span>
      </div>

      <ul
        className={`mt-4 ${
          useTwoColMembers
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3'
            : 'space-y-3'
        }`}
      >
        {displayedMembers.map((member) => (
          <li key={member.id} className="flex items-center gap-3 min-w-0">
            <TeamAvatar
              name={member.name}
              designationOrContext={`${department.name} Faculty`}
              portraitUrl={member.portraitUrl}
              variant="compact"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-ink)] leading-snug">
                {member.name}
              </p>
              {member.roleNote && (
                <p className="text-xs text-[var(--color-muted)]">{member.roleNote}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

interface FacultyDirectoryProps {
  departments: AcademicDepartment[];
}

export const FacultyDirectory: React.FC<FacultyDirectoryProps> = ({ departments }) => {
  const [selectedStream, setSelectedStream] = useState<AcademicStreamId>('all');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalMemberCount = useMemo(
    () => departments.reduce((sum, d) => sum + d.members.length, 0),
    [departments]
  );

  const filteredDepartments: FilteredDepartmentView[] = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return departments
      .filter((dept) => {
        if (selectedDepartmentId !== 'all') {
          return dept.id === selectedDepartmentId;
        }
        if (selectedStream !== 'all') {
          return dept.stream === selectedStream;
        }
        return true;
      })
      .map((dept) => {
        if (!normalizedQuery) {
          return {
            department: dept,
            displayedMembers: dept.members,
            totalInDepartment: dept.members.length,
          };
        }

        const departmentNameMatches = dept.name
          .toLowerCase()
          .includes(normalizedQuery);

        const matchingMembers = departmentNameMatches
          ? dept.members
          : dept.members.filter(
              (m) =>
                m.name.toLowerCase().includes(normalizedQuery) ||
                (m.roleNote && m.roleNote.toLowerCase().includes(normalizedQuery))
            );

        return {
          department: dept,
          displayedMembers: matchingMembers,
          totalInDepartment: dept.members.length,
        };
      })
      .filter((view) => view.displayedMembers.length > 0);
  }, [departments, selectedStream, selectedDepartmentId, searchQuery]);

  const visibleMemberCount = useMemo(
    () =>
      filteredDepartments.reduce((sum, v) => sum + v.displayedMembers.length, 0),
    [filteredDepartments]
  );

  const handleSelectStream = (stream: AcademicStreamId) => {
    setSelectedStream(stream);
    setSelectedDepartmentId('all');
  };

  const handleSelectDepartment = (deptId: string) => {
    setSelectedDepartmentId(deptId);
    if (deptId === 'all') {
      setSelectedStream('all');
    } else {
      const found = departments.find((d) => d.id === deptId);
      if (found) {
        setSelectedStream(found.stream);
      }
    }
  };

  const handleResetFilters = () => {
    setSelectedStream('all');
    setSelectedDepartmentId('all');
    setSearchQuery('');
  };

  return (
    <section
      id="team-faculty"
      aria-labelledby="faculty-heading"
      className="scroll-mt-20 py-16 lg:py-24 bg-white border-b border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[var(--color-hairline)]">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-brand)] font-semibold mb-2">
              {FACULTY_SECTION_COPY.subheading}
            </p>
            <h2
              id="faculty-heading"
              className="text-3xl sm:text-4xl font-semibold text-[var(--color-primary-ink)]"
            >
              {FACULTY_SECTION_COPY.heading}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[var(--color-muted)] max-w-md">
            {FACULTY_SECTION_COPY.supportingText}
          </p>
        </div>

        <DepartmentNavigation
          departments={departments}
          selectedStream={selectedStream}
          selectedDepartmentId={selectedDepartmentId}
          searchQuery={searchQuery}
          visibleDepartmentCount={filteredDepartments.length}
          visibleMemberCount={visibleMemberCount}
          totalMemberCount={totalMemberCount}
          onSelectStream={handleSelectStream}
          onSelectDepartment={handleSelectDepartment}
          onSearchChange={setSearchQuery}
          onResetFilters={handleResetFilters}
        />

        {filteredDepartments.length === 0 ? (
          <div className="mt-10 py-14 px-6 text-center bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl">
            <p className="font-display text-xl font-semibold text-[var(--color-primary-ink)]">
              No matching faculty members found
            </p>
            <p className="mt-2 text-sm text-[var(--color-muted)] max-w-md mx-auto">
              No faculty member or department matched{' '}
              {searchQuery.trim() ? (
                <strong className="text-[var(--color-ink)]">
                  &ldquo;{searchQuery.trim()}&rdquo;
                </strong>
              ) : (
                'the current filter selection'
              )}
              .
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Return to Complete Faculty List
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {filteredDepartments.map((item) => (
              <DepartmentSection
                key={item.department.id}
                item={item}
                isIsolated={selectedDepartmentId === item.department.id}
                onSelectDepartment={handleSelectDepartment}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Section E — GeneralStaffSection                                            */
/* -------------------------------------------------------------------------- */

interface GeneralStaffSectionProps {
  staff: GeneralStaffMember[];
}

export const GeneralStaffSection: React.FC<GeneralStaffSectionProps> = ({ staff }) => {
  const sortedStaff = useMemo(
    () => [...staff].sort((a, b) => a.sortOrder - b.sortOrder),
    [staff]
  );

  return (
    <section
      id="team-general-staff"
      aria-labelledby="general-staff-heading"
      className="scroll-mt-20 py-16 lg:py-20 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-hairline)]">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-brand)] font-semibold mb-2">
              Campus Operations
            </p>
            <h2
              id="general-staff-heading"
              className="text-2xl sm:text-3xl font-semibold text-[var(--color-primary-ink)]"
            >
              {GENERAL_STAFF_SECTION_COPY.heading}
            </h2>
          </div>
          <span className="text-xs text-[var(--color-muted)] tabular-nums">
            {sortedStaff.length} Staff Members
          </span>
        </div>

        <div className="mt-8 bg-white border border-[var(--color-hairline)] rounded-xl p-6 sm:p-8">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            {sortedStaff.map((person) => (
              <li key={person.id} className="flex items-center gap-3.5">
                <TeamAvatar
                  name={person.name}
                  designationOrContext="General Staff"
                  portraitUrl={person.portraitUrl}
                  variant="compact"
                />
                <span className="text-sm sm:text-base font-medium text-[var(--color-ink)]">
                  {person.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Section F — TeamPageCTA                                                    */
/* -------------------------------------------------------------------------- */

interface TeamPageCTAProps {
  onExplorePrograms: () => void;
  onContactUs: () => void;
}

export const TeamPageCTA: React.FC<TeamPageCTAProps> = ({
  onExplorePrograms,
  onContactUs,
}) => {
  return (
    <section
      aria-labelledby="team-cta-heading"
      className="bg-[var(--color-primary-ink)] text-white py-16 lg:py-20 border-t-4 border-t-[var(--color-brand)]"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-on-dark)] mb-2.5">
            Academic Excellence · Teku, Kathmandu
          </p>
          <h2
            id="team-cta-heading"
            className="text-3xl sm:text-4xl font-semibold text-white leading-tight"
          >
            {TEAM_CTA_COPY.heading}
          </h2>
          <p className="mt-3.5 text-base text-neutral-300 leading-relaxed">
            {TEAM_CTA_COPY.supportingText}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={onExplorePrograms}
            className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {TEAM_CTA_COPY.primaryLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onContactUs}
            className="inline-flex items-center justify-center min-h-11 px-6 py-3 text-sm font-semibold text-white border border-white/30 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {TEAM_CTA_COPY.secondaryLabel}
          </button>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Complete TeamMembersPage                                                   */
/* -------------------------------------------------------------------------- */

interface TeamMembersPageProps {
  onNavigateHome: () => void;
  onNavigateLeadership?: () => void;
  onExplorePrograms: () => void;
  onContactUs: () => void;
}

export const TeamMembersPage: React.FC<TeamMembersPageProps> = ({
  onNavigateHome,
  onNavigateLeadership,
  onExplorePrograms,
  onContactUs,
}) => {
  const totalFacultyListings = useMemo(
    () => FACULTY_DEPARTMENTS.reduce((acc, dept) => acc + dept.members.length, 0),
    []
  );

  return (
    <div className="bg-[var(--color-canvas)] text-[var(--color-ink)]">
      <TeamPageHero
        onNavigateHome={onNavigateHome}
        leadershipCount={LEADERSHIP_MEMBERS.length}
        departmentCount={FACULTY_DEPARTMENTS.length}
        facultyCount={totalFacultyListings}
        generalStaffCount={GENERAL_STAFF_MEMBERS.length}
      />

      <LeadershipSection
        members={LEADERSHIP_MEMBERS}
        onNavigateLeadership={onNavigateLeadership}
      />

      <FacultyDirectory departments={FACULTY_DEPARTMENTS} />

      <GeneralStaffSection staff={GENERAL_STAFF_MEMBERS} />

      <TeamPageCTA
        onExplorePrograms={onExplorePrograms}
        onContactUs={onContactUs}
      />
    </div>
  );
};
