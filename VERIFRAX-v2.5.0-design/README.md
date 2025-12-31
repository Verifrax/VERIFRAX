# VERIFRAX-v2.5.0-design

**STATUS:** DESIGN ONLY  
**ROLE:** NON-AUTHORITATIVE  
**VERSION:** v2.5.0 (FUTURE)

> **This repository contains design notes only. No implementation. No authority.**

---

## Purpose

This repository contains design discussions and proposals for VERIFRAX v2.5.0.

**This is NOT an implementation repository.**

**This is NOT authoritative.**

**This is NOT production code.**

---

## Design Boundary

- v2.4.0 behavior is immutable
- v2.5.0 design must preserve v2.4.0 compatibility
- No retroactive changes to v2.4.0
- No reinterpretation of v2.4.0 certificates

---

## Contents

- `DESIGN_CONSTRAINTS.md` — Design constraints and immutability locks
- `PROBLEMS.md` — Problem statements (no solutions)
- `NON_GOALS.md` — Explicitly banned features
- `AXIOMS.md` — Design axioms that must be preserved
- `INTERFACES.md` — Interface sketches (text only)
- `VERSION_FIREWALL.md` — Version isolation rules

---

## Authority

**None.** This repository has no authority over VERIFRAX.

Authoritative sources:
- `Verifrax/VERIFRAX` — v2.4.0 (frozen)
- `verifrax.net/spec` — v2.4.0 specification

---

## Status

**DRAFT** — Design discussions only.

