import React from 'react';
import { AlumniCTA } from '../components/alumni/AlumniCTA';
import { AlumniHero } from '../components/alumni/AlumniHero';
import { AlumniSuccessStories } from '../components/alumni/AlumniSuccessStories';
import { AlumniValuesSection } from '../components/alumni/AlumniValuesSection';
import { TestimonialsSection } from '../components/alumni/TestimonialsSection';
import {
  ALUMNI_CTA_CONTENT,
  ALUMNI_HERO_CONTENT,
  ALUMNI_PROFILES,
  COLLEGE_VALUE_PILLARS,
} from '../data/alumniData';
import { STUDENT_TESTIMONIALS } from '../data/testimonialsData';

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
      {/* Section A: Hero Section */}
      <AlumniHero
        content={ALUMNI_HERO_CONTENT}
        onNavigateHome={onNavigateHome}
        onExploreStories={() => scrollToSection('alumni-stories')}
        onReconnect={() => scrollToSection('alumni-connect')}
      />

      {/* Section B: Alumni Success Stories */}
      <AlumniSuccessStories profiles={ALUMNI_PROFILES} />

      {/* Section C: Student & Graduate Testimonials */}
      <TestimonialsSection testimonials={STUDENT_TESTIMONIALS} />

      {/* Section D: Why Our Students Value Capitol Hill College */}
      <AlumniValuesSection
        pillars={COLLEGE_VALUE_PILLARS}
        onExploreFacilities={onExploreFacilities}
      />

      {/* Section E: Alumni Connection / Call to Action */}
      <AlumniCTA content={ALUMNI_CTA_CONTENT} onOpenEnquiry={onOpenEnquiry} />
    </div>
  );
};
