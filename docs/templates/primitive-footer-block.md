# VERIFRAX Primitive Footer Block

Use this footer block in every standalone primitive README.

## Canonical footer block

## Repository

- GitHub: https://github.com/Verifrax/<primitive>
- Package: `@verifrax/<primitive>`
- Binary: `<primitive>`

## License

MIT

## Release identity

- initial public package line: `0.1.0`
- initial canonical tag line: `v0.1.0`

## Rules

1. The repository URL must resolve to the standalone primitive repository.
2. The package identity must use the canonical scoped npm name.
3. The binary identity must use the canonical lowercase primitive name.
4. License text must remain stable unless the protocol governance changes it explicitly.
5. Release identity references in the footer must not contradict package.json, tags, or release notes.
6. No README may replace this footer with an inconsistent repository or package identity block.

## Variable substitutions

- `<primitive>` = canonical lowercase primitive name
