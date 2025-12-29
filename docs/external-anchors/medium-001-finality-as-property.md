# Finality as a Property of Verification

Finality is a property of verification systems that renders further dispute unnecessary. Unlike consensus mechanisms that require ongoing agreement, finality emerges from deterministic evaluation of evidence against declared standards.

A verification system achieves finality when:

1. The evaluation process is deterministic
2. The evidence bundle is immutable
3. The verification profile is fixed
4. The output is reproducible

When these conditions are met, the verdict cannot be meaningfully disputed because any party can independently reproduce the same result using the same inputs.

VERIFRAX implements finality through deterministic hashing, stateless evaluation, and immutable verdict outputs. Each verdict includes a canonical hash of the evidence bundle, ensuring that the same bundle always produces the same verdict under the same verification profile.

This differs from systems that rely on authority, consensus, or mutable state. In those systems, finality is a social construct. In deterministic verification systems, finality is a mathematical property.

For more information, see [verifrax.net/what-is-verifrax](https://verifrax.net/what-is-verifrax).

