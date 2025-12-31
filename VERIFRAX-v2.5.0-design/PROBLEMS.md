# Problems (No Solutions)

## Problem Statements Only

This document lists problems identified in v2.4.0. **No solutions are proposed here.**

---

## Streaming Hash Limitation

**Problem:** v2.4.0 reads entire bundle into memory to compute hash.

**Impact:** Memory-bound upload limits bundle size.

**Constraint:** Must preserve v2.4.0 hash computation for compatibility.

---

## Memory-Bound Upload

**Problem:** v2.4.0 upload endpoint buffers entire bundle in memory.

**Impact:** Large bundles consume excessive memory.

**Constraint:** Must preserve v2.4.0 upload behavior for compatibility.

---

## Operational Ergonomics

**Problem:** v2.4.0 requires manual payment intent creation before upload.

**Impact:** Additional client-side steps required.

**Constraint:** Must preserve v2.4.0 payment → execution boundary.

---

## Notes

- These are problem statements only
- No solutions are proposed
- No implementation details
- No design decisions

