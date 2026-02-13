# Certificate Canonicalization Rules

**Version:** 2.6.0  
**Purpose:** Define deterministic serialization rules for VERIFRAX certificates

---

## Encoding

- **Character Encoding:** UTF-8
- **Newlines:** `\n` (LF, U+000A)
- **No BOM:** Files must not include UTF-8 BOM

---

## Serialization Rules

### JSON Structure

1. **Field Order:** Fields must appear in this exact order:
   - `verifrax_version`
   - `certificate_version`
   - `bundle_hash`
   - `profile_id`
   - `verdict`
   - `reason_codes`
   - `executed_at`
   - `certificate_hash`

2. **No Pretty-Printing:**
   - No indentation
   - No trailing whitespace
   - No spaces after colons or commas
   - Single line (except for readability in documentation)

3. **Object Serialization:**
   - Keys must be in the exact order specified above
   - No additional fields
   - No omitted fields

4. **Array Serialization:**
   - Arrays are ordered (order matters)
   - Elements serialized in array order
   - No spaces after commas

5. **String Serialization:**
   - Use standard JSON string escaping
   - No trailing whitespace
   - Preserve exact character sequence

6. **Number Serialization:**
   - No leading zeros (except for decimals)
   - No trailing zeros (except for decimals)
   - Use standard JSON number format

---

## Timestamp Format

**Field:** `executed_at`

- **Format:** RFC3339 with millisecond precision
- **Timezone:** UTC (always `Z` suffix)
- **Pattern:** `YYYY-MM-DDTHH:mm:ss.sssZ`
- **Example:** `2025-01-01T12:00:00.000Z`

**Rules:**
- Year: 4 digits
- Month: 2 digits (01-12)
- Day: 2 digits (01-31)
- Hour: 2 digits (00-23)
- Minute: 2 digits (00-59)
- Second: 2 digits (00-59)
- Millisecond: 3 digits (000-999)
- Always UTC (`Z`)

---

## Hash Format

**Fields:** `bundle_hash`, `certificate_hash`

- **Algorithm:** SHA-256
- **Encoding:** Hexadecimal (lowercase)
- **Length:** 64 characters
- **No Prefix:** Do not include `sha256:` or any other prefix
- **Example:** `ba18a51f06af90c110924fc4e87a64dba5127bc092a582b33a2f1b844835413b`

---

## Certificate Hash Computation

**Critical:** The `certificate_hash` field is computed **after** serializing all other fields.

**Steps:**

1. Create certificate object with all fields **except** `certificate_hash`
2. Serialize to canonical JSON string (following all rules above)
3. Compute SHA-256 hash of the UTF-8 encoded string
4. Encode hash as 64-character lowercase hexadecimal string
5. Add `certificate_hash` field as the final field

**Formula:**
```
certificate_hash = SHA-256(UTF-8(canonical_json_string))
```

Where `canonical_json_string` is the serialized certificate **without** the `certificate_hash` field.

---

## Verification

Two independent parties serializing the same certificate inputs must produce:

1. **Identical JSON bytes** (not just equivalent structure)
2. **Identical certificate_hash** (when computed from those bytes)

**Test:**
- Serialize certificate with tool A
- Re-serialize with tool B (different editor, machine, or language)
- Compare byte-for-byte: must be identical
- Compare hashes: must be identical

---

## Example Canonical Output

```json
{"verifrax_version":"2.6.0","certificate_version":"1.0.0","bundle_hash":"ba18a51f06af90c110924fc4e87a64dba5127bc092a582b33a2f1b844835413b","profile_id":"public@1.0.0","verdict":"verified","reason_codes":[],"executed_at":"2025-01-01T12:00:00.000Z","certificate_hash":"a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"}
```

**Note:** This example is shown on multiple lines for readability, but the actual canonical form is a single line with no spaces.

---

**END OF CANONICALIZATION RULES**

