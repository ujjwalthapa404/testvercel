/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useState } from 'react';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { NoticePopupModal } from './components/NoticePopupModal';
import { PromoPopupModal } from './components/PromoPopupModal';
import { FaqChatbot } from './components/FaqChatbot';
import { HomePage } from './pages/HomePage';
import { NoticesPage } from './pages/NoticesPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { CampusGalleryPage } from './pages/CampusGalleryPage';
import { TeamMembersPage } from './pages/TeamMembersPage';
import { AlumniTestimonialsPage } from './pages/AlumniTestimonials';
import { LeadershipPage } from './pages/LeadershipPage';
import { AdvisoryCommitteePage } from './pages/AdvisoryCommitteePage';
import { ContactPage } from './pages/ContactPage';
import { AcademicProgramsPage } from './pages/AcademicProgramsPage';
import { AcademicProgramDetailPage } from './pages/AcademicProgramDetailPage';
import { getAcademicProgramBySlug } from './data/academicPrograms';
import { useAppRouter } from './hooks/useAppRouter';
import { usePublishedContent } from './hooks/usePublishedContent';
import { ChatbotQuickAction } from './types/chatbot';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPromoPopupVisible, setIsPromoPopupVisible] = useState(false);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const {
    route,
    navigateHome,
    navigateToPrograms,
    navigateToLeadership,
    navigateToAdvisory,
    navigateToFacilities,
    navigateToTeam,
    navigateToGallery,
    navigateToAlumni,
    navigateToNotices,
    navigateToContact,
  } = useAppRouter(closeMobileMenu);

  const { activeNotices, announcementNotices, popupNotice, activeFaqs } = usePublishedContent();

  const handleOpenEnquiry = useCallback(
    (programTitle?: string) => {
      navigateToContact(programTitle);
    },
    [navigateToContact]
  );

  const handleChatbotAction = useCallback(
    (action: ChatbotQuickAction) => {
      switch (action.action) {
        case 'open-enquiry':
          navigateToContact(action.programTitle);
          break;
        case 'open-programs':
        case 'scroll-programs':
          navigateToPrograms();
          break;
        case 'open-program-detail':
          navigateToPrograms(action.programSlug);
          break;
        case 'scroll-contact':
          navigateToContact();
          break;
        case 'scroll-about':
          navigateHome('about');
          break;
        case 'open-leadership':
          navigateToLeadership();
          break;
        case 'open-advisory':
          navigateToAdvisory();
          break;
        case 'open-facilities':
          navigateToFacilities();
          break;
        case 'open-gallery':
          navigateToGallery();
          break;
        case 'open-team':
          navigateToTeam();
          break;
        case 'open-notices':
          navigateToNotices(null);
          break;
        case 'external-link':
          break;
      }
    },
    [
      navigateHome,
      navigateToAdvisory,
      navigateToContact,
      navigateToFacilities,
      navigateToGallery,
      navigateToLeadership,
      navigateToNotices,
      navigateToPrograms,
      navigateToTeam,
    ]
  );

  const renderActivePage = () => {
    switch (route.view) {
      case 'programs':
        return (
          <AcademicProgramsPage
            onNavigateHome={navigateHome}
            onSelectProgram={navigateToPrograms}
            onNavigateFacilities={navigateToFacilities}
            onOpenEnquiry={handleOpenEnquiry}
          />
        );
      case 'program-detail': {
        const activeProgram = getAcademicProgramBySlug(route.programSlug);
        if (!activeProgram) {
          return (
            <AcademicProgramsPage
              onNavigateHome={navigateHome}
              onSelectProgram={navigateToPrograms}
              onNavigateFacilities={navigateToFacilities}
              onOpenEnquiry={handleOpenEnquiry}
            />
          );
        }
        return (
          <AcademicProgramDetailPage
            program={activeProgram}
            onNavigateHome={navigateHome}
            onNavigateAllPrograms={() => navigateToPrograms()}
            onSelectProgram={navigateToPrograms}
            onNavigateFacilities={navigateToFacilities}
            onOpenEnquiry={handleOpenEnquiry}
          />
        );
      }
      case 'leadership':
        return (
          <LeadershipPage
            onNavigateHome={navigateHome}
            onNavigateTeam={navigateToTeam}
            onNavigateAdvisory={navigateToAdvisory}
            onOpenEnquiry={() => handleOpenEnquiry()}
          />
        );
      case 'advisory':
        return (
          <AdvisoryCommitteePage
            onNavigateHome={() => navigateHome()}
            onNavigateLeadership={navigateToLeadership}
            onNavigateTeam={navigateToTeam}
            onNavigateContact={() => navigateToContact()}
          />
        );
      case 'facilities':
        return (
          <FacilitiesPage
            onNavigateHome={navigateHome}
            onExplorePrograms={() => navigateToPrograms()}
            onContactCollege={() => navigateToContact()}
            onOpenEnquiry={handleOpenEnquiry}
          />
        );
      case 'team':
        return (
          <TeamMembersPage
            onNavigateHome={() => navigateHome()}
            onNavigateLeadership={navigateToLeadership}
            onExplorePrograms={() => navigateToPrograms()}
            onContactUs={() => navigateToContact()}
          />
        );
      case 'gallery':
        return (
          <CampusGalleryPage
            onNavigateHome={() => navigateHome()}
            onExplorePrograms={() => navigateToPrograms()}
            onContactUs={() => navigateToContact()}
          />
        );
      case 'alumni':
        return (
          <AlumniTestimonialsPage
            onNavigateHome={() => navigateHome()}
            onExploreFacilities={navigateToFacilities}
            onOpenEnquiry={() => handleOpenEnquiry()}
          />
        );
      case 'notices':
        return (
          <NoticesPage
            notices={activeNotices}
            activeSlug={route.slug}
            onSelectNotice={navigateToNotices}
            onBackToHome={() => navigateHome()}
            onOpenEnquiry={handleOpenEnquiry}
          />
        );
      case 'contact':
        return (
          <ContactPage
            initialProgram={route.initialProgram}
            onNavigateHome={() => navigateHome()}
            onNavigatePrograms={() => navigateToPrograms()}
          />
        );
      case 'home':
      default:
        return (
          <HomePage
            activeNotices={activeNotices}
            activeFaqs={activeFaqs}
            onNavigatePrograms={navigateToPrograms}
            onNavigateLeadership={navigateToLeadership}
            onNavigateAdvisory={navigateToAdvisory}
            onNavigateFacilities={navigateToFacilities}
            onNavigateTeam={navigateToTeam}
            onNavigateAlumni={navigateToAlumni}
            onNavigateNotices={navigateToNotices}
            onNavigateContact={navigateToContact}
            onOpenEnquiry={handleOpenEnquiry}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[var(--color-ink)]">
      {/* Shared Main Navigation Bar — Official Website-Wide Deep Red University Header */}
      <SiteHeader
        activeView={route.view}
        activeProgramSlug={route.view === 'program-detail' ? route.programSlug : null}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        onNavigateHome={navigateHome}
        onNavigatePrograms={navigateToPrograms}
        onNavigateLeadership={navigateToLeadership}
        onNavigateAdvisory={navigateToAdvisory}
        onNavigateFacilities={navigateToFacilities}
        onNavigateGallery={navigateToGallery}
        onNavigateTeam={navigateToTeam}
        onNavigateAlumni={navigateToAlumni}
        onNavigateNotices={() => navigateToNotices(null)}
        onNavigateContact={() => navigateToContact()}
        onOpenEnquiry={() => handleOpenEnquiry()}
      />

      {/* Full-width continuous announcement slider directly beneath the main navigation bar */}
      <AnnouncementBar
        notices={announcementNotices}
        onNavigateToNotices={(slug) => navigateToNotices(slug ?? null)}
      />

      <main id="top" className="flex-1">
        {renderActivePage()}
      </main>

      {/* Shared Institutional Footer — Official Website-Wide Deep Red Footer */}
      <SiteFooter
        activeView={route.view}
        onNavigateHome={navigateHome}
        onNavigatePrograms={navigateToPrograms}
        onNavigateLeadership={navigateToLeadership}
        onNavigateAdvisory={navigateToAdvisory}
        onNavigateFacilities={navigateToFacilities}
        onNavigateGallery={navigateToGallery}
        onNavigateTeam={navigateToTeam}
        onNavigateAlumni={navigateToAlumni}
        onNavigateNotices={() => navigateToNotices(null)}
        onNavigateContact={() => navigateToContact()}
      />

      {/* Scroll-Triggered Admissions Brochure Popup */}
      <PromoPopupModal
        onVisibilityChange={setIsPromoPopupVisible}
        onOpenEnquiry={() => handleOpenEnquiry()}
      />

      {/* Controlled Announcement Popup Modal */}
      <NoticePopupModal
        notice={popupNotice}
        disabled={isPromoPopupVisible}
        onReadFullNotice={(slug) => navigateToNotices(slug)}
      />

      {/* Floating College Campus Guide (Local Predefined Dataset — Zero External AI APIs) */}
      <FaqChatbot onAction={handleChatbotAction} />
    </div>
  );
}
