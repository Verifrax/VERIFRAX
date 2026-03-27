import fs from "fs";
import path from "path";

const ALLOWED_VERDICTS = new Set([
  "VERIFIED",
  "FAILED",
  "INVALIDATED",
  "INCOMPLETE",
  "NOT_EXECUTABLE"
]);

const ALLOWED_STATUS = new Set([
  "EXECUTED",
  "NOT_EXECUTED"
]);

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function readTextIfExists(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8").trim() : null;
}

function stableUnique(items) {
  return [...new Set(items)].sort();
}

function requireArtifactShape(artifact) {
  const requiredTop = ["artifact_id", "title", "subject", "claim_set"];
  for (const k of requiredTop) {
    if (!(k in artifact)) {
      throw new Error(`artifact missing required field: ${k}`);
    }
  }
  if (!artifact.subject || typeof artifact.subject !== "object") {
    throw new Error("artifact subject must be an object");
  }
}

function resolveEvidencePath(repoRoot, artifactPath, declaredPath) {
  if (!declaredPath || typeof declaredPath !== "string") return null;
  if (path.isAbsolute(declaredPath)) return declaredPath;
  const artifactDir = path.dirname(artifactPath);
  const candidateFromArtifact = path.resolve(artifactDir, declaredPath);
  if (fs.existsSync(candidateFromArtifact)) return candidateFromArtifact;
  return path.resolve(repoRoot, declaredPath);
}

function evaluateArtifact0002(repoRoot, artifact, artifactPath) {
  const support = artifact.supporting_evidence || {};

  const sealLog = resolveEvidencePath(repoRoot, artifactPath, support.seal_presence_log);
  const ledgerLog = resolveEvidencePath(repoRoot, artifactPath, support.ledger_presence_log);

  if (!sealLog || !fs.existsSync(sealLog) || !ledgerLog || !fs.existsSync(ledgerLog)) {
    return {
      artifact_id: artifact.artifact_id,
      subject_ref: artifact.subject.subject_ref,
      commit: artifact.subject.commit,
      verdict: "NOT_EXECUTABLE",
      status: "NOT_EXECUTED",
      reason_codes: stableUnique([
        "DECLARED_EVIDENCE_MISSING",
        "EXECUTION_PREREQUISITE_MISSING"
      ]),
      observations: {
        seal_presence: "UNKNOWN",
        ledger_presence: "UNKNOWN"
      },
      notes: [
        "declared mandatory evidence for semantic readiness evaluation was missing"
      ]
    };
  }

  const sealPresence = readTextIfExists(sealLog);
  const ledgerPresence = readTextIfExists(ledgerLog);

  const reasonCodes = ["DECLARED_EVIDENCE_PRESENT"];
  const observations = {
    seal_presence: sealPresence || "UNKNOWN",
    ledger_presence: ledgerPresence || "UNKNOWN"
  };

  if (sealPresence === "ABSENT") reasonCodes.push("GENESIS_SEAL_ABSENT");
  if (sealPresence === "PRESENT") reasonCodes.push("GENESIS_SEAL_PRESENT");
  if (ledgerPresence === "ABSENT") reasonCodes.push("AUTHORITY_LEDGER_ABSENT");
  if (ledgerPresence === "PRESENT") reasonCodes.push("AUTHORITY_LEDGER_PRESENT");

  const readinessUnsatisfied =
    sealPresence === "ABSENT" || ledgerPresence === "ABSENT";

  if (readinessUnsatisfied) {
    reasonCodes.push("SEMANTIC_READINESS_UNSATISFIED");
    return {
      artifact_id: artifact.artifact_id,
      subject_ref: artifact.subject.subject_ref,
      commit: artifact.subject.commit,
      verdict: "FAILED",
      status: "EXECUTED",
      reason_codes: stableUnique(reasonCodes),
      observations,
      notes: [
        "semantic readiness conditions were evaluated from declared evidence"
      ]
    };
  }

  reasonCodes.push("SEMANTIC_VALIDATION_SUCCEEDED");
  return {
    artifact_id: artifact.artifact_id,
    subject_ref: artifact.subject.subject_ref,
    commit: artifact.subject.commit,
    verdict: "VERIFIED",
    status: "EXECUTED",
    reason_codes: stableUnique(reasonCodes),
    observations,
    notes: [
      "semantic readiness conditions were satisfied from declared evidence"
    ]
  };
}

function evaluateArtifact0003(repoRoot, artifact, artifactPath) {
  const support = artifact.supporting_evidence || {};

  const sealLog = resolveEvidencePath(repoRoot, artifactPath, support.seal_presence_log);
  const ledgerLog = resolveEvidencePath(repoRoot, artifactPath, support.ledger_presence_log);

  if (!sealLog || !fs.existsSync(sealLog) || !ledgerLog || !fs.existsSync(ledgerLog)) {
    return {
      artifact_id: artifact.artifact_id,
      subject_ref: artifact.subject.subject_ref,
      commit: artifact.subject.commit,
      verdict: "NOT_EXECUTABLE",
      status: "NOT_EXECUTED",
      reason_codes: stableUnique([
        "DECLARED_EVIDENCE_MISSING",
        "EXECUTION_PREREQUISITE_MISSING"
      ]),
      observations: {
        seal_presence: "UNKNOWN",
        ledger_presence: "UNKNOWN"
      },
      notes: [
        "declared mandatory evidence for issuance validation was missing"
      ]
    };
  }

  const sealPresence = readTextIfExists(sealLog);
  const ledgerPresence = readTextIfExists(ledgerLog);

  const reasonCodes = ["DECLARED_EVIDENCE_PRESENT"];
  const observations = {
    seal_presence: sealPresence || "UNKNOWN",
    ledger_presence: ledgerPresence || "UNKNOWN"
  };

  if (sealPresence === "ABSENT") reasonCodes.push("GENESIS_SEAL_ABSENT");
  if (sealPresence === "PRESENT") reasonCodes.push("GENESIS_SEAL_PRESENT");
  if (ledgerPresence === "ABSENT") reasonCodes.push("AUTHORITY_LEDGER_ABSENT");
  if (ledgerPresence === "PRESENT") reasonCodes.push("AUTHORITY_LEDGER_PRESENT");

  const subjectAbsent =
    sealPresence === "ABSENT" || ledgerPresence === "ABSENT";

  if (subjectAbsent) {
    reasonCodes.push("SUBJECT_ABSENT_NOT_EXECUTABLE");
    return {
      artifact_id: artifact.artifact_id,
      subject_ref: artifact.subject.subject_ref,
      commit: artifact.subject.commit,
      verdict: "NOT_EXECUTABLE",
      status: "NOT_EXECUTED",
      reason_codes: stableUnique(reasonCodes),
      observations,
      notes: [
        "claimed external issuance subject was absent at execution time"
      ]
    };
  }

  reasonCodes.push("SEMANTIC_VALIDATION_SUCCEEDED");
  return {
    artifact_id: artifact.artifact_id,
    subject_ref: artifact.subject.subject_ref,
    commit: artifact.subject.commit,
    verdict: "VERIFIED",
    status: "EXECUTED",
    reason_codes: stableUnique(reasonCodes),
    observations,
    notes: [
      "claimed external issuance subject was present and executable"
    ]
  };
}


function evaluateArtifact0005(repoRoot, artifact, artifactPath) {
  const support = artifact.supporting_evidence || {};

  const executionStatusPath = resolveEvidencePath(repoRoot, artifactPath, support.execution_status);
  const receiptPath = resolveEvidencePath(repoRoot, artifactPath, support.receipt_json);
  const receiptDigestPath = resolveEvidencePath(repoRoot, artifactPath, support.receipt_digest);
  const outputDigestsPath = resolveEvidencePath(repoRoot, artifactPath, support.output_digests);
  const exitCodePath = resolveEvidencePath(repoRoot, artifactPath, support.exit_code_log);

  if (
    !executionStatusPath || !fs.existsSync(executionStatusPath) ||
    !receiptPath || !fs.existsSync(receiptPath) ||
    !receiptDigestPath || !fs.existsSync(receiptDigestPath) ||
    !outputDigestsPath || !fs.existsSync(outputDigestsPath) ||
    !exitCodePath || !fs.existsSync(exitCodePath)
  ) {
    return {
      artifact_id: artifact.artifact_id,
      subject_ref: artifact.subject.subject_ref,
      commit: artifact.subject.commit,
      verdict: "NOT_EXECUTABLE",
      status: "NOT_EXECUTED",
      reason_codes: stableUnique([
        "DECLARED_EVIDENCE_MISSING",
        "EXECUTION_PREREQUISITE_MISSING"
      ]),
      observations: {
        execution_status: "UNKNOWN",
        receipt_status: "UNKNOWN",
        receipt_authority_binding: "UNKNOWN",
        exit_code: "UNKNOWN"
      },
      notes: [
        "declared mandatory evidence for governed execution validation was missing"
      ]
    };
  }

  const executionStatus = readTextIfExists(executionStatusPath) || "";
  const receipt = readJson(receiptPath);
  const exitCode = readTextIfExists(exitCodePath) || "UNKNOWN";

  const expectedSealId = artifact.subject.authority_seal_id || "UNKNOWN";
  const actualSealId = receipt.authority_seal_id || "UNKNOWN";
  const bindingMatched = actualSealId === expectedSealId;

  const reasonCodes = ["DECLARED_EVIDENCE_PRESENT"];
  const observations = {
    execution_status: executionStatus.includes("STATUS: GOVERNED EXECUTION RECORDED") ? "RECORDED" : "UNKNOWN",
    receipt_status: receipt.receipt_id ? "PRESENT" : "ABSENT",
    receipt_authority_binding: bindingMatched ? "MATCHED" : "MISMATCH",
    exit_code: exitCode
  };

  if (observations.execution_status === "RECORDED") reasonCodes.push("GOVERNED_EXECUTION_RECORDED");
  if (observations.receipt_status === "PRESENT") reasonCodes.push("RECEIPT_PRESENT");
  if (bindingMatched) reasonCodes.push("RECEIPT_AUTHORITY_MATCHED");
  if (exitCode === "0") reasonCodes.push("EXIT_CODE_ZERO");

  const failed =
    observations.execution_status !== "RECORDED" ||
    observations.receipt_status !== "PRESENT" ||
    !bindingMatched ||
    exitCode !== "0";

  if (failed) {
    reasonCodes.push("SEMANTIC_VALIDATION_UNSATISFIED");
    return {
      artifact_id: artifact.artifact_id,
      subject_ref: artifact.subject.subject_ref,
      commit: artifact.subject.commit,
      verdict: "FAILED",
      status: "EXECUTED",
      reason_codes: stableUnique(reasonCodes),
      observations,
      notes: [
        "governed execution evidence was present but one or more required validation conditions failed"
      ]
    };
  }

  reasonCodes.push("SEMANTIC_VALIDATION_SUCCEEDED");
  return {
    artifact_id: artifact.artifact_id,
    subject_ref: artifact.subject.subject_ref,
    commit: artifact.subject.commit,
    verdict: "VERIFIED",
    status: "EXECUTED",
    reason_codes: stableUnique(reasonCodes),
    observations,
    notes: [
      "governed execution evidence, receipt presence, authority binding, and exit code all satisfied validation"
    ]
  };
}

function evaluateArtifact(repoRoot, artifact, artifactPath) {
  switch (artifact.artifact_id) {
    case "artifact-0002":
      return evaluateArtifact0002(repoRoot, artifact, artifactPath);
    case "artifact-0003":
      return evaluateArtifact0003(repoRoot, artifact, artifactPath);
    case "artifact-0005":
      return evaluateArtifact0005(repoRoot, artifact, artifactPath);
    default:
      throw new Error(`unsupported artifact id: ${artifact.artifact_id}`);
  }
}

function validateOutput(output) {
  if (!ALLOWED_VERDICTS.has(output.verdict)) {
    throw new Error(`invalid verdict: ${output.verdict}`);
  }
  if (!ALLOWED_STATUS.has(output.status)) {
    throw new Error(`invalid status: ${output.status}`);
  }
  if (!Array.isArray(output.reason_codes)) {
    throw new Error("reason_codes must be an array");
  }
  if (!output.observations || typeof output.observations !== "object") {
    throw new Error("observations must be an object");
  }
}

function main() {
  const artifactArg = process.argv[2];
  if (!artifactArg) {
    throw new Error("usage: node verifier/node/src/artifact/semantic-evaluator.mjs <artifact-json-path>");
  }

  const repoRoot = process.cwd();
  const artifactPath = path.resolve(repoRoot, artifactArg);
  const artifact = readJson(artifactPath);

  requireArtifactShape(artifact);

  const output = evaluateArtifact(repoRoot, artifact, artifactPath);
  validateOutput(output);

  process.stdout.write(JSON.stringify(output, null, 2) + "\n");
}

main();
