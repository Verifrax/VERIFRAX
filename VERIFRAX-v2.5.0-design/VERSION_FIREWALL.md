# Version Firewall

## Isolation Rules

v2.4.0 and v2.5.0 must remain completely isolated.

---

## No Shared Branches

**Rule:** v2.4.0 and v2.5.0 must not share branches.

**Enforcement:** Separate branches for each version. No common branches.

---

## No Cherry-Picks

**Rule:** No cherry-picking commits between v2.4.0 and v2.5.0.

**Enforcement:** Versions are independent. No commit sharing.

---

## No Backports

**Rule:** No backporting changes from v2.5.0 to v2.4.0.

**Enforcement:** v2.4.0 is frozen. No changes allowed.

---

## No Mixed Commits

**Rule:** No commits that affect both v2.4.0 and v2.5.0.

**Enforcement:** Each commit must target exactly one version.

---

## Repository Separation

**Rule:** v2.4.0 and v2.5.0 may be in separate repositories.

**Enforcement:** Design repository (`VERIFRAX-v2.5.0-design`) is separate from implementation repository (`VERIFRAX`).

---

## Summary

Version firewall ensures v2.4.0 remains sealed and v2.5.0 development does not affect it.

