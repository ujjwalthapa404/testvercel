import React from 'react';
import { AlumniCTA } from '../components/alumni/AlumniCTA';
import { AlumniValuesSection } from '../components/alumni/AlumniValuesSection';
import { StudentStoriesGrid } from '../components/studentStories/StudentStoriesGrid';
import { StudentVoicesHero } from '../components/studentStories/StudentVoicesHero';
import {
  ALUMNI_CTA_CONTENT,
  COLLEGE_VALUE_PILLARS,
} from '../data/alumniData';

interface AlumniTestimonialsPageProps {
  onNavigateHome: () => void;
  onExploreFacilities: () => void;
  onOpenEnquiry: () => void;
}

export const AlumniTestimonialsPage: React.FC<AlumniTestimonialsPageProps> = ({
  onNavigateHome,
  onExploreFacilities,
  onOpenEnquiry,
}) => {
  const scrollToSection = (elementId: string) => {
    const target = document.getElementById(elementId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-[var(--color-ink)]">
      {/* Section 1: Hero Section */}
      <StudentVoicesHero
        onNavigateHome={onNavigateHome}
        onExploreStories={() => scrollToSection('student-stories')}
        onOpenEnquiry={onOpenEnquiry}
      />

      {/* Section 2: Student Achievements & Testimonials Grid */}
      <StudentStoriesGrid onOpenEnquiry={onOpenEnquiry} />

      {/* Section 3: Institutional Foundations & Student Pillars */}
      <AlumniValuesSection
        pillars={COLLEGE_VALUE_PILLARS}
        onExploreFacilities={onExploreFacilities}
      />

      {/* Section 4: Campus Community Connection & Admission Enquiry */}
      <AlumniCTA
        content={ALUMNI_CTA_CONTENT}
        onOpenEnquiry={onOpenEnquiry}
      />
    </div>
  );
};
