VERIFRAX Python SDK Integration Template

This template shows the minimal integration structure for invoking
VERIFRAX verification from a Python-based application.

Objective

The integration must:

- execute deterministic verification
- preserve protocol failure classes
- return canonical verifier output
- avoid rewriting verification semantics

Integration Flow

1. receive artifact bundle path
2. invoke VERIFRAX verifier
3. capture deterministic output
4. propagate verification result without mutation

Minimal Template

import subprocess

def verify_with_verifrax(bundle_path):
    result = subprocess.run(
        ["node", "verifier/node/src/verifier.mjs", bundle_path],
        capture_output=True,
        text=True
    )

    return {
        "status": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr
    }

Integration Rule

The SDK layer must not reinterpret protocol verdicts.

It may transport results, but it must not alter:

- verdict meaning
- failure taxonomy
- canonical output structure
