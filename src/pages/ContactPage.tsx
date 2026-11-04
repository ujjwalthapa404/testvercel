import React, { useEffect, useMemo, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { ACADEMIC_PROGRAMS, OFFICIAL_CAMPUS_LOCATION } from '../data/academicPrograms';
import { useFirebase } from '../context/FirebaseContext';
import { db, isFirebaseConfigured, SCHEMA_LIMITS, toSafeDocId } from '../lib/firebase';
import { EnquiryStatus } from '../types/notice';

interface ContactPageProps {
  initialProgram?: string;
  onNavigateHome: () => void;
  onNavigatePrograms: () => void;
}

const GENERAL_ENQUIRY_OPTION = 'General / Campus Visit Enquiry';

export const ContactPage: React.FC<ContactPageProps> = ({
  initialProgram,
  onNavigateHome,
  onNavigatePrograms,
}) => {
  const { user, profileReady } = useFirebase();

  const programOptions = useMemo(
    () => [...ACADEMIC_PROGRAMS.map((p) => p.title), GENERAL_ENQUIRY_OPTION],
    []
  );

  const resolvedInitialProgram = useMemo(() => {
    if (!initialProgram) return ACADEMIC_PROGRAMS[0].title;
    const exactMatch = programOptions.find(
      (opt) => opt.toLowerCase() === initialProgram.toLowerCase()
    );
    if (exactMatch) return exactMatch;
    const partialMatch = ACADEMIC_PROGRAMS.find(
      (p) =>
        initialProgram.toLowerCase().includes(p.shortTitle.toLowerCase()) ||
        p.title.toLowerCase().includes(initialProgram.toLowerCase())
    );
    return partialMatch ? partialMatch.title : initialProgram;
  }, [initialProgram, programOptions]);

  const [formState, setFormState] = useState({
    fullName: '',
    phone: '',
    email: '',
    program: resolvedInitialProgram,
    message: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<{
    fullName: string;
    phone: string;
    email: string;
    program: string;
    message: string;
    savedToDatabase: boolean;
  } | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      program: resolvedInitialProgram,
    }));
  }, [resolvedInitialProgram]);

  useEffect(() => {
    if (user) {
      setFormState((prev) => ({
        ...prev,
        fullName: prev.fullName || user.displayName || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = formState.fullName.trim();
    const cleanPhone = formState.phone.trim();
    const cleanEmail = formState.email.trim();
    const cleanMessage = formState.message.trim();

    if (cleanName.length < SCHEMA_LIMITS.ENQUIRY_NAME_MIN) {
      setFormError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (
      cleanPhone.length < SCHEMA_LIMITS.PHONE_MIN ||
      cleanPhone.length > SCHEMA_LIMITS.PHONE_MAX ||
      !SCHEMA_LIMITS.PHONE_PATTERN.test(cleanPhone)
    ) {
      setFormError('Please enter a valid contact phone number (7–25 digits).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setFormError('Please enter a valid email address so our admissions team can reply.');
      return;
    }

    setFormError('');
    setSubmitting(true);

    let savedToDatabase = false;
    if (isFirebaseConfigured && user && profileReady) {
      try {
        const enquiryId = toSafeDocId('enq');
        await setDoc(doc(db, 'enquiries', enquiryId), {
          userId: user.uid,
          fullName: cleanName.slice(0, SCHEMA_LIMITS.ENQUIRY_NAME_MAX),
          phone: cleanPhone.slice(0, SCHEMA_LIMITS.PHONE_MAX),
          email: cleanEmail.slice(0, SCHEMA_LIMITS.EMAIL_MAX),
          program: formState.program.slice(0, SCHEMA_LIMITS.ENQUIRY_PROGRAM_MAX),
          message: cleanMessage.slice(0, SCHEMA_LIMITS.ENQUIRY_MESSAGE_MAX),
          status: EnquiryStatus.NEW,
          adminNotes: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        savedToDatabase = true;
      } catch {
        savedToDatabase = false;
      }
    }

    setSubmittedRecord({
      fullName: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      program: formState.program,
      message: cleanMessage,
      savedToDatabase,
    });
    setSubmitting(false);
  };

  const buildFormattedSummary = (rec: NonNullable<typeof submittedRecord>): string => {
    return [
      `Admission / Student Enquiry — ${OFFICIAL_CAMPUS_LOCATION.collegeName}`,
      `--------------------------------------------------`,
      `Full Name: ${rec.fullName}`,
      `Phone Number: ${rec.phone}`,
      `Email Address: ${rec.email}`,
      `Program of Interest: ${rec.program}`,
      rec.message ? `Message / Questions:\n${rec.message}` : `Message / Questions: Please share admission and counseling details.`,
    ].join('\n');
  };

  const buildMailtoHref = (rec: NonNullable<typeof submittedRecord>): string => {
    const subject = encodeURIComponent(
      `Admission Enquiry: ${rec.program} — ${rec.fullName}`
    );
    const body = encodeURIComponent(buildFormattedSummary(rec));
    return `mailto:${OFFICIAL_CAMPUS_LOCATION.email}?subject=${subject}&body=${body}`;
  };

  const handleCopySummary = async () => {
    if (!submittedRecord) return;
    try {
      await navigator.clipboard.writeText(buildFormattedSummary(submittedRecord));
      setCopiedSummary(true);
      window.setTimeout(() => setCopiedSummary(false), 2200);
    } catch {
      setCopiedSummary(false);
    }
  };

  return (
    <div className="bg-white text-[var(--color-ink)]">
      {/* Institutional Page Header */}
      <section className="bg-white border-b border-[var(--color-hairline)] pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-6"
          >
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-[var(--color-brand)] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="font-medium text-[var(--color-primary-ink)]">
              Contact &amp; Admission Enquiry
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                {OFFICIAL_CAMPUS_LOCATION.collegeName} · {OFFICIAL_CAMPUS_LOCATION.tagline}
              </p>
              <h1 className="mt-3 text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold tracking-tight leading-[1.08] text-[var(--color-primary-ink)]">
                Contact &amp; Admission Enquiry
              </h1>
              <p className="mt-4 text-[15px] sm:text-base lg:text-[17px] text-[var(--color-muted)] leading-relaxed max-w-[64ch]">
                Connect directly with the Admissions Desk and Campus Administration at{' '}
                {OFFICIAL_CAMPUS_LOCATION.collegeName} in Teku, Kathmandu for academic counseling,
                campus visits, eligibility verification, and program enquiries across NEB (+2) and
                Tribhuvan University (BBS &amp; MBS) streams.
              </p>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl p-5 sm:p-6 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-brand)]">
                  Direct Admissions Desk
                </p>
                <a
                  href={OFFICIAL_CAMPUS_LOCATION.telephoneHref}
                  className="block font-display text-2xl font-semibold text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] tabular-nums transition-colors"
                >
                  {OFFICIAL_CAMPUS_LOCATION.telephone}
                </a>
                <p className="text-xs text-[var(--color-muted)]">
                  Sunday – Friday · Regular College Hours · Teku, Kathmandu
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Two-Column Section: Enquiry Form + Campus Office Directory */}
      <section className="py-14 sm:py-20 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Public Student & Admission Enquiry Form */}
            <div id="enquiry-form" className="lg:col-span-7 scroll-mt-24">
              <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-6 sm:p-8 lg:p-10">
                <div className="pb-6 border-b border-[var(--color-hairline)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                    Student &amp; Guardian Counselling
                  </p>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-primary-ink)]">
                    Submit an Admission or General Enquiry
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">
                    Complete your details below to prepare a structured admission enquiry for our
                    Teku campus counseling desk, or reach us immediately by phone or email.
                  </p>
                </div>

                {submittedRecord ? (
                  <div className="mt-7 space-y-6">
                    <div className="rounded-xl bg-[var(--color-canvas)] border border-[var(--color-hairline)] p-6">
                      <div className="flex items-start gap-3.5">
                        <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--color-primary-ink)]">
                            {submittedRecord.savedToDatabase
                              ? 'Your Enquiry Has Been Recorded'
                              : 'Enquiry Ready for Direct Dispatch'}
                          </h3>
                          <p className="mt-1.5 text-sm text-[var(--color-muted)] leading-relaxed">
                            Thank you, <strong className="text-[var(--color-ink)]">{submittedRecord.fullName}</strong>.
                            {submittedRecord.savedToDatabase
                              ? ' Your enquiry for '
                              : ' Click "Send via Official Email" below to transmit your formatted enquiry for '}
                            <strong className="text-[var(--color-ink)]">
                              {submittedRecord.program}
                            </strong>{' '}
                            directly to{' '}
                            <span className="font-medium text-[var(--color-primary-ink)]">
                              {OFFICIAL_CAMPUS_LOCATION.email}
                            </span>
                            , or call our Admissions Desk at{' '}
                            <span className="font-medium text-[var(--color-primary-ink)] tabular-nums">
                              {OFFICIAL_CAMPUS_LOCATION.telephone}
                            </span>
                            .
                          </p>
                        </div>
                      </div>

                      <dl className="mt-5 pt-4 border-t border-[var(--color-hairline)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <dt className="text-[var(--color-muted)]">Applicant / Enquirer</dt>
                          <dd className="mt-0.5 font-semibold text-[var(--color-primary-ink)]">
                            {submittedRecord.fullName}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[var(--color-muted)]">Contact Phone</dt>
                          <dd className="mt-0.5 font-semibold text-[var(--color-primary-ink)] tabular-nums">
                            {submittedRecord.phone}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[var(--color-muted)]">Email Address</dt>
                          <dd className="mt-0.5 font-semibold text-[var(--color-primary-ink)] break-all">
                            {submittedRecord.email}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[var(--color-muted)]">Program Selected</dt>
                          <dd className="mt-0.5 font-semibold text-[var(--color-brand)]">
                            {submittedRecord.program}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                      <a
                        href={buildMailtoHref(submittedRecord)}
                        className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-lg transition-colors whitespace-nowrap shrink-0"
                      >
                        <Mail className="w-4 h-4 shrink-0" />
                        <span>Send via Official Email</span>
                      </a>

                      <a
                        href={OFFICIAL_CAMPUS_LOCATION.telephoneHref}
                        className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-3 text-sm font-semibold text-[var(--color-primary-ink)] bg-white border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] rounded-lg transition-colors whitespace-nowrap shrink-0 tabular-nums"
                      >
                        <Phone className="w-4 h-4 shrink-0 text-[var(--color-brand)]" />
                        <span>Call {OFFICIAL_CAMPUS_LOCATION.telephone}</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="inline-flex items-center justify-center gap-1.5 min-h-11 px-4 py-2.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-primary-ink)] border border-[var(--color-hairline)] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {copiedSummary ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Copied Summary</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Summary</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setSubmittedRecord(null)}
                        className="text-xs font-semibold text-[var(--color-brand)] hover:underline underline-offset-4 cursor-pointer"
                      >
                        Edit details or prepare another enquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                    <div>
                      <label
                        htmlFor="contact-full-name"
                        className="block text-xs font-semibold text-[var(--color-primary-ink)] mb-1.5"
                      >
                        Full Name <span className="text-[var(--color-brand)]">*</span>
                      </label>
                      <input
                        id="contact-full-name"
                        type="text"
                        required
                        maxLength={SCHEMA_LIMITS.ENQUIRY_NAME_MAX}
                        value={formState.fullName}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, fullName: e.target.value }))
                        }
                        placeholder="Enter student or guardian full name"
                        className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-lg text-[var(--color-ink)] focus:bg-white focus:border-[var(--color-brand)] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="block text-xs font-semibold text-[var(--color-primary-ink)] mb-1.5"
                        >
                          Phone Number <span className="text-[var(--color-brand)]">*</span>
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          required
                          maxLength={SCHEMA_LIMITS.PHONE_MAX}
                          value={formState.phone}
                          onChange={(e) =>
                            setFormState((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          placeholder="98XXXXXXXX or 01-XXXXXXX"
                          className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-lg text-[var(--color-ink)] tabular-nums focus:bg-white focus:border-[var(--color-brand)] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-semibold text-[var(--color-primary-ink)] mb-1.5"
                        >
                          Email Address <span className="text-[var(--color-brand)]">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          maxLength={SCHEMA_LIMITS.EMAIL_MAX}
                          value={formState.email}
                          onChange={(e) =>
                            setFormState((prev) => ({ ...prev, email: e.target.value }))
                          }
                          placeholder="you@example.com"
                          className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-lg text-[var(--color-ink)] focus:bg-white focus:border-[var(--color-brand)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-program"
                        className="block text-xs font-semibold text-[var(--color-primary-ink)] mb-1.5"
                      >
                        Academic Program of Interest
                      </label>
                      <select
                        id="contact-program"
                        value={formState.program}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, program: e.target.value }))
                        }
                        className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-lg text-[var(--color-ink)] focus:bg-white focus:border-[var(--color-brand)] focus:outline-none cursor-pointer"
                      >
                        {programOptions.map((optionTitle) => (
                          <option key={optionTitle} value={optionTitle}>
                            {optionTitle}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-semibold text-[var(--color-primary-ink)] mb-1.5"
                      >
                        Questions or Counselling Notes (Optional)
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        maxLength={SCHEMA_LIMITS.ENQUIRY_MESSAGE_MAX}
                        value={formState.message}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, message: e.target.value }))
                        }
                        placeholder="Ask about subject combinations, eligibility, shifts, scholarships, or scheduling a campus visit..."
                        className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-lg text-[var(--color-ink)] focus:bg-white focus:border-[var(--color-brand)] focus:outline-none"
                      />
                    </div>

                    {formError && (
                      <p role="alert" className="text-xs font-medium text-[var(--color-brand)]">
                        {formError}
                      </p>
                    )}

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-sm font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>{submitting ? 'Preparing Enquiry...' : 'Continue Admission Enquiry'}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>

                      <p className="text-xs text-[var(--color-muted)]">
                        Or call directly:{' '}
                        <a
                          href={OFFICIAL_CAMPUS_LOCATION.telephoneHref}
                          className="font-semibold text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] underline underline-offset-4 tabular-nums"
                        >
                          {OFFICIAL_CAMPUS_LOCATION.telephone}
                        </a>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Verified Campus Contact Details & Google Maps Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[var(--color-hairline)] rounded-xl p-6 sm:p-8 space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                    Campus Administration
                  </p>
                  <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-[var(--color-primary-ink)]">
                    Official Contact Information
                  </h2>
                </div>

                <dl className="divide-y divide-[var(--color-hairline)] text-sm">
                  <div className="py-4 first:pt-0 flex items-start gap-3.5">
                    <MapPin className="w-4 h-4 text-[var(--color-brand)] shrink-0 mt-1" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        Campus Address
                      </dt>
                      <dd className="mt-1 font-medium text-[var(--color-primary-ink)]">
                        {OFFICIAL_CAMPUS_LOCATION.collegeName}
                        <span className="block text-[var(--color-ink)] font-normal">
                          {OFFICIAL_CAMPUS_LOCATION.address}
                        </span>
                      </dd>
                    </div>
                  </div>

                  <div className="py-4 flex items-start gap-3.5">
                    <Phone className="w-4 h-4 text-[var(--color-brand)] shrink-0 mt-1" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        Telephone
                      </dt>
                      <dd className="mt-1">
                        <a
                          href={OFFICIAL_CAMPUS_LOCATION.telephoneHref}
                          className="font-semibold text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] underline-offset-4 hover:underline tabular-nums"
                        >
                          {OFFICIAL_CAMPUS_LOCATION.telephone}
                        </a>
                      </dd>
                    </div>
                  </div>

                  <div className="py-4 flex items-start gap-3.5">
                    <Mail className="w-4 h-4 text-[var(--color-brand)] shrink-0 mt-1" />
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        Official Email
                      </dt>
                      <dd className="mt-1">
                        <a
                          href={OFFICIAL_CAMPUS_LOCATION.emailHref}
                          className="font-medium text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] underline-offset-4 hover:underline break-all"
                        >
                          {OFFICIAL_CAMPUS_LOCATION.email}
                        </a>
                      </dd>
                    </div>
                  </div>

                  <div className="py-4 last:pb-0 flex items-start gap-3.5">
                    <Clock className="w-4 h-4 text-[var(--color-brand)] shrink-0 mt-1" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        Office &amp; Counselling Hours
                      </dt>
                      <dd className="mt-1 text-[var(--color-ink)]">
                        Sunday – Friday (Regular College Hours)
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>

              {/* Official Campus Map Card */}
              <div className="bg-[var(--color-primary-ink)] text-white rounded-xl p-6 sm:p-8 border-t-4 border-t-[var(--color-brand)] space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-on-dark)]">
                  Campus Directions
                </p>
                <h3 className="text-xl font-semibold text-white">
                  Visit Our Teku, Kathmandu Campus
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Open our verified campus pin on Google Maps for turn-by-turn directions to{' '}
                  {OFFICIAL_CAMPUS_LOCATION.collegeName} in Teku, Kathmandu.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={OFFICIAL_CAMPUS_LOCATION.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 text-xs font-semibold bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>

                  <button
                    type="button"
                    onClick={onNavigatePrograms}
                    className="inline-flex items-center justify-center min-h-11 px-4 py-2.5 text-xs font-medium text-white border border-white/25 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Explore All 6 Programs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
