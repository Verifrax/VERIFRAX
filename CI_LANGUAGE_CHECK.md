# CI Language Check (Docs + Samples Only)

## Automated Check

CI check for documentation and samples repositories only.

## Fail Conditions

CI fails if text contains:
- "standard"
- "certification"
- "compliant"
- "official"
- "recognized"

## Scope

- **DOCS repository:** Check enabled
- **SAMPLES repository:** Check enabled
- **Authoritative repos:** CI OFF (already frozen)

## Implementation

```bash
# Check for forbidden words
grep -r -i -E "(standard|certification|compliant|official|recognized)" . && exit 1 || exit 0
```

## Rationale

Prevent language that implies standard status or official recognition.

## Exceptions

Technical terms in code comments are allowed. Only documentation text is checked.

