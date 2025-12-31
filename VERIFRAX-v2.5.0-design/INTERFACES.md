# Interface Sketches (Text Only)

## Streaming Hash Interface

**Purpose:** Enable hash computation without loading entire bundle into memory.

**Concept:**
- Accept bundle as stream
- Compute hash incrementally
- Return hash when stream completes
- No buffering of entire bundle

**Constraints:**
- Must produce same hash as v2.4.0 for same bundle
- Must be deterministic
- Must not require memory proportional to bundle size

**Notes:**
- This is a concept sketch only
- No implementation details
- No code
- No schemas

---

## Execution Authorization Boundary

**Purpose:** Maintain payment → execution boundary with streaming upload.

**Concept:**
- Payment intent created before upload
- Payment confirmed before execution
- Upload can stream (no payment check during stream)
- Execution requires verified payment

**Constraints:**
- Must preserve v2.4.0 payment → execution boundary
- Must not allow execution without payment
- Must not allow retry without new payment

**Notes:**
- This is a concept sketch only
- No implementation details
- No code
- No schemas

---

## Summary

These are interface sketches only. No implementation. No code. No schemas.

