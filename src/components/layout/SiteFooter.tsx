import React from 'react';
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { VERIFIED_SOCIAL_LINKS } from '../../data/facilities';
import { CollegeLogo } from '../CollegeImage';
import { ActiveSiteView } from './SiteHeader';

interface SiteFooterProps {
  activeView: ActiveSiteView;
  onNavigateHome: (sectionId?: string) => void;
  onNavigateLeadership: () => void;
  onNavigateFacilities: () => void;
  onNavigateGallery: () => void;
  onNavigateTeam: () => void;
  onNavigateAlumni: () => void;
  onNavigateNotices: () => void;
  onNavigatePortal: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  activeView,
  onNavigateHome,
  onNavigateLeadership,
  onNavigateFacilities,
  onNavigateGallery,
  onNavigateTeam,
  onNavigateAlumni,
  onNavigateNotices,
  onNavigatePortal,
}) => {
  const linkClass = (isCurrent = false) =>
    `underline-offset-4 hover:underline transition-colors cursor-pointer focus-visible:outline-white ${
      isCurrent ? 'text-white font-semibold underline' : 'text-white/85 hover:text-white'
    }`;

  return (
    <footer className="bg-[var(--color-brand)] text-white/90 border-t border-white/15">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        {/* Column 1: Logo + Institutional Motto */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <CollegeLogo size="md" variant="light" />
            <div>
              <p className="font-display text-lg font-semibold text-white">
                Capitol Hill College
              </p>
              <p className="text-xs text-white/75">Teku, Kathmandu, Nepal</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed max-w-md text-white/85">
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
        <div className="lg:col-span-4">
          <h3 className="text-xs uppercase tracking-widest font-sans font-semibold mb-4 text-white/75">
            Quick Navigation
          </h3>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
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
                onClick={onNavigateLeadership}
                className={linkClass(activeView === 'leadership')}
              >
                Leadership &amp; Governance
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateHome('programs')}
                className={linkClass()}
              >
                Academic Program
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onNavigateFacilities}
                className={linkClass(activeView === 'facilities')}
              >
                Facilities &amp; Services
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
                Alumni &amp; Stories
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
                onClick={() => onNavigateHome('about')}
                className={linkClass()}
              >
                About
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigateHome('contact')}
                className={linkClass()}
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
              <span>Teku, Kathmandu, Nepal</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 shrink-0 text-white" />
              <a
                href="tel:015312399"
                className="hover:text-white underline-offset-4 hover:underline tabular-nums focus-visible:outline-white"
              >
                01-5312399
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 shrink-0 mt-0.5 text-white" />
              <a
                href="mailto:info.capitolhillcollege@gmail.com"
                className="hover:text-white underline-offset-4 hover:underline break-all focus-visible:outline-white"
              >
                info.capitolhillcollege@gmail.com
              </a>
            </li>
          </ul>
          <div className="mt-4 pt-3 border-t border-white/15">
            <button
              type="button"
              onClick={onNavigatePortal}
              className="text-xs text-white/80 hover:text-white underline-offset-4 hover:underline cursor-pointer focus-visible:outline-white"
            >
              Staff &amp; Student Portal
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-brand-dark)] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/80">
          <p>&copy; 2026 Capitol Hill College. All Rights Reserved.</p>
          <p>Teku, Kathmandu, Nepal</p>
        </div>
      </div>
    </footer>
  );
};
