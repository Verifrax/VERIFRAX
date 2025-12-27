import { randomUUID } from "crypto";
import { CineLintNode, Finding } from "./node.interface.js";
import { listNodes } from "../registry/node.registry.js";
import { assertCineLintPath } from "./guard.js";

export interface RunOptions {
  profile: {
    id: string;
    version: string;
  };
  artifacts: {
    id: string;
    type: string;
    hash: string;
    path?: string;
  }[];
  nodes: CineLintNode[];
  options?: Record<string, any>;
}

export async function runCineLint(opts: RunOptions) {
  const runId = randomUUID();
  const timestamp = new Date().toISOString();

  const findings: Finding[] = [];

  for (const node of opts.nodes) {
    const supportedArtifacts = opts.artifacts.filter(a =>
      node.supports.includes(a.type) || node.supports.includes("*")
    );

    if (supportedArtifacts.length === 0) continue;

    const result = await node.run({
      artifacts: supportedArtifacts,
      profile: opts.profile,
      options: opts.options
    });

    findings.push(...result);
  }

  const status =
    findings.some(f => f.severity === "ERROR")
      ? "FAIL"
      : findings.some(f => f.severity === "WARN")
      ? "WARN"
      : "PASS";

  const report = {
    run: {
      id: runId,
      timestamp
    },
    profile: opts.profile,
    artifacts: opts.artifacts.map(a => ({
      id: a.id,
      type: a.type,
      hash: a.hash,
      path: a.path ? assertCineLintPath(a.path) : undefined
    })),
    summary: {
      status
    },
    findings
  };

  

  return report;
}

// TEMP registry wiring
export async function runWithRegistry(opts: Omit<RunOptions, "nodes">) {
  return runCineLint({
    ...opts,
    nodes: listNodes()
  });
}

