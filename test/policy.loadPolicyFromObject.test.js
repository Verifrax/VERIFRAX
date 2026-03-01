"use strict";

const { loadPolicy, evaluate } = require("../core/engine/policy");

function must(cond, msg) {
  if (!cond) { console.error("FAIL:", msg); process.exit(1); }
}

const policyObj = { rules: [{ id: "R001", level: "fail", require: [{ path: "a", op: "eq", value: 1 }] }] };
const policyJson = JSON.stringify(policyObj);

const loaded1 = loadPolicy(policyObj);
must(loaded1 && loaded1.policy && Array.isArray(loaded1.policy.rules), "object load: policy.rules missing");
must(typeof loaded1.policy_hash === "string" && loaded1.policy_hash.length > 0, "object load: policy_hash missing");

const loaded2 = loadPolicy(policyJson);
must(loaded2 && loaded2.policy && Array.isArray(loaded2.policy.rules), "json load: policy.rules missing");
must(typeof loaded2.policy_hash === "string" && loaded2.policy_hash.length > 0, "json load: policy_hash missing");

const res = evaluate({ a: 1 }, policyObj);
must(res && res.decision === "pass", "evaluate: expected pass");

console.log("OK");
