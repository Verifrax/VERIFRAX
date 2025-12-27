import { execSync } from "child_process";
const zip = process.argv[2];
if(!zip){ console.error("usage: node tools/bundle-inspect.mjs <zipfile>"); process.exit(2); }
execSync(`/usr/bin/unzip -l ${zip}`, { stdio: "inherit" });

