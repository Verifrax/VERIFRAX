# VERIFRAX Primitive Install Block

Use this install block in every standalone primitive README.

## Canonical install block

```bash
npm install -g @verifrax/<primitive>
```

## Canonical verification block

```bash
command -v <primitive>
```

## Canonical package identity block

- package: `@verifrax/<primitive>`
- binary: `<primitive>`
- expected initial version line: `0.1.0`

## Rules

1. The install command must use the scoped public package name.
2. The install command must use global installation because the primitive surface is CLI-first.
3. The verification command must check the installed binary name directly.
4. The package name and binary name must match the canonical primitive naming standard.
5. No README may replace this install surface with an unscoped, local-only, or ambiguous install command.
6. Primitive-specific examples may follow this block, but may not replace it.

## Variable substitutions

- `<primitive>` = canonical lowercase primitive name
