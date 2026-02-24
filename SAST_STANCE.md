SAST STANCE — CICULLIS

CICULLIS is primarily shell/YAML policy enforcement.
There is no substantive analyzable application code target for CodeQL.

We intentionally accept OpenSSF Scorecard SAST=0.
We do not run SAST for optics.

Security signal is enforced via:
- pinned actions
- least-privilege permissions
- required CI gate checks
- signed commits
- branch protection maximality
