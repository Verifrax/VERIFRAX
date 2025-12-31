# VERIFRAX v2.4.0 — Repo-by-Repo Audit Checklist

**Purpose:** Hard-fix GitHub, freeze VERIFRAX v2.4.0, eliminate personal leakage, align GitHub + Cloudflare with finality.

**Status:** IMMEDIATE ACTION REQUIRED

---

## PHASE 0 — STOP DAMAGE (IMMEDIATE)

### ✅ 0.1 Hard Stop
- [ ] **STOP all commits** until Phase 1 is complete
- [ ] Document current state of all repos
- [ ] Identify all working directories

### ✅ 0.2 Identify All Repos
List all repositories in the `Verifrax` GitHub org:

- [ ] `VERIFRAX` (main engine)
- [ ] `VERIFRAX-verify` (reference verifier)
- [ ] `VERIFRAX-SPEC` (specification)
- [ ] `VERIFRAX-PROFILES` (profiles)
- [ ] `verifrax-edge` (Cloudflare Worker — **MUST BE PRIVATE**)
- [ ] `verifrax-infra` (if exists — **MUST BE PRIVATE**)
- [ ] Any other repos?

---

## PHASE 1 — HARD CLEAN LOCAL STATE

### ✅ 1.1 Git Identity Per Directory

For **each repository**, run:

```bash
cd <repo-directory>
git config --local user.name
git config --local user.email
git remote -v
```

**Expected pattern:**
- `user.email`: `legal@verifrax.net` (or appropriate org email)
- `user.name`: `VERIFRAX` (or consistent org identity)
- `remote`: Points to correct GitHub repo

**Action items per repo:**

#### VERIFRAX (main)
- [ ] Verify local Git config
- [ ] Set: `git config --local user.email legal@verifrax.net`
- [ ] Set: `git config --local user.name "VERIFRAX"`
- [ ] Verify remote: `git remote -v` → `https://github.com/Verifrax/VERIFRAX.git`
- [ ] Document current commit hash

#### VERIFRAX-verify (reference verifier)
- [ ] Verify local Git config
- [ ] Set: `git config --local user.email legal@verifrax.net`
- [ ] Set: `git config --local user.name "VERIFRAX"`
- [ ] Verify remote: `git remote -v` → `https://github.com/Verifrax/VERIFRAX-verify.git`
- [ ] Document current commit hash

#### VERIFRAX-SPEC (specification)
- [ ] Verify local Git config
- [ ] Set: `git config --local user.email legal@verifrax.net`
- [ ] Set: `git config --local user.name "VERIFRAX"`
- [ ] Verify remote: `git remote -v` → `https://github.com/Verifrax/VERIFRAX-SPEC.git`
- [ ] Document current commit hash

#### VERIFRAX-PROFILES (profiles)
- [ ] Verify local Git config
- [ ] Set: `git config --local user.email legal@verifrax.net`
- [ ] Set: `git config --local user.name "VERIFRAX"`
- [ ] Verify remote: `git remote -v` → `https://github.com/Verifrax/VERIFRAX-PROFILES.git`
- [ ] Document current commit hash

#### verifrax-edge (Cloudflare Worker — **PRIVATE**)
- [ ] Verify local Git config
- [ ] Set: `git config --local user.email legal@verifrax.net`
- [ ] Set: `git config --local user.name "VERIFRAX"`
- [ ] Verify remote: `git remote -v` → `https://github.com/Verifrax/verifrax-edge.git`
- [ ] **VERIFY REPO IS PRIVATE ON GITHUB**
- [ ] Document current commit hash

#### verifrax-infra (if exists — **PRIVATE**)
- [ ] Verify local Git config
- [ ] Set: `git config --local user.email legal@verifrax.net`
- [ ] Set: `git config --local user.name "VERIFRAX"`
- [ ] Verify remote: `git remote -v` → `https://github.com/Verifrax/verifrax-infra.git`
- [ ] **VERIFY REPO IS PRIVATE ON GITHUB**
- [ ] Document current commit hash

### ✅ 1.2 Kill Credential Bleed

On macOS:

```bash
git credential reject
```

- [ ] Clear credential cache
- [ ] Re-authenticate **once**, deliberately, per repo
- [ ] Use GitHub Personal Access Token (PAT) or SSH keys
- [ ] **Do not** rely on global Git config for identity

---

## PHASE 2 — DEFINE PUBLIC VS FORBIDDEN

### ✅ 2.1 PUBLIC Repositories (Intentional Exposure)

These exist to **prove determinism**, not to operate the system.

#### VERIFRAX-verify (Reference Verifier)
- [ ] **Status:** PUBLIC
- [ ] **Purpose:** Offline, third-party verification
- [ ] **Contains:** Reference verifier implementation only
- [ ] **Does NOT contain:** Cloudflare Worker code, Stripe integration, R2 logic
- [ ] **GitHub Pages:** Enabled at `/docs` or `/root` (static only)
- [ ] **URL:** `https://verifrax.github.io/VERIFRAX-verify/`
- [ ] **Freeze tag:** `v2.4.0` exists and is protected

#### VERIFRAX-SPEC (Specification)
- [ ] **Status:** PUBLIC
- [ ] **Purpose:** Frozen specification mirror
- [ ] **Contains:** Specification documents only (no runtime code)
- [ ] **Does NOT contain:** Private keys, infrastructure references, execution code
- [ ] **Freeze tag:** `v2.4.0` exists and is protected

#### VERIFRAX-PROFILES (Profiles)
- [ ] **Status:** PUBLIC
- [ ] **Purpose:** Declarative profile definitions
- [ ] **Contains:** Profile JSON schemas only
- [ ] **Does NOT contain:** Interpretation logic, execution code
- [ ] **Freeze tag:** `v2.4.0` exists and is protected

#### VERIFRAX (Main Engine)
- [ ] **Status:** PUBLIC (authoritative engine)
- [ ] **Purpose:** Deterministic verification engine
- [ ] **Contains:** Core engine, frozen artifacts, reference verifier source
- [ ] **Does NOT contain:** Cloudflare Worker deployment code, Stripe integration, R2 bucket logic
- [ ] **Freeze tag:** `v2.4.0` exists and is protected
- [ ] **Freeze commit:** `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`

### ✅ 2.2 PRIVATE Repositories (Non-Negotiable)

These violate finality or expose attack surface if public.

#### verifrax-edge (Cloudflare Worker)
- [ ] **Status:** PRIVATE (non-negotiable)
- [ ] **Contains:** Cloudflare Worker source for execution
- [ ] **Contains:** Stripe integration code
- [ ] **Contains:** R2 bucket logic
- [ ] **Contains:** Environment variable names tied to infra
- [ ] **Does NOT contain:** `.env` files (use Cloudflare secrets)
- [ ] **Does NOT contain:** Secret keys (use Cloudflare secrets)
- [ ] **Verification:** Repo visibility is PRIVATE on GitHub

#### verifrax-infra (if exists)
- [ ] **Status:** PRIVATE (non-negotiable)
- [ ] **Contains:** Cloudflare/Stripe glue code
- [ ] **Contains:** Deployment scripts
- [ ] **Contains:** Infrastructure configuration
- [ ] **Verification:** Repo visibility is PRIVATE on GitHub

### ✅ 2.3 Forbidden Content (Never Public)

Scan all repos for:

- [ ] Cloudflare Worker source for execution
- [ ] Stripe integration code
- [ ] R2 bucket logic
- [ ] Environment variable names tied to infra
- [ ] Any `.env` files
- [ ] Any secrets, fallbacks
- [ ] Any code that can **produce** a certificate (execution code)
- [ ] Personal information (gmail, icloud, macbook, home/)

**Action:** If found in public repo → **IMMEDIATE REMOVAL** or move to private repo

---

## PHASE 3 — GITHUB ORG HARD STRUCTURE

### ✅ 3.1 Target Org Structure

```
Verifrax/
├── VERIFRAX              (public, frozen, authoritative engine)
├── VERIFRAX-SPEC         (public, frozen, specification)
├── VERIFRAX-PROFILES     (public, frozen, profiles)
├── VERIFRAX-verify       (public, frozen, Pages enabled)
├── verifrax-edge         (private, Cloudflare Worker)
├── verifrax-infra        (private, Cloudflare/Stripe glue)
└── .github
    └── SECURITY.md
```

### ✅ 3.2 Rules Enforcement

- [ ] **One purpose per repo** — verified
- [ ] **Public repos never deploy** — verified
- [ ] **Private repos never explain** — verified
- [ ] All repos have consistent naming
- [ ] All repos have consistent identity

---

## PHASE 4 — FREEZE v2.4.0 (REAL FREEZE)

### ✅ 4.1 Git Freeze (All v2.4.0 Repos)

For each repo:

```bash
git tag -a v2.4.0 -m "VERIFRAX v2.4.0 — FROZEN"
git push origin v2.4.0
```

**Checklist per repo:**

#### VERIFRAX
- [ ] Tag `v2.4.0` exists
- [ ] Tag pushed to GitHub
- [ ] Tag points to freeze commit: `160f1f94bfedb81c6de6f797abad6e5fc9e0f5f2`
- [ ] Branch `main` is protected
- [ ] Force-push is disabled
- [ ] Signed commits required (if configured)

#### VERIFRAX-verify
- [ ] Tag `v2.4.0` exists
- [ ] Tag pushed to GitHub
- [ ] Branch `main` is protected
- [ ] Force-push is disabled

#### VERIFRAX-SPEC
- [ ] Tag `v2.4.0` exists
- [ ] Tag pushed to GitHub
- [ ] Branch `main` is protected
- [ ] Force-push is disabled

#### VERIFRAX-PROFILES
- [ ] Tag `v2.4.0` exists
- [ ] Tag pushed to GitHub
- [ ] Branch `main` is protected
- [ ] Force-push is disabled

#### verifrax-edge
- [ ] Tag `v2.4.0` exists
- [ ] Tag pushed to GitHub
- [ ] Branch `main` is protected
- [ ] Force-push is disabled

### ✅ 4.2 README Declaration

Top line in **every** repo README:

```
**Status: FROZEN — VERIFRAX v2.4.0 is immutable**
```

- [ ] VERIFRAX README updated
- [ ] VERIFRAX-verify README updated
- [ ] VERIFRAX-SPEC README updated
- [ ] VERIFRAX-PROFILES README updated
- [ ] verifrax-edge README updated (if exists)

**No roadmap. No promises. Just frozen state.**

---

## PHASE 5 — GITHUB PAGES FIX

### ✅ 5.1 VERIFRAX-verify Pages Configuration

- [ ] Pages source = `/docs` or `/root` (choose one, document choice)
- [ ] Static only (no JS build step)
- [ ] Manual push → confirm Pages rebuild
- [ ] Test: `https://verifrax.github.io/VERIFRAX-verify/` loads correctly
- [ ] **If Pages requires CI → violation of simplicity** (fix immediately)

### ✅ 5.2 Pages Troubleshooting

If Pages "stopped updating":

- [ ] Check: Commits from wrong repo? → Fix identity (Phase 1)
- [ ] Check: Pages source branch mismatch? → Fix in GitHub settings
- [ ] Check: Build artifact removed? → Restore if intentional
- [ ] Check: Identity mismatch blocked CI? → Fix identity (Phase 1)

---

## PHASE 6 — CLOUDFLARE ALIGNMENT

### ✅ 6.1 Cloudflare Authority Boundary

**Re-anchor thinking:** Cloudflare **executes**, it does not **define truth**.

- [ ] No Cloudflare links in public docs
- [ ] No dependency claims on Cloudflare
- [ ] Certificates must survive Cloudflare deletion
- [ ] Reference verifier works offline (no Cloudflare dependency)

### ✅ 6.2 Public Documentation Scan

Scan all public repos for:

- [ ] References to `cloudflare.com` → Remove or qualify as "execution only"
- [ ] Claims that verification depends on Cloudflare → Remove
- [ ] Links to Cloudflare Worker code → Remove (code is private)

---

## PHASE 7 — JUNK & PERSONAL INFO PURGE

### ✅ 7.1 Personal Information Scan

Run on **all repos**:

```bash
git grep -i "gmail\|icloud\|macbook\|home\/"
```

**Known issues:**

- [ ] `ENVIRONMENT_FINGERPRINT.txt` contains `MacBookAir.home` → **FIX IMMEDIATELY**
- [ ] Any other personal info found? → Document and fix

### ✅ 7.2 Secret Rotation

If secrets ever existed in Git history:

- [ ] Rotate all keys (Stripe, Cloudflare, etc.)
- [ ] Consider `git filter-repo` for history cleanup
- [ ] Assume compromise, not safety
- [ ] Update all Cloudflare Worker secrets
- [ ] Update all Stripe keys

**Cost of avoidance here is catastrophic.**

### ✅ 7.3 File Cleanup

- [ ] Remove `.env` files (if any)
- [ ] Remove `*.local` files
- [ ] Remove test credentials
- [ ] Remove personal notes
- [ ] Remove development artifacts

---

## PHASE 8 — FINAL VERIFICATION

### ✅ 8.1 Repo Visibility Check

- [ ] VERIFRAX: PUBLIC
- [ ] VERIFRAX-verify: PUBLIC
- [ ] VERIFRAX-SPEC: PUBLIC
- [ ] VERIFRAX-PROFILES: PUBLIC
- [ ] verifrax-edge: **PRIVATE**
- [ ] verifrax-infra: **PRIVATE** (if exists)

### ✅ 8.2 Identity Consistency

- [ ] All repos use same Git identity
- [ ] All repos use same email: `legal@verifrax.net`
- [ ] All repos use same name: `VERIFRAX`
- [ ] All remotes point to correct GitHub org

### ✅ 8.3 Freeze Verification

- [ ] All repos have `v2.4.0` tag
- [ ] All tags pushed to GitHub
- [ ] All `main` branches protected
- [ ] All READMEs declare frozen status

### ✅ 8.4 Public/Private Boundary

- [ ] No execution code in public repos
- [ ] No secrets in any repo
- [ ] No personal information in any repo
- [ ] No Cloudflare/Stripe integration code in public repos

---

## FINAL REALITY CHECK

**Your drift point was urgency without boundary discipline.**

**VERIFRAX only works if:**
- ✅ Execution is private
- ✅ Verification is public
- ✅ Truth is frozen

**Restore that triangle and momentum returns.**

---

## SIGN-OFF

- [ ] All Phase 0 items complete
- [ ] All Phase 1 items complete
- [ ] All Phase 2 items complete
- [ ] All Phase 3 items complete
- [ ] All Phase 4 items complete
- [ ] All Phase 5 items complete
- [ ] All Phase 6 items complete
- [ ] All Phase 7 items complete
- [ ] All Phase 8 items complete

**Date completed:** _______________

**Completed by:** _______________

