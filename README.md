# Ekachitta— Software Requirements Specification (SRS)

Project: Ekachitta • Document Version: 1.0 • Author: Nischal Lamichhane • Date: 2025-10-26

## 1\. Introduction

**Purpose:** This SRS defines the requirements for **Ekachitta**, a forever-free browser extension that filters YouTube content to show only videos relevant to the user's search query or user-provided keywords. The goal is to create an intent-based, distraction-free viewing experience for learners and professionals.

**Audience:** Developers, product managers, testers, contributors, and end-users (students, self-learners, professionals).

**Scope:** The first release (MVP) targets Chromium-based browsers (Chrome, Edge, Brave) as a Manifest V3 extension. Firefox support may be considered in a future release.

## 2\. Name & Branding

**Chosen name (primary):** **Ekachitta** — A non-English word from Sanskrit, EkaChitta means “focused mind” or “one-pointed consciousness.” Chosen for clarity, memorability, and alignment with the product goal: enabling the user to maintain full focus on their learning intent.

**Alternative non-English names (candidates):**

*   **Adhyayan** (Sanskrit/Hindi) — means "study/learning".
*   **Netra** (Sanskrit/Nepali) — means "eye" or "sight".
*   **Vidyā** (Sanskrit) — means "knowledge".
*   **Ankura** (Sanskrit/Nepali) — means "sprout" (learning growth metaphor).

Note: Final name must be checked for trademark conflicts and Chrome Web Store availability before publication.

## 3\. Overall Description

### 3.1 Product Perspective

Ekachitta is a client-side browser extension that modifies YouTube's web UI by hiding or showing video elements according to an intent filter. No backend is required for the MVP — settings are stored locally using the browser storage API.

### 3.2 User Roles

*   **End User** — a learner who sets keywords or expects automatic detection from search queries.
*   **Admin / Maintainer** — developer who publishes updates and maintains the open-source repo.

### 3.3 Assumptions

*   YouTube DOM structure is subject to change; selectors may need updates. The extension will be robust but requires maintenance.
*   The extension will not access or transmit personal video watch history or private data.

## 4\. Functional Requirements

| ID  | Title | Description |
| --- | --- | --- |
| FR-01 | Keyword Input | The user can add, edit, and remove keywords (comma-separated) via the extension popup. Keywords persist using `chrome.storage.local`. |
| FR-02 | Search Auto-detection | When a user performs a YouTube search, Ekachitta can auto-suggest the query as active keywords and prompt the user to accept or modify them. |
| FR-03 | Filter Suggestions & Homepage | Ekachitta scans suggested videos, sidebars, and homepage cards; only elements matching at least one keyword in title or available metadata remain visible. |
| FR-04 | Filter in-Page Dynamically | The extension observes DOM mutations and reapplies filters when new video items load (infinite scroll/navigation). |
| FR-05 | Whitelist Channels | User can mark channels as always-allowed so their videos are never hidden regardless of keywords. |
| FR-06 | Temporary Pause | User can toggle filtering on/off (quick switch) without losing keyword settings. |
| FR-07 | Visual Indicator | When active, an unobtrusive overlay shows "Ekachitta : Focus On — keywords..." with an option to edit keywords quickly. |
| FR-08 | Error Handling | If filter fails due to DOM changes, the extension shows a toast or popup message recommending update and offers an "attempt fallback" mode (simpler selectors). |

## 5\. Non-Functional Requirements

| ID  | Title | Requirement |
| --- | --- | --- |
| NFR-01 | Performance | Filtering operations must not block the main thread. MutationObserver callbacks must be debounced; CPU usage should be minimal. |
| NFR-02 | Privacy | No user data (keywords, usage) is transmitted externally. Local storage only. The extension is open-source and privacy-respecting. |
| NFR-03 | Reliability | Extension should continue to work reliably for typical browsing sessions (no crashes, not interfering with video playback). |
| NFR-04 | Compatibility | Supports latest stable Chromium browsers at time of release. Graceful degradation for unsupported browsers. |
| NFR-05 | Accessibility | Popup UI and controls should be keyboard accessible and screen-reader friendly where feasible. |

## 6\. UI/UX Requirements

*   Popup: simple keyword input, quick toggle (on/off), link to "Manage whitelist" and "Open settings".
*   Overlay: small banner near the top right when active showing current keywords and a one-click "pause" button.
*   Settings Page (optional): manage multiple keyword profiles, export/import keywords as JSON.
*   Notifications: unobtrusive alerts when filters fail or when YouTube layout changes significantly.
## 7\. Data Requirements

*   Keywords: stored as an array of strings in `chrome.storage.local`.
*   Whitelist: stored as an array of channel IDs or channel names.
*   Telemetry: none for MVP. Optional opt-in anonymous crash reports in later versions.

## 8\. Security & Privacy

*   Permissions: restrict extension permissions to only what is necessary: `activeTab`, `scripting`, `storage`, and host match `*://www.youtube.com/*`.
*   No external network calls are made by default. Any optional feature that requires network (e.g., AI summaries) must be opt-in and documented.
*   Adhere to Chrome Web Store policies regarding user data and permissions.

## 9\. Performance Requirements

*   Initial filtering pass should complete within 300ms on a typical mid-range laptop when applied to the current view (measured at time of release).
*   Subsequent re-filters triggered by DOM changes should be debounced (e.g., 300–600ms) to avoid repeated heavy runs.

## 10\. Testing & Acceptance Criteria

*   Unit tests for keyword matching logic (cases: exact, partial, case-insensitive, multi-word).
*   Integration tests (manual/automated) to verify that suggested videos and sidebar cards hide correctly for a set of sample keywords and YouTube pages (search results, watch page, home feed).
*   Performance testing to ensure UI remains responsive while filtering active pages.
*   Accessibility checks for popup controls and toggles.

## 11\. Milestones (MVP)

1.  Project setup, repo, README, license (MIT), basic manifest & build pipeline.
2.  Popup UI: Add/edit keywords + storage + basic on/off toggle.
3.  Content script: filter by title selector + MutationObserver + debounce.
4.  Whitelist feature + visual overlay.
5.  Testing, publish to Chrome Web Store (as free) and create landing page.

## 12\. Open Questions & Risks

*   **DOM fragility:** YouTube’s frequent UI changes may break selectors. Mitigation: provide fallback selectors and frequent maintenance, and open-source community help.
*   **Keyword quality:** Users might choose too-broad or too-narrow keywords. Mitigation: provide UI suggestions (auto-add from search query) and examples.
*   **Extension store policies:** Ensure extension permissions and description match privacy claims to avoid rejection.

## 13\. Appendix

### 13.1 Glossary

*   **Keyword:** A string or phrase used to determine relevance.
*   **Whitelist:** Channel-level allow list.
*   **DOM:** Document Object Model — the structure of elements on the web page.

### 13.2 References

*   Chrome Extension Manifest V3 Documentation
*   Chrome Web Store policies

End of SRS — Ekachitta • Version 1.0 • Generated on 2025-10-26
