# VERIFRAX Primitive Usage Block

Use this usage block in every standalone primitive README.

## Canonical usage block

```bash
<primitive> --help
```

```bash
<primitive> <example-input>
```

## Canonical usage guidance

1. The first usage example must show the canonical binary name directly.
2. The first usage example must remain CLI-first.
3. README usage must describe the real command contract, not a hypothetical library API.
4. Primitive-specific examples must reflect the actual runtime behavior of the primitive.
5. If the primitive reads from stdin, the README must show a real stdin example.
6. If the primitive reads from file arguments, the README must show a real file example.
7. If the primitive emits a deterministic verdict or terminal state, the README must show that outcome precisely.
8. Usage examples must stay aligned with the documented behavioral contract.

## Variable substitutions

- `<primitive>` = canonical lowercase primitive name
- `<example-input>` = primitive-specific real example input
