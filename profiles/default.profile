# CICULLIS DEFAULT PROFILE
# CI-SAFE BASELINE

PROFILE_VERSION = 1
PROFILE_MODE    = STRICT
PROFILE_LOCK    = FINAL

# --- TIME -------------------------------------------------
# TIME GATE DISABLED IN CI

LOCK_AT                    = 1970-01-01T00:00:00Z
TIME_BOUNDARY.ENFORCE      = NO
TIME_BOUNDARY.MUTABLE      = NO

# --- CUSTODY ----------------------------------------------

CUSTODY.REQUIRED           = YES
CUSTODY.MULTIPLE_ALLOWED   = NO
CUSTODY.ANONYMOUS          = FORBIDDEN
custodian: midiakiasat

# --- PROVENANCE -------------------------------------------

PROVENANCE.SEAL            = REQUIRED
PROVENANCE.RESEAL          = FORBIDDEN
PROVENANCE.SOURCE_CHANGE   = FORBIDDEN

# --- BOUNDARY ---------------------------------------------

BOUNDARY.MODE              = CLOSED
BOUNDARY.REOPEN            = FORBIDDEN
BOUNDARY.SILENT_BYPASS     = FORBIDDEN

# --- VERIFICATION -----------------------------------------

VERIFICATION.MODE          = STRICT
VERIFICATION.NONDET        = FORBIDDEN
VERIFICATION.PARTIAL       = FORBIDDEN

# --- ATTESTATION ------------------------------------------

ATTESTATION.REQUIRED       = YES
ATTESTATION.OVERWRITE      = FORBIDDEN
ATTESTATION.DELETE         = FORBIDDEN

# --- JUDGMENT ---------------------------------------------

JUDGMENT.MODE              = FINAL
JUDGMENT.RETRY             = FORBIDDEN
JUDGMENT.OVERRIDE          = FORBIDDEN

# --- EXECUTION --------------------------------------------

EXECUTION.ENABLED          = NO
EXECUTION.CONDITIONAL      = MANUAL_ONLY
