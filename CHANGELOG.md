# Changelog

All notable changes to **CICULLIS** are documented in this file.

CICULLIS follows **Semantic Versioning (SemVer)**.  
Once released, behavior is considered **final** for that version.

There are no silent changes.

---

## [1.0.0] — Initial Release

### Added
- Deterministic CI enforcement gate with **binary pass/fail semantics**
- Fixed enforcement pipeline covering:
  - Time boundary evaluation
  - Custody requirements
  - Provenance sealing
  - Boundary closure
  - Deterministic verification
  - Attestation recording
  - Final judgment
- Default enforcement profile (`profiles/default.profile`)
- Minimal GitHub Actions integration (`action.yml`)
- Non-interactive execution model (no prompts, no retries)
- Explicit failure output identifying:
  - violated rule
  - affected artifact
  - closed decision
- Example workflow demonstrating minimal, read-only permissions usage
- GitHub Marketplace publication

### Security
- No dynamic configuration
- No remote rule fetching
- No mutable runtime behavior
- Designed for **pin-to-SHA** usage in security-sensitive environments

### Guarantees
- Forward-only execution
- No warn mode
- No partial success states
- No silent bypass paths

---

## Versioning Policy

- **MAJOR** versions may introduce breaking enforcement behavior
- **MINOR** versions may add new enforcement rules without altering existing semantics
- **PATCH** versions may fix defects that do not change enforcement outcomes

If behavior changes, the version changes.

---

## Compatibility

- GitHub-hosted runners (Linux)
- GitHub Actions execution environment
- Deterministic behavior across identical inputs

---

## Stability Notice

CICULLIS prioritizes **correctness and finality** over flexibility.

If an upgrade changes outcomes, it will be reflected in a **major version bump**.

Pin versions accordingly.

---

## Out of Scope

The following will never appear in this changelog:
- cosmetic refactors
- documentation-only changes
- internal experiments
- unreleased behavior

If it affects decisions, it is recorded here.

---

End of file.
