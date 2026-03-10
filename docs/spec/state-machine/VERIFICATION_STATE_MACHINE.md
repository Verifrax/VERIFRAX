# VERIFRAX Verification State Machine

Status: Normative

---

## 1. Purpose

This document defines the formal verification execution model of
the VERIFRAX protocol.

The verification process is defined as a deterministic state machine.

All compliant implementations MUST follow the state transitions
defined in this document.

---

## 2. Execution Model

Verification is performed as a sequence of deterministic states.

Each state processes verification inputs and produces either:

- a transition to the next state
- a deterministic failure
- a final verification verdict

---

## 3. State Definitions

### INITIALIZATION

The verification engine initializes execution.

Required actions:

- load protocol version
- load verification profile
- initialize deterministic runtime

Transition:

INITIALIZATION → BUNDLE_LOAD

---

### BUNDLE_LOAD

The verification engine loads the evidence bundle.

Required actions:

- parse bundle container
- validate bundle structure
- ensure required fields exist

Failure conditions:

- malformed bundle
- missing mandatory components

Transition:

BUNDLE_LOAD → CANONICALIZATION

---

### CANONICALIZATION

All verification inputs are canonicalized.

Required actions:

- normalize JSON structures
- enforce canonical ordering
- remove serialization ambiguity

Transition:

CANONICALIZATION → HASH_DERIVATION

---

### HASH_DERIVATION

The canonical bundle hash is computed.

Required actions:

- apply canonical serialization
- compute deterministic hash

Transition:

HASH_DERIVATION → SIGNATURE_VERIFICATION

---

### SIGNATURE_VERIFICATION

Cryptographic signatures are verified.

Required actions:

- validate certificate signatures
- validate attestation signatures
- confirm signature algorithms

Failure conditions:

- invalid signatures
- unsupported algorithms

Transition:

SIGNATURE_VERIFICATION → EVIDENCE_EVALUATION

---

### EVIDENCE_EVALUATION

Evidence claims are evaluated.

Required actions:

- evaluate attestations
- evaluate claims
- apply verification policies

Transition:

EVIDENCE_EVALUATION → CONTRADICTION_ANALYSIS

---

### CONTRADICTION_ANALYSIS

Evidence contradictions are detected.

Required actions:

- identify conflicting claims
- compute contradiction relationships
- classify contradictions

Transition:

CONTRADICTION_ANALYSIS → INVALIDATION_CHECK

---

### INVALIDATION_CHECK

Invalidation rules are evaluated.

Required actions:

- apply invalidation conditions
- determine whether evidence is invalid

Transition:

INVALIDATION_CHECK → VERDICT_GENERATION

---

### VERDICT_GENERATION

A deterministic verification verdict is produced.

Possible verdicts:

- VERIFIED
- FAILED
- INVALIDATED

Transition:

VERDICT_GENERATION → FINAL

---

### FINAL

Terminal state of the verification process.

No further state transitions are permitted.

The verification outcome becomes final.

---

## 4. Deterministic Execution

All implementations MUST execute states in the order defined by
this specification.

State transitions MUST NOT vary across implementations.

---

## 5. Failure Semantics

If any state encounters a failure condition, the verification
engine MUST transition to VERDICT_GENERATION and produce a
deterministic failure verdict.

---

## 6. State Machine Integrity

Implementations MUST NOT modify the state transition order.

Protocol behavior MUST remain identical across implementations.

