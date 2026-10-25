# Date Invitation

A planned romantic, mobile-friendly invitation with activity choices, scheduling, and reliable answer delivery. The design direction is classy, off-white, and lightly animated.

**Status: Phase 0 complete; implementation has not started.** There is no application, configured submission service, or verified live website. Private response tracking remains a requirement to resolve.

## Documentation

| File | Purpose |
| --- | --- |
| [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md) | Full product scope and source labels |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Recommended architecture and future file structure |
| [DECISIONS_AND_OPEN_QUESTIONS.md](DECISIONS_AND_OPEN_QUESTIONS.md) | Confirmed requirements, proposals, conflicts, and unknowns |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Prioritized phases, checks, and release gates |
| [REFERENCE_REVIEW.md](REFERENCE_REVIEW.md) | Uploaded-video observations and TikTok access limits |
| [VERIFICATION.md](VERIFICATION.md) | Repository/environment evidence and executed checks |
| [AGENTS.md](AGENTS.md) | Instructions for future coding tasks |

## Repository and workflow

- Connected repository: `adriancarbon-byte/Date-invitation`.
- Verified remote branch: `main`; current Codex checkout: `work`.
- Initial commit: `e60ce67c0f6a5b2d2c6a659c8fbe414cf2dcb20d`; both branches matched it before documentation edits.
- Development and testing run in Codex Cloud; no café-computer installation is needed.
- Phase 0 documentation is maintained on `work` for preservation through a pull request to `main`, as authorized in the follow-up request. Git history and the pull request record the saved revision; this does not authorize merging or Phase 1.
- Future hosting target: GitHub Pages. GitHub reports Pages is disabled as of the preservation review. Expected future address: `https://adriancarbon-byte.github.io/Date-invitation/`; no live website has been verified. Release requires explicit approval.

## Recommended direction

Use semantic HTML, vanilla JavaScript modules, and Tailwind compiled in the cloud to static CSS. Add restrained Animate.css transitions, bounded Canvas Confetti, and optional audio later. Use a mocked submission adapter until answer delivery is approved.

Web3Forms email is the proposed simple delivery route. It does not let the client reopen the invitation to retrieve private saved answers. Email-only delivery requires acceptance; an authenticated dashboard would require separate scope and architecture.

## Review and next task

Review the documents, particularly decisions Q01–Q06. These do not block a neutral Phase 1 foundation. Keep personal details, dinner categories, and time availability configurable until confirmed.

After approving Phase 0, send this exact instruction:

> Phase 0 is approved. Execute Phase 1 only using the saved project documentation. Create the minimal semantic HTML, compiled Tailwind CSS, and vanilla JavaScript foundation with centralized in-memory state, accessible forward/back navigation, and responsive placeholder stages. Keep unresolved invitation buttons, dinner choices, and time availability configurable without treating defaults as client-approved. Use mock submission behavior only and clearly label any test outcome. Run the Phase 1 acceptance checks and update the documentation. Do not implement later-phase features, configure live Web3Forms, send notifications, enable GitHub Pages, deploy, commit, or push. Report the changed files, checks, remaining decisions, and next task.
