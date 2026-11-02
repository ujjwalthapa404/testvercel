# Capitol Hill College — Firestore Security Specification

## 1. Data Invariants
1. **Default-Deny Catch-All**: All paths not explicitly matched in `firestore.rules` deny all reads and writes.
2. **PII Split Isolation**: `/users/{userId}` holds only non-PII public profile fields (`uid`, `displayName`, `photoURL`, `createdAt`, `updatedAt`). Email and bookmarked notices live strictly in `/users/{userId}/private/info`, readable and writable only by the verified owner (`request.auth.uid == userId`), and synchronized with parent existence (`existsAfter`).
3. **Trusted Admin Verification**: Admin status requires `request.auth.token.email_verified == true` and either the bootstrapped admin email (`thapaujjwal20@gmail.com`) or an existing `/admins/{uid}` document.
4. **Public Content Lifecycle**: Unauthenticated visitors may `get` or `list` `/notices` and `/faqs` strictly when `resource.data.status == 'PUBLISHED'`. Draft and archived records are restricted to verified administrators.
5. **Enquiry Ownership & Terminal State**: `/enquiries/{enquiryId}` creation requires a verified user whose `userId == request.auth.uid`, an existing `/users/{uid}` parent profile, initial `status == 'NEW'`, empty `adminNotes`, and server timestamps (`request.time`). Students cannot mutate `status` or `adminNotes`, cannot mutate `CLOSED` enquiries, and can only `list` enquiries where `resource.data.userId == request.auth.uid`.

## 2. Dirty Dozen Payloads
Documented and typed in `firestore.rules.test.ts` (`DIRTY_DOZEN_TEST_CASES`, Cases 1–12), covering shadow fields, self-assigned admin escalation, unverified admin email spoofing, cross-user PII reads, orphaned subcollection writes, unbounded bookmark arrays, draft notice leaks, enquiry UID spoofing, student status mutation, terminal state mutation, forged timestamps, and unfiltered collection scraping.
