# Passive Dependency Formation (Do Not Force)

## C1. Citation Watch

Set alerts (read-only) on:

- Incident databases
- Audit repositories
- Legal memo indexes

### Trigger Condition

```
VFXV1:
```

### Monitoring

- Automated search: `VFXV1:sha256:`
- Manual review: Weekly
- No outreach
- No promotion

## C2. Citation Capture (ONE TIME)

When detected:

```bash
./scripts/archive-external-citation.sh <url>
./scripts/final-lock.sh
```

### That is the LAST permitted mutation.

After citation capture:
- No more mutations allowed
- Final lock is final
- System is complete

---

**Passive only. No forcing. No outreach.**

