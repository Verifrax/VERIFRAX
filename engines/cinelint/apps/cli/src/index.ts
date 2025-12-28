import * as finality from "./finality";
import { exportAffidavit } from "./affidavit";

const cmd = process.argv[2];
const subcmd = process.argv[3];
const args = process.argv.slice(4);

// Finality-first commands
if (cmd === "claim" && subcmd === "create") {
  finality.handleClaimCreate(args);
} else if (cmd === "bundle" && subcmd === "build") {
  finality.handleBundleBuild(args);
} else if (cmd === "verify") {
  finality.handleVerify([subcmd, ...args]);
} else if (cmd === "contradict") {
  finality.handleContradict([subcmd, ...args]);
} else if (cmd === "invalidate") {
  finality.handleInvalidate([subcmd, ...args]);
} else if (cmd === "index" && subcmd === "publish") {
  finality.handleIndexPublish(args);
} else if (cmd === "export" && subcmd === "affidavit") {
  const bundlePath = args[0] || ".";
  const strict = args.includes("--strict");
  const outputPath = args.find(arg => arg !== "--strict" && !arg.startsWith("--") && arg !== bundlePath);
  exportAffidavit(bundlePath, outputPath, strict);
} else if (cmd === "delivery" && subcmd === "run") {
  finality.handleDeliveryRun(args);
} else {
  console.error("usage: verifrax <command> [args]");
  console.error("\nCommands:");
  console.error("  claim create       - Create a new claim");
  console.error("  bundle build       - Build an evidence bundle");
  console.error("  verify [path]      - Verify a bundle and show verdict");
  console.error("  contradict         - Detect contradictions");
  console.error("  invalidate         - Create an invalidation");
  console.error("  index publish      - Publish to truth index");
  console.error("  export affidavit   - Export affidavit (facts only)");
  console.error("  delivery run       - Run delivery verification");
  process.exit(1);
}
