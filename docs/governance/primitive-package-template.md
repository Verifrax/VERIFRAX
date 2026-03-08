# VERIFRAX Primitive Package Template

This document freezes the canonical npm package template for the Verifrax primitive layer.

This package template is normative for:

- standalone primitive repositories
- npm package manifests
- install surfaces
- binary exposure
- tarball contents
- release validation
- future package consistency

## Canonical package manifest fields

Every primitive package must define these fields:

- name
- version
- description
- license
- repository
- homepage
- bugs
- bin
- files
- publishConfig

## Canonical manifest template

```json
{
  "name": "@verifrax/<primitive>",
  "version": "0.1.0",
  "description": "Verifrax primitive — <role phrase> for deterministic irreversible systems.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Verifrax/<primitive>.git"
  },
  "homepage": "https://github.com/Verifrax/<primitive>#readme",
  "bugs": {
    "url": "https://github.com/Verifrax/<primitive>/issues"
  },
  "bin": {
    "<primitive>": "./<primitive>.sh"
  },
  "files": [
    "<primitive>.sh",
    "README.md",
    "LICENSE",
    "VERSION"
  ],
  "publishConfig": {
    "access": "public"
  }
}
```

## Canonical variable substitutions

- `<primitive>` must equal the canonical lowercase primitive name.
- `<role phrase>` must equal the canonical role phrase from the About pattern standard.

## Rules

1. The package name must equal `@verifrax/<primitive>`.
2. The binary name must equal the canonical lowercase primitive name.
3. The shell entrypoint path must equal `./<primitive>.sh`.
4. The version must follow the canonical primitive version policy.
5. The description must follow the canonical About pattern.
6. The published tarball must be constrained by the canonical `files` list unless governance approves an expansion.
7. No package may expose an unrelated runtime file as the primary binary.
8. No package may omit repository, homepage, bugs, or license metadata.
9. Public access must be declared explicitly through `publishConfig.access`.
10. Package manifests across all eight primitives must differ only where primitive identity requires it.

## Constraint

No primitive package manifest or npm public surface may contradict this package template.
