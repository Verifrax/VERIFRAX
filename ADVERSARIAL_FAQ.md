# Adversarial FAQ

Common misinterpretations and why they are wrong.

---

### 1. "This certificate proves the content is true."

**Incorrect.**
The certificate proves that a specific evidence bundle existed in a specific form at a specific time and produced a specific deterministic result. It does not assert factual truth, correctness, or quality of the content.

---

### 2. "If VERIFRAX shuts down, the certificate becomes invalid."

**Incorrect.**
Certificate validity is cryptographic and self-contained. Anyone can independently verify the certificate hash and verdict using the public algorithm and the certificate JSON. VERIFRAX infrastructure is not required after issuance.

---

### 3. "A better or corrected certificate can replace an earlier one."

**Incorrect.**
Certificates are immutable and non-superseding. A new execution produces a different certificate that does not invalidate or replace earlier certificates. Each certificate stands on its own.

---

### 4. "VERIFRAX assumes responsibility for the decision."

**Incorrect.**
Responsibility remains with the human party who selected the evidence, initiated execution, and interpreted the result. The system computes deterministically; it does not judge, decide, or assume liability.

---

### 5. "Different outputs mean the system is unreliable."

**Incorrect.**
VERIFRAX is deterministic. Different outputs necessarily imply different inputs, even if the difference is a single byte. Only if byte-identical inputs provably produce different outputs would this indicate a system failure.

---

### 6. "The certificate is legally binding by itself."

**Incorrect.**
Admissibility and legal effect are determined by courts or other decision-makers. The certificate provides cryptographic proof of state, not automatic legal authority or enforceability.

---

### 7. "Using the certificate removes the need for understanding the evidence."

**Incorrect.**
A certificate without understanding the underlying evidence and verdict semantics is meaningless. The system is a precision tool; safe use requires informed human interpretation.
