VERIFRAX Node SDK Integration Template

This template shows the minimal integration structure for invoking
VERIFRAX verification from a Node-based application.

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

import { spawnSync } from "node:child_process";

export function verifyWithVerifrax(bundlePath) {
  const result = spawnSync(
    "node",
    ["verifier/node/src/verifier.mjs", bundlePath],
    { encoding: "utf8" }
  );

  if (result.error) {
    throw result.error;
  }

  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr
  };
}

Integration Rule

The SDK layer must not reinterpret protocol verdicts.

It may transport results, but it must not alter:

- verdict meaning
- failure taxonomy
- canonical output structure
