import React from 'react';
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { AcademicProgramSlug, OFFICIAL_CAMPUS_LOCATION } from '../../data/academicPrograms';
import { VERIFIED_SOCIAL_LINKS } from '../../data/facilities';
import { CollegeLogo } from '../CollegeImage';
import { ActiveSiteView } from './SiteHeader';

interface SiteFooterProps {
  activeView: ActiveSiteView;
  onNavigateHome: (sectionId?: string) => void;
  onNavigatePrograms: (slug?: AcademicProgramSlug) => void;
  onNavigateLeadership: () => void;
  onNavigateAdvisory: () => void;
  onNavigateFacilities: () => void;
  onNavigateGallery: () => void;
  onNavigateTeam: () => void;
  onNavigateAlumni: () => void;
  onNavigateNotices: () => void;
  onNavigateContact: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  activeView,
  onNavigateHome,
  onNavigatePrograms,
  onNavigateLeadership,
  onNavigateAdvisory,
  onNavigateFacilities,
  onNavigateGallery,
  onNavigateTeam,
  onNavigateAlumni,
  onNavigateNotices,
  onNavigateContact,
}) => {
  const linkClass = (isCurrent = false) =>
    `underline-offset-4 hover:underline transition-colors cursor-pointer focus-visible:outline-white ${
      isCurrent ? 'text-white font-semibold underline' : 'text-white/85 hover:text-white'
    }`;

  const isProgramsActive = activeView === 'programs' || activeView === 'program-detail';

  return (
    <footer className="bg-[var(--color-brand)] text-white/90 border-t border-white/15">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        {/* Column 1: Logo + Uppercase College Name & Official Tagline */}
        <div className="lg:col-span-3">
          <div className="flex items-start gap-3">
            <CollegeLogo size="md" variant="light" />
            <div>
              <p className="font-display text-base sm:text-lg font-bold tracking-[0.02em] text-white leading-tight uppercase">
                {OFFICIAL_CAMPUS_LOCATION.collegeName}
              </p>
              <p className="mt-1 text-[11px] tracking-[0.03em] text-white/80 leading-tight">
                {OFFICIAL_CAMPUS_LOCATION.tagline}
              </p>
              <p className="mt-1 text-xs text-white/75">{OFFICIAL_CAMPUS_LOCATION.address}</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-white/85">
            A center of excellence in education, building future leaders with knowledge and
            discipline.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs">
            {VERIFIED_SOCIAL_LINKS.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-white/85 hover:text-white underline-offset-4 hover:underline transition-colors focus-visible:outline-white"
              >
                <span>{social.platform}</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Navigation Links */}
        <div className="lg:col-span-3">
          <h3 className="text-xs uppercase tracking-widest font-sans font-semibold mb-4 text-white/75">
            Quick Navigation
          </h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
            <li>
              <button
                type="button"
                onClick={() => onNavigateHome()}
                className={linkClass(activeView === 'home')}
              >
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigatePrograms()}
                className={linkClass(isProgramsActive)}
              >
                Academic Program
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onNavigateLeadership}
                className={linkClass(activeView === 'leadership')}
              >
                Leadership
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onNavigateAdvisory}
                className={linkClass(activeView === 'advisory')}
              >
                Advisory Committee
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onNavigateFacilities}
                className={linkClass(activeView === 'facilities')}
              >
                Facilities
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onNavigateGallery}
                className={linkClass(activeView === 'gallery')}
              >
                Gallery
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onNavigateTeam}
                className={linkClass(activeView === 'team')}
              >
                Team Member
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onNavigateAlumni}
                className={linkClass(activeView === 'alumni')}
              >
                Student Voices &amp; Achievements
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onNavigateNotices}
                className={linkClass(activeView === 'notices')}
              >
                Notices
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onNavigateContact}
                className={linkClass(activeView === 'contact')}
              >
                Contact
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Official Contact Details */}
        <div className="lg:col-span-3">
          <h3 className="text-xs uppercase tracking-widest font-sans font-semibold mb-4 text-white/75">
            Contact Office
          </h3>
          <ul className="space-y-3 text-sm text-white/90">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-white" />
              <span>{OFFICIAL_CAMPUS_LOCATION.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 shrink-0 text-white" />
              <a
                href={OFFICIAL_CAMPUS_LOCATION.telephoneHref}
                className="hover:text-white underline-offset-4 hover:underline tabular-nums focus-visible:outline-white"
              >
                {OFFICIAL_CAMPUS_LOCATION.telephone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 shrink-0 mt-0.5 text-white" />
              <a
                href={OFFICIAL_CAMPUS_LOCATION.emailHref}
                className="hover:text-white underline-offset-4 hover:underline break-all focus-visible:outline-white"
              >
                {OFFICIAL_CAMPUS_LOCATION.email}
              </a>
            </li>
          </ul>
          <div className="mt-4 pt-3 border-t border-white/15">
            <button
              type="button"
              onClick={onNavigateContact}
              className="text-xs text-white/85 hover:text-white underline-offset-4 hover:underline cursor-pointer focus-visible:outline-white"
            >
              Admission &amp; Student Enquiry
            </button>
          </div>
        </div>

        {/* Column 4: Official Campus Location & Google Maps Link */}
        <div className="lg:col-span-3">
          <h3 className="text-xs uppercase tracking-widest font-sans font-semibold mb-4 text-white/75">
            Look Where We Are Located
          </h3>
          <div className="rounded-xl bg-black/20 border border-white/15 p-4 space-y-3.5">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="w-9 h-9 rounded-lg bg-white/12 flex items-center justify-center shrink-0 mt-0.5"
              >
                <MapPin className="w-4 h-4 text-white" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold text-white leading-snug uppercase">
                  {OFFICIAL_CAMPUS_LOCATION.collegeName}
                </p>
                <p className="mt-0.5 text-xs text-white/85 leading-relaxed">
                  {OFFICIAL_CAMPUS_LOCATION.address}
                </p>
              </div>
            </div>

            <a
              href={OFFICIAL_CAMPUS_LOCATION.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-10 px-4 py-2 rounded-lg bg-white text-[var(--color-brand)] hover:bg-[var(--color-canvas)] text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-white"
            >
              <span>View on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-brand-dark)] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/80">
          <p>&copy; 2026 {OFFICIAL_CAMPUS_LOCATION.collegeName}. All Rights Reserved.</p>
          <p>
            {OFFICIAL_CAMPUS_LOCATION.tagline} · {OFFICIAL_CAMPUS_LOCATION.address}
          </p>
        </div>
      </div>
    </footer>
  );
};
